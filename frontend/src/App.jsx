import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, ShieldAlert, ArrowRight, Activity, Database, Lock } from 'lucide-react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import Lenis from 'lenis'
import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

// The interactive, scroll-driven 3D Background
function DataParticles({ scrollYProgress }) {
  const count = 3000
  const group = useRef()
  const { mouse, viewport, camera } = useThree()

  // Use a simple, performant particle generation (middle-ground performance)
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Create a "tunnel" of data points
      let r = 5 + Math.random() * 25
      let theta = Math.random() * Math.PI * 2
      let z = (Math.random() - 0.5) * 150 // Stretch along Z axis
      positions[i * 3] = r * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(theta)
      positions[i * 3 + 2] = z
    }
    return positions
  }, [count])

  useFrame(() => {
    // Parallax mouse follow - subtle and performant
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, (mouse.x * viewport.width) / 10, 0.05)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (mouse.y * viewport.height) / 10, 0.05)
    
    // Slowed down the rotation significantly to stop it from feeling trippy
    group.current.rotation.z += 0.0002 
  })

  // Tie camera Z to scroll progress!
  useFrame(() => {
    const scroll = scrollYProgress.get()
    // Scroll from 0 to 1 translates to camera moving through the tunnel
    // We start at z=75 and dive deep into z=-75
    camera.position.z = THREE.MathUtils.lerp(75, -75, scroll)
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#00e5ff" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()

  // Transforms for the massive hero text
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -300])
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div className="bg-obsidian text-white font-sans selection:bg-cyan-accent selection:text-obsidian overflow-x-hidden">
      
      {/* 3D Background - Fixed, responds to scroll via scrollYProgress */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 75], fov: 60 }}>
          {/* Fog creates the deep space / fading effect at distance */}
          <fog attach="fog" args={['#050505', 20, 80]} />
          <DataParticles scrollYProgress={scrollYProgress} />
        </Canvas>
      </div>

      {/* Forensic UI Accents (HUD) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-40 border-[12px] md:border-[24px] border-obsidian/90 mix-blend-overlay hidden sm:block"></div>
      <div className="fixed bottom-6 right-10 z-50 pointer-events-none text-cyan-accent text-xs font-mono opacity-40 tracking-[0.2em] hidden md:block">
        SYS.REQ: VAHAN_API // LATENCY: 24ms // STATUS: SECURE
      </div>
      <div className="fixed top-1/2 left-4 -translate-y-1/2 z-50 pointer-events-none text-slate-600 text-xs font-mono tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 hidden md:block">
        CLEAR_TITLE_v1.0.0 // INDIAN_VEHICLE_REGISTRY
      </div>

      <div className="relative z-10">
        {/* Navigation - Minimalist, editorial */}
        <nav className="fixed top-0 w-full z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="ClearTitle Logo" className="w-8 h-8" />
            <span className="text-xl md:text-2xl font-black tracking-widest uppercase">
              Clear<span className="text-cyan-accent">Title</span>
            </span>
          </div>
          <button 
            onClick={() => navigate('/check')}
            className="border-b border-white hover:text-cyan-accent hover:border-cyan-accent uppercase tracking-widest text-xs md:text-sm font-bold transition-colors pb-1"
          >
            Check a Vehicle
          </button>
        </nav>

        {/* Scrollable Container (Increased height for more content) */}
        <div className="h-[500vh]">
          
          {/* Section 1: The Massive Hook */}
          <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-16 pointer-events-none">
            <motion.div 
              style={{ y: yHero, opacity: opacityHero }}
              className="w-full relative"
            >
              <div className="absolute -top-8 left-2 md:-top-12 md:left-4 text-cyan-accent/60 font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
                [ Protocol: Initiate Scan ]
              </div>
              <h1 className="text-[18vw] md:text-[14vw] font-black leading-[0.8] tracking-tighter uppercase ml-[-1vw]">
                Trust<br/>No One.
              </h1>
              <p className="mt-8 text-xl md:text-3xl font-light tracking-tight max-w-2xl text-slate-300">
                The Indian used car market is a minefield. We bring forensic transparency to your next purchase.
              </p>
            </motion.div>
          </div>

          {/* Section 2: Asymmetrical Right */}
          <div className="relative h-screen flex items-center justify-end px-6 md:px-24">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-xl text-right relative"
            >
              <div className="absolute -top-10 right-0 text-amber-warning/50 font-mono text-sm tracking-[0.2em] uppercase hidden md:block">
                ERR: STRUCTURAL_INTEGRITY_COMPROMISED
              </div>
              <h2 className="text-[12vw] md:text-[8vw] font-black leading-[0.9] tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-warning">
                Total<br/>Loss.
              </h2>
              <p className="text-2xl md:text-3xl font-light text-slate-400 mb-6">
                Sellers cosmetically cover up structural damage. We dig into insurance registries to uncover the actual crash history.
              </p>
              <div className="inline-flex items-center gap-2 border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm font-mono text-slate-400">
                <Database size={16} className="text-amber-warning" /> CROSS-REFERENCING IIB DATABASE
              </div>
            </motion.div>
          </div>

          {/* Section 3: Asymmetrical Left */}
          <div className="relative h-screen flex items-center justify-start px-6 md:px-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-xl relative"
            >
              <div className="absolute -top-10 left-0 text-cyan-accent/50 font-mono text-sm tracking-[0.2em] uppercase hidden md:block">
                ERR: ACTIVE_HYPOTHECATION_FOUND
              </div>
              <h2 className="text-[12vw] md:text-[8vw] font-black leading-[0.9] tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent to-blue-500">
                Ghost<br/>Loans.
              </h2>
              <p className="text-2xl md:text-3xl font-light text-slate-400 mb-6">
                Buying a car with an active bank hypothecation means you don't legally own it. We trace the financial paper trail.
              </p>
              <div className="inline-flex items-center gap-2 border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm font-mono text-slate-400">
                <Lock size={16} className="text-cyan-accent" /> VERIFYING FINANCIAL LIENS
              </div>
            </motion.div>
          </div>

          {/* Section 4: Data Aggregation Protocol */}
          <div className="relative h-screen flex items-center justify-center px-6 md:px-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-5xl w-full"
            >
              <div className="text-center mb-12">
                <div className="text-cyan-accent font-mono tracking-[0.3em] mb-4 text-sm uppercase">
                  [ Aggregation Protocol ]
                </div>
                <h2 className="text-[10vw] md:text-[6vw] font-black leading-[1] tracking-tighter uppercase">
                  50+ Databases.<br/>One Report.
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-b border-slate-800/80 py-12 bg-obsidian/30 backdrop-blur-sm">
                <div className="text-center md:text-left md:px-6 md:border-r border-slate-800/80 last:border-0">
                  <h4 className="text-4xl font-black text-white mb-2">RTO</h4>
                  <p className="text-slate-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">Registration & Tax</p>
                </div>
                <div className="text-center md:text-left md:px-6 md:border-r border-slate-800/80 last:border-0">
                  <h4 className="text-4xl font-black text-white mb-2">NIC</h4>
                  <p className="text-slate-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">eChallan Records</p>
                </div>
                <div className="text-center md:text-left md:px-6 md:border-r border-slate-800/80 last:border-0">
                  <h4 className="text-4xl font-black text-white mb-2">IIB</h4>
                  <p className="text-slate-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">Insurance Claims</p>
                </div>
                <div className="text-center md:text-left md:px-6">
                  <h4 className="text-4xl font-black text-white mb-2">NCRB</h4>
                  <p className="text-slate-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">Stolen Vehicles</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 5: The Brutalist Call to Action */}
          <div className="relative h-screen flex flex-col items-center justify-center px-6 text-center bg-obsidian/60 backdrop-blur-md border-t border-white/5">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.9] mb-16"
            >
              Verify<br/>Everything.
            </motion.h2>
            
            <motion.button 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => navigate('/check')}
              className="group relative px-10 py-5 md:px-16 md:py-8 bg-white text-black text-xl md:text-3xl font-black uppercase tracking-widest overflow-hidden cursor-pointer shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,229,255,0.4)] transition-shadow duration-500"
            >
              <span className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-500">
                Start Search <ArrowRight size={36} />
              </span>
              {/* Slide up fill effect */}
              <div className="absolute inset-0 bg-cyan-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  )
}

