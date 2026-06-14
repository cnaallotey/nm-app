import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Download, 
  ExternalLink,
  Filter,
  BookOpen
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function Materials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'materials'), orderBy('uploaded_at', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterials(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === 'all' || mat.module_id === selectedModule;
    return matchesSearch && matchesModule;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-green-500" />;
      case 'notebook': return <BookOpen className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Materials</h1>
        <p className="text-text-secondary mt-1">Access slides, notes, and recordings for your programme.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search materials..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat, i) => (
            <motion.div
              key={mat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-accent/10 transition-colors">
                      {getIcon(mat.type)}
                    </div>
                    <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600">
                      {mat.type}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg line-clamp-1">{mat.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Uploaded {format(new Date(mat.uploaded_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-text-secondary">
                      {mat.size || '2.4 MB'}
                    </span>
                    <Button 
                      size="sm" 
                      className="rounded-full bg-accent hover:bg-accent/90"
                      onClick={() => window.open(mat.file_url, '_blank')}
                    >
                      {mat.type === 'link' ? (
                        <>Open <ExternalLink className="w-3 h-3 ml-2" /></>
                      ) : (
                        <>Download <Download className="w-3 h-3 ml-2" /></>
                      )}
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
            <BookOpen className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold">No materials found</h3>
          <p className="text-text-secondary">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
