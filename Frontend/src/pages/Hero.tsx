import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

type NavItem = {
  label: string;
  href: `#${string}`;
};

type Stat = {
  value: string;
  label: string;
};

type Step = {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type Feature = {
  title: string;
  description: string;
  eyebrow: string;
  icon: ReactNode;
  accent: string;
};

type RevealProps = {
  className?: string;
  id?: string;
  children: ReactNode;
};

const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const stats: Stat[] = [
  { value: "2,000+", label: "Schemes Indexed" },
  { value: "28", label: "States Covered" },
  { value: "<10 sec", label: "Average Match Time" },
];

const steps: Step[] = [
  {
    number: "01",
    title: "Share your profile",
    description:
      "Tell us a few essentials like location, income bracket, occupation, and goals through a short guided flow.",
    icon: <IconUser className="h-6 w-6" />,
  },
  {
    number: "02",
    title: "Match with confidence",
    description:
      "Our AI engine filters eligible central and state schemes so you can focus on options that truly fit.",
    icon: <IconSparkle className="h-6 w-6" />,
  },
  {
    number: "03",
    title: "Take the next step",
    description:
      "See benefits, documents, deadlines, and application pathways in one clean experience built to reduce friction.",
    icon: <IconGift className="h-6 w-6" />,
  },
];

const features: Feature[] = [
  {
    title: "Personalized discovery",
    description:
      "Every recommendation adapts to the citizen profile instead of dumping a generic database on the user.",
    eyebrow: "Precision",
    icon: <IconTarget className="h-6 w-6" />,
    accent: "from-cyan-400/30 via-sky-400/10 to-transparent",
  },
  {
    title: "Fast actionability",
    description:
      "Move from uncertainty to a clear next step quickly, with eligibility context and practical guidance.",
    eyebrow: "Speed",
    icon: <IconZap className="h-6 w-6" />,
    accent: "from-amber-300/30 via-orange-400/10 to-transparent",
  },
  {
    title: "Inclusive by design",
    description:
      "Mobile-first layouts and plain-language content make the experience easier to use in real-world conditions.",
    eyebrow: "Accessibility",
    icon: <IconGrid className="h-6 w-6" />,
    accent: "from-emerald-300/30 via-teal-400/10 to-transparent",
  },
  {
    title: "Trustworthy information",
    description:
      "Official-source alignment helps users feel confident they are seeing relevant, practical, and current pathways.",
    eyebrow: "Trust",
    icon: <IconShield className="h-6 w-6" />,
    accent: "from-fuchsia-300/25 via-pink-400/10 to-transparent",
  },
];

function IconUser({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconSparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
      <path d="M19 3l.9 2.7L22 7l-2.1.3L19 10l-.9-2.7L16 7l2.1-.3z" />
    </svg>
  );
}

function IconGift({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <rect x="3" y="9" width="18" height="11.5" rx="2" />
      <path d="M12 9v11.5M3 13h18" />
      <path d="M8 9c0-2.2 1.7-4 4-4s4 1.8 4 4" />
    </svg>
  );
}

function IconTarget({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconZap({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <path d="M12 3 5 6.5v5.7c0 4 2.7 7.7 7 8.8 4.3-1.1 7-4.8 7-8.8V6.5Z" />
      <path d="m9.3 12.4 1.8 1.8 3.9-4.2" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <rect x="3" y="3" width="7" height="7" rx="1.4" />
      <rect x="14" y="3" width="7" height="7" rx="1.4" />
      <rect x="3" y="14" width="7" height="7" rx="1.4" />
      <rect x="14" y="14" width="7" height="7" rx="1.4" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({ className = "", id, children }: RevealProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      id={id}
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function scrollToSection(target: string) {
  document.querySelector<HTMLElement>(target)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-slate-950/70 shadow-2xl shadow-slate-950/25 backdrop-blur-xl"
            : "border-white/8 bg-slate-950/35 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20">
              <IconSparkle className="h-5 w-5" />
            </span>
            <span className="text-left text-lg font-semibold tracking-tight text-white">
              YojnaMitrAI
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Get Started
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-white/10 p-2 text-white md:hidden"
            aria-label="Toggle navigation"
          >
            <IconMenu className="h-5 w-5" />
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/dashboard");
                }}
                className="mt-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-orb absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="hero-orb absolute right-[8%] top-40 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="hero-orb absolute bottom-10 left-[10%] h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.8))]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl pt-10 sm:pt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.8)]" />
              Built for real-world impact
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Find the right{" "}
              <span className="bg-linear-to-r from-cyan-200 via-sky-300 to-emerald-200 bg-clip-text text-transparent">
                government schemes
              </span>{" "}
              without the guesswork.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              YojnaMitrAI helps people discover benefits they are actually
              eligible for, with a clearer path from awareness to action.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 text-base font-semibold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-[0_18px_45px_rgba(34,211,238,0.28)]"
              >
                Get Started
                <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("#how-it-works")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-7 py-4 text-base font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/10"
              >
                Learn More
              </button>
            </div>

            <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-4xl bg-linear-to-br from-cyan-300/15 via-sky-400/10 to-emerald-300/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-900/65 p-6 shadow-[0_30px_80px_rgba(8,47,73,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Eligibility Snapshot
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    Recommendation confidence
                  </h2>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                  Live AI Match
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  { title: "Education support", value: "92%" },
                  { title: "Women entrepreneurship", value: "87%" },
                  { title: "State subsidy programs", value: "81%" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/8 bg-white/3 p-4"
                  >
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{item.title}</span>
                      <span className="font-semibold text-white">{item.value}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-linear-to-r from-cyan-300 via-sky-400 to-emerald-300"
                        style={{ width: item.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/75">
                  Outcome Focus
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  A more guided landing experience builds trust faster and helps
                  users understand the product before they commit to the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <Reveal
      id="how-it-works"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/75">
          How It Works
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          A simple flow designed to reduce confusion.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          The experience moves from profile capture to AI matching to clear next
          actions, so the landing page feels like a product with momentum.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.number}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-7 transition duration-300 hover:-translate-y-2 hover:border-cyan-300/35 hover:shadow-[0_18px_50px_rgba(8,145,178,0.22)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 transition duration-300 group-hover:scale-110 group-hover:bg-cyan-300/15">
                {step.icon}
              </div>
              <span className="text-5xl font-semibold tracking-tight text-slate-800/80 transition duration-300 group-hover:text-cyan-100/15">
                {step.number}
              </span>
            </div>
            <h3 className="mt-8 text-xl font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

function FeaturesSection() {
  return (
    <Reveal
      id="features"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/75">
            Features
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Built to feel credible, helpful, and alive.
          </h2>
        </div>
        <p className="max-w-xl text-base leading-8 text-slate-300">
          These cards now carry stronger hierarchy, iconography, hover states,
          and motion so the page reads like a polished product surface instead of
          a static mockup.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/55 p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-300/35 hover:shadow-[0_25px_60px_rgba(8,145,178,0.2)]"
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${feature.accent} opacity-60 transition duration-300 group-hover:opacity-100`}
            />
            <div className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/5 transition duration-300 group-hover:ring-cyan-200/20" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-white transition duration-300 group-hover:scale-110 group-hover:border-cyan-200/30 group-hover:text-cyan-100">
                {feature.icon}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">
                {feature.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {feature.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

function AboutSection() {
  return (
    <Reveal
      id="about"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/75">
            About
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Why this matters beyond the interface.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            People often miss benefits not because they are ineligible, but
            because discovery is fragmented and hard to interpret. YojnaMitrAI
            makes that first step feel more guided and less intimidating.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              title: "Clearer discovery",
              body: "Guide users into relevant schemes faster with cleaner narrative and stronger UI cues.",
            },
            {
              title: "Lower friction",
              body: "Purposeful buttons, anchor navigation, and route flow now create obvious next actions.",
            },
            {
              title: "More trust",
              body: "A stronger hero, product framing, and confidence signals make the concept feel credible.",
            },
            {
              title: "Better UX rhythm",
              body: "Scroll reveals and responsive sections give the page more energy without adding heavy libraries.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-slate-900/55 p-6 transition duration-300 hover:border-cyan-300/25 hover:bg-slate-900/75"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function CTASection() {
  return (
    <Reveal className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden rounded-4xl border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(8,47,73,0.95),rgba(15,23,42,0.96),rgba(6,78,59,0.88))] px-8 py-10 shadow-[0_30px_70px_rgba(15,23,42,0.35)] sm:px-12 sm:py-14">
        <div className="absolute -left-8 top-8 h-36 w-36 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/75">
              Ready to Explore
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Start building a clearer benefits journey.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-200">
              The homepage now points users toward a real next destination, so
              the experience feels intentional from first impression to first click.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-50"
          >
            Launch Dashboard
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-white">YojnaMitrAI</p>
          <p className="mt-2 max-w-md leading-7">
            AI-assisted discovery for public welfare schemes, designed to make
            complex information feel approachable.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex gap-5">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@yojnamitrai.com"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </div>
          <p>© {new Date().getFullYear()} YojnaMitrAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
