import React from 'react'
import '../style/interview.scss'
import { useParams } from 'react-router'
import {useInterview} from '../hook/useInterview.js'


const QuestionCard = ({ item, index }) => {
  const [isAnswerVisible, setIsAnswerVisible] = React.useState(false)

  return (
    <article className={`question-card ${isAnswerVisible ? 'expanded' : ''}`}>
      <div className="question-number">{String(index + 1).padStart(2, '0')}</div>
      <div className="question-copy">
        <button
          className="question-toggle"
          type="button"
          aria-expanded={isAnswerVisible}
          onClick={() => setIsAnswerVisible((visible) => !visible)}
        >
          <h3>{item.question}</h3>
          <span className="toggle-icon" aria-hidden="true">{isAnswerVisible ? '−' : '+'}</span>
        </button>
        <p className="question-intention"><strong>Why they ask:</strong> {item.intention}</p>
        {isAnswerVisible && (
          <div className="answer-box">
            <span className="answer-label">Suggested answer</span>
            <p>{item.answer}</p>
          </div>
        )}
      </div>
    </article>
  )
}

const Interview = () => {
  const [activeSection, setActiveSection] = React.useState('technical')
  const { report, getReportById, getResumePdf, loading } = useInterview()
  const [loadError, setLoadError] = React.useState('')
  const [pdfError, setPdfError] = React.useState('')
  const [isDownloading, setIsDownloading] = React.useState(false)
  const { interviewId } = useParams()
  React.useEffect(() => {
    getReportById(interviewId).catch((error) => {
      setLoadError(error.response?.data?.message || 'Unable to load this interview plan.')
    })
  }, [getReportById, interviewId])

  if (loading) {
    return <main className="interview-dashboard"><p>Loading interview plan...</p></main>
  }
  if (loadError || !report) {
    return <main className="interview-dashboard"><p role="alert">{loadError || 'Interview plan not found.'}</p></main>
  }
  const isQuestionsSection = activeSection === 'technical' || activeSection === 'behavioral'
  const questions = activeSection === 'behavioral' ? report.behavioralQuestions : report.technicalQuestions
  const sectionTitle = activeSection === 'behavioral' ? 'Behavioral questions' : 'Technical questions'
  const sectionNumber = activeSection === 'behavioral' ? 'SECTION 02' : 'SECTION 01'

  const handleDownloadPdf = async () => {
    setPdfError('')
    setIsDownloading(true)
    try {
      const pdf = await getResumePdf(interviewId)
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = `${report.title || 'interview-plan'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      setPdfError(error.response?.data?.message || 'Unable to generate the PDF.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="interview-dashboard">
      <section className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <p className="sidebar-label">YOUR PLAN</p>
          <nav aria-label="Interview plan sections">
            <button className={`sidebar-link ${activeSection === 'technical' ? 'active' : ''}`} type="button" onClick={() => setActiveSection('technical')}><span>⌘</span>Technical questions</button>
            <button className={`sidebar-link ${activeSection === 'behavioral' ? 'active' : ''}`} type="button" onClick={() => setActiveSection('behavioral')}><span>◈</span>Behavioral questions</button>
            <button className={`sidebar-link ${activeSection === 'roadmap' ? 'active' : ''}`} type="button" onClick={() => setActiveSection('roadmap')}><span>◷</span>Road Map</button>
          </nav>
          <div className="sidebar-summary">
            <span className="summary-icon">✦</span>
            <strong>Keep going</strong>
            <p>Small, focused practice sessions will help you feel interview-ready.</p>
          </div>
          <button
            className="sidebar-download"
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
          >
            <span aria-hidden="true">✦</span>
            {isDownloading ? 'Preparing PDF...' : 'Download Resume'}
          </button>
        </aside>

        <section className="dashboard-main">
          {isQuestionsSection ? (
            <>
              <div className="content-heading">
                <div>
                  <p className="eyebrow">{sectionNumber}</p>
                  <h2>{sectionTitle}</h2>
                </div>
                <div className="heading-actions">
                  <span className="count-badge">{questions.length} questions</span>
                  <button className="download-button" type="button" onClick={handleDownloadPdf} disabled={isDownloading}>
                    {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>
              {pdfError && <p className="pdf-error" role="alert">{pdfError}</p>}
              <p className="section-description">
                {activeSection === 'behavioral'
                  ? 'Use the STAR method to structure clear stories about your experience, teamwork, and problem-solving.'
                  : 'Practice explaining your thinking clearly and connect each answer to real project experience.'}
              </p>
              <div className="question-list">
                {questions.map((item, index) => <QuestionCard key={item.question} item={item} index={index} />)}
              </div>
            </>
          ) : (
            <div className="roadmap-main">
              <div className="content-heading">
                <div>
                  <p className="eyebrow">SECTION 03</p>
                  <h2>Preparation Road Map</h2>
                </div>
                <div className="heading-actions">
                  <span className="count-badge">{report.preparationPlan.length} days</span>
                  <button className="download-button" type="button" onClick={handleDownloadPdf} disabled={isDownloading}>
                    {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>
              {pdfError && <p className="pdf-error" role="alert">{pdfError}</p>}
              <p className="section-description">Follow this focused three-day plan to strengthen your highest-priority skills before the interview.</p>
              <div className="preparation-list">
                {report.preparationPlan.map((day) => (
                  <article className="preparation-card" key={day.day}>
                    <div className="preparation-day">DAY <strong>{day.day}</strong></div>
                    <div className="preparation-content">
                      <h3>{day.focus}</h3>
                      <ul>{day.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="dashboard-insights">
          <div className="match-score">
            <div className="insight-heading">
              <p className="eyebrow">PROFILE MATCH</p>
              <h2>Match score</h2>
            </div>
            <div className="score-display">
              <strong>{report.matchScore ?? 0}<span>%</span></strong>
              <div className="score-progress" aria-label={`${report.matchScore ?? 0} percent profile match`}>
                <span style={{ width: `${report.matchScore ?? 0}%` }} />
              </div>
            </div>
            <p className="score-copy">Your experience is a good match for this role. Focus on the skill gaps below.</p>
          </div>
          <div className="insight-divider score-divider" />
          <div className="insight-heading">
            <p className="eyebrow">FOCUS AREAS</p>
            <h2>Skill gaps</h2>
          </div>
          <div className="skill-list">
            {report.skillGaps.map(({ skill, severity }) => (
              <div className="skill-row" key={skill}>
                <span>{skill}</span>
                <small className={`severity ${severity}`}>{severity}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Interview
