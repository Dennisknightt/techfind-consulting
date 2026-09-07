/** Shared wa.me deep-link builder — used anywhere the CRM hands a message off to WhatsApp for sending. */
export function waLink(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;
}
