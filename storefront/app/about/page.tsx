import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, Flame, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story behind Luminae — handcrafted luxury candles made with intention.',
}

const values = [
  {
    icon: Leaf,
    title: 'Sustainably Sourced',
    description:
      'We use only 100% natural soy wax — renewable, biodegradable, and cleaner-burning than paraffin. Our fragrance oils are free from phthalates and parabens.',
  },
  {
    icon: Flame,
    title: 'Small Batch Quality',
    description:
      'Every Luminae candle is hand-poured in small batches. This means consistent quality, individual attention, and a product we stand behind completely.',
  },
  {
    icon: Heart,
    title: 'Made With Intention',
    description:
      'We believe in the ritual of a candle. Each fragrance is composed to evoke a feeling, mark a moment, or simply fill your home with something beautiful.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-36 overflow-hidden" style={{ backgroundColor: 'hsl(20 15% 10%)' }}>
        <div className="container-custom text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-medium mb-5" style={{ color: 'hsl(28 55% 62%)' }}>
            Our Story
          </p>
          <h1 className="font-heading font-semibold text-balance mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'hsl(36 25% 93%)', lineHeight: 1.1 }}>
            Light That <em className="not-italic" style={{ color: 'hsl(28 55% 65%)' }}>Lingers</em>
          </h1>
          <p className="max-w-xl mx-auto text-lg font-light leading-relaxed" style={{ color: 'hsl(36 12% 60%)' }}>
            Luminae was born from a simple belief: your home deserves more than a functional candle.
            It deserves one made with care, intention, and fragrance worth remembering.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] bg-muted rounded-sm overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1608181831718-c9f6e6a6c5bc?w=1200&q=90&fit=crop"
                alt="Luminae candle craft"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'hsl(28 55% 45%)' }}>Where It Began</p>
              <h2 className="font-heading text-h2 font-semibold leading-tight">
                A Kitchen Table.<br />A Better Idea.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Luminae started at a kitchen table with a double boiler, a bag of soy wax, and a frustration
                with mass-produced candles that promised everything and delivered nothing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We spent months testing fragrance combinations, wax blends, and wick types before pouring
                a single candle we were proud to share. That obsessive process became our standard.
                It still is.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today we ship across India, but the process is still the same — small batches,
                careful hands, and fragrance compositions that feel like they were made just for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-section" style={{ backgroundColor: 'hsl(36 25% 96%)' }}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'hsl(28 55% 45%)' }}>What We Stand For</p>
            <h2 className="font-heading text-h2 font-semibold">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="space-y-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(28 40% 88%)' }}
                >
                  <Icon className="h-6 w-6" style={{ color: 'hsl(28 55% 42%)' }} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section">
        <div className="container-custom text-center max-w-lg">
          <h2 className="font-heading text-h2 font-semibold mb-4">
            Ready to Find Your Scent?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Every candle ships in beautiful packaging, ready to enjoy or share.
            Discover the collection and find the fragrance that feels like yours.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'hsl(20 15% 12%)' }}
          >
            Shop the Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
