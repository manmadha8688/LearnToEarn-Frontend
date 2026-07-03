import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

const TICKER = [
  'Python', 'Java', 'C++', 'JavaScript', 'Arrays', 'Strings', 'Recursion',
  'Hash Maps', 'Two Pointers', 'Sorting', 'Binary Search', 'Linked Lists',
  'Stacks', 'Queues', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy',
  'Bit Magic', 'Sliding Window', 'Backtracking', 'Big-O',
]

const METHOD = [
  { n: '01', title: 'Read it right', text: 'Understand what is really being asked and spot the edge cases before you touch the keyboard.' },
  { n: '02', title: 'Write it badly', text: 'Get any working version on screen. Ugly and slow beats blank and perfect — every single time.' },
  { n: '03', title: 'Run & break it', text: 'Test it, watch it fail, read the error, fix it. That loop is where the real learning lives.' },
  { n: '04', title: 'Level up', text: 'Optimise it, name the pattern you just used, then carry it into the next rep.' },
]

const GATES = [
  {
    key: 'start-coding',
    rank: 'E',
    icon: '🌑',
    system: 'SYSTEM · AWAKENING',
    title: 'Start Coding',
    line: 'Never written code before? This is your gate.',
    desc: 'Learn the basics — how to write, run, and fix simple programs step by step.',
    quest: 'Write your first program and make it run.',
    chips: ['First steps', 'Syntax', 'Hello World'],
    color: '#9CA3AF',
  },
  {
    key: 'logic-building',
    rank: 'D',
    icon: '🗡️',
    system: 'SYSTEM · TRAINING',
    title: 'Logic Building',
    line: 'You can type code — but problems still confuse you.',
    desc: 'Learn to break a question into small steps and solve it on paper before you code.',
    quest: 'Solve one problem using your own thinking.',
    chips: ['Step-by-step', 'Dry runs', 'Problem solving'],
    color: '#4ADE80',
  },
  {
    key: 'skill-up',
    rank: 'C',
    icon: '⚡',
    system: 'SYSTEM · ASCENSION',
    title: 'Skill Up',
    line: 'Ready to handle harder coding questions.',
    desc: 'Practice arrays, strings, and common patterns — get a slow answer working, then make it faster.',
    quest: 'Solve it the simple way first. Then improve it.',
    chips: ['Arrays & strings', 'Patterns', 'Faster code'],
    color: '#60A5FA',
  },
  {
    key: 'crack-it',
    rank: 'B',
    icon: '🎯',
    system: 'SYSTEM · RAID',
    title: 'Crack It',
    line: 'Questions that read like a real-life story.',
    desc: 'Read a situation, spot every rule inside it, and write code that handles all the cases.',
    quest: 'Understand the full story before you type.',
    chips: ['Story problems', 'Many conditions', 'Real logic'],
    color: '#9B6ED4',
  },
  {
    key: 'build-it',
    rank: 'A',
    icon: '🔥',
    system: 'SYSTEM · FORGE',
    title: 'Build It',
    line: 'Your code works — now make it smarter.',
    desc: 'Take a working solution and improve it — fewer steps, less time, and be able to explain why.',
    quest: 'Make it run first. Then make it better.',
    chips: ['Better code', 'Less time', 'Explain why'],
    color: '#F59E0B',
  },
  {
    key: 'prove-it',
    rank: 'S',
    icon: '👑',
    system: 'SYSTEM · MONARCH',
    title: 'Prove It',
    line: 'Real problems with real rules — build the full answer.',
    desc: 'Put together a complete solution: every rule, check, and edge case handled properly. This is where coding meets the real world.',
    quest: 'List every rule first, then build the whole solution.',
    chips: ['Real systems', 'Edge cases', 'Complete logic'],
    color: '#EF4444',
  },
]

function GateCard({ gate, index, onEnter }) {
  return (
    <motion.button
      type="button"
      className={`gym-gate gym-gate--${gate.rank.toLowerCase()}`}
      style={{ '--rank': gate.color }}
      onClick={() => onEnter(gate.key)}
      aria-label={`Enter the ${gate.title} gate, Rank ${gate.rank}`}
      initial={{ opacity: 0, y: 40 + index * 10, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -6 }}
    >
      <span className="gym-gate__rank" aria-hidden="true">
        {gate.rank}
        <span className="gym-gate__rank-tag">RANK</span>
      </span>

      <span className="gym-gate__system">{gate.system}</span>
      <span className="gym-gate__icon" aria-hidden="true">{gate.icon}</span>
      <h3 className="gym-gate__title">{gate.title}</h3>
      <p className="gym-gate__line">{gate.line}</p>
      <p className="gym-gate__desc">{gate.desc}</p>

      <span className="gym-gate__quest">
        <span className="gym-gate__quest-label">◈ QUEST</span>
        <span className="gym-gate__quest-text">{gate.quest}</span>
      </span>

      <span className="gym-gate__chips">
        {gate.chips.map((chip) => (
          <span className="gym-gate__chip" key={chip}>{chip}</span>
        ))}
      </span>

      <span className="gym-gate__enter">
        Enter the Gate <ChevronRight size={14} />
      </span>
    </motion.button>
  )
}

function GymGates() {
  const navigate = useNavigate()
  const enter = (key) => navigate(`/problem-solving/${key}`)

  return (
    <section className="gym-gates" aria-labelledby="gym-gates-title">
      <div className="gym-gates__bg" aria-hidden="true">
        <div className="gym-gates__beam gym-gates__beam--1" />
        <div className="gym-gates__beam gym-gates__beam--2" />
      </div>

      <div className="gym-gates__wrap">
        <motion.header
          className="gym-gates__head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="gym-gates__eyebrow">⟡ SIX GATES · ONE PATH</p>
          <h2 id="gym-gates-title" className="gym-gates__headline">
            Where are you today?
          </h2>
          <p className="gym-gates__sub">
            Pick the gate that matches your level. Each one teaches something different —
            from your first program to real problems you can solve end to end.
          </p>
        </motion.header>

        <div className="gym-gates__grid">
          {GATES.map((gate, i) => (
            <GateCard key={gate.key} gate={gate} index={i} onEnter={enter} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GymTicker() {
  const strip = [...TICKER, ...TICKER]
  return (
    <div className="gym-ticker" aria-hidden="true">
      <div className="gym-ticker__row">
        {strip.map((word, i) => (
          <span className="gym-ticker__item" key={`${word}-${i}`}>
            <span className="gym-ticker__dot" />
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}

function GymMethod() {
  return (
    <section className="gym-method" aria-labelledby="gym-method-title">
      <div className="gym-method__wrap">
        <motion.header
          className="gym-method__head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="gym-method__eyebrow">HOW THE GYM WORKS</p>
          <h2 id="gym-method-title" className="gym-method__headline">
            Four moves. Repeat until it clicks.
          </h2>
          <p className="gym-method__sub">
            No lectures, no endless theory. Just the loop that turns beginners into people who ship code.
          </p>
        </motion.header>

        <div className="gym-method__steps">
          <div className="gym-method__connector" aria-hidden="true">
            <motion.span
              className="gym-method__connector-fill"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>

          {METHOD.map((step, i) => (
            <motion.article
              className="gym-method__step"
              key={step.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
            >
              <span className="gym-method__num">{step.n}</span>
              <h3 className="gym-method__step-title">{step.title}</h3>
              <p className="gym-method__step-text">{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function GymTrackPath() {
  return (
    <>
      <GymGates />
      <GymTicker />
      <GymMethod />
    </>
  )
}
