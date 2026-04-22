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
  const [paymentOption, setPaymentOption] = useState<'founder' | 'standard' | 'late'>('founder');
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

  const getPricing = () => {
    switch (paymentOption) {
      case 'founder':
        return { base: 300, discount: 60, total: 240 };
      case 'standard':
        return { base: 300, discount: 0, total: 300 };
      case 'late':
        return { base: 300, discount: -100, total: 400 };
    }
  };

  const pricing = getPricing();

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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-3" style={{ fontSize: '14px' }}>Payment Option</label>
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === 'founder'}
                  onChange={() => setPaymentOption('founder')}
                  className="mt-1 accent-pink-600"
                />
                <span className="text-gray-700" style={{ fontSize: '13px' }}>
                  Founder's Reward (₵100 by 1st May — save ₵60)
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === 'standard'}
                  onChange={() => setPaymentOption('standard')}
                  className="mt-1 accent-pink-600"
                />
                <span className="text-gray-700" style={{ fontSize: '13px' }}>
                  Standard (₵100 by 14th May)
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentOption === 'late'}
                  onChange={() => setPaymentOption('late')}
                  className="mt-1 accent-pink-600"
                />
                <span className="text-gray-700" style={{ fontSize: '13px' }}>
                  Late Payment (₵100 + ₵100 penalty)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-3" style={{ fontSize: '14px' }}>Payment Summary</label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-gray-600" style={{ fontSize: '13px' }}>
                <span>Certificate fee:</span>
                <span>₵{pricing.base}</span>
              </div>
              {pricing.discount !== 0 && (
                <div className="flex justify-between text-gray-600" style={{ fontSize: '13px' }}>
                  <span>Discount:</span>
                  <span className={pricing.discount > 0 ? 'text-green-600' : 'text-red-600'}>
                    {pricing.discount > 0 ? '-' : '+'}₵{Math.abs(pricing.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200" style={{ fontSize: '15px' }}>
                <span className="text-gray-700">Total:</span>
                <span className="text-pink-600">₵{pricing.total}</span>
              </div>
            </div>
          </div>
        </div>

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
