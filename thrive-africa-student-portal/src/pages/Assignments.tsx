import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Star,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { format, isAfter, parseISO } from 'date-fns';
import { motion } from 'motion/react';

export default function Assignments() {
  const { profile, user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  useEffect(() => {
    // Fetch assignments
    const qA = query(collection(db, 'assignments'), orderBy('due_date', 'asc'));
    const unsubA = onSnapshot(qA, (snapshot) => {
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch user's submissions
    if (user) {
      const qS = query(collection(db, 'submissions'), where('user_id', '==', user.uid));
      const unsubS = onSnapshot(qS, (snapshot) => {
        setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
      return () => { unsubA(); unsubS(); };
    }

    return () => unsubA();
  }, [user]);

  const getStatus = (assignmentId: string) => {
    const submission = submissions.find(s => s.assignment_id === assignmentId);
    if (!submission) {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment && isAfter(new Date(), parseISO(assignment.due_date))) {
        return { label: 'Late', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle };
      }
      return { label: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock };
    }
    if (submission.score !== undefined) {
      return { label: 'Graded', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 };
    }
    return { label: 'Submitted', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: FileText };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedAssignment) return;

    try {
      await addDoc(collection(db, 'submissions'), {
        assignment_id: selectedAssignment.id,
        user_id: user.uid,
        file_url: submissionLink,
        notes: submissionNotes,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      });
      setSubmitModalOpen(false);
      setSubmissionLink('');
      setSubmissionNotes('');
    } catch (err) {
      console.error('Error submitting:', err);
    }
  };

  const AssignmentCard = ({ assignment }: { assignment: any }) => {
    const status = getStatus(assignment.id);
    const submission = submissions.find(s => s.assignment_id === assignment.id);

    return (
      <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className={cn("px-2 py-0.5", status.color)}>
              <status.icon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
            <span className="text-xs text-text-secondary font-medium">
              Due: {format(parseISO(assignment.due_date), 'MMM d, h:mm a')}
            </span>
          </div>
          <CardTitle className="text-lg font-bold mt-2">{assignment.title}</CardTitle>
          <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Max Score: <span className="text-text-primary font-bold">{assignment.max_score}</span></span>
            {submission?.score !== undefined && (
              <span className="text-success font-bold">Score: {submission.score}/{assignment.max_score}</span>
            )}
          </div>
          
          {submission?.feedback && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs font-bold flex items-center gap-1 mb-1">
                <MessageSquare className="w-3 h-3" /> Mentor Feedback:
              </p>
              <p className="text-xs text-text-secondary italic">"{submission.feedback}"</p>
            </div>
          )}

          <div className="pt-2">
            {!submission ? (
              <Dialog open={submitModalOpen && selectedAssignment?.id === assignment.id} onOpenChange={(open) => {
                setSubmitModalOpen(open);
                if (open) setSelectedAssignment(assignment);
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 rounded-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit: {assignment.title}</DialogTitle>
                    <DialogDescription>
                      Upload your file or provide a link to your work (GitHub, Colab, etc.)
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="link">Submission Link (GitHub/Colab/Drive)</Label>
                      <Input 
                        id="link" 
                        placeholder="https://..." 
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Anything you'd like to tell your mentor..." 
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setSubmitModalOpen(false)}>Cancel</Button>
                      <Button type="submit" className="bg-accent">Submit Work</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant="outline" className="w-full rounded-full" onClick={() => window.open(submission.file_url, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Submission
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-text-secondary mt-1">Submit your work and track your progress.</p>
        </div>
      </div>

      {/* Capstone Section */}
      <section>
        <Card className="bg-primary text-white border-none shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <Badge className="bg-amber-500 text-white border-none">CAPSTONE PROJECT</Badge>
              <h2 className="text-2xl font-bold">Final Graduation Project</h2>
              <p className="text-white/70 max-w-md">
                Your capstone project is the culmination of your learning journey. 
                Work with your team to build a real-world solution.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs text-white/50 uppercase font-bold tracking-wider">Status</p>
                <p className="text-lg font-bold">Proposal Pending</p>
                <div className="mt-2 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-1/4"></div>
                </div>
              </div>
              <Button variant="secondary" className="rounded-full">
                View Project Brief
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-full shadow-sm border border-slate-100">
          <TabsTrigger value="all" className="rounded-full px-6">All</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-full px-6">Pending</TabsTrigger>
          <TabsTrigger value="submitted" className="rounded-full px-6">Submitted</TabsTrigger>
          <TabsTrigger value="graded" className="rounded-full px-6">Graded</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment, i) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AssignmentCard assignment={assignment} />
              </motion.div>
            ))}
          </div>
        </TabsContent>
        {/* Other tabs would filter the assignments array similarly */}
      </Tabs>
    </div>
  );
}
