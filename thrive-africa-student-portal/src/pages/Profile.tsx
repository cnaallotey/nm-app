import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Camera, 
  Lock, 
  Bell, 
  Shield,
  Save,
  CheckCircle2
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'motion/react';

export default function Profile() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    linkedin_url: profile?.linkedin_url || '',
    country: profile?.country || 'Ghana'
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm text-center overflow-hidden">
            <div className="h-24 bg-primary"></div>
            <CardContent className="p-6 -mt-12">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-slate-100 text-slate-400">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-xl font-bold mt-4">{profile?.full_name}</h3>
              <p className="text-sm text-text-secondary">{profile?.programme}</p>
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-text-secondary">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-text-secondary">{profile?.country}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <Badge variant="secondary" className="bg-success/10 text-success border-none capitalize">{profile?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Programme Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Cohort</p>
                <p className="text-sm font-medium">{profile?.cohort || 'Cohort 1'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Start Date</p>
                <p className="text-sm font-medium">January 15, 2026</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Assigned Mentor</p>
                <p className="text-sm font-medium text-accent">Mentor Sarah</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-full shadow-sm border border-slate-100 w-full md:w-auto">
              <TabsTrigger value="general" className="rounded-full px-6 flex-1 md:flex-none">General</TabsTrigger>
              <TabsTrigger value="security" className="rounded-full px-6 flex-1 md:flex-none">Security</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-full px-6 flex-1 md:flex-none">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your basic profile details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input 
                          id="full_name" 
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={profile?.email} disabled className="bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="+233..." 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="linkedin" 
                          placeholder="https://linkedin.com/in/..." 
                          className="pl-10"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      {success && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-success text-sm font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Profile updated successfully!
                        </motion.div>
                      )}
                      <Button type="submit" className="bg-accent hover:bg-accent/90 ml-auto" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Lock className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Password</p>
                          <p className="text-xs text-text-secondary">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">Change Password</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Shield className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-text-secondary">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">Enable 2FA</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: 'Upcoming Class Reminders', desc: 'Get notified 1 hour before your live session starts.' },
                    { title: 'Assignment Due Dates', desc: 'Reminders for upcoming assignment deadlines.' },
                    { title: 'New Announcements', desc: 'Stay updated with the latest news from mentors.' },
                    { title: 'Grading Updates', desc: 'Get notified when your assignments are graded.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-text-secondary">{item.desc}</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-accent rounded focus:ring-accent" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
