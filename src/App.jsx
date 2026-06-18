import { useState, useEffect, useCallback, useRef } from 'react'
import { sfx, toggleMute, isMuted } from './sound'
import MarioSprite from './MarioSprite'

const RESUME = {
  name: 'ABHISHEK KIRLOSKAR',
  title: 'SR. CLOUD SOLUTIONS ENGINEER',
  location: 'KARWAR, KARNATAKA, INDIA',
  email: 'abhishekkirloskar1@gmail.com',
  phone: '+91 95918 42860',
  linkedin: 'https://linkedin.com/in/abhishek-kirloskar/',
  summary:
    'Experienced engineer with a strong background in AWS SageMaker and Generative AI. Proven track record of building and deploying ML models at scale, and harnessing Generative AI to transform customer experiences and applications.',
  experience: [
    {
      role: 'Generative AI Engineer',
      company: 'Amazon Web Services (AWS)',
      period: '06/2019 – PRESENT',
      place: 'Bangalore, India',
      points: [
        'Integrate third-party & AWS foundation models into the Bedrock platform; optimize inference latency & throughput at scale.',
        'Design scalable, low-latency model-serving infra using Docker, Kubernetes, Lambda, SageMaker & ECS.',
        'Implement access controls, data-privacy safeguards & responsible-AI practices (bias mitigation, red-teaming).',
        'Collaborate with model providers (Anthropic, Cohere, AI21) to onboard & evaluate new models.',
        'Onboard enterprise customers, build PoCs, and ship observability dashboards for latency, usage & cost.',
      ],
    },
    {
      role: 'System Developer',
      company: 'Accenture',
      period: '09/2018 – 06/2019',
      place: 'Bengaluru, India',
      points: [
        'Designed & implemented a .NET front end to collect and manage demographic and medical data for clinical-trial participants.',
      ],
    },
  ],
  education: [
    { degree: 'B.E. Computer Science', school: 'BMS Institute of Technology & Management', period: '2014 – 2018' },
    { degree: 'PU College (PCMB)', school: "St Joseph's PU College", period: '2012 – 2014' },
  ],
  skills: ['Python', 'AWS SageMaker', 'AWS Bedrock', "LLM's", 'NoSQL', 'Git'],
}

// Each "world" has its own theme color, map position & background class
const WORLDS = [
  { id: 'about',      world: '1-1', name: 'ABOUT',      icon: '🍄', hex: '#22c55e', x: 12, y: 70, bg: 'bg-about' },
  { id: 'experience', world: '1-2', name: 'EXPERIENCE', icon: '⭐', hex: '#facc15', x: 32, y: 35, bg: 'bg-experience' },
  { id: 'skills',     world: '2-1', name: 'POWER-UPS',  icon: '🔥', hex: '#fb923c', x: 52, y: 65, bg: 'bg-skills' },
  { id: 'education',  world: '2-2', name: 'EDUCATION',  icon: '🎓', hex: '#c084fc', x: 72, y: 30, bg: 'bg-education' },
  { id: 'contact',    world: '3-1', name: 'CONTACT',    icon: '📡', hex: '#22d3ee', x: 90, y: 62, bg: 'bg-contact' },
]

function Pacman() {
  return <div className="pacman" aria-hidden />
}

/* --------------------- MARIO DEATH OVERLAY ----------------------------- */
// Shown when the player leaves a world: the screen dims, time "freezes",
// and Mario hops up then tumbles off the bottom — classic death animation.
function DeathOverlay() {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        <p className="font-pixel text-white text-sm md:text-xl mb-2">LEAVING WORLD…</p>
        <p className="font-pixel text-yellow-400 text-[10px] md:text-xs blink">RETURNING TO MAP</p>
      </div>
      {/* the falling hero */}
      <MarioSprite className="mario-fall absolute left-1/2 top-1/2 w-16 md:w-20 h-auto" />
    </div>
  )
}

/* ----------------------------- MUTE BUTTON ------------------------------ */
function MuteButton() {
  const [m, setM] = useState(isMuted())
  return (
    <button
      onClick={() => setM(toggleMute())}
      className="fixed top-3 right-3 z-50 font-pixel text-[10px] border-2 border-cyan-400 text-cyan-300 px-3 py-2 bg-black/70 hover:bg-cyan-400 hover:text-black transition-colors"
      title="Toggle sound"
    >
      {m ? '🔇 OFF' : '🔊 ON'}
    </button>
  )
}

