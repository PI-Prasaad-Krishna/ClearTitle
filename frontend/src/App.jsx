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
function DataParticles({ scrollYProgress, disableParallax }) {
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
    if (!disableParallax) {
      // Parallax mouse follow - subtle and performant
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, (mouse.x * viewport.width) / 10, 0.05)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (mouse.y * viewport.height) / 10, 0.05)
    }
    
    // Slowed down the rotation significantly to stop it from feeling trippy
    group.current.rotation.z += 0.0002 
  })

  // Tie camera Z to scroll progress!
  useFrame((state) => {
    if (scrollYProgress) {
      const scroll = scrollYProgress.get()
      // Scroll from 0 to 1 translates to camera moving through the tunnel
      // We start at z=75 and dive deep into z=-75
      camera.position.z = THREE.MathUtils.lerp(75, -75, scroll)
    } else {
      // Gentle floating for Check page without scroll
      camera.position.z = 50
      camera.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 5
    }
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
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!plate) return
    setLoading(true)
    setError(null)
    try {
      // Using an environment variable for deployment safety, defaulting to localhost
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/v1/vehicle/${plate}`)
      if (!res.ok) throw new Error('Registry sync failed. Verify plate number.')
      const data = await res.json()
      setReport(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (report) {
    const rScore = report.summary.risk_score
    const gradeColor = rScore > 70 ? 'text-red-500' : rScore > 40 ? 'text-amber-warning' : 'text-cyan-accent'
    
    return (
      <div className="relative w-full min-h-screen bg-obsidian flex flex-col pt-32 px-6 md:px-16 overflow-x-hidden selection:bg-cyan-accent selection:text-obsidian">
        {/* Navigation */}
        <div className="fixed top-8 left-6 md:left-12 flex items-center gap-3 cursor-pointer z-50 mix-blend-difference" onClick={() => navigate('/')}>
          <img src="/favicon.svg" alt="ClearTitle Logo" className="w-8 h-8" />
          <span className="text-xl md:text-2xl font-black tracking-widest uppercase text-white">Clear<span className="text-cyan-accent">Title</span></span>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl mx-auto z-10 pb-24">
          <button onClick={() => setReport(null)} className="text-slate-400 font-mono text-xs uppercase tracking-widest hover:text-cyan-accent mb-12 flex items-center gap-2">
            ← [ TERMINATE SESSION & RETURN ]
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-slate-800 pb-12">
            <div>
              <div className="text-cyan-accent font-mono text-sm tracking-[0.2em] uppercase mb-4">TARGET PLATE</div>
              <h1 className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase text-white">{report.plate}</h1>
            </div>
            <div className="text-left md:text-right">
              <div className="text-slate-500 font-mono text-sm tracking-[0.2em] uppercase mb-4">THREAT LEVEL</div>
              <h2 className={`text-6xl md:text-8xl font-black ${gradeColor} tracking-tighter`}>{rScore}<span className="text-3xl text-slate-600">/100</span></h2>
              <div className="font-mono text-sm mt-2 uppercase tracking-widest">{report.summary.grade}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* VAHAN */}
            <div className="border border-slate-800 bg-black/40 p-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex justify-between">
                VAHAN Registry
                <span className="text-xs font-mono font-normal text-cyan-accent tracking-widest mt-2">[ {report.registry.status} ]</span>
              </h3>
              <div className="space-y-4 font-mono text-sm text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>OWNER</span> <span className="text-white">{report.registry.data.owner_name}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>CLASS</span> <span className="text-white">{report.registry.data.vehicle_class}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>FUEL</span> <span className="text-white">{report.registry.data.fuel_type}</span></div>
                <div className="flex justify-between border-b border-slate-800 pb-2"><span>HYPOTHECATION</span> <span className={report.registry.data.hypothecation !== 'NONE' ? 'text-amber-warning' : 'text-cyan-accent'}>{report.registry.data.hypothecation}</span></div>
              </div>
            </div>

            {/* IIB */}
            <div className="border border-slate-800 bg-black/40 p-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex justify-between">
                IIB Insurance
                <span className={`text-xs font-mono font-normal tracking-widest mt-2 ${report.insurance.status === 'CLEAR' ? 'text-cyan-accent' : 'text-amber-warning'}`}>[ {report.insurance.status} ]</span>
              </h3>
              <div className="space-y-4 font-mono text-sm text-slate-300">
                {report.insurance.data.claims_history.length > 0 ? (
                  report.insurance.data.claims_history.map((claim, idx) => (
                    <div key={idx} className="border border-red-900/50 bg-red-950/20 p-4">
                      <div className="text-red-500 font-bold mb-2">{claim.type}</div>
                      <div className="flex justify-between"><span>DATE</span> <span>{claim.date}</span></div>
                      <div className="flex justify-between mt-1"><span>ESTIMATE</span> <span>₹{claim.amount.toLocaleString()}</span></div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic">No accident claims found in central database.</div>
                )}
              </div>
            </div>

            {/* NCRB */}
            <div className="border border-slate-800 bg-black/40 p-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex justify-between">
                NCRB Crime Records
                <span className={`text-xs font-mono font-normal tracking-widest mt-2 ${report.crime.status === 'CLEAR' ? 'text-cyan-accent' : 'text-red-500'}`}>[ {report.crime.status} ]</span>
              </h3>
              <div className="space-y-4 font-mono text-sm text-slate-300">
                {report.crime.status === 'CRITICAL' ? (
                  <div className="border border-red-900/50 bg-red-950/20 p-4">
                    <div className="text-red-500 font-bold mb-2 animate-pulse">ACTIVE STOLEN FIR MATCH</div>
                    <div className="break-words">{report.crime.data.fir_details}</div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">No matching crime records found.</div>
                )}
              </div>
            </div>

            {/* EChallan */}
            <div className="border border-slate-800 bg-black/40 p-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex justify-between">
                Traffic Violations
                <span className="text-xs font-mono font-normal tracking-widest mt-2 text-cyan-accent">[ {report.traffic.status} ]</span>
              </h3>
              <div className="flex flex-col items-center justify-center h-32">
                <div className="text-5xl font-black text-white mb-2">{report.traffic.data.pending_challans}</div>
                <div className="font-mono text-sm text-slate-400 uppercase tracking-widest">Pending Challans</div>
                {report.traffic.data.total_pending_amount > 0 && (
                  <div className="mt-4 text-amber-warning font-mono">₹{report.traffic.data.total_pending_amount} DUES</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-obsidian flex flex-col justify-center overflow-hidden selection:bg-cyan-accent selection:text-obsidian">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
          <fog attach="fog" args={['#050505', 20, 80]} />
          <DataParticles disableParallax={true} />
        </Canvas>
      </div>

      {/* Forensic UI Accents (HUD) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-40 border-[12px] md:border-[24px] border-obsidian/90 mix-blend-overlay hidden sm:block"></div>
      <div className="fixed bottom-6 right-10 z-50 pointer-events-none text-cyan-accent text-xs font-mono opacity-40 tracking-[0.2em] hidden md:block">
        SYS.REQ: VAHAN_API // LATENCY: 24ms // STATUS: SECURE
      </div>
      <div className="fixed top-1/2 left-4 -translate-y-1/2 z-50 pointer-events-none text-slate-600 text-xs font-mono tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 hidden md:block">
        CLEAR_TITLE_v1.0.0 // SEARCH_MODE
      </div>

      {/* Navigation */}
      <div 
        className="absolute top-8 left-6 md:left-12 flex items-center gap-3 cursor-pointer z-50 mix-blend-difference"
        onClick={() => navigate('/')}
      >
        <img src="/favicon.svg" alt="ClearTitle Logo" className="w-8 h-8" />
        <span className="text-xl md:text-2xl font-black tracking-widest uppercase text-white">
          Clear<span className="text-cyan-accent">Title</span>
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 mt-28 md:mt-0">
        
        {/* Left Side: Massive Typography */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full"
        >
          <div className="text-cyan-accent/60 font-mono text-[10px] md:text-sm tracking-[0.3em] uppercase mb-4">
            [ Protocol: Database Access ]
          </div>
          <h2 className="text-[14vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase text-white mb-4 md:mb-6">
            Enter<br/>Registry.
          </h2>
          <p className="text-sm md:text-xl font-light text-slate-400 max-w-md">
            Direct connection to the National VAHAN Registry. Provide the exact vehicle number plate to pull forensic history.
          </p>
        </motion.div>

        {/* Right Side: Brutalist Input */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-xl"
        >
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-none -m-1 transition-colors duration-500 group-focus-within:border-cyan-accent/50"></div>
            <div className="relative bg-black/50 backdrop-blur-sm p-4 md:p-6 border border-slate-700/50 transition-colors duration-500 group-focus-within:border-cyan-accent flex flex-col">
              <label className="text-cyan-accent font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2 opacity-80">
                Vehicle Registration Number
              </label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="MH01AB1234" 
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={loading}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-slate-800 py-3 md:py-4 text-2xl md:text-5xl uppercase tracking-[0.1em] font-mono selection:bg-cyan-accent selection:text-black disabled:opacity-50"
                />
              </div>
              
              {error && (
                <div className="mt-2 text-red-500 font-mono text-xs uppercase tracking-widest">
                  ERR: {error}
                </div>
              )}

              <button 
                onClick={handleSearch}
                disabled={loading || !plate}
                className="mt-3 md:mt-4 w-full bg-white hover:bg-cyan-accent disabled:bg-slate-800 disabled:text-slate-500 text-obsidian font-black py-3 md:py-4 transition-colors duration-300 flex items-center justify-center gap-2 md:gap-3 uppercase tracking-widest text-sm md:text-lg"
              >
                {loading ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <Activity size={20} className="md:w-6 md:h-6" /> AGGREGATING DATA...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search size={20} className="md:w-6 md:h-6" /> Verify Vehicle
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 md:mt-6 flex justify-between items-center text-[10px] md:text-xs font-mono text-slate-500">
            <span className="flex items-center gap-2"><ShieldAlert size={14} className="text-cyan-accent hidden md:block" /> SECURE TUNNEL</span>
            <span>256-BIT ENCRYPTION</span>
          </div>
        </motion.div>

      </div>
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
