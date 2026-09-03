import Image from "next/image";
import { Zap } from "lucide-react";

const PHOTO = {
  src: "/auth/nairobi.jpg",
  alt: "Nairobi's skyline at golden hour, seen from the KICC rooftop",
  credit: "Lebu Ayiga",
  creditUrl:
    "https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Nairobi_skyline_from_the_KICC_rooftop_at_golden_hour.jpg",
  license: "CC BY-SA 4.0",
};

/**
 * The sign-in screen's photo panel: Nairobi at golden hour, tinted in the
 * OS's fuchsia/indigo, naming the product and the city. Full-height beside
 * the card on desktop, a banner above it on mobile. Self-hosted image;
 * the photographer credit is a CC BY-SA requirement and stays.
 */
export function AuthPhotoPanel() {
  return (
    <aside className="relative h-[240px] overflow-hidden text-white lg:sticky lg:top-0 lg:h-screen">
      <Image
        src={PHOTO.src}
        alt={PHOTO.alt}
        fill
        priority
        sizes="(min-width: 1024px) 52vw, 100vw"
        className="object-cover"
        style={{ objectPosition: "50% 60%" }}
      />
      <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(135deg, rgba(76,29,149,0.55), rgba(30,27,75,0.55))" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />

      <div className="absolute left-6 top-5 flex items-center gap-2.5 lg:left-10 lg:top-8">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-[10px] ring-1 ring-white/25 lg:h-9 lg:w-9"
          style={{ background: "linear-gradient(135deg, #E879F9, #818CF8)" }}
        >
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold tracking-wide drop-shadow" style={{ fontFamily: "var(--font-display)" }}>
          TECHFIND
        </span>
      </div>

      <div className="absolute inset-x-6 bottom-5 lg:inset-x-10 lg:bottom-12 lg:max-w-xl">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ring-1 ring-white/20 lg:mb-4">
          <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.15)]" style={{ background: "#E879F9" }} />
          Revenue OS
          <span className="text-white/55">·</span>
          <span className="text-white/80">Nairobi, Kenya</span>
        </p>
        <h2
          className="text-[1.6rem] font-bold leading-[1.05] tracking-tight drop-shadow-md lg:text-[3rem] xl:text-[3.4rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your business.
          <br />
          In control.
        </h2>
        <p className="mt-3 hidden max-w-md text-[15px] leading-relaxed text-white/80 lg:block">
          Every lead, deal, quote, invoice and payment in one place — the numbers you run the
          company on, the same numbers your team sees.
        </p>
      </div>

      <a
        href={PHOTO.creditUrl}
        target="_blank"
        rel="noopener noreferrer license"
        className="absolute bottom-2 right-3 hidden text-[10px] text-white/55 transition-colors hover:text-white/90 lg:block"
      >
        Photo: {PHOTO.credit} · {PHOTO.license}
      </a>
    </aside>
  );
}
