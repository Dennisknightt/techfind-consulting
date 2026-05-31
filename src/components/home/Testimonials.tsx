"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James Mwangi",
    title: "CEO, SunBright Energy Kenya",
    avatar: "JM",
    company: "Solar Energy",
    rating: 5,
    quote: "TechFind did something no SEO agency had ever done — they made our company visible to AI. Within 4 months, ChatGPT started recommending us in solar queries across Kenya. Our inbound leads tripled.",
    result: "+312% inbound leads",
  },
  {
    name: "Amina Hassan",
    title: "Managing Partner, Kariuki & Associates",
    avatar: "AH",
    company: "Legal Services",
    rating: 5,
    quote: "We had 20 years of experience and zero AI presence. TechFind changed that completely. Now when corporate clients ask AI tools about law firms in East Africa, we appear. The quality of leads is incredible.",
    result: "+218% client inquiries",
  },
  {
    name: "Wanjiku Kariuki",
    title: "Founder, Zuri Fashion House",
    avatar: "WK",
    company: "E-Commerce",
    rating: 5,
    quote: "The WhatsApp AI agent TechFind built for us is absolutely game-changing. It responds instantly, understands product questions, and closes sales while I sleep. Our conversion rate went from 12% to 68%.",
    result: "68% WhatsApp conversion",
  },
  {
    name: "David Omondi",
    title: "Marketing Director, Prestige Hotels",
    avatar: "DO",
    company: "Hospitality",
    rating: 5,
    quote: "We invested in AEO for our hotel chain and saw results within 3 months. Perplexity and ChatGPT now recommend our properties when travellers search for business hotels in Nairobi.",
    result: "+89% AI referral traffic",
  },
  {
    name: "Sarah Njoroge",
    title: "CEO, BuildRight Construction",
    avatar: "SN",
    company: "Construction",
    rating: 5,
    quote: "TechFind's AEO strategy positioned us as the go-to authority for construction in Nairobi. Now when procurement teams ask AI for contractor recommendations, we appear at the top. Our project pipeline has doubled.",
    result: "2× project pipeline",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((i) => (i + 1) % testimonials.length);
  const t = testimonials[current];

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-blue animate-orb-3 absolute bottom-0 right-0 w-80 h-80 opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">Client Stories</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            What Our Clients Say
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative surface rounded-3xl p-8 md:p-12 overflow-hidden mb-6"
              style={{ borderColor: "var(--border-accent)" }}
            >
              {/* Subtle accent gradient bg */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "linear-gradient(135deg, var(--accent-glow), var(--accent-2-glow))" }}
              />
              <Quote className="absolute top-6 right-8 w-16 h-16 text-[var(--accent)] opacity-[0.06]" />

              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <blockquote
                  className="text-xl md:text-2xl font-medium text-[var(--text)] leading-relaxed mb-8"
                  style={{ fontFamily: "var(--font-space)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-[var(--accent)]"
                      style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text)] text-sm" style={{ fontFamily: "var(--font-space)" }}>{t.name}</p>
                      <p className="text-[var(--muted)] text-xs">{t.title}</p>
                      <p className="text-[var(--muted)] text-xs opacity-60">{t.company}</p>
                    </div>
                  </div>
                  <div
                    className="surface rounded-xl px-4 py-2 text-right"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-0.5">Result</p>
                    <p className="font-bold text-emerald-500 text-sm">{t.result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "2rem" : "0.375rem",
                    background: i === current ? "var(--accent)" : "var(--border)",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {[{ fn: prev, label: "Previous", Icon: ChevronLeft }, { fn: next, label: "Next", Icon: ChevronRight }].map(({ fn, label, Icon }) => (
                <button
                  key={label}
                  onClick={fn}
                  aria-label={label}
                  className="w-10 h-10 rounded-full surface flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-all"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mini strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8"
        >
          {testimonials.map((t2, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="surface rounded-xl p-3 text-left transition-all"
              style={i === current ? { borderColor: "var(--border-accent)" } : {}}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[var(--accent)] mb-2"
                style={{ background: "var(--accent-glow)" }}
              >
                {t2.avatar}
              </div>
              <p className="text-[var(--text)] text-xs font-semibold leading-snug">{t2.name}</p>
              <p className="text-[var(--muted)] text-[10px]">{t2.company}</p>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
