import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { PRODUCTS, getProduct } from "@/lib/constants";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PRODUCTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `${product.title}: ${product.tagline}`,
    description: product.summary.slice(0, 155),
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return <ProductDetail slug={product.slug} />;
}
