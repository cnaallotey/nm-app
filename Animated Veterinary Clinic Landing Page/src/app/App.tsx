import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Star,
  ChevronDown,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Stethoscope,
  Syringe,
  Scissors,
  Microscope,
  Shield,
  Home,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

const FONT = "'Inter', sans-serif";

/* ── fade-up wrapper ── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════
   NAV
════════════════════════════════════════ */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = ["Leistungen", "Standorte", "Über uns", "FAQ", "Kontakt"];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-foreground">PawHaven</span>
        </div>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="#kontakt" className="text-sm font-semibold text-primary hover:underline">
            Termin buchen
          </a>
          <a
            href="tel:+495550123456"
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> (555) 012-3456
          </a>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="text-sm text-foreground py-1 font-medium">
              {l}
            </a>
          ))}
          <a href="#kontakt" className="bg-primary text-white text-center py-2.5 rounded-full text-sm font-semibold mt-1">
            Termin buchen
          </a>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative bg-white overflow-hidden pb-0" style={{ fontFamily: FONT }}>
      {/* light blue gradient sky */}
      <div
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, #dbeafe 0%, #eff6ff 60%, #ffffff 100%)" }}
      />

      <div className="relative max-w-3xl mx-auto px-6 pt-14 pb-0 text-center">
        {/* pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-5 tracking-wide uppercase"
        >
          <Star className="w-3 h-3 fill-primary" /> Ausgezeichnete Veterinärmedizin seit 2009
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4"
        >
          PawHaven –{" "}
          <span className="text-primary italic">Moderne Tiermedizin</span>
          <br />
          für Ihre Gesundheit
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto"
        >
          Ihre Lieblinge verdienen das Beste. Erstklassige tierärztliche Versorgung — von der Routineuntersuchung bis zur komplexen Operation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.38 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            Jetzt Termin buchen <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#leistungen"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full text-sm border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            Unsere Leistungen
          </a>
        </motion.div>

        {/* hero photo */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="rounded-t-3xl overflow-hidden shadow-2xl shadow-blue-100">
            <img
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=900&h=480&fit=crop&auto=format"
              alt="PawHaven veterinary team"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-t-3xl" />
          </div>

          {/* floating badge */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Nächster Termin</p>
              <p className="text-xs text-primary font-bold">Heute · 14:30 Uhr</p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
            </div>
            <span className="text-xs font-semibold text-foreground">4.9 · 800+ Bewertungen</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   REVIEWS
════════════════════════════════════════ */
const reviews = [
  { name: "Jessica M.", pet: "Labrador Biscuit", text: "Das Team von PawHaven hat unserem Hund das Leben gerettet. Unglaublich professionell und einfühlsam!", stars: 5 },
  { name: "Tom & Riley P.", pet: "Katze Nimbus", text: "Dr. Chen erinnert sich an jedes Detail über unsere Katze. Jeder Besuch fühlt sich persönlich und fürsorglich an.", stars: 5 },
  { name: "Diana K.", pet: "Beagle Winston", text: "Ich war sehr ängstlich wegen der Operation, aber das Team hat mich durch jeden Schritt begleitet. Perfektes Ergebnis!", stars: 5 },
  { name: "Marco S.", pet: "Perser Lila", text: "Beste Tierklinik der Stadt! Schnelle Termine, moderne Ausstattung und ein wirklich herzliches Team.", stars: 5 },
  { name: "Anna B.", pet: "Golden Mango", text: "Unsere Hündin liebt die Tierärzte hier. Immer entspannte Atmosphäre, keine Panik. Sehr empfehlenswert.", stars: 5 },
];

function Reviews() {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const max = reviews.length - visible;

  return (
    <section className="py-16 bg-white border-t border-border" style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Patientenerfahrungen</p>
            <h2 className="text-2xl font-bold text-foreground">Was unsere Kunden sagen</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx(Math.min(max, idx + 1))}
              disabled={idx >= max}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `${-idx * (100 / visible)}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-5"
          >
            {reviews.map((r, i) => (
              <div key={i} className="min-w-[calc(33.333%-14px)] bg-white border border-border rounded-2xl p-6 shadow-sm flex-shrink-0">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.stars)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />)}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{r.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.pet}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   LOCATIONS
════════════════════════════════════════ */
const locations = [
  { city: "Berlin", addr: "Kurfürstendamm 45", phone: "(030) 123-4567" },
  { city: "München", addr: "Maximilianstraße 18", phone: "(089) 234-5678" },
  { city: "Hamburg", addr: "Jungfernstieg 22", phone: "(040) 345-6789" },
  { city: "Frankfurt", addr: "Zeil 106", phone: "(069) 456-7890" },
  { city: "Köln", addr: "Schildergasse 57", phone: "(0221) 567-8901" },
  { city: "Stuttgart", addr: "Königstraße 30", phone: "(0711) 678-9012" },
];

function Locations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="standorte" className="py-20 bg-muted" ref={ref} style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Unsere Kliniken</p>
          <h2 className="text-3xl font-bold text-foreground">
            Moderne Tiermedizin – an Standorten in ganz Deutschland.
          </h2>
        </FadeUp>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* map placeholder */}
          <div className="lg:col-span-3">
            <FadeUp delay={0.1}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border aspect-[4/3] relative">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop&auto=format"
                  alt="Map of Germany with clinic locations"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-blue-900/10" />
                {/* location pins */}
                {[
                  { top: "30%", left: "55%" },
                  { top: "65%", left: "45%" },
                  { top: "20%", left: "38%" },
                  { top: "48%", left: "52%" },
                  { top: "40%", left: "40%" },
                  { top: "58%", left: "51%" },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={pos}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <div className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* location list */}
          <div className="lg:col-span-2 space-y-3">
            {locations.map((loc, i) => (
              <FadeUp key={loc.city} delay={0.1 + i * 0.06}>
                <div className="bg-white rounded-xl p-4 border border-border shadow-sm hover:border-primary/40 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{loc.city}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{loc.addr}</p>
                      <p className="text-xs text-primary mt-1 font-medium">{loc.phone}</p>
                    </div>
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  </div>
                </div>
              </FadeUp>
            ))}
            <FadeUp delay={0.5}>
              <a href="#kontakt" className="block text-center bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-2">
                Standort in meiner Nähe finden
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   HOW IT WORKS
════════════════════════════════════════ */
const steps = [
  { n: "01", title: "Termin online buchen", desc: "Wählen Sie einen passenden Termin über unser Online-Buchungssystem oder rufen Sie uns direkt an." },
  { n: "02", title: "Anmeldung & Erstgespräch", desc: "Bei Ihrer Ankunft nehmen wir uns Zeit für ein ausführliches Gespräch über Ihren Liebling und seine Bedürfnisse." },
  { n: "03", title: "Untersuchung & Diagnose", desc: "Unsere Tierärzte führen eine gründliche Untersuchung durch und erläutern Ihnen alle Befunde klar und verständlich." },
  { n: "04", title: "Behandlung & Nachsorge", desc: "Sie erhalten einen individuellen Behandlungsplan sowie Tipps für die optimale Nachsorge zu Hause." },
];

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 bg-white" ref={ref} style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <FadeUp>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">So funktioniert es</p>
            <h2 className="text-3xl font-bold text-foreground mb-8">In 4 Schritten zur optimalen Tiergesundheit</h2>
          </FadeUp>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <FadeUp delay={0.55} className="mt-8">
            <a href="#kontakt" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">
              Jetzt Termin buchen <ArrowRight className="w-4 h-4" />
            </a>
          </FadeUp>
        </div>

        <FadeUp delay={0.2}>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&h=520&fit=crop&auto=format"
              alt="Vet examining a dog"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   BLUE BANNER
════════════════════════════════════════ */
const bannerItems = [
  { icon: CheckCircle, title: "Sofortige Termine", sub: "Flexibel & kurzfristig" },
  { icon: Shield, title: "Zertifizierte Ärzte", sub: "Board-zertifiziert" },
  { icon: Heart, title: "Notfallversorgung", sub: "24 Stunden, 7 Tage" },
  { icon: Stethoscope, title: "Modernste Technik", sub: "Digital & präzise" },
];

function BlueBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-14" style={{ background: "#1d4ed8", fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {bannerItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center text-white"
          >
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-3">
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-base mb-0.5">{item.title}</p>
            <p className="text-blue-200 text-sm">{item.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   SERVICES
════════════════════════════════════════ */
const services = [
  { icon: Stethoscope, title: "Vorsorgeuntersuchungen", desc: "Jährliche Checkups und individuelle Gesundheitspläne für ein langes, glückliches Leben." },
  { icon: Syringe, title: "Impfungen", desc: "Vollständige Impfpläne für Hunde und Katzen, angepasst an Alter und Lebensstil." },
  { icon: Scissors, title: "Grooming", desc: "Professionelle Fellpflege und Styling für das gepflegte Erscheinungsbild Ihres Lieblings." },
  { icon: Microscope, title: "Diagnostik & Labor", desc: "Vor-Ort-Bluttests, digitale Röntgenaufnahmen und Ultraschall für schnelle, präzise Diagnosen." },
  { icon: Home, title: "Tierhotell & Betreuung", desc: "Sichere, komfortable Übernachtungsbetreuung, wenn Sie verreisen." },
  { icon: Shield, title: "Chirurgie", desc: "Modernster OP-Saal mit board-zertifizierten Chirurgen und fortschrittlichem Monitoring." },
];

function Services() {
  return (
    <section id="leistungen" className="py-20 bg-muted" style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">PawHaven – Unser Leistungsspektrum</p>
          <h2 className="text-3xl font-bold text-foreground max-w-xl">
            Umfassende Tiermedizin aus einer Hand
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.07}>
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-default h-full">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground mb-2">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Mehr erfahren <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   TECHNOLOGY / ENVIRONMENT
════════════════════════════════════════ */
function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const perks = [
    "Volldigitale Patientenakte",
    "Modernste bildgebende Diagnostik",
    "Fear-Free zertifizierte Behandlung",
    "Komfortable Wartebereiche & Behandlungsräume",
  ];

  return (
    <section className="py-20 bg-white" ref={ref} style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <FadeUp delay={0.1}>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=700&h=500&fit=crop&auto=format"
                alt="State of the art vet clinic interior"
                className="w-full object-cover"
              />
            </div>
            {/* small floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
              </div>
              <p className="text-xs font-bold text-foreground">12.000+ behandelte Tiere</p>
              <p className="text-xs text-muted-foreground">98% Genesungsrate</p>
            </motion.div>
          </div>
        </FadeUp>

        <div>
          <FadeUp>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Technologie & Ambiente</p>
            <h2 className="text-3xl font-bold text-foreground mb-5">
              Technologie und Ambiente auf <span className="text-primary">Höchstem Niveau.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-7">
              Unsere Klinik verbindet modernste medizinische Technologie mit einer warmen, einladenden Atmosphäre. Wir glauben, dass sich auch Ihre Lieblinge wohlfühlen sollen — vom Wartezimmer bis zum Behandlungsraum.
            </p>
          </FadeUp>

          <div className="space-y-3">
            {perks.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.09 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{p}</span>
              </motion.div>
            ))}
          </div>

          <FadeUp delay={0.5} className="mt-8">
            <a href="#kontakt" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">
              Klinik entdecken <ArrowRight className="w-4 h-4" />
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FAQ
════════════════════════════════════════ */
const faqs = [
  { q: "Wie kann ich einen Termin buchen?", a: "Sie können jederzeit online buchen oder uns telefonisch unter (555) 012-3456 erreichen. Wir bieten auch Same-Day-Termine für dringende Fälle an." },
  { q: "Wie bereite ich mein Tier auf den ersten Besuch vor?", a: "Bringen Sie alle bisherigen Impfnachweise und Gesundheitsunterlagen mit. Für Katzen empfehlen wir eine Transportbox, die sie bereits kennen." },
  { q: "Bieten Sie auch Notfallversorgung an?", a: "Ja! Unsere Notfallhotline ist rund um die Uhr erreichbar. Bei lebensbedrohlichen Situationen kommen Sie bitte direkt zu uns." },
  { q: "Werden alle Behandlungskosten vorab mitgeteilt?", a: "Absolut. Vor jeder Behandlung erhalten Sie einen transparenten Kostenvoranschlag. Keine versteckten Gebühren — das ist unser Versprechen." },
  { q: "Kann ich während der Untersuchung dabei sein?", a: "In den meisten Fällen ja. Wir ermutigen Besitzer, dabei zu sein, da die Anwesenheit vertrauter Menschen die Tiere beruhigt." },
  { q: "Welche Tierarten behandeln Sie?", a: "Wir behandeln Hunde, Katzen, Kleinsäuger (Kaninchen, Meerschweinchen), Vögel und ausgewählte Exoten. Fragen Sie uns einfach!" },
  { q: "Gibt es Parkmöglichkeiten in der Nähe?", a: "Alle unsere Standorte verfügen über kostenfreie Parkplätze direkt vor der Tür oder in unmittelbarer Nähe." },
  { q: "Wie lange dauert eine normale Routineuntersuchung?", a: "Eine Vorsorgeuntersuchung dauert in der Regel 20–30 Minuten. Wir nehmen uns die Zeit, die Ihr Tier braucht." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const half = Math.ceil(faqs.length / 2);
  const col1 = faqs.slice(0, half);
  const col2 = faqs.slice(half);

  const Item = ({ faq, i }: { faq: typeof faqs[0]; i: number }) => (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-semibold text-foreground">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="text-xs text-muted-foreground leading-relaxed pb-4">{faq.a}</p>
      </motion.div>
    </div>
  );

  return (
    <section id="faq" className="py-20 bg-white" style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">FAQ</p>
          <h2 className="text-3xl font-bold text-foreground">Häufige Fragen</h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-x-12">
          <div>{col1.map((f, i) => <Item key={i} faq={f} i={i} />)}</div>
          <div>{col2.map((f, i) => <Item key={i + half} faq={f} i={i + half} />)}</div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CONTACT
════════════════════════════════════════ */
function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="kontakt" className="py-20" style={{ background: "#1d4ed8", fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-start">
        {/* left */}
        <FadeUp>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">Kontakt</p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Wir freuen uns über Ihre Nachricht!
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Ob Terminwunsch, Frage oder Feedback — unser Team antwortet innerhalb von 2 Stunden.
          </p>

          <div className="space-y-4">
            {[
              { icon: Phone, label: "(555) 012-3456", sub: "Mo–Fr 7–20 Uhr, Sa–So 8–18 Uhr" },
              { icon: Mail, label: "hallo@pawhaven.de", sub: "Antwort innerhalb von 2 Stunden" },
              { icon: MapPin, label: "Maple Grove Allee 142", sub: "Berlin, Hamburg, München und mehr" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-blue-200 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* form */}
        <FadeUp delay={0.15}>
          <div className="bg-white rounded-2xl p-7 shadow-xl">
            {sent ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-primary fill-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Nachricht erhalten!</h3>
                <p className="text-sm text-muted-foreground">Wir melden uns innerhalb von 2 Stunden bei Ihnen.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-1">Termin anfragen</h3>
                <p className="text-xs text-muted-foreground mb-4">Füllen Sie das Formular aus — wir melden uns schnellstmöglich.</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Vorname</label>
                    <input required placeholder="Max" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-muted" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Nachname</label>
                    <input required placeholder="Mustermann" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-muted" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">E-Mail</label>
                  <input type="email" required placeholder="max@beispiel.de" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-muted" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Tier & Rasse</label>
                  <input required placeholder="Hund – Golden Retriever" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-muted" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Anliegen</label>
                  <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-muted text-foreground">
                    <option>Vorsorgeuntersuchung</option>
                    <option>Impfung</option>
                    <option>Chirurgie-Beratung</option>
                    <option>Notfall</option>
                    <option>Grooming</option>
                    <option>Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Nachricht (optional)</label>
                  <textarea rows={3} placeholder="Beschreiben Sie kurz Ihr Anliegen..." className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-muted resize-none" />
                </div>

                <button type="submit" className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Nachricht absenden
                </button>
                <p className="text-center text-xs text-muted-foreground">Ihre Daten sind bei uns sicher und werden nicht weitergegeben.</p>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12" style={{ fontFamily: FONT }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="font-bold text-base text-foreground">PawHaven</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Moderne Tiermedizin mit Herz. Für das Wohlbefinden Ihres Lieblings.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Leistungen</p>
            <ul className="space-y-2">
              {["Vorsorgeuntersuchungen", "Impfungen", "Chirurgie", "Grooming", "Diagnostik", "Notfallversorgung"].map((s) => (
                <li key={s}><a href="#leistungen" className="text-xs text-muted-foreground hover:text-primary transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Unternehmen</p>
            <ul className="space-y-2">
              {["Über uns", "Unser Team", "Karriere", "Presse", "Blog"].map((s) => (
                <li key={s}><a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Kontakt</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />(555) 012-3456</li>
              <li className="flex items-start gap-2"><Mail className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />hallo@pawhaven.de</li>
              <li className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />Mo–Fr 7–20, Sa–So 8–18 Uhr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">© 2025 PawHaven Tiermedizin GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            {["Datenschutz", "Impressum", "AGB"].map((l) => (
              <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: FONT }}>
      <Nav />
      <Hero />
      <Reviews />
      <Locations />
      <HowItWorks />
      <BlueBanner />
      <Services />
      <Technology />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
