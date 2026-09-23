"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./homepage.module.css";

export type HomeCategory = { slug: string; name: string; href: string; description?: string | null; imageAlt: string; imageSrc: string };
export type HomeProduct = { category: string; configuration: string; href: string; imageAlt: string; imageSrc: string; name: string; price: string | null };
type Tab = "mattresses" | "sofas" | "beds";

const collectionLinks: Record<Tab, string> = { mattresses: "/shop", sofas: "/shop?category=sofas", beds: "/shop?category=padding-beds" };

function SocialIcon({ name }: { name: "instagram" | "facebook" | "youtube" }) {
  if (name === "instagram") return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><rect height="18" rx="5" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="3"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" fill="currentColor" r="1"/></svg>;
  if (name === "facebook") return <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.5l.5-4h-4V9c0-.7.3-1 1-1Z"/></svg>;
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M21 12c0 3.8-.5 5.8-1.2 6.5C19 19.3 16.6 20 12 20s-7-.7-7.8-1.5C3.5 17.8 3 15.8 3 12s.5-5.8 1.2-6.5C5 4.7 7.4 4 12 4s7 .7 7.8 1.5C20.5 6.2 21 8.2 21 12Z" stroke="currentColor" strokeWidth="1.8"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/></svg>;
}

export function Homepage({ categories, featured, heroImage }: { categories: HomeCategory[]; featured: Record<Tab, HomeProduct[]>; heroImage: { alt: string; src: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>("mattresses");

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`.${styles.home}`);
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    if (!("IntersectionObserver" in window)) { elements.forEach((element) => element.dataset.visible = "true"); return; }
    if (root) root.dataset.animate = "true";
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.visible = "true"; observer.unobserve(entry.target); } }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); if (root) delete root.dataset.animate; };
  }, []);

  const interiorCategories = categories.filter((category) => ["tv-units", "kitchen", "ceilings"].includes(category.slug));
  const customImage = categories.find((category) => category.slug === "mattresses")?.imageSrc || heroImage.src;

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}><p className={styles.eyebrow}>SleepExcellent home collection</p><h1>Better sleep.<br/>Beautiful spaces.</h1><p>Explore mattresses, sofas, beds, and interior solutions for a home that feels like you.</p><div className={styles.actions}><a className={styles.primaryButton} href="#shop-by-category">Explore Collections</a><Link className={styles.secondaryButton} href="/build-your-mattress">Make Your Own Mattress</Link></div></div>
        <div className={styles.heroImage}><Image alt={heroImage.alt} fill loading="eager" priority sizes="(max-width: 767px) 100vw, 55vw" src={heroImage.src} unoptimized={heroImage.src.startsWith("http")} /></div>
      </section>

      <section className={`${styles.section} ${styles.reveal}`} id="shop-by-category"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Explore the catalogue</p><h2>Shop by category</h2></div><p>Everything you need for restful rooms and beautifully considered interiors.</p></div><div className={styles.categoryGrid}>{categories.map((category) => <Link className={styles.categoryCard} href={category.href} key={category.slug}><div className={styles.categoryImage}><Image alt={category.imageAlt} fill loading="lazy" sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 16vw" src={category.imageSrc} unoptimized={category.imageSrc.startsWith("http")} /></div><span>{category.name}</span><small>Explore collection →</small></Link>)}</div></section>

      <section className={`${styles.section} ${styles.reveal}`}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Featured collections</p><h2>Find your next favourite</h2></div><Link href={collectionLinks[activeTab]}>View all {activeTab} →</Link></div><div aria-label="Featured product collections" className={styles.tabs} role="tablist">{(["mattresses", "sofas", "beds"] as Tab[]).map((tab) => <button aria-controls={`featured-${tab}`} aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} id={`tab-${tab}`} key={tab} onClick={() => setActiveTab(tab)} role="tab" type="button">{tab[0].toUpperCase() + tab.slice(1)}</button>)}</div><div aria-labelledby={`tab-${activeTab}`} className={styles.productGrid} id={`featured-${activeTab}`} key={activeTab} role="tabpanel">{featured[activeTab].map((product) => <Link className={styles.productCard} href={product.href} key={product.href}><div className={styles.productImage}><span>Featured</span><Image alt={product.imageAlt} fill loading="lazy" sizes="(max-width: 640px) 50vw, 25vw" src={product.imageSrc} unoptimized={product.imageSrc.startsWith("http")} /></div><div className={styles.productCopy}><h3>{product.name}</h3><p>{product.configuration}</p>{product.price ? <strong>Indicative {product.price}</strong> : <strong>Price confirmed before ordering</strong>}<span>View product →</span></div></Link>)}{featured[activeTab].length === 0 ? <p className={styles.empty}>Featured products are being prepared for this collection.</p> : null}</div></section>

      <section className={`${styles.customSection} ${styles.reveal}`}><div className={styles.customVisual}><div className={styles.animatedOutline} /><Image alt="SleepExcellent custom mattress" fill loading="lazy" sizes="(max-width: 767px) 100vw, 48vw" src={customImage} unoptimized={customImage.startsWith("http")} /></div><div className={styles.customCopy}><p className={styles.eyebrow}>Made around your sleep</p><h2>Your mattress. Your way.</h2><p>Choose a supported size, dimensions, thickness, and comfort preference in our existing mattress builder.</p><div className={styles.chips}><span>Size</span><span>Dimensions</span><span>Thickness</span><span>Comfort</span></div><Link className={styles.primaryButton} href="/build-your-mattress">Make Your Own Mattress</Link></div></section>

      <section className={`${styles.section} ${styles.reveal}`}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Designed beyond the bedroom</p><h2>Bring every space together</h2></div><p>Explore made-to-order interior categories with project scope and final quotation confirmed by our team.</p></div><div className={styles.interiorGrid}>{interiorCategories.map((category) => <Link className={styles.interiorCard} href={category.href} key={category.slug}><Image alt={category.imageAlt} fill loading="lazy" sizes="(max-width: 767px) 100vw, 33vw" src={category.imageSrc} unoptimized={category.imageSrc.startsWith("http")} /><div><p>Interior solutions</p><h3>{category.name}</h3><span>Request a quote <b>→</b></span></div></Link>)}</div></section>

      <section className={`${styles.help} ${styles.reveal}`}><div><p className={styles.eyebrow}>Personal guidance</p><h2>Need help choosing?</h2><p>Explore your options with our team.</p></div><div className={styles.actions}><a className={styles.primaryButton} href="https://wa.me/919876543210" rel="noreferrer" target="_blank">Chat on WhatsApp</a><a className={styles.secondaryButton} href="tel:+919876543210">Call us</a></div></section>

      <footer className={styles.footer}><div className={styles.footerGrid}><div><Link aria-label="SleepExcellent home" className={styles.footerLogo} href="/"><Image alt="SleepExcellent" fill sizes="230px" src="/logo.png" /></Link><p>Purposeful sleep systems and interior solutions, made for how you live.</p><address>Plot No. 356, Road Number 10A, opposite Srikar Apartments, Gopalnagar Society, Hafeezpet, Hyderabad, Telangana 500085</address><div className={styles.socials}><a aria-label="Instagram" href="https://www.instagram.com/" rel="noreferrer" target="_blank"><SocialIcon name="instagram" /></a><a aria-label="Facebook" href="https://www.facebook.com/" rel="noreferrer" target="_blank"><SocialIcon name="facebook" /></a><a aria-label="YouTube" href="https://www.youtube.com/" rel="noreferrer" target="_blank"><SocialIcon name="youtube" /></a></div></div><div><h3>Collections</h3><Link href="/shop">Mattresses</Link><Link href="/shop?category=sofas">Sofas</Link><Link href="/shop?category=padding-beds">Beds</Link><Link href="/interiors">Interiors</Link></div><div><h3>Support</h3><Link href="/build-your-mattress">Make your own mattress</Link><Link href="/account">Track an order</Link><Link href="/favorites">Favorites</Link><Link href="/about">About us</Link></div><div><h3>Contact</h3><a href="tel:+919876543210">+91 98765 43210</a><a href="mailto:concierge@sleepexcellent.com">concierge@sleepexcellent.com</a></div></div><div className={styles.copyright}>© {new Date().getFullYear()} SleepExcellent. All rights reserved.</div></footer>
    </main>
  );
}
