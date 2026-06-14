import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Users, 
  Video, 
  BookOpen, 
  FileText, 
  Megaphone, 
  Plus, 
  Search, 
  MoreVertical,
  Calendar as CalendarIcon,
  Trash2,
  Edit
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Admin() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newClass, setNewClass] = useState({ title: '', scheduled_at: '', zoom_link: '', instructor_name: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });

  useEffect(() => {
    if (profile?.role !== 'admin' && profile?.role !== 'mentor') return;

    const unsubStudents = onSnapshot(query(collection(db, 'users'), where('role', '==', 'student')), (snap) => {
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubClasses = onSnapshot(query(collection(db, 'classes'), orderBy('scheduled_at', 'desc')), (snap) => {
      setClasses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAnnouncements = onSnapshot(query(collection(db, 'announcements'), orderBy('created_at', 'desc')), (snap) => {
      setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    setLoading(false);
    return () => { unsubStudents(); unsubClasses(); unsubAnnouncements(); };
  }, [profile]);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'classes'), {
        ...newClass,
        module_id: 'default',
        created_at: new Date().toISOString()
      });
      setNewClass({ title: '', scheduled_at: '', zoom_link: '', instructor_name: '' });
    } catch (err) {
      console.error('Error adding class:', err);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'announcements'), {
        ...newAnnouncement,
        course_id: 'default',
        author_id: profile?.uid,
        created_at: new Date().toISOString()
      });
      setNewAnnouncement({ title: '', body: '' });
    } catch (err) {
      console.error('Error adding announcement:', err);
    }
  };

  if (profile?.role !== 'admin' && profile?.role !== 'mentor') {
    return <div className="text-center py-20">Access Denied. Admins only.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-text-secondary mt-1">Manage cohorts, classes, and student progress.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-full shadow-sm border border-slate-100 overflow-x-auto">
          <TabsTrigger value="students" className="rounded-full px-6">Students</TabsTrigger>
          <TabsTrigger value="classes" className="rounded-full px-6">Classes</TabsTrigger>
          <TabsTrigger value="materials" className="rounded-full px-6">Materials</TabsTrigger>
          <TabsTrigger value="announcements" className="rounded-full px-6">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Directory</CardTitle>
                <CardDescription>Overview of all enrolled students and their progress.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Search students..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 font-bold">Name</th>
                      <th className="px-6 py-3 font-bold">Programme</th>
                      <th className="px-6 py-3 font-bold">Cohort</th>
                      <th className="px-6 py-3 font-bold">Country</th>
                      <th className="px-6 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{student.full_name}</td>
                        <td className="px-6 py-4">{student.programme}</td>
                        <td className="px-6 py-4">{student.cohort}</td>
                        <td className="px-6 py-4">{student.country}</td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="mt-0 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Schedule New Class</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Class Title</Label>
                  <Input 
                    placeholder="e.g. Intro to Figma" 
                    value={newClass.title}
                    onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input 
                    type="datetime-local" 
                    value={newClass.scheduled_at}
                    onChange={(e) => setNewClass({...newClass, scheduled_at: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zoom Link</Label>
                  <Input 
                    placeholder="https://zoom.us/..." 
                    value={newClass.zoom_link}
                    onChange={(e) => setNewClass({...newClass, zoom_link: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="bg-accent">Schedule Class</Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Video className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-bold">{cls.title}</p>
                      <p className="text-xs text-text-secondary">{format(new Date(cls.scheduled_at), 'MMM d, yyyy • h:mm a')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDoc(doc(db, 'classes', cls.id))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-0 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Post New Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    placeholder="Announcement Title" 
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-accent outline-none text-sm"
                    placeholder="Write your message here..."
                    value={newAnnouncement.body}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, body: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="bg-accent">Post Announcement</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <Card key={ann.id} className="border-none shadow-sm">
                <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold">{ann.title}</CardTitle>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDoc(doc(db, 'announcements', ann.id))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-text-secondary">{ann.body}</p>
                  <p className="text-[10px] text-text-secondary mt-2">{format(new Date(ann.created_at), 'MMM d, yyyy')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
