import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar as CalendarIcon, 
  Clock, 
  PlayCircle, 
  Info, 
  Plus,
  CalendarPlus,
  ExternalLink
} from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'motion/react';

export default function Classes() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd filter by cohort/programme
    const q = query(collection(db, 'classes'), orderBy('scheduled_at', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredClasses = classes.filter(cls => {
    const scheduledDate = parseISO(cls.scheduled_at);
    const now = new Date();
    if (activeTab === 'upcoming') {
      return isAfter(scheduledDate, now) || Math.abs(scheduledDate.getTime() - now.getTime()) < 3600000; // Within 1 hour
    } else {
      return isBefore(scheduledDate, now);
    }
  });

  const getGoogleCalendarLink = (cls: any) => {
    const start = format(parseISO(cls.scheduled_at), "yyyyMMdd'T'HHmmss'Z'");
    const end = format(parseISO(cls.scheduled_at), "yyyyMMdd'T'HHmmss'Z'"); // Simplified
    const text = encodeURIComponent(cls.title);
    const details = encodeURIComponent(`Join Zoom: ${cls.zoom_link}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${encodeURIComponent(cls.zoom_link)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
          <p className="text-text-secondary mt-1">Join your live sessions and catch up on recordings.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredClasses.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 bg-slate-50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100">
                    <span className="text-sm font-bold text-accent uppercase tracking-wider mb-1">
                      {format(parseISO(cls.scheduled_at), 'EEE')}
                    </span>
                    <span className="text-4xl font-extrabold text-primary leading-none">
                      {format(parseISO(cls.scheduled_at), 'd')}
                    </span>
                    <span className="text-sm font-medium text-text-secondary mt-1">
                      {format(parseISO(cls.scheduled_at), 'MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {cls.is_catchup && (
                          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Catchup+</Badge>
                        )}
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">Module {cls.module_number || '?'}</Badge>
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(cls.scheduled_at), 'h:mm a')} (1.5h)
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{cls.title}</h3>
                      <p className="text-sm text-text-secondary">Instructor: {cls.instructor_name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {activeTab === 'upcoming' ? (
                        <>
                          <Button 
                            className="bg-zoom hover:bg-zoom/90 text-white rounded-full px-6"
                            onClick={() => window.open(cls.zoom_link, '_blank')}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Zoom
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full"
                            onClick={() => window.open(getGoogleCalendarLink(cls), '_blank')}
                            title="Add to Google Calendar"
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="rounded-full border-accent text-accent hover:bg-accent hover:text-white"
                          onClick={() => window.open(cls.recording_url, '_blank')}
                          disabled={!cls.recording_url}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Watch Recording
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold">No classes found</h3>
          <p className="text-text-secondary">Check back later for your cohort's schedule.</p>
        </div>
      )}
    </div>
  );
}
