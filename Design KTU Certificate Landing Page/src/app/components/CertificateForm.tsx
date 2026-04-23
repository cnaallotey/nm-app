import { useState, FormEvent } from 'react';

const courses = [
  'Generative AI & Advanced Prompt Engineering',
  'Advanced Data Science & Analytics',
  'Advanced Cloud Computing',
  'Advanced Machine Learning and AI',
  'Advanced Cybersecurity',
];

const certificateTitles = [
  { value: 'data-science', label: 'Certificate in Advanced Data Science & Analytics' },
  { value: 'ml-ai', label: 'Certificate in Advanced Machine Learning and AI' },
  { value: 'cloud', label: 'Certificate in Advanced Cloud Computing' },
  { value: 'cybersecurity', label: 'Certificate in Advanced Cybersecurity' },
  { value: 'gen-ai', label: 'Certificate in Generative AI & Advanced Prompt Engineering' },
  { value: 'bundle-data-science', label: 'Certificate in Advanced Data Science (Data Science + ML/AI)' },
  { value: 'bundle-cyber-cloud', label: 'Certificate in Advanced Cybersecurity with Advanced Cloud Computing' },
  { value: 'bundle-data-eng', label: 'Certificate in Advanced Data Engineering (Data Science + Cloud)' },
  { value: 'bundle-ai-eng', label: 'Certificate in Advanced AI-Engineering (ML/AI + Cloud)' },
];

const FORM_ENDPOINT = 'https://forminit.com/f/bvrmgxpb';
const PAYSTACK_URL = 'https://paystack.shop/pay/m26cert';
const CONTACTS = ['0552133389', '0538415157', '0594606051', '0264861897'];

export function CertificateForm() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCourseToggle = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    if (selectedCourses.length === 0) {
      setSubmitError('Please select at least one course.');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const data = new FormData(form);
      selectedCourses.forEach(c => data.append('courses[]', c));

      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        mode: 'no-cors',
      });

      form.reset();
      setSelectedCourses([]);
      setShowSuccess(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-[680px] mx-auto">
      <h3 className="mb-6" style={{ fontSize: '20px', color: '#1a1a1a' }}>Certificate Application Form</h3>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            placeholder="Enter your full name"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="e.g. 0551234567"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Course(s) Enrolled In — March Cohort</label>
          <div className="border border-gray-200 rounded-lg p-3 space-y-2">
            {courses.map((course) => (
              <label key={course} className="flex items-start gap-2 cursor-pointer">
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
          <p className="text-gray-500 mt-2" style={{ fontSize: '12px' }}>Select all courses you're enrolled in.</p>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" style={{ fontSize: '14px' }}>Certificate Title Selected</label>
          <select
            name="certificateTitle"
            required
            defaultValue=""
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
            style={{ fontSize: '14px' }}
          >
            <option value="" disabled>Select your certificate title</option>
            {certificateTitles.map((cert) => (
              <option key={cert.value} value={cert.label}>{cert.label}</option>
            ))}
          </select>
        </div>

        <p className="bg-pink-50 border border-pink-100 text-pink-700 rounded-lg px-4 py-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          Pay an initial GHS100 deposit per certificate to enjoy the <b>GHS60 Founder's Reward discount</b> per certificate.
        </p>

        {submitError && (
          <p className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3" style={{ fontSize: '13px' }}>
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-[52px] bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontSize: '16px' }}
        >
          {submitting ? 'Submitting…' : 'Submit My Application →'}
        </button>

        <p className="text-center text-gray-400" style={{ fontSize: '13px' }}>
          Need help? Call: {CONTACTS.join(' | ')}
        </p>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[520px] w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              style={{ fontSize: '20px' }}
            >
              ×
            </button>

            <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-5" style={{ fontSize: '28px' }}>
              ✓
            </div>

            <h3 className="text-[#1a1a1a] text-center mb-2" style={{ fontSize: '22px', fontWeight: 700 }}>
              Thank you for submitting your details.
            </h3>

            <p className="text-gray-600 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              To complete your application, please pay a <b>GHS100 deposit</b> using the link below to secure your certificate and unlock your <b>GHS60 Founder's Reward</b>.
            </p>

            <a
              href={PAYSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors mb-5"
              style={{ fontSize: '15px', fontWeight: 600 }}
            >
              Pay GHS100 Deposit on Paystack →
            </a>

            <p className="text-gray-600 mb-3" style={{ fontSize: '13px', lineHeight: '1.6' }}>
              After payment, send your receipt or a screenshot (including the transaction ID) to any of the contacts below for confirmation:
            </p>

            <ul className="space-y-1.5 mb-5">
              {CONTACTS.map((num) => (
                <li key={num}>
                  <a href={`tel:${num}`} className="text-pink-600 hover:text-pink-700" style={{ fontSize: '14px', fontWeight: 500 }}>
                    {num}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontSize: '14px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
