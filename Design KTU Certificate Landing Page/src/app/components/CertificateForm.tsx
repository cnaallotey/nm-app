import { useState, FormEvent } from 'react';

const courses = [
  'Generative AI & Advanced Prompt Engineering',
  'Advanced Data Science & Analytics',
  'Advanced Cloud Computing',
  'Advanced Machine Learning and AI',
  'Advanced Cybersecurity',
];

const certificateTitles = [
  // Individual
  { value: 'data-science', label: 'Certificate in Advanced Data Science & Analytics', criteria: 'Individual course certificate' },
  { value: 'ml-ai', label: 'Certificate in Advanced Machine Learning & AI', criteria: 'Individual course certificate' },
  { value: 'cloud', label: 'Certificate in Advanced Cloud Computing', criteria: 'Individual course certificate' },
  { value: 'cybersecurity', label: 'Certificate in Advanced Cybersecurity', criteria: 'Individual course certificate' },
  { value: 'gen-ai', label: 'Certificate in Generative AI & Advanced Prompt Engineering', criteria: 'Individual course certificate' },

  // Bundles
  { value: 'bundle-data-science', label: 'Certificate in Advanced Data Science', criteria: 'if you enrolled in both Advanced Data Science & Analytics and Advanced Machine Learning & AI Course' },
  { value: 'bundle-cyber-cloud', label: 'Certificate in Advanced Cybersecurity with Advanced Cloud Computing', criteria: 'if you enrolled in both Advanced Cybersecurity & Advanced Cloud Computing Course' },
  { value: 'bundle-data-eng', label: 'Certificate in Advanced Data Engineering', criteria: 'if you enrolled in both Advanced Data Science & Analytics and Advanced Cloud Computing Course' },
  { value: 'bundle-ai-eng', label: 'Certificate in Advanced AI-Engineering', criteria: 'if you enrolled in both Advanced Machine Learning & AI and Advanced Cloud Computing Course' },

  // AI-Powered
  { value: 'ai-data-analytics', label: 'Certificate in Advanced AI-Powered Data Analytics', criteria: 'if you enrolled in both Generative AI & Advanced Prompt Engineering & Advanced Data Science & Analytics Course' },
  { value: 'ai-cyber', label: 'Certificate in Advanced AI-Powered Cybersecurity', criteria: 'if you enrolled in both Generative AI & Advanced Prompt Engineering & Advanced Cybersecurity Course' },
  { value: 'ai-cloud', label: 'Certificate in Advanced AI-Powered Cloud Computing', criteria: 'if you enrolled in both Advanced Cloud Computing & Generative AI & Advanced Prompt Engineering' },
  { value: 'ai-data-science', label: 'Certificate in Advanced AI-Powered Data Science', criteria: 'if you enrolled in both Advanced Data Science & Analytics, Advanced Machine Learning & AI & Generative AI & Advanced Prompt Engineering' },
  { value: 'ai-cyber-cloud', label: 'Certificate in Advanced AI-Powered Cybersecurity with Cloud Computing', criteria: 'if you enrolled in both Advanced cybersecurity, Advanced cloud computing & Generative AI & Advanced Prompt Engineering' },
  { value: 'ai-data-eng', label: 'Certificate in Advanced AI-Powered Data Engineering', criteria: 'if you enrolled in both Advanced Data Science & Analytics, Advanced Cloud Computing & Generative AI & Advanced Prompt Engineering' },
];

const FORM_ENDPOINT = 'https://formdrop.clientra.tech/f/3smopezh';
const PAYSTACK_URL = 'https://paystack.shop/pay/m26cert';
const CONTACTS = ['0552133389', '0538415157', '0594606051', '0264861897'];

