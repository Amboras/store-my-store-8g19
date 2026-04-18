'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold tracking-wide">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description, details }: ProductAccordionProps) {
  return (
    <div className="border-t">
      {description && (
        <AccordionItem title="Description" defaultOpen>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionItem>
      )}

      <AccordionItem title="Candle Care">
        <ul className="space-y-2">
          <li>Trim wick to 5mm before each burn to prevent soot and ensure an even flame.</li>
          <li>Allow wax to pool to the edges on the first burn (2–3 hours) to prevent tunnelling.</li>
          <li>Never burn for more than 4 hours at a time.</li>
          <li>Keep away from drafts, children, and pets.</li>
          <li>Discontinue use when 1cm of wax remains.</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Shipping & Returns">
        <ul className="space-y-2">
          <li>Free shipping on orders over ₹1,500 across India.</li>
          <li>Orders dispatched within 2–3 business days.</li>
          <li>Standard delivery: 5–7 business days.</li>
          <li>Returns accepted within 14 days for unopened, undamaged products.</li>
          <li>Fragrance is personal — please check scent notes before ordering.</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Ingredients & Sustainability">
        <ul className="space-y-2">
          <li>100% natural soy wax — clean-burning and biodegradable.</li>
          <li>Premium fragrance oils, free from phthalates and parabens.</li>
          <li>Cotton wick — lead-free for a steady, safe flame.</li>
          <li>Reusable glass vessel — wash and repurpose once candle is finished.</li>
          <li>Recyclable packaging with minimal plastic use.</li>
        </ul>
      </AccordionItem>
    </div>
  )
}
