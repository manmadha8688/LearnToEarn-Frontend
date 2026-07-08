import { useNavigate } from 'react-router-dom'
import Navbar from './navbars/Navbar'
import '../styles/pages/shared/info-pages.css'

const INFO_FOOTER_LINKS = [
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Terms', path: '/terms' },
  { label: 'Privacy', path: '/privacy' },
]

/**
 * Shared shell for About / Contact / Terms / Privacy.
 * Global navbar + full-bleed hero band + wide content column + legal footer.
 */
export default function InfoPageLayout({ eyebrow, title, lede, updated, children }) {
  const navigate = useNavigate()

  return (
    <div className="info-page">
      <Navbar sticky showBack />

      <header className="info-hero">
        <div className="info-hero__glow" aria-hidden="true" />
        <div className="info-hero__inner">
          {eyebrow && <span className="info-hero__eyebrow">{eyebrow}</span>}
          <h1 className="info-hero__title">{title}</h1>
          {lede && <p className="info-hero__lede">{lede}</p>}
          {updated && <div className="info-hero__updated">Last updated · {updated}</div>}
        </div>
      </header>

      <main className="info-page__body">
        {children}
      </main>

      <footer className="info-page__footer">
        <div className="info-page__footer-inner">
          <span className="info-page__footer-brand">learnforearn — Learn Skills. Earn Job.</span>
          <div className="lp-footer__legal">
            {INFO_FOOTER_LINKS.map(link => (
              <button
                key={link.label}
                type="button"
                className="lp-footer__legal-link"
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
