'use client';

import { motion } from 'framer-motion';
import MeshGradientBackground from '@/components/effects/mesh-gradient-bg';
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog-data';

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <main className="relative min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-white/20">
            <MeshGradientBackground />

            {/* Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider uppercase text-white/60 mb-8 backdrop-blur-sm">
                        <BookOpen className="w-3.5 h-3.5" />
                        Our Blog
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                            Insights &
                        </span>
                        <br />
                        <span className="text-white/40">Updates.</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                        Expert advice on career growth, personal branding, and the future of work.
                    </p>
                </motion.div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-32">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative flex flex-col h-full"
                        >
                            <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative flex flex-col h-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                                    {/* Featured Image */}
                                    <div className="relative w-full h-48 overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent" />
                                        {/* Category Tag */}
                                        <div className="absolute bottom-4 left-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md border border-white/10 text-white/90">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 sm:p-8 flex flex-col flex-grow">
                                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-white/50 leading-relaxed mb-8 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        {/* Meta & Link */}
                                        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                                            <div className="flex items-center gap-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {post.date}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {post.readTime}
                                                </div>
                                            </div>
                                            <span className="text-white group-hover:translate-x-1 transition-transform">
                                                <ArrowRight className="w-5 h-5" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="pt-8 border-t border-white/10 text-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
