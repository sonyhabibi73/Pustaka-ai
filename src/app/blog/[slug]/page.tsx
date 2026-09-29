import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { Badge } from "@/components/ui/badge";
import { getPost, posts } from "@/lib/blog/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Artikel tidak ditemukan" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <article className="mx-auto max-w-3xl px-5 pt-12 pb-16 sm:px-8">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Semua artikel
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="highlight">{post.tag}</Badge>
            <span className="text-muted-foreground font-mono text-xs">
              {post.dateLabel} · {post.readingMinutes} menit baca
            </span>
          </div>

          <h1 className="text-h1 mt-4 font-extrabold tracking-[-0.02em] text-balance">
            {post.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{post.excerpt}</p>

          <div className="border-ink mt-8 rounded-md border-2 border-dashed p-1" aria-hidden="true">
            <div className="bg-highlight/30 h-2 rounded-sm" />
          </div>

          <div className="mt-8 space-y-5">
            {post.blocks.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2 key={index} className="text-h3 pt-4 font-bold">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={index} className="space-y-2.5">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-base leading-relaxed">
                        <span className="bg-highlight text-ink rounded-pill border-ink mt-1 inline-flex size-5 shrink-0 items-center justify-center border text-[11px] font-bold">
                          •
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={index}
                    className="border-ink bg-card shadow-1 rounded-md border-l-[6px] p-5 text-lg leading-relaxed font-semibold"
                  >
                    “{block.text}”
                  </blockquote>
                );
              }
              return (
                <p key={index} className="leading-[1.75]">
                  {block.text}
                </p>
              );
            })}
          </div>

          <div className="border-line mt-10 border-t pt-8">
            <p className="text-muted-foreground mb-4 text-sm">
              Mau coba langsung pada materimu sendiri?
            </p>
            <Link
              href="/dashboard"
              className="border-ink bg-primary text-primary-foreground shadow-1 rounded-pill ease-snappy hover:shadow-2 inline-flex h-12 items-center border-2 px-6 text-sm font-bold transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Buka workspace
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
