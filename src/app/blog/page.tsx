import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips belajar yang bisa langsung dipakai: spaced repetition, flashcard, ringkasan efektif, dan cara memakai AI tanpa ketagihan jawaban karangan.",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:px-8 lg:pt-16">
          <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">Blog</p>
          <h1 className="text-h1 mt-3 font-extrabold tracking-[-0.02em] text-balance">
            Catatan belajar, tanpa basa-basi
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            Metode yang terbukti, ditulis pendek supaya bisa langsung kamu praktikkan hari ini juga.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <article className="border-ink bg-card lift shadow-2 rounded-md border-2 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="highlight">{featured.tag}</Badge>
              <span className="text-muted-foreground font-mono text-xs">
                {featured.dateLabel} · {featured.readingMinutes} menit
              </span>
            </div>
            <h2 className="text-h2 mt-4 font-extrabold">
              <Link href={`/blog/${featured.slug}`} className="hover:text-brand transition-colors">
                {featured.title}
              </Link>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
              {featured.excerpt}
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="text-brand mt-5 inline-flex items-center gap-1.5 text-sm font-bold"
            >
              Baca selengkapnya <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </article>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="border-ink bg-card shadow-2 flex flex-col rounded-md border-2 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="mint">{post.tag}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-bold text-balance">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <p className="text-muted-foreground border-line mt-4 border-t pt-3 font-mono text-xs">
                  {post.dateLabel} · {post.readingMinutes} menit
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
