/**
 * Background music.
 *  • WEDDING_DATA.music.src set  → loops that file with gentle fades.
 *  • Otherwise                   → a soft generated ambience: a tanpura drone
 *    (Pa–Sa–Sa–Sa) with santoor-like notes wandering through Raag Bhupali,
 *    synthesised live with the Web Audio API — nothing to download, nothing
 *    to license.
 * play() must be called from a tap/click (browser autoplay rules).
 */

export function createMusicPlayer({ src } = {}) {
  return src ? createFilePlayer(src) : createAmbientPlayer();
}

/* ── Audio file ─────────────────────────────────────────────────────────── */
function createFilePlayer(src) {
  const audio = new Audio();
  audio.src = src;
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = 0;
  let playing = false;
  let raf = 0;

  const fade = (to, ms, done) => {
    cancelAnimationFrame(raf);
    const from = audio.volume;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms);
      audio.volume = from + (to - from) * k;
      if (k < 1) raf = requestAnimationFrame(step);
      else done?.();
    };
    raf = requestAnimationFrame(step);
  };

  return {
    get playing() {
      return playing;
    },
    async play() {
      try {
        await audio.play();
        playing = true;
        fade(0.7, 1800);
        return true;
      } catch {
        playing = false;
        return false;
      }
    },
    pause() {
      playing = false;
      fade(0, 700, () => audio.pause());
    },
    dispose() {
      cancelAnimationFrame(raf);
      audio.pause();
      audio.removeAttribute('src');
    },
  };
}

/* ── Generated ambience ─────────────────────────────────────────────────── */
const SA = 146.83; // D3 — tonic of the drone
const MID_SA = SA * 2; // D4 — tonic of the melody
// Raag Bhupali (Sa Re Ga Pa Dha), just intonation, low Pa → high Re
const MELODY = [3 / 4, 5 / 6, 1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4].map((r) => MID_SA * r);
const RESTING = [2, 4, 5, 7]; // Sa, Ga, Pa, high Sa — phrase endings
// Tanpura cycle: [frequency, seconds until next pluck]
const DRONE = [
  [SA * 0.75, 1.1], // Pa (mandra)
  [SA, 1.1], // Sa
  [SA, 1.1], // Sa
  [SA / 2, 1.75], // kharaj Sa
];

const pick = (arr) => arr[(Math.random() * arr.length) | 0];

function makeImpulse(ctx, seconds, decay) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function makeTanpuraWave(ctx) {
  const n = 28;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let k = 1; k < n; k++) imag[k] = (1 / Math.pow(k, 0.8)) * (k % 2 ? 1 : 0.82);
  return ctx.createPeriodicWave(real, imag);
}

function createMelody() {
  let idx = 2;
  let left = 0;
  return {
    next() {
      if (left <= 0) {
        left = 4 + ((Math.random() * 4) | 0);
        return { dur: 1.4 + Math.random() * 1.8 }; // breath between phrases
      }
      left -= 1;
      idx = Math.min(MELODY.length - 1, Math.max(0, idx + pick([-2, -1, -1, 0, 1, 1, 2])));
      if (left === 0) {
        idx = RESTING.reduce((a, b) => (Math.abs(b - idx) < Math.abs(a - idx) ? b : a));
        return { freq: MELODY[idx], dur: 2.2 + Math.random(), vel: 0.85 };
      }
      return {
        freq: MELODY[idx],
        dur: pick([0.5, 0.5, 0.75, 0.75, 1, 1.5]),
        vel: 0.55 + Math.random() * 0.35,
        tremolo: Math.random() < 0.2, // santoor-style double strike
      };
    },
  };
}

