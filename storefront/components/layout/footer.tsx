'use client'
// Luminae footer — candle brand
import Link from 'next/link'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'
import { Flame, Share2, Mail } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'All Candles', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Collections', href: '/collections' },
    { label: 'Gift Sets', href: '/collections' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Candle Care', href: '/faq' },
  ],
}

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [
    { label: 'Our Story', href: '/about' },
  ]

  if (policies?.privacy_policy) {
    companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  }
  if (policies?.terms_of_service) {
    companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  }
  if (policies?.refund_policy) {
    companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  }
  if (policies?.cookie_policy) {
    companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })
  }

  return (
    <footer className="border-t" style={{ backgroundColor: 'hsl(20 15% 10%)' }}>
      <div className="container-custom py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" strokeWidth={1.5} />
              <span className="font-heading text-2xl font-semibold italic text-amber-50">
                Luminae
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed max-w-xs" style={{ color: 'hsl(36 15% 58%)' }}>
              Handcrafted luxury candles poured with intention. Pure soy wax, fine fragrance, and a flame that lingers.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                aria-label="Instagram"
                style={{ color: 'hsl(36 15% 58%)' }}
              >
                <Share2 className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="mailto:hello@luminae.com"
                className="transition-opacity hover:opacity-70"
                aria-label="Email us"
                style={{ color: 'hsl(36 15% 58%)' }}
              >
                <Mail className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'hsl(36 30% 75%)' }}>Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-opacity hover:opacity-100 opacity-60" style={{ color: 'hsl(36 15% 78%)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'hsl(36 30% 75%)' }}>Support</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-opacity hover:opacity-100 opacity-60" style={{ color: 'hsl(36 15% 78%)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'hsl(36 30% 75%)' }}>Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-opacity hover:opacity-100 opacity-60" style={{ color: 'hsl(36 15% 78%)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid hsl(20 10% 20%)' }}>
          <p className="text-xs" style={{ color: 'hsl(36 10% 42%)' }}>
            &copy; {new Date().getFullYear()} Luminae. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs transition-opacity hover:opacity-80"
              style={{ color: 'hsl(36 10% 42%)' }}
            >
              Manage Cookies
            </button>
            <span className="text-xs" style={{ color: 'hsl(36 10% 35%)' }}>Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