/* ----------------------------- START SCREEN ----------------------------- */
function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-10">
      <div className="bob text-5xl md:text-7xl">🕹️</div>
      <h1 className="font-pixel text-yellow-400 glow text-2xl md:text-5xl leading-relaxed">
        {RESUME.name}
      </h1>
      <p className="font-pixel text-pink-400 text-xs md:text-base">{RESUME.title}</p>
      <div className="flex items-center gap-4">
        <Pacman />
        <span className="text-cyan-300 text-2xl">• • • •</span>
        <span className="text-pink-400 text-3xl bob">👾</span>
      </div>
      <button
        onClick={() => { sfx.start(); onStart() }}
        className="font-pixel text-sm md:text-xl text-white border-4 border-yellow-400 px-8 py-4 hover:bg-yellow-400 hover:text-black transition-colors blink"
      >
        ▶ PRESS START
      </button>
      <p className="text-cyan-300 text-xl">insert coin · © {new Date().getFullYear()}</p>
    </div>
  )
}

/* ------------------------------ WORLD MAP ------------------------------- */
function WorldMap({ onSelect, cursor, setCursor, cleared, avatarIndex, traveling }) {
  const avatar = WORLDS[avatarIndex]
  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="font-pixel text-yellow-400 glow text-base md:text-2xl mb-3">SELECT A WORLD</h1>
        <p className="text-cyan-300 text-lg md:text-xl">
          click a world — or use ← → and ENTER · {cleared.size}/{WORLDS.length} cleared
        </p>
      </div>

      <div className="relative flex-1 max-w-5xl w-full mx-auto border-4 border-cyan-400/40 bg-[#0d1030] rounded-lg overflow-hidden min-h-[440px]">
        {/* dotted path connecting worlds */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            points={WORLDS.map((w) => `${w.x},${w.y}`).join(' ')}
            fill="none"
            stroke="#475569"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {WORLDS.map((w, i) => {
          const active = cursor === i
          const done = cleared.has(w.id)
          return (
            <button
              key={w.id}
              disabled={traveling}
              onClick={() => onSelect(i)}
              onMouseEnter={() => { if (!traveling && cursor !== i) { setCursor(i); sfx.move() } }}
              style={{ left: `${w.x}%`, top: `${w.y}%`, color: w.hex }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-transform ${
                active ? 'scale-125 z-10' : 'hover:scale-110'
              } ${traveling ? 'cursor-default' : ''}`}
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-3xl md:text-4xl rounded-full border-4 bg-[#0b0b1a] ${active ? 'bob' : ''}`}
                style={{ borderColor: w.hex, boxShadow: active ? `0 0 24px ${w.hex}` : 'none' }}
              >
                {w.icon}
              </div>
              <span className="font-pixel text-[8px] md:text-[10px] whitespace-nowrap">{w.world}</span>
              <span className="font-pixel text-[8px] md:text-[10px] text-white whitespace-nowrap">{w.name}</span>
              {done && <span className="absolute -top-2 -right-1 text-green-400 text-lg">✓</span>}
              {active && !traveling && (
                <span className="absolute -bottom-6 text-yellow-400 text-xl animate-bounce">▲</span>
              )}
            </button>
          )
        })}

        {/* THE PLAYER AVATAR — walks node to node */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${avatar.x}%`,
            top: `${avatar.y}%`,
            transform: 'translate(-50%, -118%)',
            transition: 'left 0.42s linear, top 0.42s linear',
          }}
        >
          <MarioSprite className={`w-8 md:w-10 h-auto ${traveling ? 'animate-bounce' : 'bob'}`} />
        </div>

        <div className="absolute bottom-3 left-3"><Pacman /></div>
      </div>
    </div>
  )
}

/* --------------------------- WORLD CONTENTS ----------------------------- */
function AboutWorld() {
  return (
    <div className="border-4 border-green-400 bg-black/60 p-6 md:p-10">
      <p className="text-xl md:text-2xl leading-relaxed text-gray-100">{RESUME.summary}</p>
    </div>
  )
}

function ExperienceWorld() {
  return (
    <div className="space-y-8">
      {RESUME.experience.map((job) => (
        <div key={job.company} className="border-4 border-yellow-400 bg-black/70 p-6 md:p-8 text-left">
          <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
            <h3 className="font-pixel text-sm md:text-base text-yellow-400">{job.role}</h3>
            <span className="font-pixel text-[10px] md:text-xs text-pink-400">{job.period}</span>
          </div>
          <p className="text-cyan-300 text-xl mb-4">{job.company} · {job.place}</p>
          <ul className="space-y-3">
            {job.points.map((p, i) => (
              <li key={i} className="text-lg md:text-xl text-gray-100 flex gap-3">
                <span className="text-yellow-400">▸</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function SkillsWorld() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {RESUME.skills.map((skill) => (
        <div
          key={skill}
          onMouseEnter={() => sfx.coin()}
          className="bob border-4 border-orange-400 bg-black/70 p-5 text-center hover:bg-orange-400 hover:text-black transition-colors group cursor-pointer"
        >
          <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">⚡</div>
          <span className="font-pixel text-[10px] md:text-xs">{skill}</span>
        </div>
      ))}
    </div>
  )
}

function EducationWorld() {
  return (
    <div className="space-y-6">
      {RESUME.education.map((ed) => (
        <div key={ed.school} className="border-4 border-purple-400 bg-black/70 p-6 text-left flex flex-wrap justify-between items-baseline gap-2">
          <div>
            <h3 className="font-pixel text-xs md:text-sm text-purple-300 mb-2">{ed.degree}</h3>
            <p className="text-cyan-300 text-xl">{ed.school}</p>
          </div>
          <span className="font-pixel text-[10px] md:text-xs text-pink-400">{ed.period}</span>
        </div>
      ))}
    </div>
  )
}

function ContactWorld() {
  return (
    <div className="border-4 border-cyan-400 bg-black/70 p-6 md:p-10 grid gap-5 text-left">
      <a href={`mailto:${RESUME.email}`} onMouseEnter={() => sfx.coin()} className="text-xl md:text-2xl text-gray-100 hover:text-yellow-400 transition-colors flex gap-3">
        <span>✉️</span> {RESUME.email}
      </a>
      <a href={`tel:${RESUME.phone.replace(/\s/g, '')}`} onMouseEnter={() => sfx.coin()} className="text-xl md:text-2xl text-gray-100 hover:text-yellow-400 transition-colors flex gap-3">
        <span>📞</span> {RESUME.phone}
      </a>
      <a href={RESUME.linkedin} target="_blank" rel="noreferrer" onMouseEnter={() => sfx.coin()} className="text-xl md:text-2xl text-gray-100 hover:text-yellow-400 transition-colors flex gap-3">
        <span>💼</span> linkedin.com/in/abhishek-kirloskar
      </a>
    </div>
  )
}

const WORLD_BODY = {
  about: AboutWorld,
  experience: ExperienceWorld,
  skills: SkillsWorld,
  education: EducationWorld,
  contact: ContactWorld,
}

/* ----------------------------- WORLD VIEW ------------------------------- */
function WorldView({ index, onBack, onGoto }) {
  const w = WORLDS[index]
  const Body = WORLD_BODY[w.id]
  const prev = WORLDS[index - 1]
  const next = WORLDS[index + 1]

  return (
    <>
      <div className={`bg-world ${w.bg}`} aria-hidden />
      <div className="min-h-screen flex flex-col px-4 py-6 animate-[fadeIn_0.3s_ease]">
        <div className="flex items-center justify-between gap-3 max-w-4xl w-full mx-auto mb-8 flex-wrap">
          <button
            onClick={() => { sfx.move(); onBack() }}
            className="font-pixel text-[10px] md:text-xs text-cyan-300 border-2 border-cyan-400 px-4 py-3 bg-black/60 hover:bg-cyan-400 hover:text-black transition-colors"
          >
            ◀ WORLD MAP
          </button>
          <span className="font-pixel text-[10px] md:text-xs bg-black/60 px-3 py-2" style={{ color: w.hex }}>
            WORLD {w.world}
          </span>
        </div>

        <div className="text-center mb-10">
          <div className="text-5xl md:text-6xl bob mb-4">{w.icon}</div>
          <h1 className="font-pixel text-lg md:text-3xl glow" style={{ color: w.hex }}>{w.name}</h1>
        </div>

        <div className="max-w-4xl w-full mx-auto flex-1">
          <Body />
        </div>

        <div className="flex items-center justify-between gap-3 max-w-4xl w-full mx-auto mt-12 flex-wrap">
          {prev ? (
            <button onClick={() => onGoto(index - 1)} className="font-pixel text-[9px] md:text-[11px] text-gray-200 bg-black/50 px-3 py-2 hover:text-yellow-400 transition-colors">
              ◀ {prev.icon} {prev.name}
            </button>
          ) : <span />}
          {next ? (
            <button onClick={() => onGoto(index + 1)} className="font-pixel text-[9px] md:text-[11px] text-gray-200 bg-black/50 px-3 py-2 hover:text-yellow-400 transition-colors">
              {next.name} {next.icon} ▶
            </button>
          ) : (
            <span className="font-pixel text-[9px] md:text-[11px] text-green-400 glow bg-black/50 px-3 py-2">★ ALL WORLDS CLEARED ★</span>
          )}
        </div>
      </div>
    </>
  )
}

/* -------------------------------- APP ----------------------------------- */
function App() {
  const [view, setView] = useState('start') // 'start' | 'map' | 'world'
  const [worldIndex, setWorldIndex] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [cleared, setCleared] = useState(() => new Set())
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [traveling, setTraveling] = useState(false)
  const [dying, setDying] = useState(false)
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const enterWorld = useCallback((i) => {
    sfx.powerup()
    setWorldIndex(i)
    setView('world')
    setCleared((prev) => {
      const n = new Set(prev).add(WORLDS[i].id)
      return n
    })
    window.scrollTo(0, 0)
  }, [])

  // Walk the avatar node-by-node from its current spot to `target`, then enter.
  const walkTo = useCallback((target) => {
    if (traveling) return
    sfx.select()
    if (target === avatarIndex) { enterWorld(target); return }
    setTraveling(true)
    const dir = target > avatarIndex ? 1 : -1
    let pos = avatarIndex
    const stepMs = 440
    const stepOnce = () => {
      pos += dir
      setAvatarIndex(pos)
      setCursor(pos)
      sfx.step()
      if (pos === target) {
        timers.current.push(setTimeout(() => {
          setTraveling(false)
          enterWorld(target)
        }, stepMs))
      } else {
        timers.current.push(setTimeout(stepOnce, stepMs))
      }
    }
    timers.current.push(setTimeout(stepOnce, 120))
  }, [traveling, avatarIndex, enterWorld])

  // keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (view === 'start' && (e.key === 'Enter' || e.key === ' ')) {
        sfx.start(); setView('map')
      } else if (view === 'map' && !traveling) {
        if (e.key === 'ArrowRight') { setCursor((c) => { const n = (c + 1) % WORLDS.length; sfx.move(); return n }) }
        if (e.key === 'ArrowLeft') { setCursor((c) => { const n = (c - 1 + WORLDS.length) % WORLDS.length; sfx.move(); return n }) }
        if (e.key === 'Enter' || e.key === ' ') walkTo(cursor)
      } else if (view === 'world' && !dying) {
        if (e.key === 'Escape') backToMap()
        if (e.key === 'ArrowRight' && worldIndex < WORLDS.length - 1) enterWorld(worldIndex + 1)
        if (e.key === 'ArrowLeft' && worldIndex > 0) enterWorld(worldIndex - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, cursor, worldIndex, traveling, dying, walkTo, enterWorld])

  useEffect(() => () => clearTimers(), [])

  // Leaving a world plays the Mario death: he falls off-screen, then we
  // drop back onto the map with the avatar synced to the world just left.
  const backToMap = () => {
    if (dying) return
    setDying(true)
    sfx.die()
    timers.current.push(setTimeout(() => {
      setDying(false)
      setAvatarIndex(worldIndex)
      setCursor(worldIndex)
      setView('map')
    }, 1450))
  }

  const gotoFromWorld = (i) => enterWorld(i)

  return (
    <div className="crt min-h-screen">
      {view !== 'start' && <MuteButton />}
      {view === 'start' && <StartScreen onStart={() => setView('map')} />}
      {view === 'map' && (
        <WorldMap
          onSelect={walkTo}
          cursor={cursor}
          setCursor={setCursor}
          cleared={cleared}
          avatarIndex={avatarIndex}
          traveling={traveling}
        />
      )}
      {view === 'world' && (
        <WorldView index={worldIndex} onBack={backToMap} onGoto={gotoFromWorld} />
      )}
      {dying && <DeathOverlay />}
    </div>
  )
}

export default App