/** Builds the synth graph on any (Offline)AudioContext and returns a scheduler. */
export function createAmbientEngine(ctx, destination) {
  const out = ctx.createGain();
  out.gain.value = 2.6; // make-up gain; the compressor below keeps peaks in check
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -9;
  comp.knee.value = 10;
  comp.ratio.value = 4;
  comp.attack.value = 0.01;
  comp.release.value = 0.35;
  out.connect(comp).connect(destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx, 3.4, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.45;
  reverb.connect(wet).connect(out);

  const droneBus = ctx.createGain();
  droneBus.gain.value = 0.8;
  droneBus.connect(out);
  droneBus.connect(reverb);

  const melodyBus = ctx.createGain();
  melodyBus.gain.value = 0.9;
  melodyBus.connect(out);
  melodyBus.connect(reverb);

  const wave = makeTanpuraWave(ctx);
  const melody = createMelody();
  let nextDrone = 0;
  let droneStep = 0;
  let nextNote = 0;

  function tanpura(freq, t) {
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.06, t + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 5.6);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(freq * 9, 4000), t);
    lp.frequency.exponentialRampToValueAtTime(freq * 3, t + 4.5);

    // "jawari": a resonance that glides up through the harmonics
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 3.5;
    bp.frequency.setValueAtTime(freq * 3, t);
    bp.frequency.exponentialRampToValueAtTime(Math.min(freq * 12, 5000), t + 3.4);

    for (const detune of [-4, 4]) {
      const o = ctx.createOscillator();
      o.setPeriodicWave(wave);
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(lp);
      o.connect(bp);
      o.start(t);
      o.stop(t + 5.7);
    }
    lp.connect(env);
    bp.connect(env);
    env.connect(droneBus);
  }

  function santoor(freq, t, vel) {
    const peak = 0.08 * vel;
    const decay = 1.3 + 1.3 * (300 / freq);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4200;
    const partials = [
      [1, 1, 'triangle'],
      [2.004, 0.34, 'sine'],
      [3.012, 0.13, 'sine'],
      [4.21, 0.05, 'sine'],
    ];
    for (const [mult, amp, type] of partials) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq * mult;
      const g = ctx.createGain();
      const end = t + decay / Math.pow(mult, 0.7);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak * amp, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      o.connect(g).connect(lp);
      o.start(t);
      o.stop(end + 0.05);
    }
    if (ctx.createStereoPanner) {
      const pan = ctx.createStereoPanner();
      pan.pan.value = (Math.random() - 0.5) * 0.5;
      lp.connect(pan).connect(melodyBus);
    } else {
      lp.connect(melodyBus);
    }
  }

  return {
    reset(t) {
      nextDrone = t;
      droneStep = 0;
      nextNote = t + 2.4;
    },
    schedule(until) {
      while (nextDrone < until) {
        const [freq, gap] = DRONE[droneStep % DRONE.length];
        tanpura(freq, nextDrone);
        nextDrone += gap;
        droneStep += 1;
      }
      while (nextNote < until) {
        const ev = melody.next();
        if (ev.freq) {
          santoor(ev.freq, nextNote, ev.vel);
          if (ev.tremolo) santoor(ev.freq, nextNote + 0.11, ev.vel * 0.55);
        }
        nextNote += ev.dur;
      }
    },
  };
}

function rampTo(param, value, now, seconds) {
  param.cancelScheduledValues(now);
  param.setValueAtTime(Math.max(param.value, 0.0001), now);
  param.exponentialRampToValueAtTime(Math.max(value, 0.0001), now + seconds);
}

function createAmbientPlayer() {
  let ctx = null;
  let master = null;
  let engine = null;
  let timer = 0;
  let suspendTimer = 0;
  let playing = false;

  const tick = () => engine.schedule(ctx.currentTime + 0.7);

  return {
    get playing() {
      return playing;
    },
    async play() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!ctx) {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.0001;
        master.connect(ctx.destination);
        engine = createAmbientEngine(ctx, master);
      }
      clearTimeout(suspendTimer);
      try {
        await ctx.resume(); // first call happens synchronously inside the tap
      } catch {
        /* handled below */
      }
      if (ctx.state !== 'running') return false;
      if (!playing) {
        playing = true;
        const now = ctx.currentTime;
        engine.reset(now + 0.05);
        rampTo(master.gain, 0.85, now, 2.6);
        clearInterval(timer);
        timer = setInterval(tick, 150);
        tick();
      }
      return true;
    },
    pause() {
      if (!ctx || !playing) return;
      playing = false;
      clearInterval(timer);
      rampTo(master.gain, 0.0001, ctx.currentTime, 0.9);
      suspendTimer = setTimeout(() => ctx?.suspend(), 1100);
    },
    dispose() {
      clearInterval(timer);
      clearTimeout(suspendTimer);
      ctx?.close();
      ctx = null;
      playing = false;
    },
  };
}
