"use client";

import { useState } from "react";

const faqs = [
  { question: "Which mattress is best for back pain?", answer: "Our orthopedic mattresses are designed for balanced spinal support. Comfort needs vary, so speak with our team before choosing firmness." },
  { question: "Do you make custom-size mattresses?", answer: "Yes. SleepExcellent can make mattresses to your required length, width, and thickness. Use Make your own mattress to share the dimensions." },
  { question: "What mattress sizes are available?", answer: "Standard Single, Queen, and King sizes are available, along with multiple dimensions and thickness options. Custom sizes can also be requested." },
  { question: "How long does delivery take?", answer: "Delivery timing depends on the product and configuration. Our operations team confirms the expected date after your order and payment are verified." },
  { question: "Do mattresses include a warranty?", answer: "Warranty coverage varies by mattress model. Check the product details or contact our team to confirm the warranty for your selected mattress." },
  { question: "How can I contact an interior expert?", answer: "Use the WhatsApp option below to speak with our team and arrange an interior consultation." },
] as const;

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
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<{ question: string; answer: string } | null>(null);

  function closeChat() {
    setChatOpen(false);
    setQuestion("");
    setReply(null);
  }

  function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitted = question.trim();
    if (!submitted) return;
    const normalized = submitted.toLocaleLowerCase().replace(/[?.!]+$/, "");
    const matched = faqs.find((faq) => faq.question.toLocaleLowerCase().replace(/[?.!]+$/, "") === normalized);
    setReply({
      question: submitted,
      answer: matched?.answer ?? "Thank you for your question. We will get back to you.",
    });
    setQuestion("");
  }

  return <>
    {chatOpen ? <section aria-label="SleepExcellent FAQ chatbot" className="fixed bottom-20 right-4 z-[110] flex max-h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[#d6c8b5] bg-white shadow-2xl sm:bottom-24 sm:right-6" role="dialog">
      <header className="flex items-start justify-between gap-4 bg-[#171717] px-5 py-4" style={{ color: "#ffffff" }}>
        <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/70">SleepExcellent</p><h2 className="mt-1 text-lg font-semibold">How can we help?</h2></div>
        <button aria-label="Close chatbot" className="grid h-8 w-8 place-items-center rounded-full border border-white/30 text-lg leading-none hover:bg-white/10" onClick={closeChat} type="button">×</button>
      </header>
      <div className="overflow-y-auto p-4">
        <div className="rounded-xl bg-[#f8f4ec] p-3 text-sm leading-6 text-[#343434]">Hello! Choose a question below and I’ll show you the ready answer.</div>
        {reply ? <div className="mt-4">
          <p className="text-sm font-semibold">{reply.question}</p>
          <p className="mt-2 rounded-xl border border-[#e7dccb] p-3 text-sm leading-6 text-neutral-600">{reply.answer}</p>
          <button className="mt-4 text-sm font-semibold text-[#765025] underline underline-offset-4" onClick={() => setReply(null)} type="button">Back to questions</button>
        </div> : <div className="mt-4 grid gap-2" aria-label="Frequently asked questions">
          {faqs.map((faq) => <button className="rounded-xl border border-[#d6c8b5] px-4 py-3 text-left text-sm font-semibold transition hover:border-[#8a694c] hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2" key={faq.question} onClick={() => setReply(faq)} type="button">{faq.question}</button>)}
        </div>}
      </div>
      <form className="flex gap-2 border-t border-[#e7dccb] bg-white p-3" onSubmit={submitQuestion}>
        <label className="sr-only" htmlFor="faq-chat-question">Type your question</label>
        <input className="min-w-0 flex-1 rounded-full border border-[#d6c8b5] px-4 py-2 text-sm outline-none focus:border-[#171717]" id="faq-chat-question" onChange={(event) => setQuestion(event.target.value)} placeholder="Type your question..." type="text" value={question} />
        <button className="rounded-full bg-[#171717] px-4 py-2 text-sm font-semibold" style={{ color: "#ffffff" }} type="submit">Send</button>
      </form>
      <footer className="border-t border-[#e7dccb] bg-[#fffdfa] p-3 text-center text-xs text-neutral-600">Need more help? <a className="font-semibold text-[#176b38] underline" href="https://wa.me/919876543210" rel="noreferrer" target="_blank">Chat on WhatsApp</a></footer>
    </section> : null}
    <aside aria-label="Contact options" className="contact-dock fixed right-4 z-[100] flex flex-col items-end gap-2 sm:right-6">
      <button aria-expanded={chatOpen} aria-label={chatOpen ? "Close FAQ chatbot" : "Open FAQ chatbot"} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d6c8b5] bg-white px-3 text-xs font-bold text-[#171717] shadow-lg transition hover:border-[#8a694c] sm:px-4" onClick={() => setChatOpen((open) => !open)} title="Chat with us" type="button"><ChatIcon /><span className="hidden sm:inline">Chat with us</span></button>
      <a aria-label="WhatsApp" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 text-xs font-bold text-white shadow-lg transition hover:brightness-95 sm:px-4" href="https://wa.me/919876543210" rel="noreferrer" target="_blank" title="WhatsApp"><WhatsAppIcon /><span className="hidden sm:inline">WhatsApp</span></a>
      <a aria-label="Call us" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#171717] px-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#5f4531] sm:px-4" href="tel:+919876543210" title="Call us"><PhoneIcon /><span className="hidden sm:inline">Call us</span></a>
    </aside>
  </>;
}
