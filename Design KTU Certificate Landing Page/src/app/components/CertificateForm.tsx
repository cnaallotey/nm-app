import { useEffect, useState } from 'react';

type CourseGroup = { label: string; items: string[] };

const certificateTitles = [
  { value: 'data-science', label: 'Certificate in Advanced Data Science & Analytics', courses: ['Advanced Data Science & Analytics'] },
  { value: 'ml-ai', label: 'Certificate in Advanced Machine Learning & AI', courses: ['Advanced Machine Learning & AI'] },
  { value: 'cloud', label: 'Certificate in Advanced Cloud Computing', courses: ['Advanced Cloud Computing'] },
  { value: 'cybersecurity', label: 'Certificate in Advanced Cybersecurity', courses: ['Advanced Cybersecurity'] },
  { value: 'gen-ai', label: 'Certificate in Generative AI & Advanced Prompt Engineering', courses: ['Generative AI & Advanced Prompt Engineering'] },
  { value: 'bundle-data-science', label: 'Certificate in Advanced Data Science', courses: ['Advanced Data Science & Analytics', 'Advanced Machine Learning & AI'] },
  { value: 'bundle-cyber-cloud', label: 'Certificate in Advanced Cybersecurity with Advanced Cloud Computing', courses: ['Advanced Cybersecurity', 'Advanced Cloud Computing'] },
  { value: 'bundle-data-eng', label: 'Certificate in Advanced Data Engineering', courses: ['Advanced Data Science & Analytics', 'Advanced Cloud Computing'] },
  { value: 'bundle-ai-eng', label: 'Certificate in Advanced AI-Engineering', courses: ['Advanced Machine Learning & AI', 'Advanced Cloud Computing'] },
];

export function CertificateForm() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/thrive-courses').then(r => r.json()),
      fetch('/api/ignite-courses').then(r => r.json()),
    ])
      .then(([thrive, ignite]) => {
        if (cancelled) return;
        const thriveNames: string[] = (thrive.items || [])
          .map((i: { name?: string }) => (i.name || '').trim())
          .filter(Boolean);
        const igniteNames: string[] = (ignite.items || [])
          .map((i: { name?: string }) => (i.name || '').trim())
          .filter(Boolean);
        const essentials = thriveNames.map(n => n.replace(/^Advanced\s+/i, '').trim());
        setCourseGroups([
          { label: 'Essentials', items: essentials },
          { label: 'Advanced', items: thriveNames },
          { label: 'Ignite', items: igniteNames },
        ]);
      })
      .catch(() => {
        if (cancelled) return;
        setCourseGroups([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCourses(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleCourseToggle = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-[680px] mx-auto">
      <h3 className="mb-6" style={{ fontSize: '20px', color: '#1a1a1a' }}>Certificate Application Form</h3>

      <form className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Phone Number</label>
          <input
            type="tel"
            placeholder="e.g. 0551234567"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Course(s) Enrolled In</label>
          {loadingCourses ? (
            <p className="text-gray-400" style={{ fontSize: '13px' }}>Loading courses…</p>
          ) : courseGroups.length === 0 ? (
            <p className="text-red-500" style={{ fontSize: '13px' }}>Unable to load courses. Please refresh.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-4">
              {courseGroups.map((group) => (
                group.items.length > 0 && (
                  <div key={group.label}>
                    <p className="text-pink-600 uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600 }}>
                      {group.label}
                    </p>
                    <div className="space-y-2">
                      {group.items.map((course) => (
                        <label key={`${group.label}-${course}`} className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course)}
                            onChange={() => handleCourseToggle(course)}
                            className="w-4 h-4 mt-0.5 accent-pink-600 flex-shrink-0"
                          />
                          <span className="text-gray-700" style={{ fontSize: '14px' }}>{course}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
          <p className="text-gray-500 mt-2" style={{ fontSize: '12px' }}>Select all courses you're enrolled in.</p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Certificate Title Selected</label>
          <select
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          >
            <option value="">Select your certificate title</option>
            {certificateTitles.map((cert) => (
              <option key={cert.value} value={cert.value}>{cert.label}</option>
            ))}
          </select>
        </div>

        <p className="bg-pink-50 border border-pink-100 text-pink-700 rounded-lg px-4 py-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          Pay an initial GHS100 deposit per certificate to enjoy the <b>GHS60 Founder's Reward discount</b> per certificate.
        </p>

        <button
          type="submit"
          className="w-full h-[52px] bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          style={{ fontSize: '16px' }}
        >
          Submit My Application →
        </button>

        <p className="text-center text-gray-400" style={{ fontSize: '13px' }}>
          Need help? Call: 0552133389 | 0594606051 | 0538415157 | 0264861897
        </p>
      </form>
    </div>
  );
}
