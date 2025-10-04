'use client';
import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import type { PortfolioData } from '@/templates/types';

/**
 * Ultra 3D Portfolio Template — Dark (Blue/Green Themes)
 * ------------------------------------------------------
 * FIXED: Robust Canvas & Drei usage to avoid "reading 'source' of undefined" errors
 * - Added ErrorBoundary around Canvas
 * - Guarded refs inside useFrame
 * - Simplified <Html> (no transform/occlude) to avoid renderer-specific edge cases
 * - Added client-only runtime, Suspense fallback, and WebGL capability checks
 * - Provided DiagnosticsPanel with simple runtime tests
 * - Theme toggle BLUE/GREEN; content placeholders remain blank for you to fill
 *
 * Requirements in your app:
 * 1) TailwindCSS enabled (dark background recommended)
 * 2) Install deps: three @react-three/fiber @react-three/drei framer-motion
 *    npm i three @react-three/fiber @react-three/drei framer-motion
 */

// ====== THEME SYSTEM ======
const THEMES = {
  BLUE: {
    name: "BLUE",
    accent: "#60a5fa", // blue-400
    accentStrong: "#93c5fd",
    bg: "#0b0f14",
    surf: "#0e1620",
    line: "#17202a",
  },
  GREEN: {
    name: "GREEN",
    accent: "#34d399", // emerald-400
    accentStrong: "#6ee7b7",
    bg: "#0b0f14",
    surf: "#0e1620",
    line: "#17202a",
  },
} as const;

