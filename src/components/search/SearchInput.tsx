import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomIcons } from '@/components/icons';
import { Clock, X, TrendingUp } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  count?: number;
}

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'machine learning', type: 'recent' },
  { id: '2', text: 'japanese design', type: 'recent' },
  { id: '3', text: 'productivity tips', type: 'trending', count: 1247 },
  { id: '4', text: 'react patterns', type: 'suggestion' },
  { id: '5', text: 'mindfulness', type: 'trending', count: 892 },
];

export function SearchInput({ placeholder = "Search your knowledge...", onSearch, className }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(mockSuggestions);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch?.(suggestion.text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch?.(query);
  };

  const clearQuery = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-primary" />;
      default:
        return <CustomIcons.SearchEnhanced className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <CustomIcons.SearchEnhanced className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-10 paper-input transition-smooth focus:shadow-floating"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearQuery}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-60 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </form>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border border-border shadow-floating z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {filteredSuggestions.length > 0 ? (
              <>
                {filteredSuggestions.some(s => s.type === 'recent') && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Recent Searches</p>
                    {filteredSuggestions
                      .filter(s => s.type === 'recent')
                      .map(suggestion => (
                        <Button
                          key={suggestion.id}
                          variant="ghost"
                          className="w-full justify-start text-left p-2 h-auto hover:bg-muted/50 transition-smooth"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            {getSuggestionIcon(suggestion.type)}
                            <span className="flex-1">{suggestion.text}</span>
                          </div>
                        </Button>
                      ))}
                  </div>
                )}

                {filteredSuggestions.some(s => s.type === 'trending') && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Trending</p>
                    {filteredSuggestions
                      .filter(s => s.type === 'trending')
                      .map(suggestion => (
                        <Button
                          key={suggestion.id}
                          variant="ghost"
                          className="w-full justify-start text-left p-2 h-auto hover:bg-muted/50 transition-smooth"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            {getSuggestionIcon(suggestion.type)}
                            <span className="flex-1">{suggestion.text}</span>
                            {suggestion.count && (
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.count.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                  </div>
                )}

                {filteredSuggestions.some(s => s.type === 'suggestion') && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Suggestions</p>
                    {filteredSuggestions
                      .filter(s => s.type === 'suggestion')
                      .map(suggestion => (
                        <Button
                          key={suggestion.id}
                          variant="ghost"
                          className="w-full justify-start text-left p-2 h-auto hover:bg-muted/50 transition-smooth"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            {getSuggestionIcon(suggestion.type)}
                            <span className="flex-1">{suggestion.text}</span>
                          </div>
                        </Button>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <CustomIcons.SearchEnhanced className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}