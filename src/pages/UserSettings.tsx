import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { UserGreeting } from "@/components/user/UserGreeting";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomIcons } from "@/components/icons";
import { 
  Bell, 
  Moon, 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  Eye,
  Palette,
  Volume2,
  Vibrate
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UserSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
    soundEnabled: true,
    hapticFeedback: true,
    autoBookmark: false,
    aiTraining: true,
    userName: "Knowledge Seeker",
    avatar: "🧠"
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: `${key} has been updated successfully.`,
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen pb-8">
        {/* User Greeting */}
        <div className="p-4">
          <UserGreeting 
            userName={settings.userName}
            avatar={settings.avatar}
          />
        </div>

        {/* Settings Sections */}
        <div className="p-4 space-y-6">
          {/* Profile Settings */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <CustomIcons.UserProfile className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-ink">Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName" className="text-sm font-medium">Display Name</Label>
                <Input
                  id="userName"
                  value={settings.userName}
                  onChange={(e) => handleSettingChange('userName', e.target.value)}
                  className="mt-1 paper-input"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Avatar</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-2xl">
                    {settings.avatar}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['🧠', '🎯', '📚', '💡', '🌸', '⭐', '🚀', '🎨'].map((emoji) => (
                      <Button
                        key={emoji}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 p-0"
                        onClick={() => handleSettingChange('avatar', emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <CustomIcons.Settings className="w-5 h-5 text-bamboo" />
              <h3 className="font-semibold text-ink">Preferences</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified about new bookmarks and AI insights</div>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Switch to dark theme</div>
                  </div>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Sound Effects</div>
                    <div className="text-sm text-muted-foreground">Play sounds for interactions</div>
                  </div>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Haptic Feedback</div>
                    <div className="text-sm text-muted-foreground">Vibrate on touch interactions</div>
                  </div>
                </div>
                <Switch
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => handleSettingChange('hapticFeedback', checked)}
                />
              </div>
            </div>
          </Card>

          {/* AI & Learning */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <CustomIcons.BrainAI className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-ink">AI & Learning</h3>
              <Badge variant="secondary" className="ml-auto">
                <Eye className="w-3 h-3 mr-1" />
                89% Trained
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-bookmark Links</div>
                  <div className="text-sm text-muted-foreground">Automatically save shared links</div>
                </div>
                <Switch
                  checked={settings.autoBookmark}
                  onCheckedChange={(checked) => handleSettingChange('autoBookmark', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">AI Training</div>
                  <div className="text-sm text-muted-foreground">Help improve AI recommendations</div>
                </div>
                <Switch
                  checked={settings.aiTraining}
                  onCheckedChange={(checked) => handleSettingChange('aiTraining', checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex flex-col gap-2 h-16">
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Export Data</span>
                </Button>
                <Button variant="outline" className="flex flex-col gap-2 h-16">
                  <Download className="w-5 h-5" />
                  <span className="text-xs">Import Data</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-ink">Privacy & Security</h3>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Eye className="w-4 h-4" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Shield className="w-4 h-4" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}