import Image from "next/image";
import logo from "../../../public/hmg/brand/hmg-logo.png";
import logoWhite from "../../../public/hmg/brand/hmg-logo-white.png";

/** HMG Group Africa's own logo (mark + wordmark). `light` = white version for navy backgrounds. */
export function Logo({ light = false, priority = false }: { light?: boolean; priority?: boolean }) {
  return (
    <Image
      src={light ? logoWhite : logo}
      alt="HMG Group Africa"
      className="logo-img"
      priority={priority}
      sizes="160px"
    />
  );
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.19-1.36A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.08.81.82-3-.2-.31a8.2 8.2 0 1 1 6.94 3.82Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.17.25-.63.8-.77.96-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.17 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.47-.29Z" />
    </svg>
  );
}
