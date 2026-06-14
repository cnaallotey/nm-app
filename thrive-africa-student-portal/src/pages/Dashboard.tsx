import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Trophy, 
  ArrowRight,
  ExternalLink,
  Bell,
  ChevronRight,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, isAfter, isBefore, addHours } from 'date-fns';
import { motion } from 'motion/react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Dashboard() {
  const { profile } = useAuth();
  const [nextClass, setNextClass] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    progress: 65,
    attended: 12,
    assignments: 8,
    score: 92
  });

  useEffect(() => {
    // Mock data for next class - in a real app, fetch from Firestore
    const now = new Date();
    setNextClass({
      id: '1',
      title: 'Advanced UI/UX Design Principles',
      instructor: 'Mentor Sarah',
      scheduled_at: addHours(now, 2).toISOString(),
      zoom_link: 'https://zoom.us/j/123456789',
      is_live: false
    });

    // Fetch announcements
    const q = query(collection(db, 'announcements'), orderBy('created_at', 'desc'), limit(3));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(data);
      },
      (error) => {
        console.error('Announcements listener error:', error);
      }
    );

    return () => unsub();
  }, []);

  const getTimeRemaining = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0]}! 👋</h1>
          <p className="text-text-secondary mt-1">
            {profile?.programme} • Week 6 of 12 • {profile?.cohort}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
          </Button>
          <Button className="bg-accent hover:bg-accent/90">
            View Schedule
          </Button>
        </div>
      </div>

      {/* Next Class Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden border-none shadow-lg bg-primary text-white">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Badge className="bg-success text-white border-none px-3 py-1">
                  {nextClass?.is_live ? 'LIVE NOW' : 'UPCOMING CLASS'}
                </Badge>
                {!nextClass?.is_live && (
                  <span className="text-white/70 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Starts {getTimeRemaining(nextClass?.scheduled_at)}
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">{nextClass?.title}</h2>
              <p className="text-white/70">Instructor: {nextClass?.instructor} • Today, {nextClass?.scheduled_at ? format(new Date(nextClass.scheduled_at), 'h:mm a') : ''}</p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button 
                size="lg" 
                className="bg-zoom hover:bg-zoom/90 text-white font-bold h-14 px-8 rounded-full shadow-lg shadow-zoom/20"
                onClick={() => window.open(nextClass?.zoom_link, '_blank')}
              >
                <Video className="w-5 h-5 mr-2" />
                Join Zoom Meeting
              </Button>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                Add to Calendar
              </Button>
            </div>
          </div>
          {nextClass?.is_live && (
            <div className="h-1 bg-success animate-pulse"></div>
          )}
        </Card>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Course Progress', value: `${stats.progress}%`, icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Classes Attended', value: stats.attended, icon: Video, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Assignments Done', value: stats.assignments, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Average Score', value: `${stats.score}%`, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* This Week's Classes */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">This Week's Classes</h3>
              <Button variant="ghost" size="sm" className="text-accent">View All <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Apr</span>
                        <span className="text-lg font-bold leading-none">{12 + i}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">Module {i + 1}: Visual Hierarchy & Layout</h4>
                        <p className="text-xs text-text-secondary">Instructor: Mentor Sarah • 7:00 PM GMT</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Progress Bars */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold">Module Progress</h3>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                {[
                  { name: 'Introduction to UI/UX', progress: 100 },
                  { name: 'User Research & Analysis', progress: 100 },
                  { name: 'Wireframing & Prototyping', progress: 85 },
                  { name: 'Visual Design Systems', progress: 40 },
                ].map((module, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{module.name}</span>
                      <span className="text-text-secondary">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar Content Area */}
        <div className="space-y-8">
          {/* Announcements */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold">Announcements</h3>
            <div className="space-y-4">
              {announcements.length > 0 ? announcements.map((ann, i) => (
                <Card key={i} className="border-none shadow-sm">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-sm font-bold">{ann.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-xs text-text-secondary line-clamp-2">{ann.body}</p>
                    <p className="text-[10px] text-text-secondary mt-2">{format(new Date(ann.created_at), 'MMM d, yyyy')}</p>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-text-secondary">No recent announcements</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Links */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'Career Hub', icon: Briefcase, path: '/career' },
                { name: 'Course Materials', icon: BookOpen, path: '/materials' },
                { name: 'Submit Assignment', icon: FileText, path: '/assignments' },
              ].map((link, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="w-full justify-between h-auto py-4 px-4 rounded-xl border-none shadow-sm hover:bg-slate-50"
                  asChild
                >
                  <Link to={link.path}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <link.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="font-semibold text-sm">{link.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
