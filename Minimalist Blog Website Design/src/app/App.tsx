import { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BlogPost from './components/BlogPost';
import BlogCard from './components/BlogCard';

const blogPosts = [
  {
    id: 1,
    title: 'On the Precision of Editorial Design',
    category: 'Design',
    date: 'Apr 14, 2026',
    readTime: '8 min',
    excerpt:
      'Typography is not decoration. It is the architecture of information, the scaffold upon which meaning is constructed. Every choice—font, weight, spacing—carries consequence.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80',
    imageCaption: 'Workspace study, Berlin, 2026',
    content: [
      'Typography is not decoration. It is the architecture of information, the scaffold upon which meaning is constructed. Every choice—font, weight, spacing—carries consequence. In an age of algorithmic feeds and infinite scroll, the editorial eye becomes radical resistance.',
      'Swiss design taught us that restraint is not absence. It is deliberate selection. The grid is not a cage but a framework for clarity. White space is not emptiness but breathing room for thought. A single accent color, deployed with surgical precision, achieves what a gradient carnival never could.',
      'Consider the newspaper. Consider the book. Consider any artifact that has survived the test of time. What persists is not novelty but legibility. Not complexity but coherence. The challenge is not to make something look "designed" but to make design invisible in service of the content.',
      'We return to basics: a bold serif for moments of emphasis, a monospaced font for sustained reading. Black ink on off-white paper. A 1-pixel border that frames without overwhelming. These are not limitations—they are liberations from the tyranny of choice.',
      'The digital space affords us infinite possibility. But infinite possibility without constraint produces only noise. The question is not "what can we do?" but "what should we do?" The answer, more often than not, is less.',
    ],
  },
  {
    id: 2,
    title: 'Against Smoothness',
    category: 'Essay',
    date: 'Apr 12, 2026',
    readTime: '6 min',
    excerpt:
      'Friction is information. The instant hover animation, the gradient transition, the soft shadow—these are lies about how things work. Brutalism tells the truth.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    imageCaption: 'Concrete forms, São Paulo',
    content: [
      'Friction is information. The instant hover animation, the gradient transition, the soft shadow—these are lies about how things work. They promise a frictionless experience in a world defined by resistance.',
      'Brutalism tells the truth. A button that changes color instantly on hover says: "This is a state change, not a performance." A 1-pixel border says: "This is a boundary." Raw concrete, unfinished wood, exposed brick—these materials do not pretend to be something they are not.',
      'The modernist project was clarity through reduction. Strip away ornament until only essence remains. But somewhere along the way, we confused reduction with softness. We smoothed the edges until nothing had definition.',
      'A brutalist interface does not coddle. It presents information in stark relief. It uses the grid not as suggestion but as law. It employs typography as structure, not decoration. It says: "Here is the thing. Engage with it on its terms."',
      'This is not hostility. This is respect. Respect for the user\'s intelligence. Respect for the content\'s integrity. Respect for the medium\'s constraints. The smoothness we have been sold is a patronizing lie. Friction is honesty.',
    ],
  },
  {
    id: 3,
    title: 'The Reading Experience',
    category: 'Technology',
    date: 'Apr 10, 2026',
    readTime: '5 min',
    excerpt:
      'Digital reading is not print reading. But it is not worse—it is different. The question is how we design for sustained attention in a medium optimized for distraction.',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&q=80',
    imageCaption: 'Reading notes, analog archive',
    content: [
      'Digital reading is not print reading. But it is not worse—it is different. The question is how we design for sustained attention in a medium optimized for distraction.',
      'The single-column layout is not a concession but a choice. It says: this content deserves your full focus. No sidebar. No pop-ups. No "related articles" carousel. Just words, space, and structure.',
      'The reading progress indicator is not gamification. It is orientation. In a boundless scroll, it provides a sense of place. You are here. This is how far you have come. This is how far remains.',
      'Monospaced type for body text is unconventional. But conventions exist to be questioned. The rhythm of fixed-width characters creates a different reading cadence—deliberate, measured, almost mechanical. This is not literature; this is information architecture.',
      'We have optimized for speed. Skim, scan, share. But some ideas require time. Some arguments demand careful unpacking. The reading experience, properly designed, is an invitation to slow down. To think. To engage. This is the resistance we owe to the medium.',
    ],
  },
];

export default function App() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const currentPost = selectedPost !== null ? blogPosts.find((p) => p.id === selectedPost) : null;

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <Header />
      <Navigation />

      {currentPost ? (
        <>
          <button
            onClick={() => setSelectedPost(null)}
            className="fixed top-24 right-12 z-50 border border-[#1A1A1A] px-6 py-3 bg-[#F9F9F7] text-[11px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] hover:text-[#F9F9F7] transition-colors duration-0"
          >
            ← Back
          </button>
          <BlogPost
            title={currentPost.title}
            date={currentPost.date}
            readTime={currentPost.readTime}
            image={currentPost.image}
            imageCaption={currentPost.imageCaption}
            content={currentPost.content}
          />
        </>
      ) : (
        <main className="px-12 py-24">
          <div className="grid grid-cols-12 gap-0">
            {/* Sidebar */}
            <aside className="col-span-3 border-r border-[#1A1A1A] pr-12">
              <div className="sticky top-32">
                <h3 className="text-[11px] tracking-[0.15em] uppercase mb-8 text-[#6B6B6B]">
                  Featured Topics
                </h3>
                <ul className="space-y-4">
                  {['Design', 'Essay', 'Technology', 'Architecture', 'Theory'].map((topic) => (
                    <li key={topic}>
                      <button className="text-[13px] hover:text-[#002FA7] transition-colors duration-0">
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-16 pt-16 border-t border-[#1A1A1A]">
                  <h3 className="text-[11px] tracking-[0.15em] uppercase mb-4 text-[#6B6B6B]">
                    Subscribe
                  </h3>
                  <p className="text-[11px] leading-relaxed mb-6">
                    Weekly essays on design, typography, and digital craft.
                  </p>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-[#1A1A1A] px-4 py-3 text-[11px] tracking-[0.05em] bg-transparent focus:outline-none focus:ring-1 focus:ring-[#002FA7]"
                  />
                  <button className="w-full border border-[#1A1A1A] px-4 py-3 mt-2 text-[11px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] hover:text-[#F9F9F7] transition-colors duration-0">
                    Submit
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="col-span-9 pl-12">
              <div className="grid gap-12">
                {blogPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    readTime={post.readTime}
                    category={post.category}
                    onClick={() => setSelectedPost(post.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      {!currentPost && (
        <footer className="border-t border-[#1A1A1A] px-12 py-12">
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-6">
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">
                © 2026 Paper & Ink. All rights reserved.
              </p>
            </div>
            <div className="col-span-6 flex justify-end gap-12">
              {['Twitter', 'Instagram', 'RSS'].map((social) => (
                <button
                  key={social}
                  className="text-[11px] tracking-[0.15em] uppercase hover:text-[#002FA7] transition-colors duration-0"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}