// ====== UTIL ======
function ShinyText({ children, accent, className = "" }: { children: React.ReactNode; accent: string; className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${accent} 0%, #ffffff 50%, ${accent} 100%)`,
        backgroundSize: "200% 100%",
        animation: "shine 3.5s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `@keyframes shine { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

// Simple WebGL check
function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

// ====== ERROR BOUNDARY ======
class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message?: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, message: undefined };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: String(err?.message || err) };
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("Canvas error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-xs leading-relaxed text-red-300">
          <div className="mb-2 font-semibold">3D renderer failed to start.</div>
          <div>{this.state.message}</div>
          <div className="mt-2 text-white/70">Falling back to static hero. You can still edit all content.</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ====== 3D PIECES ======
function Cog({ position = [0, 0, 0], color = "#60a5fa" as string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.z += d * 0.6;
  });
  return (
    <group position={position as any} ref={ref}>
      <mesh>
        <torusGeometry args={[0.6, 0.18, 16, 48]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Dode({ position = [0, 0, 0], color = "#93c5fd" as string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.9;
  });
  return (
    <mesh position={position as any} ref={ref}>
      <dodecahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

function Frame({ photoUrl = "/your-portrait.jpg", rim = "#93c5fd" as string }) {
  return (
    <group>
      {/* Frame body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.8, 0.09]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.42, 1.82, 0.02]} />
        <meshStandardMaterial color={rim} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Photo overlay (keep simple: no transform/occlude to avoid renderer edge-cases) */}
      <Html center position={[0, 0, 0.051]}>
        <img src={photoUrl} alt="Your portrait" className="h-[380px] w-[300px] rounded-[10px] object-cover" draggable={false} />
      </Html>
    </group>
  );
}

function WavePlane({ color = "#60a5fa" as string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = -Math.PI / 2;
    ref.current.position.y = -0.9 + Math.sin(t * 0.6) * 0.03;
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[8, 6, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.06} />
    </mesh>
  );
}

function MachineSet({ accent, accentStrong }: { accent: string; accentStrong: string }) {
  return (
    <Float speed={1.25} rotationIntensity={0.12} floatIntensity={0.8}>
      <Frame photoUrl="/your-portrait.jpg" rim={accentStrong} />
      <Cog position={[1.6, -0.2, 0.2]} color={accent} />
      <Cog position={[-1.6, 0.1, -0.2]} color={accentStrong} />
      <Dode position={[0.9, 1, -0.3]} color={accentStrong} />
      <Dode position={[-0.9, 0.9, 0.5]} color={accent} />
      <WavePlane color={accent} />
    </Float>
  );
}

// ====== DIAGNOSTICS ("test cases") ======
function R3FProbe() {
  const { gl, scene, camera } = useThree();
  return (
    <Html position={[0, -1.2, 0]}>
      <div className="rounded-md border border-white/10 bg-black/40 p-2 text-[10px] text-white/70">
        <div>WebGL Renderer: {gl?.constructor?.name || "unknown"}</div>
        <div>Scene children: {scene?.children?.length ?? 0}</div>
        <div>Camera: {camera?.type}</div>
      </div>
    </Html>
  );
}

function DiagnosticsPanel({ themeName, accent }: { themeName: string; accent: string }) {
  // Runtime "tests" (lightweight) — results rendered to UI
  const tests = useMemo(() => {
    const results: { name: string; pass: boolean; note?: string }[] = [];
    // Test 1: Theme integrity
    results.push({ name: "Theme object present", pass: !!themeName });
    results.push({ name: "Accent color set", pass: /^#/.test(accent), note: accent });
    // Test 2: WebGL availability
    const webgl = typeof window !== "undefined" && hasWebGL();
    results.push({ name: "WebGL supported", pass: !!webgl, note: webgl ? "OK" : "No WebGL" });
    return results;
  }, [themeName, accent]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        <div className="mb-1 font-semibold text-white/80">Diagnostics</div>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {tests.map((t, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: t.pass ? "#22c55e" : "#ef4444" }} />
              <span>{t.name} — {t.pass ? "PASS" : "FAIL"}{t.note ? ` (${t.note})` : ""}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


// ====== PAGE COMPONENT ======
export default function Ultra3DPortfolioTemplate() {
  const [theme, setTheme] = useState(THEMES.BLUE);
  const toggle = () => setTheme((t) => (t.name === "BLUE" ? THEMES.GREEN : THEMES.BLUE));

  const [userData, setUserData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const d = localStorage.getItem('userData');
        if (d) {
            try {
                setUserData(JSON.parse(d));
            } catch(e) {
                console.error("Failed to parse user data from localStorage", e);
            }
        }
    }
  }, []);

  const accent = theme.accent;
  const accentStrong = theme.accentStrong;
  const webglReady = useMemo(() => hasWebGL(), []);


  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg, color: "#e5f0ff" }}>
      <GlobalStyles />

      {/* NAVBAR */}
      <header
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,.34), rgba(0,0,0,.06))" }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-sm font-semibold tracking-wider">YOUR LOGO</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-white/80 md:flex">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#experience" className="hover:text-white">Experience</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="rounded-xl border border-white/15 px-3 py-1.5 text-xs text-white/90 hover:bg-white/5">Theme: {theme.name}</button>
            <a href="#contact" className="rounded-xl px-4 py-2 text-xs font-semibold" style={{ background: `${accent}20`, border: `1px solid ${accent}66`, color: "#e8fbf6" }}>Get In Touch</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container mx-auto grid items-center gap-10 px-6 py-10 md:grid-cols-2 md:py-20">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="block">Welcome, I am</span>
            <ShinyText accent={accent} className="block">{userData?.name || '[Your Name Here]'}</ShinyText>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.05 }} className="mt-5 max-w-xl text-white/70">
            {userData?.summary || '[One‑line headline about you goes here — e.g., Sustainable Ship & Shipping • Offshore & MWS] Replace this placeholder with a concise value proposition.'}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="mt-8 flex flex-wrap gap-3">
            <a href="/Your_CV.pdf" className="rounded-xl px-5 py-3 text-sm font-semibold" style={{ background: accent, color: "#0b0f14" }}>Download CV</a>
            <a href="#projects" className="rounded-xl border px-5 py-3 text-sm font-semibold" style={{ borderColor: `${accent}66` }}>View Work</a>
          </motion.div>
        </div>

         <div className="h-[440px] w-full rounded-2xl border p-2" style={{ borderColor: "#ffffff18" }}>
          <div className="h-full w-full overflow-hidden rounded-xl" style={{ background: theme.surf }}>
            {webglReady ? (
              <Canvas camera={{ position: [3.4, 2.4, 4.1], fov: 45 }} dpr={[1, 2]} shadows={false}>
                <color attach="background" args={[theme.surf as any]} />
                <hemisphereLight intensity={0.35} groundColor={theme.bg} />
                <spotLight position={[6, 8, 6]} angle={0.3} penumbra={0.6} intensity={1.2} castShadow />
                <pointLight position={[-6, 4, -6]} intensity={0.8} />

                 <CanvasErrorBoundary>
                  <Suspense fallback={<Html center><div className="text-xs text-white/70">Loading 3D…</div></Html>}>
                    <MachineSet accent={accent} accentStrong={accentStrong} />
                    <R3FProbe />
                    <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={4} maxDistance={8} />
                  </Suspense>
                </CanvasErrorBoundary>
              </Canvas>
            ) : (
              // Static fallback if no WebGL
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
                <div className="text-center text-white/70">
                  <div className="text-sm font-semibold">WebGL not available</div>
                  <div className="text-xs">Showing static hero instead of 3D.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-2xl font-bold">About</h2>
            <p className="text-white/70">{userData?.summary || '[Short bio. Two or three sentences about your background, strengths, and focus.]'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Years Experience", "Projects", "Publications", "Awards"].map((label, i) => (
              <div key={i} className="rounded-2xl border p-5" style={{ borderColor: "#ffffff18", background: "rgba(255,255,255,0.03)" }}>
                <div className="text-3xl font-extrabold" style={{ color: accent }}>{
                  i === 0 ? (userData?.experience?.[0] ? `${new Date().getFullYear() - parseInt(userData.experience[0].start)}` : '[##]') :
                  i === 1 ? (userData?.projects?.length || '[##]') :
                  '[##]'
                }</div>
                <div className="text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="container mx-auto px-6 py-16">
        <h2 className="mb-6 text-2xl font-bold">Experience</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(userData?.experience || [1, 2, 3, 4]).map((exp: any, n: number) => (
            <div key={n} className="rounded-2xl border p-6" style={{ borderColor: "#ffffff18", background: "rgba(255,255,255,0.03)" }}>
              <div className="mb-1 text-sm uppercase tracking-wide text-white/60">{exp.company || '[Company]'} · {exp.location || '[Location]'} · {exp.start && exp.end ? `${exp.start} - ${exp.end}` : '[Dates]'}</div>
              <div className="text-lg font-semibold">{exp.role || '[Role Title]'}</div>
              <p className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                {exp.description || '[Achievement / responsibility with measurable impact]'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="container mx-auto px-6 py-16">
        <h2 className="mb-6 text-2xl font-bold">Projects</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(userData?.projects || [1,2,3,4,5,6]).map((proj: any, n: number) => (
            <div
              key={n}
              className="group rounded-2xl border p-4 transition-transform duration-300 hover:-translate-y-1"
              style={{ borderColor: `${accent}30`, background: "rgba(255,255,255,0.03)" }}
            >
              <div className="h-36 w-full rounded-xl bg-black/30" />
              <div className="mt-3 text-base font-semibold">{proj.title || '[Project Title]'}</div>
              <p className="mt-1 text-sm text-white/70">{proj.description || '[Brief: problem → approach → outcome].'}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                {(proj.tech || ['[Tag]']).map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5" style={{ background: `${accent}20`, border: `1px solid ${accent}66` }}>{t}</span>
                ))}
                {proj.link && <a href={proj.link} className="underline underline-offset-4">Case Study</a>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="container mx-auto px-6 pb-20">
        <div className="rounded-2xl border p-8" style={{ borderColor: "#ffffff18", background: "rgba(255,255,255,0.03)" }}>
          <h2 className="mb-2 text-2xl font-bold">Contact</h2>
          <p className="mb-6 text-white/70">[One line: available for roles/collabs/consulting. Email and LinkedIn below.]</p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${userData?.personal_info?.email || 'you@example.com'}`} className="rounded-xl px-5 py-3 text-sm font-semibold" style={{ background: accent, color: "#0b0f14" }}>Email Me</a>
            <a href={userData?.personal_info?.linkedin || 'https://www.linkedin.com'} className="rounded-xl border px-5 py-3 text-sm font-semibold" style={{ borderColor: `${accent}66` }}>LinkedIn</a>
            <a href="/Your_CV.pdf" className="rounded-xl border px-5 py-3 text-sm font-semibold" style={{ borderColor: `${accent}66` }}>Download CV</a>
          </div>
        </div>
      </section>

      {/* DIAGNOSTICS PANEL (acts as lightweight test cases) */}
      <DiagnosticsPanel themeName={theme.name} accent={accent} />

       {/* FOOTER */}
      <footer className="border-t py-8 text-center text-xs text-white/60" style={{ borderColor: "#ffffff18" }}>
        © {new Date().getFullYear()} {userData?.name || 'Your Name'}. Built with React, Tailwind, R3F.
      </footer>
    </div>
  );
}