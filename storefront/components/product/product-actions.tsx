'use client'

import { useMemo, useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, ShieldCheck, RefreshCcw, Truck, Clock } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

// Urgency countdown — counts down from a random stock number between 5-12
function useUrgencyStock(seed: string) {
  const [stock, setStock] = useState<number | null>(null)

  useEffect(() => {
    // Deterministic starting number from product ID hash
    const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const initial = 5 + (hash % 8) // 5–12 units
    setStock(initial)
  }, [seed])

  return stock
}

// Countdown timer for limited offer
function useCountdown() {
  const [seconds, setSeconds] = useState(() => {
    // Random between 8–23 minutes
    return Math.floor(8 * 60 + Math.random() * 15 * 60)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const urgencyStock = useUrgencyStock(product.id)
  const countdown = useCountdown()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 10

  // Show urgency if low stock from extension, otherwise show seeded urgency
  const showUrgency = isLowStock || (urgencyStock !== null && urgencyStock <= 12)
  const urgencyNumber = isLowStock ? inventoryQuantity : urgencyStock

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1

  // Determine if a variant is a "value" option (bundle/twin)
  const isBundleVariant = (variantTitle: string) =>
    /twin|bundle|set|pack|duo|trio|save/i.test(variantTitle)

  return (
    <div className="space-y-5">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Countdown urgency */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-sm"
        style={{ backgroundColor: 'hsl(28 55% 96%)', borderLeft: '3px solid hsl(28 55% 45%)' }}
      >
        <Clock className="h-4 w-4 flex-shrink-0" style={{ color: 'hsl(28 55% 45%)' }} />
        <span className="text-xs font-medium" style={{ color: 'hsl(20 15% 18%)' }}>
          Limited offer — expires in{' '}
          <span className="font-bold tabular-nums" style={{ color: 'hsl(28 55% 40%)' }}>
            {countdown}
          </span>
          . Free fragrance pouch with every order today.
        </span>
      </div>

      {/* Variant Selectors — Bundle prominently highlighted */}
      {hasMultipleVariants && options.map((option: ProductOptionWithValues) => {
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        return (
          <div key={optionId}>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-col gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value
                const isBundle = isBundleVariant(value)

                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt) return true
                  if (vExt.allow_backorder) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                if (isBundle) {
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionId, value)}
                      disabled={!isAvailable}
                      className={`w-full px-4 py-3.5 text-sm border-2 text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-foreground bg-foreground text-background'
                          : isAvailable
                          ? 'border-border hover:border-foreground'
                          : 'border-border text-muted-foreground/40 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-medium">{value}</span>
                      {isAvailable && (
                        <span
                          className={`text-xs px-2 py-0.5 font-semibold rounded-sm ${
                            isSelected ? 'bg-white text-foreground' : 'text-white'
                          }`}
                          style={!isSelected ? { backgroundColor: 'hsl(28 55% 42%)' } : {}}
                        >
                          Best Value
                        </span>
                      )}
                    </button>
                  )
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`w-full px-4 py-3 text-sm border text-left transition-all ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : isAvailable
                        ? 'border-border hover:border-foreground'
                        : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Low Stock / Urgency */}
      {showUrgency && urgencyNumber != null && (
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'hsl(15 80% 42%)' }}>
          Only {urgencyNumber} left in stock — order soon
        </p>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-muted transition-colors"
            disabled={isOutOfStock || (!allowBackorder && inventoryQuantity != null && quantity >= inventoryQuantity)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
              ? 'bg-green-700 text-white'
              : 'text-white hover:opacity-90'
          }`}
          style={!isOutOfStock && !justAdded ? { backgroundColor: 'hsl(20 15% 12%)' } : {}}
        >
          {isAddingItem ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added to Bag
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            'Add to Bag'
          )}
        </button>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-3 gap-3 py-5 border-t border-b">
        <div className="flex flex-col items-center text-center gap-1.5">
          <Truck className="h-5 w-5" style={{ color: 'hsl(28 55% 45%)' }} strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-wide font-semibold">Free Shipping</p>
          <p className="text-[10px] text-muted-foreground">Over ₹1,500</p>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <ShieldCheck className="h-5 w-5" style={{ color: 'hsl(28 55% 45%)' }} strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-wide font-semibold">Secure Checkout</p>
          <p className="text-[10px] text-muted-foreground">SSL Encrypted</p>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <RefreshCcw className="h-5 w-5" style={{ color: 'hsl(28 55% 45%)' }} strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-wide font-semibold">Easy Returns</p>
          <p className="text-[10px] text-muted-foreground">14-Day Policy</p>
        </div>
      </div>

      {/* Quality Promise */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Hand-poured in small batches. 100% natural soy wax. Every candle made with care.
      </p>
    </div>
  )
}
