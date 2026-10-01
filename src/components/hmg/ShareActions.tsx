"use client";

import { useState } from "react";

export function ShareActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }
  return (
    <div className="share" role="group" aria-label="Share this article">
      <span className="share__l">Share</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" className="share__b">LinkedIn</a>
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener noreferrer" className="share__b">WhatsApp</a>
      <a href={`mailto:?subject=${t}&body=${u}`} className="share__b">Email</a>
      <button type="button" className="share__b" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied to clipboard" : ""}</span>
    </div>
  );
}
