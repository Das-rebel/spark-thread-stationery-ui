import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { UserGreeting } from "@/components/user/UserGreeting";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomIcons } from "@/components/icons";
import { useSettings } from "@/contexts/SettingsContext";
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
  Vibrate,
  Sun,
  Monitor,
  Smartphone,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UserSettings() {
  const { settings, updateSettings, resetSettings, isLoading, error } = useSettings();

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: `${key} has been updated successfully.`,
    });
  };

  const handleNestedSettingChange = (section: string, key: string, value: any) => {
    updateSettings({
      [section]: {
        ...settings[section as keyof typeof settings],
        [key]: value
      }
    });
    toast({
      title: "Settings Updated",
      description: `${key} preference updated.`,
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="paper-card p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen pb-8">
        {/* User Greeting */}
        <div className="p-4">
          <UserGreeting 
            userName="Knowledge Seeker"
            avatar="🧠"
          />
        </div>

        {/* Settings Sections */}
        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-ink">Appearance</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleSettingChange('theme', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Auto
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Display Density</Label>
                <Select 
                  value={settings.display.density} 
                  onValueChange={(value) => handleNestedSettingChange('display', 'density', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Font Size</Label>
                <Select 
                  value={settings.display.fontSize} 
                  onValueChange={(value) => handleNestedSettingChange('display', 'fontSize', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Animations</div>
                  <div className="text-sm text-muted-foreground">Enable smooth animations</div>
                </div>
                <Switch
                  checked={settings.display.animations}
                  onCheckedChange={(checked) => handleNestedSettingChange('display', 'animations', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-bamboo" />
              <h3 className="font-semibold text-ink">Notifications</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Get notified on your device</div>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'push', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive updates via email</div>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'email', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">In-App Notifications</div>
                  <div className="text-sm text-muted-foreground">Show notifications within the app</div>
                </div>
                <Switch
                  checked={settings.notifications.inApp}
                  onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'inApp', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-ink">Preferences</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Default View</Label>
                <Select 
                  value={settings.preferences.defaultView} 
                  onValueChange={(value) => handleNestedSettingChange('preferences', 'defaultView', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">Feed View</SelectItem>
                    <SelectItem value="neural">Neural Network</SelectItem>
                    <SelectItem value="bookmarks">Bookmarks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto Save</div>
                  <div className="text-sm text-muted-foreground">Automatically save changes</div>
                </div>
                <Switch
                  checked={settings.preferences.autoSave}
                  onCheckedChange={(checked) => handleNestedSettingChange('preferences', 'autoSave', checked)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Sync Interval (seconds)</Label>
                <Select 
                  value={settings.preferences.syncInterval.toString()} 
                  onValueChange={(value) => handleNestedSettingChange('preferences', 'syncInterval', parseInt(value))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-ink">Privacy & Security</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Analytics</div>
                  <div className="text-sm text-muted-foreground">Help improve the app with usage data</div>
                </div>
                <Switch
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => handleNestedSettingChange('privacy', 'analytics', checked)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Profile Visibility</Label>
                <Select 
                  value={settings.privacy.profileVisibility} 
                  onValueChange={(value) => handleNestedSettingChange('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="paper-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-ink">Data Management</h3>
            </div>
            
            <div className="space-y-4">
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
              
              <Separator />
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={resetSettings}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset All Settings
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                  Delete All Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}