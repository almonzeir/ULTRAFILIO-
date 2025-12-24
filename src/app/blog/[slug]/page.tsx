'use client';

import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog-data';
import { useState } from 'react';

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const post = getPostBySlug(slug);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!post) {
        return (
            <main className="relative min-h-screen bg-[#030014] text-white overflow-hidden flex items-center justify-center">
                <MeshGradientBackground />
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-white/50 mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-white/20">
            <MeshGradientBackground />

            {/* Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32 max-w-4xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>
                </motion.div>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden mb-12"
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/20 to-transparent" />
                    {/* Category Badge */}
                    <div className="absolute bottom-6 left-6">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-black/50 backdrop-blur-md border border-white/10 text-white uppercase tracking-wider">
                            {post.category}
                        </span>
                    </div>
                </motion.div>

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="mb-12"
                >
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
                        <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
                            {post.title}
                        </span>
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/40 pb-8 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 hover:text-white transition-colors ml-auto px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>{copied ? 'Copied!' : 'Share'}</span>
                        </button>
                    </div>
                </motion.header>

                {/* Article Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="blog-content"
                >
                    <div
                        className="
                            [&>section]:mb-12
                            [&>section:last-child]:mb-0
                            [&>hr]:border-0
                            [&>hr]:h-px
                            [&>hr]:bg-gradient-to-r
                            [&>hr]:from-transparent
                            [&>hr]:via-white/20
                            [&>hr]:to-transparent
                            [&>hr]:my-12
                            [&_h2]:text-2xl
                            [&_h2]:sm:text-3xl
                            [&_h2]:font-bold
                            [&_h2]:text-white
                            [&_h2]:mb-6
                            [&_h2]:tracking-tight
                            [&_h3]:text-xl
                            [&_h3]:font-semibold
                            [&_h3]:text-white/90
                            [&_h3]:mt-8
                            [&_h3]:mb-4
                            [&_p]:text-white/60
                            [&_p]:leading-relaxed
                            [&_p]:mb-4
                            [&_p]:text-lg
                            [&_strong]:text-white
                            [&_strong]:font-semibold
                            [&_ul]:my-6
                            [&_ul]:space-y-3
                            [&_li]:text-white/60
                            [&_li]:text-lg
                            [&_li]:pl-6
                            [&_li]:relative
                            [&_li]:before:content-['']
                            [&_li]:before:absolute
                            [&_li]:before:left-0
                            [&_li]:before:top-[0.7em]
                            [&_li]:before:w-2
                            [&_li]:before:h-2
                            [&_li]:before:bg-white/30
                            [&_li]:before:rounded-full
                            [&_code]:text-white/80
                            [&_code]:bg-white/10
                            [&_code]:px-2
                            [&_code]:py-1
                            [&_code]:rounded
                            [&_code]:text-sm
                            [&_code]:font-mono
                            [&_.stats-grid]:grid
                            [&_.stats-grid]:grid-cols-1
                            [&_.stats-grid]:sm:grid-cols-3
                            [&_.stats-grid]:gap-4
                            [&_.stats-grid]:my-8
                            [&_.stat-item]:bg-white/5
                            [&_.stat-item]:border
                            [&_.stat-item]:border-white/10
                            [&_.stat-item]:rounded-2xl
                            [&_.stat-item]:p-6
                            [&_.stat-item]:text-center
                            [&_.stat-number]:block
                            [&_.stat-number]:text-3xl
                            [&_.stat-number]:font-bold
                            [&_.stat-number]:text-white
                            [&_.stat-number]:mb-2
                            [&_.stat-label]:block
                            [&_.stat-label]:text-sm
                            [&_.stat-label]:text-white/50
                        "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </motion.article>

                {/* Related Posts */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-20 pt-12 border-t border-white/10"
                >
                    <h2 className="text-2xl font-bold text-white mb-8">More Articles</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {getAllPosts()
                            .filter(p => p.slug !== post.slug)
                            .slice(0, 2)
                            .map((relatedPost) => (
                                <Link
                                    key={relatedPost.slug}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group relative overflow-hidden rounded-2xl"
                                >
                                    <div className="absolute inset-0">
                                        <Image
                                            src={relatedPost.image}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/80 to-[#030014]/20" />
                                    </div>
                                    <div className="relative p-6 pt-32">
                                        <span className="text-xs text-white/50 uppercase tracking-wider">
                                            {relatedPost.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-white mt-2 group-hover:text-white/90 transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </motion.section>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-16 pt-8 border-t border-white/10 text-center"
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to All Articles
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