export function CertificateForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseToggle = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const handleCertificateToggle = (cert: string) => {
    setSelectedCertificates(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const nextStep = () => {
    const form = document.getElementById('certificate-form') as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (step === 2 && selectedCourses.length === 0) {
      setSubmitError('Please select at least one course.');
      return;
    }

    setSubmitError(null);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setSubmitError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    if (selectedCertificates.length === 0) {
      setSubmitError('Please select at least one certificate title.');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      selectedCourses.forEach(c => data.append('courses[]', c));
      selectedCertificates.forEach(c => data.append('certificateTitles[]', c));

      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        mode: 'no-cors',
      });

      setFormData({ fullName: '', email: '', phone: '' });
      setSelectedCourses([]);
      setSelectedCertificates([]);
      setStep(1);
      setShowSuccess(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-[680px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6">
        <h3 style={{ fontSize: '20px', color: '#1a1a1a', fontWeight: 600 }}>Certificate Application Form</h3>
        <span className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Step {step} of 3</span>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= s ? 'bg-pink-600' : 'bg-pink-100'}`} />
        ))}
      </div>

      <form id="certificate-form" className="space-y-6" onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-5 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Full Name as you want to appear on your Certificate</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
                style={{ fontSize: '14px' }}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
                style={{ fontSize: '14px' }}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 0551234567"
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-pink-500 focus:bg-pink-50 focus:outline-none transition-colors"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Course(s) Enrolled In — March Cohort</label>
              <div className="border border-gray-200 rounded-xl p-3 space-y-2">
                {courses.map((course) => {
                  const isSelected = selectedCourses.includes(course);
                  return (
                    <label key={course} className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-all border ${isSelected ? 'bg-pink-50 border-pink-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCourseToggle(course)}
                        className="w-5 h-5 mt-0.5 accent-pink-600 flex-shrink-0 cursor-pointer rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className={`text-gray-700 ${isSelected ? 'font-medium text-pink-900' : ''}`} style={{ fontSize: '14px' }}>{course}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-gray-500 mt-2" style={{ fontSize: '12px' }}>Select all courses you're enrolled in.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Certificate Title(s) Selected</label>
              <div className="grid gap-3 sm:grid-cols-2 max-h-[350px] overflow-y-auto pr-2 pb-2 custom-scrollbar p-1">
                {certificateTitles.map((cert) => {
                  const isSelected = selectedCertificates.includes(cert.label);
                  return (
                    <div
                      key={cert.value}
                      onClick={() => handleCertificateToggle(cert.label)}
                      className={`cursor-pointer border rounded-xl p-4 transition-all relative overflow-hidden group ${isSelected ? 'bg-pink-50 border-pink-500 shadow-md ring-1 ring-pink-500' : 'bg-white border-gray-200 hover:border-pink-300 hover:shadow-sm'
                        }`}
                    >
                      {/* Checkmark icon upper right corner */}
                      <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border transition-all flex items-center justify-center ${isSelected ? 'border-pink-600 bg-pink-600' : 'border-gray-300 group-hover:border-pink-300'}`}>
                        {isSelected && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white stroke-current stroke-[2.5px]"><path d="M3 7.5L5.5 10L11 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>

                      <div className="pr-6">
                        <div className={`mb-2 ${isSelected ? 'text-pink-900 font-bold' : 'text-gray-800 font-semibold'}`} style={{ fontSize: '14px' }}>
                          {cert.label}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded mb-2 ${isSelected ? 'bg-pink-100/80 text-pink-700' : 'bg-gray-100 text-gray-500'}`} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                          Requirements:
                        </div>
                        <div className={isSelected ? 'text-pink-800/80' : 'text-gray-500'} style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                          {cert.criteria}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-500 mt-3" style={{ fontSize: '12px' }}>Click to select all certificates you are requesting.</p>
            </div>

            <p className="bg-pink-50 border border-pink-100 text-pink-700 rounded-lg px-4 py-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
              Pay an initial GHS100 deposit per certificate to enjoy the <b>GHS60 Founder's Reward discount</b> per certificate.
            </p>
          </div>
        )}

        {submitError && (
          <p className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 animate-in fade-in" style={{ fontSize: '13px' }}>
            {submitError}
          </p>
        )}

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-shrink-0 px-6 sm:px-8 py-3.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              style={{ fontSize: '15px' }}
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors py-3.5 shadow-sm font-semibold"
              style={{ fontSize: '15px' }}
            >
              Next Step →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors py-3.5 shadow-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontSize: '15px' }}
            >
              {submitting ? 'Submitting…' : 'Submit My Application →'}
            </button>
          )}
        </div>

        <p className="text-center text-gray-400 mt-4" style={{ fontSize: '13px' }}>
          Need help? Call: {CONTACTS.join(' | ')}
        </p>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[520px] w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              style={{ fontSize: '20px' }}
            >
              ×
            </button>

            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-5" style={{ fontSize: '32px' }}>
              ✓
            </div>

            <h3 className="text-[#1a1a1a] text-center mb-2" style={{ fontSize: '22px', fontWeight: 700 }}>
              Thank you for submitting your details.
            </h3>

            <p className="text-gray-600 mb-5 text-center" style={{ fontSize: '15px', lineHeight: '1.6' }}>
              To complete your application, please pay a <b>GHS100 deposit per each Certificate Title</b> using the link below to secure your certificate and unlock your <b>GHS60 Founder's Reward</b>.
            </p>

            <a
              href={PAYSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-pink-600 text-white py-3.5 rounded-lg hover:bg-pink-700 transition-colors mb-6 shadow-sm"
              style={{ fontSize: '15px', fontWeight: 600 }}
            >
              Pay GHS100 Deposit on Paystack →
            </a>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
              <p className="text-gray-600 mb-3" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                After payment, send your receipt or a screenshot (including the transaction ID) to any of the contacts below for confirmation:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {CONTACTS.map((num) => (
                  <li key={num} className="flex items-center gap-2">
                    <span className="text-pink-500 text-sm">📞</span>
                    <a href={`tel:${num}`} className="text-pink-600 hover:text-pink-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {num}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              style={{ fontSize: '15px' }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
