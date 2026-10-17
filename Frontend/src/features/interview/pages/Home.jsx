import React from 'react'
import '../style/home.scss'
import { useInterview } from '../hook/useInterview.js'
import { useState,useRef } from 'react'
import {useNavigate} from 'react-router'

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 8.5h16v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Zm0 4.5h16m-9 0v1h2v-1" />
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
)

const Home = () => {
     const {loading,generateReport,reports,getAllReports} = useInterview()
     const [jobDescription,setJobDescription] = useState("")
     const [selfDescription,setSelfDescription] = useState("")
     const [reportsError, setReportsError] = useState("")
     const [generateError, setGenerateError] = useState("")
     const [selectedResumeName, setSelectedResumeName] = useState("")
     const navigate = useNavigate()
     const resumeInputRef = useRef(null)

     React.useEffect(() => {
          getAllReports().catch((error) => {
               console.error("Error loading recent interview plans:", error)
               setReportsError(error.response?.status === 401
                    ? "Log in again to view your saved interview plans."
                    : "Unable to load your recent interview plans.")
          })
     }, [getAllReports])

      
     const handleGenerateReport = async () =>{
          const resumeFile = resumeInputRef.current?.files?.[0] || null
          if (!jobDescription.trim() || (!resumeFile && !selfDescription.trim())) {
               setGenerateError("Add a job description and either a PDF resume or a self-description.")
               return
          }
          setGenerateError("")
          try {
               const data = await generateReport({jobDescription: jobDescription.trim(), selfDescription: selfDescription.trim(), resumeFile})
               navigate(`/interview/${data._id}`)
          } catch (error) {
               setGenerateError(error.response?.data?.message || "Unable to generate your interview plan.")
          }
     }
     if(loading && reports.length === 0){
          return (
               <main className="interview-page">  
                    <p>Loading...</p> 
                </main>
          )
     }
  return (

    <main className="interview-page">
      <header className="interview-header">
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a
          <br className="desktop-break" /> winning strategy.
        </p>
      </header>

      <section className="interview-card" aria-label="Interview plan details">
        <div className="plan-column job-column">
          <div className="column-heading">
            <div className="heading-title">
              <BriefcaseIcon />
              <h2>Target Job Description</h2>
            </div>
            <span className="required-badge">Required</span>
          </div>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            maxLength={5000}
            onChange={(e)=>setJobDescription(e.target.value)}   
            placeholder={'Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires\nproficiency in React, TypeScript, and large-scale system\ndesign..."'}
          />
          <span className="character-count">{jobDescription.length} / 5000 chars</span>
        </div>

        <div className="plan-column profile-column">
          <div className="column-heading">
            <div className="heading-title">
              <ProfileIcon />
              <h2>Your Profile</h2>
            </div>
          </div>

          <div className="profile-content">
            <div className="field-block">
              <label htmlFor="resume">
                Upload Resume <span>(Best Results)</span>
              </label>
              <label className="upload-zone" htmlFor="resume">
                <span className="upload-icon"><UploadIcon /></span>
                <strong>{selectedResumeName || 'Click to upload or drag & drop'}</strong>
                <small>PDF (Max 3MB)</small>
              </label>
              <input
                ref={resumeInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,application/pdf"
                onChange={(event) => setSelectedResumeName(event.target.files?.[0]?.name || "")}
              />
            </div>

            <div className="or-divider"><span>OR</span></div>

            <div className="field-block self-description">
              <label htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                value={selfDescription}
                onChange={(e)=>setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="info-note">
              <span>i</span>
              <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <small>AI-Powered Strategy Generation <span>•</span> Approx. 30s</small>
          <button 
            onClick={handleGenerateReport} 
          disabled={loading}
          className="generate-button" type="button">
          <span aria-hidden="true">✦</span> {loading ? 'Generating...' : 'Generate My Interview Strategy'}
          </button>
          {generateError && <p className="generation-error" role="alert">{generateError}</p>}
        </div>
      </section>

      <section className="recent-plans" aria-labelledby="recent-plans-title">
          <div className="recent-plans-heading">
            <div>
              <p className="section-eyebrow">YOUR HISTORY</p>
              <h2 id="recent-plans-title">My Recent Interview Plans</h2>
            </div>
            {reports.length > 0 && (
              <span>{reports.length} {reports.length === 1 ? 'plan' : 'plans'}</span>
            )}
          </div>
          {reportsError ? (
            <p className="recent-plans-message">{reportsError}</p>
          ) : reports.length > 0 ? (
            <div className="recent-plans-list">
              {reports.map((plan) => (
                <button
                  className="recent-plan-card"
                  key={plan._id}
                  type="button"
                  onClick={() => navigate(`/interview/${plan._id}`)}
                >
                  <h3>{plan.title || 'Interview Plan'}</h3>
                  <p>Generated on {new Date(plan.createdAt).toLocaleDateString()}</p>
                  <strong>Match Score: {plan.matchScore ?? 0}%</strong>
                </button>
              ))}
            </div>
          ) : (
            <p className="recent-plans-message">Your generated interview plans will appear here.</p>
          )}
        </section>

      <footer className="page-footer">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#help">Help Center</a>
      </footer>
    </main>
  )
}

export default Home
