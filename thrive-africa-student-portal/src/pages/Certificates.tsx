import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Award, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Linkedin, 
  ShieldCheck,
  Trophy,
  Search
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function Certificates() {
  const { user, profile } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'certificates'), where('user_id', '==', user.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
        <p className="text-text-secondary mt-1">View and download your earned certifications.</p>
      </div>

      {/* In Progress Certificate */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold">In Progress</h3>
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
              <Award className="w-12 h-12 text-slate-300" />
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xl font-bold">{profile?.programme || 'Current Programme'}</h4>
                  <p className="text-sm text-text-secondary">Expected Completion: June 2026</p>
                </div>
                <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-600">65% Complete</Badge>
              </div>
              <div className="space-y-2">
                <Progress value={65} className="h-3" />
                <p className="text-xs text-text-secondary text-right font-medium">8 of 12 modules completed</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Earned Certificates */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold">Earned Certificates</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-md overflow-hidden group">
                  <div className="h-2 bg-accent"></div>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-accent/5 rounded-xl flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Score</p>
                        <p className="text-2xl font-black text-accent">{cert.score}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold leading-tight">{cert.course_name || 'Digital Skills Certification'}</h4>
                      <p className="text-sm text-text-secondary mt-1">Issued on {format(new Date(cert.issued_at), 'MMMM d, yyyy')}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        <span className="text-xs font-medium text-text-secondary">Verified by {cert.university_partner || 'KTU'}</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-accent hover:bg-accent/90 rounded-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full" title="Share on LinkedIn">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-accent">
                        Verification Code: {cert.verification_code}
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold">No certificates yet</h3>
            <p className="text-text-secondary">Complete your course and assignments to earn your certificate.</p>
          </div>
        )}
      </section>

      {/* Verification Search */}
      <section className="bg-primary text-white rounded-3xl p-8 md:p-12 border-none shadow-lg">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Certificate Verification</h2>
          <p className="text-white/70">
            Employers and partners can verify the authenticity of Thrive Africa certificates using the unique verification code.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-4 h-5 w-5 text-white/40" />
            <Input 
              placeholder="Enter verification code..." 
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full focus:bg-white/20"
            />
            <Button className="absolute right-2 top-2 bg-accent hover:bg-accent/90 rounded-full h-10 px-6">
              Verify
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
