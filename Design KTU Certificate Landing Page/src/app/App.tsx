import { Accordion } from './components/Accordion';
import { Tabs } from './components/Tabs';
import { CertificateForm } from './components/CertificateForm';

export default function App() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const faqItems = [
    {
      question: "What's the difference between the free Thrive Africa certificate and the KTU one?",
      answer: "Thrive Africa Certificate (Free): Digital, comes with transcript, recognizes skills gained and not accredited. KTU Certificate (₵200): Hardcopy, official university certificate, valuable for jobs, unlocking free funding, support, and visa for study abroad, and professional recognition."
    },
    {
      question: "Can I pay in parts?",
      answer: "Yes. Pay ₵70 by 14th August 2026 and enjoy ₵30 discount on first come, first served, or ₵100 after 14th August 2026 (no discount, no penalty). Then clear the remaining balance one month before class ends."
    },
    {
      question: "When will I get my KTU certificate?",
      answer: "Within 1 month after your program ends."
    },
    {
      question: "Do I still get the Thrive Africa certificate if I don't apply for KTU's?",
      answer: "Yes, the Thrive Africa Certificate & Transcript are free for all completers. The KTU certificate is optional."
    },
    {
      question: "Is the KTU Certificate Accredited?",
      answer: "Yes, the KTU certificate is accredited because KTU is an accredited public university."
    },
    {
      question: "What are the Professional Certificate Bundle Packages?",
      answer: "Bundle Packages let you save more when you register for multiple KTU certificates. For example: 2 certificates = GHS320 (save GHS80), 3 certificates = GHS450 (save GHS150), and so on — up to 11 certificates for GHS1,320 (save GHS880). The more certificates you register for, the more you save!"
    },
    {
      question: "Can I add an AI-Powered certificate to my bundle?",
      answer: "Yes! You can boost any bundle by enrolling in the Generative AI & Advanced Prompt Engineering course, which unlocks an AI-Powered version of your certificate — perfect for standing out in today's AI-driven job market."
    }
  ];

  const certificateTabs = [
    {
      label: "Individual Courses",
      content: (
        <div className="grid md:grid-cols-3 gap-5">
          {[
            "Certificate in Data Science & Analytics",
            "Certificate in Machine Learning & AI",
            "Certificate in Cloud Computing (AWS)",
            "Certificate in Cybersecurity (CC-ComPTIA Security+)",
            "Certificate in Generative AI & Advanced Prompt Engineering",
            "Certificate in Graphic Design",
            "Certificate in Social Media Marketing & Advertising",
            "Certificate in Digital Advertising & Campaign Planning",
            "Certificate in UX/UI Design",
            "Certificate in Front-End Software Engineering"
          ].map((title, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-pink-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 text-pink-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#1a1a1a] mb-1" style={{ fontSize: '15px', fontWeight: 600 }}>
                    {title}
                  </div>
                  <div className="text-gray-400" style={{ fontSize: '12px' }}>
                    Individual course certificate
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      label: "Course Bundles",
      content: (
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: "Certificate in Data Science", combo: "if you enrolled in both Data Science & Analytics and Machine Learning & AI Course" },
            { title: "Certificate in Cybersecurity with Cloud Computing", combo: "if you enrolled in both Cybersecurity & Cloud Computing Course" },
            { title: "Certificate in Data Engineering", combo: "if you enrolled in both Data Science & Analytics and Cloud Computing Course" },
            { title: "Certificate in AI Engineering", combo: "if you enrolled in both Machine Learning & AI and Cloud Computing Course" },
            { title: "Certificate in Digital Marketing", combo: "if you enrolled in both Social Media Marketing & Advertising & Digital Advertising & Campaign Planning or Graphic Design and/or Website Development with Wordpress" },
            { title: "Certificate in Digital Marketing & Data Analytics", combo: "if you enrolled in both Social Media Marketing & Advertising & Digital Advertising and Campaign Planning & Data Science & Analytics" },
            { title: "Certificate in Software Product Design & Development", combo: "if you enrolled in both UX/UI Design & Front-End Software Engineering" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-pink-50 transition-colors relative">
              <span className="absolute top-3 right-3 bg-pink-100 text-pink-600 px-2 py-1 rounded-full" style={{ fontSize: '11px' }}>
                Bundle
              </span>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 text-pink-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#1a1a1a] mb-1" style={{ fontSize: '15px', fontWeight: 600 }}>
                    {item.title}
                  </div>
                  <div className="text-gray-400" style={{ fontSize: '12px' }}>
                    {item.combo}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      label: "AI-Powered Titles",
      content: (
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Certificate in AI-Powered Data Analytics", combo: "if you enrolled in both Generative AI & Advanced Prompt Engineering & Data Science & Analytics Course" },
            { title: "Certificate in AI-Powered Cybersecurity", combo: "if you enrolled in both Generative AI & Advanced Prompt Engineering & Cybersecurity Course" },
            { title: "Certificate in AI-Powered Cloud Computing", combo: "if you enrolled in both Cloud Computing & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Data Science", combo: "if you enrolled in both Data Science & Analytics, Machine Learning & AI & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Cybersecurity with Cloud Computing (AWS Certified)", combo: "if you enrolled in both cybersecurity, cloud computing & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Data Engineering", combo: "if you enrolled in both Data Analytics, Cloud Computing & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Graphic Design", combo: "if you enrolled in both Graphic Design & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Website Development with Wordpress", combo: "if you enrolled in both Website Development with Wordpress & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered UX/UI Design", combo: "if you enrolled in both UX/UI Design & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Front-End Software Engineering", combo: "if you enrolled in both Front-End Software Engineering & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Social Media Marketing & Advertising", combo: "if you enrolled in both Social Media Marketing & Advertising & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Digital Advertising & Campaign Planning", combo: "if you enrolled in both Digital Advertising & Campaign Planning & Generative AI & Advanced Prompt Engineering" },
            { title: "Certificate in AI-Powered Digital Marketing", combo: "if you enrolled in both Generative AI & Advanced Prompt Engineering, Social Media Marketing & Advertising & Digital Advertising & Campaign Planning or Graphic Design and/or Website Development with Wordpress" },
            { title: "Certificate in AI-Powered Digital Marketing & Data Analytics", combo: "if you enrolled in both Generative AI & Advanced Prompt Engineering, Social Media Marketing & Advertising & Digital Advertising and Campaign Planning & Data Science & Analytics" },
            { title: "Certificate in AI-Powered Software Product Design & Development", combo: "if you enrolled in both Generative AI, UX/UI Design & Front-End Software Engineering" }
          ].map(({ title, combo }, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-pink-50 transition-colors relative">
              <span className="absolute top-3 right-3 text-pink-500" style={{ fontSize: '16px' }}>✦</span>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 text-pink-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#1a1a1a] mb-1" style={{ fontSize: '15px', fontWeight: 600 }}>
                    {title}
                  </div>
                  <div className="text-gray-400" style={{ fontSize: '12px' }}>
                    {combo}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - HERO */}
      <section id="top" className="bg-[#fdf2f8] py-12 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid md:grid-cols-[60%_40%] gap-10 md:gap-12 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 bg-white/70 backdrop-blur-sm  pr-4 sm:pr-5 py-2 w-fit max-w-full ">
                <div className="flex items-center gap-2 sm:gap-3">
                  <img src="/thrive-logo2.png" alt="Thrive Africa" className="h-7 sm:h-8 w-auto object-contain" />
                  <span className="text-gray-300" style={{ fontSize: '18px' }}>×</span>
                  <img src="/ktu-logo2.png" alt="Koforidua Technical University" className="h-7 sm:h-8 w-auto object-contain" />
                </div>
                <span className="text-gray-500 uppercase" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                  Official Partnership
                </span>
              </div>
              <div className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full mb-6" style={{ fontSize: '13px' }}>
                May/June 2026 Cohort • Now Open
              </div>
              <h1 className="text-[#1a1a1a] mb-4 text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-tight">
                Earn Your Official KTU University Certificate
              </h1>
              <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">
                Our university partner, Koforidua Technical University (KTU) — a respected public university in Ghana — is offering official certificates for the May/June 2026 Cohort. Earn a hardcopy, accredited certificate recognized for jobs, study abroad funding, and professional credibility.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
                <button onClick={() => scrollTo('reserve')} className="bg-pink-600 text-white px-6 sm:px-7 py-3 rounded-lg hover:bg-pink-700 transition-colors text-[15px] sm:text-base">
                  Reserve My KTU Certificate Now →
                </button>
                <button onClick={() => scrollTo('certificate-titles')} className="bg-white text-pink-600 border-2 border-pink-600 px-6 sm:px-7 py-3 rounded-lg hover:bg-pink-50 transition-colors text-[15px] sm:text-base">
                  See Certificate Titles ↓
                </button>
              </div>
              <div className="flex flex-wrap gap-6 text-gray-500" style={{ fontSize: '13px' }}>
                <div className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Accredited University</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Hardcopy Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Study Abroad Eligible</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white border-4 border-pink-200 rounded-xl p-3 transform -rotate-2 relative">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white z-10" style={{ fontSize: '20px' }}>
                  🏆
                </div>
                <img
                  src="/cert.jpg"
                  alt="KTU Certificate Sample"
                  className="w-full h-auto rounded-md block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - PRICING BANNER */}
      <section className="bg-slate-900 text-white py-16 md:py-32">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 divide-y divide-white/20 md:divide-y-0 md:divide-x">
            <div className="text-center px-4 py-8 md:pt-0 first:pt-0">
              <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                FOUNDER'S REWARD
              </p>
              <p className="mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>₵170</p>
              <p className="text-pink-100 mb-3" style={{ fontSize: '13px' }}>
                Save ₵30 — Pay ₵70 deposit by 14th August 2026
              </p>
              <span className="inline-block bg-pink-500 text-white px-3 py-1 rounded-md" style={{ fontSize: '11px' }}>
                First come, first served
              </span>
            </div>
            <div className="text-center px-4 py-8 md:pt-0 first:pt-0">
              <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                STANDARD PRICE
              </p>
              <p className="mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>₵200</p>
              <p className="text-pink-100 mb-3" style={{ fontSize: '13px' }}>
                ₵100 deposit after 14th August 2026 (no discount)
              </p>
              <span className="inline-block bg-pink-500 text-white px-3 py-1 rounded-md" style={{ fontSize: '11px' }}>
                No discount
              </span>
            </div>
            <div className="text-center px-4 py-8 md:pt-0 first:pt-0">
              <p className="text-pink-500 uppercase mb-2 flex items-center justify-center gap-1" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                <span>⚠</span> AFTER 14TH AUGUST
              </p>
              <p className="mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>₵300</p>
              <p className="text-pink-100 mb-3" style={{ fontSize: '13px' }}>
                ₵100 late fee applies (total becomes ₵300)
              </p>
              <span className="inline-block bg-pink-500 text-white px-3 py-1 rounded-md" style={{ fontSize: '11px' }}>
                Late fee warning
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2b - BUNDLE PACKAGES */}
      <section id="bundle-packages" className="bg-white py-16 md:py-24 scroll-mt-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              BUNDLE &amp; SAVE
            </p>
            <h2 className="text-[#1a1a1a] mb-4 text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight">
              Professional Certificate Bundle Packages
            </h2>
            <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed">
              Congratulations on completing your course(s)! Register for multiple certificates and <strong className="text-pink-600">save more with every additional certificate</strong>. You can also add an <strong className="text-pink-600">AI-Powered Professional Certificate</strong> by enrolling in the Generative AI course to strengthen your portfolio.
            </p>
          </div>

          {/* Savings Table */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="bg-pink-600 text-white">
                    <th className="px-5 py-4" style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em' }}>No. of Certificates</th>
                    <th className="px-5 py-4 text-right" style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em' }}>Bundle Price</th>
                    <th className="px-5 py-4 text-right" style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em' }}>Total Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { qty: '1 Certificate',   price: 'GHS 170',   savings: 'GHS 30',   popular: false },
                    { qty: '2 Certificates',  price: 'GHS 320',   savings: 'GHS 80',   popular: true  },
                    { qty: '3 Certificates',  price: 'GHS 450',   savings: 'GHS 150',  popular: false },
                    { qty: '4 Certificates',  price: 'GHS 560',   savings: 'GHS 240',  popular: false },
                    { qty: '5 Certificates',  price: 'GHS 650',   savings: 'GHS 350'  },
                    { qty: '6 Certificates',  price: 'GHS 720',   savings: 'GHS 480'  },
                    { qty: '7 Certificates',  price: 'GHS 840',   savings: 'GHS 560'  },
                    { qty: '8 Certificates',  price: 'GHS 960',   savings: 'GHS 640'  },
                    { qty: '9 Certificates',  price: 'GHS 1,080', savings: 'GHS 720'  },
                    { qty: '10 Certificates', price: 'GHS 1,200', savings: 'GHS 800'  },
                    { qty: '11 Certificates', price: 'GHS 1,320', savings: 'GHS 880'  },
                  ].map((row, idx) => (
                     <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-5 py-3 font-medium text-[#1a1a1a]" style={{ fontSize: '14px' }}>
                        {row.qty}
                        {row.popular && (
                          <span className="ml-2 inline-block bg-pink-100 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em' }}>POPULAR</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-[#1a1a1a]" style={{ fontSize: '14px' }}>{row.price}</td>
                      <td className="px-5 py-3 text-right font-bold text-pink-600" style={{ fontSize: '14px' }}>{row.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Note + CTA */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-pink-50 border border-pink-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <p className="text-[#1a1a1a] font-semibold mb-1" style={{ fontSize: '14px' }}>Limited-Time Promotional Offer</p>
                <p className="text-gray-600" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  Register for all the certificates you have earned and maximise the value of your learning experience. Prices shown reflect the Founder's Reward (pay by 14th August 2026).
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button onClick={() => scrollTo('reserve')} className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors" style={{ fontSize: '15px', fontWeight: 600 }}>
                Reserve My Certificates &amp; Save →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - WHY GET KTU CERTIFICATE */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/19501079/pexels-photo-19501079.jpeg"
          alt="University graduates celebrating"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,26,26,0.88) 0%, rgba(157,23,77,0.78) 100%)' }}></div>
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <p className="text-pink-300 uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
              BENEFITS
            </p>
            <h2 className="text-white mb-4 text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight">
              Why the KTU Certificate Matters
            </h2>
            <p className="text-pink-50/80 text-[15px] sm:text-base">
              More than just a document — it's your competitive edge.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
                title: "Boost Employability",
                body: "Stand out to employers and institutions with a hardcopy, university-backed credential."
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: "Unlock Study Abroad",
                body: "Use your KTU certificate to access free funding, support, and visa opportunities for studying abroad."
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                ),
                title: "Official University Recognition",
                body: "Issued directly by an accredited Ghanaian public university with full academic authority."
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                ),
                title: "Recognize Prior Learning",
                body: "Your skills and experience formally recognized and certified at the university level."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-6 hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-full flex items-center justify-center text-pink-200 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p className="text-pink-50/75" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - CERTIFICATE TITLES */}
      <section id="certificate-titles" className="bg-gray-50 py-16 md:py-24 scroll-mt-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              WHAT YOU'LL RECEIVE
            </p>
            <h2 className="text-[#1a1a1a] mb-4 text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight">
              Certificate Titles Available
            </h2>
            <p className="text-gray-500" style={{ fontSize: '15px' }}>
              Your certificate title reflects the course(s) you completed.
            </p>
          </div>
          <Tabs tabs={certificateTabs} />
        </div>
      </section>

      {/* SECTION 5 - CERTIFICATE PREVIEW */}
      <section className="py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, #fdf2f8, #ffffff)' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              SAMPLE
            </p>
            <h2 className="text-[#1a1a1a] text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight">
              What Your Certificate Will Look Like
            </h2>
          </div>
          <div className="max-w-[900px] mx-auto bg-white rounded-xl p-3 sm:p-4 relative" style={{ border: '2px solid #fbcfe8', outline: '1px solid #fce7f3', outlineOffset: '4px' }}>
            <img
              src="/cert.jpg"
              alt="KTU Certificate Sample"
              className="w-full h-auto rounded-md block"
            />
          </div>
          <p className="text-center text-gray-400 mt-6" style={{ fontSize: '13px' }}>
            Sample for illustration only. Actual certificate issued by Koforidua Technical University.
          </p>
        </div>
      </section>

      {/* SECTION 6 - PAYMENT TIMELINE */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              SIMPLE PROCESS
            </p>
            <h2 className="text-[#1a1a1a] text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight">
              How to Secure Your Certificate
            </h2>
          </div>
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 border-t-2 border-dashed border-pink-300 hidden md:block"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
              {[
                { title: "Choose Your Certificate", desc: "Select from individual, bundle, or AI-powered titles." },
                { title: "Pay ₵70 Deposit", desc: "By 14th August 2026 for ₵30 discount. After that, pay ₵100 (no discount)." },
                { title: "Complete Your Course", desc: "Continue your studies. Certificate is being prepared." },
                { title: "Receive Your Certificate", desc: "Hardcopy issued within 1 month of program completion." }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10" style={{ fontSize: '18px', fontWeight: 700 }}>
                    {idx + 1}
                  </div>
                  <h3 className="text-[#1a1a1a] mb-2" style={{ fontSize: '15px', fontWeight: 700 }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-500" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - COMPARISON TABLE */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&q=80&auto=format&fit=crop"
          alt="Students comparing study paths"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,26,26,0.88) 0%, rgba(157,23,77,0.78) 100%)' }}></div>
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6 py-16 md:py-24">
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <p className="text-pink-300 uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
              COMPARE
            </p>
            <h2 className="text-white text-[24px] sm:text-[28px] md:text-[32px] font-bold leading-tight">
              KTU Certificate vs. Free Thrive Africa Certificate
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white/20 backdrop-blur-sm border border-white/15 rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
                  Thrive Africa Certificate
                </h3>
                <span className="bg-green-500/20 text-green-200 border border-green-300/30 px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
                  FREE
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { text: "Digital certificate", check: true },
                  { text: "Includes transcript", check: true },
                  { text: "Recognizes skills gained", check: true },
                  { text: "Not accredited", check: false },
                  { text: "No hardcopy", check: false },
                  { text: "No study abroad access", check: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={item.check ? "text-green-300" : "text-red-300/80"} style={{ fontSize: '18px' }}>
                      {item.check ? "✓" : "✗"}
                    </span>
                    <span className={item.check ? "text-pink-50/90" : "text-pink-50/50"} style={{ fontSize: '14px' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm border border-pink-300/50 rounded-xl p-6 sm:p-8 relative">
              <span className="absolute -top-3 right-6 bg-pink-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>
                RECOMMENDED
              </span>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
                  KTU University Certificate
                </h3>
                <span className="bg-pink-500/30 text-pink-100 border border-pink-300/40 px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
                  ₵200 (₵170 early)
                </span>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  "Hardcopy certificate",
                  "Accredited by KTU (public university)",
                  "Boosts employment prospects",
                  "Unlocks study abroad funding",
                  "Professional recognition",
                  "Includes transcript"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-pink-300" style={{ fontSize: '18px' }}>✓</span>
                    <span className="text-pink-50/90" style={{ fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollTo('reserve')} className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors" style={{ fontSize: '15px', fontWeight: 600 }}>
                Apply for KTU Certificate →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - CERTIFICATE REQUEST FORM */}
      <section id="reserve" className="bg-slate-900 py-16 md:py-24 scroll-mt-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-white mb-3 text-[26px] sm:text-[30px] md:text-[32px] font-bold leading-tight">
              Reserve My KTU Certificate
            </h2>
            <p className="text-pink-100" style={{ fontSize: '15px' }}>
              Fill in your details below to secure your spot. Limited slots available.
            </p>
          </div>
          <CertificateForm />
        </div>
      </section>

      {/* SECTION 9 - FAQ */}
      <section id="faq" className="bg-white py-16 md:py-24 scroll-mt-8">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-pink-500 uppercase mb-2" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              QUICK ANSWERS
            </p>
            <h2 className="text-[#1a1a1a] text-[24px] sm:text-[28px] md:text-[30px] font-bold leading-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* SECTION 9b - COMMUNITY BAND */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1600&q=80&auto=format&fit=crop"
          alt="African students in a learning environment"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,26,26,0.88) 0%, rgba(157,23,77,0.78) 100%)' }}></div>
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div>
              <p className="text-pink-300 uppercase mb-3" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
                JOIN THE COMMUNITY
              </p>
              <h2 className="text-white mb-4 text-[26px] sm:text-[30px] md:text-[34px] font-bold leading-tight">
                Be part of Africa's next generation of certified professionals
              </h2>
              <p className="text-pink-50/80 text-[15px] sm:text-base max-w-xl">
                Earn recognition that travels with you — from Accra to Abuja, from Nairobi to New York. Your KTU certificate opens doors at home and abroad.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { stat: '70k+', label: 'Africans Trained' },
                { stat: '8+', label: 'In-demand Courses' },
              ].map((s, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-5 text-center">
                  <div className="text-white mb-1" style={{ fontSize: '26px', fontWeight: 700 }}>{s.stat}</div>
                  <div className="text-pink-100/80" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 - FINAL CTA */}
      <section className="bg-[#1a1a1a] py-16 md:py-20" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 text-center">
          <h2 className="text-white mb-4 text-[26px] sm:text-[30px] md:text-[36px] font-bold leading-tight">
            Secure Your Official KTU Certificate Today
          </h2>
          <p className="text-gray-400 mb-8 text-[15px] sm:text-base">
            Take advantage of the Founder's Reward — pay ₵70 by 14th August 2026 and save ₵30. Don't miss out!
          </p>
          <button onClick={() => scrollTo('reserve')} className="bg-pink-600 text-white px-8 sm:px-10 py-4 rounded-lg hover:bg-pink-700 transition-colors mb-4 w-full sm:w-auto text-[15px] sm:text-base" style={{ fontWeight: 600 }}>
            Reserve My Certificate Now →
          </button>
          <p className="text-gray-500" style={{ fontSize: '13px' }}>
            Questions? WhatsApp us: 0552133389, 0593106954, 0538415157 or 0264861897
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-gray-400 py-10 md:py-12">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-white mb-3" style={{ fontSize: '20px', fontWeight: 700 }}>KTU Certificate Program</div>
              <p style={{ fontSize: '13px' }}>Powered by Thrive Africa in partnership with KTU.</p>
            </div>
            <div>
              <h4 className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>Quick Links</h4>
              <ul className="space-y-2" style={{ fontSize: '13px' }}>
                <li><a href="#top" className="hover:text-pink-400">Home</a></li>
                <li><a href="#bundle-packages" className="hover:text-pink-400">Bundle Packages</a></li>
                <li><a href="#certificate-titles" className="hover:text-pink-400">Certificate Titles</a></li>
                <li><a href="#faq" className="hover:text-pink-400">FAQs</a></li>
                <li><a href="#reserve" className="hover:text-pink-400">Apply Now</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>Contact (WhatsApp)</h4>
              <ul className="space-y-2" style={{ fontSize: '13px' }}>
                <li>0552133389</li>
                <li>0593106954</li>
                <li>0538415157</li>
                <li>0264861897</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-600" style={{ fontSize: '12px' }}>
            © 2026 Thrive Africa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}