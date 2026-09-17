function ChatIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M6.5 18.5 3.8 21l.7-4.1A8.2 8.2 0 1 1 12 20.2c-1.9 0-3.6-.6-5-1.7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function WhatsAppIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.05 2a9.83 9.83 0 0 0-8.47 14.82L2 22l5.32-1.53A9.85 9.85 0 1 0 12.05 2Zm0 17.9a8.05 8.05 0 0 1-4.1-1.12l-.3-.18-3.15.9.92-3.08-.2-.32a8.08 8.08 0 1 1 6.83 3.8Zm4.43-6.03c-.24-.12-1.4-.7-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.1.15 1.52.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" /></svg>;
}

function PhoneIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M7.6 3.5 5.5 4.7c-.9.5-1.3 1.5-1 2.4 1.4 4.6 5 8.2 9.6 9.6.9.3 1.9-.1 2.4-1l1.2-2.1-3.1-2.1-1.3 1.4a11 11 0 0 1-2-2 11 11 0 0 1-2-2l1.4-1.3-2.1-3.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

export function FloatingActions() {
  return <aside aria-label="Contact options" className="contact-dock fixed right-4 z-[100] flex flex-col items-end gap-2 sm:right-6">
    <button aria-label="Chatbot coming soon" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d6c8b5] bg-white px-3 text-xs font-bold text-[#171717] shadow-lg transition hover:border-[#8a694c] sm:px-4" title="Chat coming soon" type="button"><ChatIcon /><span className="hidden sm:inline">Chat soon</span></button>
    <a aria-label="WhatsApp" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 text-xs font-bold text-white shadow-lg transition hover:brightness-95 sm:px-4" href="https://wa.me/919876543210" rel="noreferrer" target="_blank" title="WhatsApp"><WhatsAppIcon /><span className="hidden sm:inline">WhatsApp</span></a>
    <a aria-label="Call us" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#171717] px-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#5f4531] sm:px-4" href="tel:+919876543210" title="Call us"><PhoneIcon /><span className="hidden sm:inline">Call us</span></a>
  </aside>;
}
