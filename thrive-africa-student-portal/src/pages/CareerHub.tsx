import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  FileUser, 
  Linkedin, 
  Globe, 
  Users, 
  Video,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

const services = [
  {
    id: 'cv_review',
    title: 'CV Review',
    description: 'Get professional feedback on your CV to stand out to recruiters.',
    icon: FileUser,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    cta: 'Upload CV'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Optimisation',
    description: 'Improve your profile visibility and attract remote opportunities.',
    icon: Linkedin,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    cta: 'Submit Profile'
  },
  {
    id: 'internship',
    title: 'Internship Applications',
    description: 'Apply for remote internships with our partner companies.',
    icon: Users,
    color: 'text-green-500',
    bg: 'bg-green-50',
    cta: 'Apply Now'
  },
  {
    id: 'mock_interview',
    title: 'Mock Interviews',
    description: 'Practice with mentors to ace your technical and HR interviews.',
    icon: Video,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    cta: 'Book Session'
  },
  {
    id: 'jobs',
    title: 'Remote Job Board',
    description: 'Curated list of remote-friendly jobs for African talent.',
    icon: Briefcase,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    cta: 'Browse Jobs'
  },
  {
    id: 'study_abroad',
    title: 'Study & Work Abroad',
    description: 'Explore scholarship and work opportunities in Europe and North America.',
    icon: Globe,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    cta: 'Explore'
  }
];

export default function CareerHub() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'career_applications'), where('user_id', '==', user.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Submitted</Badge>;
      case 'under_review': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Under Review</Badge>;
      case 'feedback_ready': return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Feedback Ready</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Hub</h1>
        <p className="text-text-secondary mt-1">Accelerate your career with our professional services and job board.</p>
      </div>

      {/* Active Applications */}
      {applications.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold">Your Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <Card key={app.id} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      {services.find(s => s.id === app.type)?.icon({ className: "w-5 h-5 text-slate-600" })}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{services.find(s => s.id === app.type)?.title}</p>
                      <p className="text-xs text-text-secondary">Applied on {new Date(app.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-all flex flex-col">
              <CardHeader>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", service.bg)}>
                  <service.icon className={cn("w-6 h-6", service.color)} />
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Button className="w-full bg-accent hover:bg-accent/90 rounded-full group">
                  {service.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats/Info Section */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to land your dream remote job?</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Our career services are designed to bridge the gap between learning and employment. 
              From CV reviews to mock interviews, we provide the support you need to succeed in the global job market.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="font-medium">1-on-1 Mentorship</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="font-medium">Global Network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="font-medium">Remote-First Focus</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-accent/5 rounded-full flex items-center justify-center">
              <Briefcase className="w-32 h-32 text-accent/20" />
            </div>
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 border-none shadow-xl rotate-3">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-text-secondary">Students Placed in Remote Jobs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
