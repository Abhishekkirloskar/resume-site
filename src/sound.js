// Tiny chiptune sound engine using the Web Audio API.
// No audio files needed — every blip is synthesized, so it ships fine to
// static hosts like GitHub Pages. The AudioContext is created lazily on the
// first user gesture (required by browser autoplay policies).

let ctx = null
let muted = false

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Play a single tone. freq in Hz, dur in seconds.
function tone(freq, dur, type = 'square', when = 0, gain = 0.08) {
  const c = ac()
  if (!c || muted) return
  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur)
}

// A short note sequence helper. A freq of 0 is treated as a rest.
function seq(notes, type = 'square') {
  let t = 0
  for (const [freq, dur] of notes) {
    if (freq > 0) tone(freq, dur, type, t)
    t += dur
  }
}

export const sfx = {
  // Moving the cursor on the map
  move: () => tone(440, 0.06, 'square'),
  // Selecting / confirming a world
  select: () => seq([[660, 0.07], [880, 0.09]]),
  // Each step the avatar walks
  step: () => tone(330, 0.05, 'triangle', 0, 0.05),
  // Coin pickup (classic two-note)
  coin: () => seq([[988, 0.07], [1319, 0.18]]),
  // Entering a world / "jump"
  jump: () => {
    const c = ac()
    if (!c || muted) return
    const t0 = c.currentTime
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(330, t0)
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.18)
    g.gain.setValueAtTime(0.08, t0)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2)
    osc.connect(g).connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + 0.2)
  },
  // Power-up / level-clear flourish
  powerup: () => seq([[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.16]], 'square'),
  // Game start
  start: () => seq([[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.2]], 'square'),
  // Mario death jingle — little flourish, then a descending tumble down
  die: () =>
    seq(
      [
        [659, 0.12], [0, 0.04], [659, 0.12], [622, 0.14], [0, 0.06],
        [523, 0.14], [440, 0.16], [392, 0.16], [330, 0.18],
        [262, 0.20], [196, 0.34],
      ],
      'square'
    ),
}

export function toggleMute() {
  muted = !muted
  return muted
}

export function isMuted() {
  return muted
}
