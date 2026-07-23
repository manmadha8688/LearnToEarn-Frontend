import { X } from 'lucide-react'
import useBodyLock from '../../../hooks/useBodyLock'
import useModalA11y from '../../../hooks/useModalA11y'
import { CONCEPT_XP_RANGE, QUIZ_XP, ROADMAP_XP_RANGE, SUBJECT_XP_RANGE } from '../../../utils/quizXp'

const QUIZ_META = {
  concept: {
    label: 'SKILL TRIAL', color: '#9B6ED4',
    questions: QUIZ_XP.concept.total, time: null, passNum: QUIZ_XP.concept.pass, reward: `${CONCEPT_XP_RANGE} (+50 daily)`, rewardColor: '#9B6ED4',
    rules: [
      'No time limit — read each question at your own pace',
      'Select one answer per question; you can navigate back freely',
      `Score ${QUIZ_XP.concept.pass} / ${QUIZ_XP.concept.total} to clear — earn ${QUIZ_XP.concept.base} XP (+${QUIZ_XP.concept.perPoint} per extra correct)`,
      `First skill cleared today earns +${QUIZ_XP.concept.dailyBonus} bonus XP on top`,
      'Failed? A 10-minute cooldown applies before you can retry',
    ],
  },
  subject: {
    label: 'GATE ASSESSMENT', color: '#F59E0B',
    questions: QUIZ_XP.subject.total, time: '50 min', passNum: QUIZ_XP.subject.pass, reward: `${SUBJECT_XP_RANGE} + Badge`, rewardColor: '#F59E0B',
    rules: [
      'Questions are drawn randomly from all skills inside this gate',
      'Timer starts when you begin — 50 minutes total',
      `Score ${QUIZ_XP.subject.pass} / ${QUIZ_XP.subject.total} to close the gate — ${QUIZ_XP.subject.base} XP base (+${QUIZ_XP.subject.perPoint} per extra correct)`,
      `Perfect ${QUIZ_XP.subject.total} / ${QUIZ_XP.subject.total} earns ${QUIZ_XP.subject.base + (QUIZ_XP.subject.total - QUIZ_XP.subject.pass) * QUIZ_XP.subject.perPoint} XP`,
      'Failed? A 24-hour cooldown applies before you can retry',
    ],
  },
  roadmap: {
    label: 'PATH FINAL TRIAL', color: '#EF4444',
    questions: QUIZ_XP.roadmap.total, time: '110 min', passNum: QUIZ_XP.roadmap.pass, reward: `${ROADMAP_XP_RANGE} + Badge`, rewardColor: '#4ADE80',
    rules: [
      'Questions span all subjects and all skills across this path',
      'Timer starts when you begin — 110 minutes total',
      `Score ${QUIZ_XP.roadmap.pass} / ${QUIZ_XP.roadmap.total} to clear the path — ${QUIZ_XP.roadmap.base} XP base (+${QUIZ_XP.roadmap.perPoint} per extra correct)`,
      `Perfect ${QUIZ_XP.roadmap.total} / ${QUIZ_XP.roadmap.total} earns ${QUIZ_XP.roadmap.base + (QUIZ_XP.roadmap.total - QUIZ_XP.roadmap.pass) * QUIZ_XP.roadmap.perPoint} XP`,
      'Failed? A 48-hour cooldown applies before you can retry',
    ],
  },
}

export default function InstructionsModal({ intent, onClose, onConfirm }) {
  const meta = QUIZ_META[intent?.type]
  useBodyLock()
  const modalRef = useModalA11y(onClose, !!meta)

  if (!meta) return null

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} className="dash-overlay-backdrop dash-overlay-backdrop--modal">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="instructions-title" className="dash-instructions-modal" style={{ '--accent': meta.color }}>
        <div className="dash-instructions-modal__header">
          <span id="instructions-title" className="dash-instructions-modal__tag">[ {meta.label} PROTOCOL ]</span>
          <button type="button" aria-label="Close" onClick={onClose} className="dash-instructions-modal__close"><X size={15} /></button>
        </div>

        <div className="dash-instructions-modal__body">
          <div className="dash-instructions-modal__title-row">
            {intent.icon && <span className="dash-instructions-modal__icon">{intent.icon}</span>}
            <div>
              <div className="dash-instructions-modal__title">{intent.title}</div>
              <div className="dash-instructions-modal__subtitle">{meta.label}</div>
            </div>
          </div>

          <div className="dash-instructions-modal__stats">
            {[
              { label: 'QUESTIONS', value: meta.questions, color: '#60A5FA', big: true },
              { label: 'TIME LIMIT', value: meta.time ?? 'NONE', color: '#F59E0B', big: true },
              { label: 'PASS MARK', value: `${meta.passNum}/${meta.questions}`, color: meta.color, big: true },
              { label: 'REWARD', value: meta.reward, color: meta.rewardColor, big: false },
            ].map(s => (
              <div key={s.label} className="dash-instructions-stat" style={{ '--stat-color': s.color }}>
                <div className={`dash-instructions-stat__value ${s.big ? 'dash-instructions-stat__value--big' : 'dash-instructions-stat__value--small'}`}>{s.value}</div>
                <div className="dash-instructions-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="dash-instructions-modal__rules">
            <div className="dash-instructions-modal__rules-title">[ TRIAL RULES ]</div>
            <div className="dash-instructions-modal__rules-list">
              {meta.rules.map((rule, i) => (
                <div key={i} className="dash-instructions-rule">
                  <span className="dash-instructions-rule__num">0{i + 1}</span>
                  <span className="dash-instructions-rule__text">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-instructions-modal__actions">
            <button onClick={onClose} className="dash-instructions-cancel">CANCEL</button>
            <button
              onClick={onConfirm}
              className={`dash-instructions-confirm${intent.type === 'subject' ? ' dash-instructions-confirm--subject' : ''}`}
            >
              ⚔ BEGIN {meta.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
