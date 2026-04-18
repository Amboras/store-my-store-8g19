'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Flame, Leaf, Wind, Package } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=1400&q=85&fit=crop'
const LIFESTYLE_IMAGE = 'https://images.unsplash.com/photo-1608181831718-c9f6e6a6c5bc?w=1400&q=85&fit=crop'
const AMBIENT_IMAGE = 'https://images.unsplash.com/photo-1636467583973-b2083f7b4ab4?w=1400&q=85&fit=crop'

const features = [
  {
    icon: Leaf,
    title: 'Pure Soy Wax',
    description: 'Sustainably sourced, clean-burning natural soy wax for a longer, healthier burn.',
  },
  {
    icon: Wind,
    title: 'Fine Fragrance',
    description: 'Premium fragrance oils blended to fill every room with intention and depth.',
  },
  {
    icon: Flame,
    title: 'Hand-Poured',
    description: 'Each candle poured in small batches to ensure consistent quality and care.',
  },
  {
    icon: Package,
    title: 'Gift-Ready',
    description: 'Beautifully packaged and ready to gift — no extra wrapping needed.',
  },
]

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
    setSubscribed(true)
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'hsl(20 15% 10%)' }}>
        <div className="container-custom grid lg:grid-cols-2 gap-0 items-stretch min-h-[85vh]">
          {/* Text */}
          <div className="flex flex-col justify-center py-20 lg:py-24 lg:pr-16 animate-fade-in">
            <p className="text-xs uppercase tracking-[0.3em] font-medium mb-6" style={{ color: 'hsl(28 60% 62%)' }}>
              Handcrafted Luxury Candles
            </p>
            <h1
              className="font-heading font-semibold text-balance mb-6 leading-[1.08]"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'hsl(36 30% 93%)' }}
            >
              Light That<br />
              <em className="not-italic" style={{ color: 'hsl(28 55% 65%)' }}>Lingers</em>
            </h1>
            <p className="text-lg font-light max-w-md leading-relaxed mb-10" style={{ color: 'hsl(36 12% 62%)' }}>
              Premium soy candles crafted in small batches. Each fragrance a story,
              each flame a ritual — made to transform your everyday space.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'hsl(28 55% 45%)', color: 'white' }}
                prefetch={true}
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-colors border"
                style={{ borderColor: 'hsl(36 15% 30%)', color: 'hsl(36 20% 75%)' }}
                prefetch={true}
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative min-h-[50vh] lg:min-h-full">
            <Image
              src={HERO_IMAGE}
              alt="Luminae luxury candle — warm amber glow"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Gradient overlay on left edge */}
            <div
              className="absolute inset-y-0 left-0 w-32 hidden lg:block"
              style={{ background: 'linear-gradient(to right, hsl(20 15% 10%), transparent)' }}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ──────────────────────────────────────── */}
      <section className="py-14 border-b" style={{ backgroundColor: 'hsl(36 25% 96%)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(28 40% 90%)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: 'hsl(28 55% 42%)' }} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed hidden lg:block">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ───────────────────────────────────────── */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* ── BRAND STORY / EDITORIAL ───────────────────────────── */}
      <section className="py-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src={LIFESTYLE_IMAGE}
                  alt="Luminae candle — a moment of calm"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Floating accent card */}
              <div
                className="absolute -bottom-6 -right-6 hidden lg:block p-6 w-52"
                style={{ backgroundColor: 'hsl(20 15% 10%)', color: 'hsl(36 20% 78%)' }}
              >
                <p className="font-heading text-4xl font-semibold italic" style={{ color: 'hsl(28 55% 65%)' }}>8+</p>
                <p className="text-xs uppercase tracking-widest mt-1">Signature Scents</p>
                <p className="text-xs mt-2 opacity-60 leading-relaxed">Thoughtfully composed for every mood and season.</p>
              </div>
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'hsl(28 55% 45%)' }}>Our Philosophy</p>
              <h2 className="font-heading text-h2 font-semibold leading-tight">
                Poured With<br />
                <em className="not-italic" style={{ color: 'hsl(28 55% 45%)' }}>Intention</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[0.95rem]">
                At Luminae, we believe a candle is more than light. It is atmosphere, memory, and presence.
                Every jar begins with premium soy wax, carefully chosen fragrance notes, and hands that care.
              </p>
              <p className="text-muted-foreground leading-relaxed text-[0.95rem]">
                We produce in small batches so each pour is consistent, intentional, and worthy of your space.
                No compromises. No shortcuts.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] link-underline pb-0.5"
                style={{ color: 'hsl(28 55% 42%)' }}
                prefetch={true}
              >
                Read Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AMBIENT FULL-WIDTH CTA ─────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <Image
          src={AMBIENT_IMAGE}
          alt="Luminae ambiance — warm candlelight"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(15,10,5,0.68)' }} />
        <div className="relative container-custom text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-medium mb-4" style={{ color: 'hsl(28 55% 65%)' }}>
            Limited Batches
          </p>
          <h2
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-balance"
            style={{ color: 'hsl(36 25% 93%)' }}
          >
            Find Your Signature Scent
          </h2>
          <p className="mb-10 max-w-md mx-auto font-light text-lg" style={{ color: 'hsl(36 12% 68%)' }}>
            Each collection is crafted in small quantities. Once a batch is gone, it is gone.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'hsl(28 55% 45%)', color: 'white' }}
            prefetch={true}
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="py-section" style={{ backgroundColor: 'hsl(36 25% 96%)' }}>
        <div className="container-custom max-w-lg text-center">
          <Flame className="h-7 w-7 mx-auto mb-5" style={{ color: 'hsl(28 55% 45%)' }} strokeWidth={1.5} />
          <h2 className="font-heading text-h2 font-semibold">Stay in the Glow</h2>
          <p className="mt-3 text-muted-foreground font-light text-[0.95rem]">
            Early access to new scents, seasonal collections, and exclusive offers — straight to your inbox.
          </p>
          {subscribed ? (
            <p className="mt-8 text-sm font-medium" style={{ color: 'hsl(28 55% 45%)' }}>
              Thank you for subscribing. Watch for something special soon.
            </p>
          ) : (
            <form className="mt-8 flex gap-0" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 border border-r-0 border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: 'hsl(20 15% 12%)' }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