function CheckPage() {
  const [plate, setPlate] = useState('')
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-screen bg-obsidian flex flex-col items-center justify-center overflow-hidden selection:bg-cyan-accent selection:text-obsidian">
      {/* Subtle, static background for performance on check page */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Navigation */}
      <div 
        className="absolute top-8 left-6 md:left-12 flex items-center gap-3 cursor-pointer z-20 mix-blend-difference"
        onClick={() => navigate('/')}
      >
        <img src="/favicon.svg" alt="ClearTitle Logo" className="w-8 h-8" />
        <span className="text-xl md:text-2xl font-black tracking-widest uppercase">
          Clear<span className="text-cyan-accent">Title</span>
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl px-6 text-center z-10"
      >
        <Activity className="text-white mx-auto mb-8 opacity-50" size={48} />
        <h2 className="text-[6vw] md:text-5xl font-black text-white mb-10 tracking-tighter uppercase">Registration Number</h2>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-none -m-1 transition-colors duration-500 group-focus-within:border-cyan-accent/50"></div>
          <div className="relative flex items-center bg-black/50 backdrop-blur-sm p-2 border border-slate-700/50 transition-colors duration-500 group-focus-within:border-cyan-accent">
            <input 
              type="text" 
              placeholder="MH01AB1234" 
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              className="w-full bg-transparent border-none outline-none text-white placeholder-slate-800 px-6 py-6 text-3xl md:text-5xl uppercase tracking-[0.2em] font-mono text-center selection:bg-cyan-accent selection:text-black"
            />
            <button className="bg-white hover:bg-cyan-accent text-obsidian font-black px-6 md:px-10 py-6 md:py-8 transition-colors duration-300 flex items-center h-full absolute right-0 top-0 bottom-0 uppercase tracking-widest text-lg">
              <Search size={28} />
            </button>
          </div>
        </div>
        <p className="text-slate-500 mt-8 text-sm md:text-base tracking-widest uppercase font-bold flex items-center justify-center gap-3">
          <ShieldAlert size={18} className="text-cyan-accent" /> Secure connection to VAHAN Registry
        </p>
      </motion.div>
    </div>
  )
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/check" element={<CheckPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
