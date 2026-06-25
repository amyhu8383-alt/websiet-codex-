import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ p }: { p: Product }) {
  return <article className="card"><div className="product-image"><Image src={`/images/products/${p.slug}.webp`} alt={`${p.name} ${p.category}`} width={1200} height={1200} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" /></div><div className="card-body"><span className="tag">{p.category}</span><h3 style={{ marginTop: 14 }}>{p.name}</h3><p className="body" style={{ fontSize: 14 }}>{p.summary}</p><div className="specs"><span><strong>{p.capacity}</strong>Capacity</span><span><strong>{p.output}</strong>Output</span><span><strong>{p.cycles}</strong>Cycles</span></div><Link href={`/products/${p.slug}`} style={{ fontWeight: 800, color: "var(--orange)", display: "inline-flex", gap: 7 }}>View product <ArrowUpRight size={17} /></Link></div></article>;
}
