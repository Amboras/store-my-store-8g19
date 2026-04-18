import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} — handcrafted soy candles by Luminae`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

// Static social proof bar data
const socialProofStats = [
  { value: '4.9', label: 'Average Rating' },
  { value: '1,200+', label: 'Happy Customers' },
  { value: '100%', label: 'Natural Soy Wax' },
  { value: '45–55h', label: 'Burn Time' },
]

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: any) => img.url !== product.thumbnail),
  ]

  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b" style={{ backgroundColor: 'hsl(36 25% 97%)' }}>
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Candles</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="border-b" style={{ backgroundColor: 'hsl(20 15% 10%)' }}>
        <div className="container-custom py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {socialProofStats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="font-heading text-lg font-semibold" style={{ color: 'hsl(28 55% 65%)' }}>
                  {value}
                </span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(36 12% 55%)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} view ${idx + 2}`}
                      fill
                      sizes="15vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Rating stars under images */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-4 w-4"
                    fill={s <= 5 ? 'hsl(28 65% 52%)' : 'none'}
                    style={{ color: 'hsl(28 65% 52%)' }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">4.9 — Over 1,200 orders shipped</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
            {/* Title */}
            <div>
              {product.subtitle && (
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {product.subtitle}
                </p>
              )}
              <h1 className="font-heading text-h2 font-semibold leading-tight">{product.title}</h1>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* Variant Selector + Price + Add to Cart */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* Accordion */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>
      </div>
    </>
  )
}
