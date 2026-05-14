import maasiBanner from "./assets/maasi-marker.png"
import { useState } from 'react'
import { mockResult } from "./mock/data"

const card = {
  marginTop: 10,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 8,
  backgroundColor: "#fafafa"
};

const text = {
  margin: 0,
  lineHeight: 1.5,
  textAlign: "left"
};

const Section = ({ title, children }) => (
  <div style={{ marginTop: 20 }}>
    <h4>{title}</h4>
    <div
      style={{
        marginTop: 10,
        padding: 15,
        border: "1px solid #ddd",
        borderRadius: 8,
        backgroundColor: "#fafafa"
      }}
    >
      {children}
    </div>
  </div>
)

const CollapsibleSection = ({ title, items }) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: 15 }}>

      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f5f5f5",
          fontWeight: "bold"
        }}
      >
        {title} {open ? "▲" : "▼"}
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: 10, border: "1px solid #ddd", borderTop: "none" }}>
          <ul>
            {items?.map((item, i) => (
              <li style={text} key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


const JsonBlock = ({ title, data }) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: 20 }}>

      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f5f5f5",
          fontWeight: "bold"
        }}
      >
        {title} {open ? "▲" : "▼"}
      </div>

      {open && (
        <pre style={text}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

    </div>
  )
}


const TrafficLight = ({ status }) => {
  const colorMap = {
    red: "red",
    yellow: "gold",
    green: "green"
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: colorMap[status],
          boxShadow: `0 0 6px ${colorMap[status]}`
        }}
      />
      <span style={{ fontWeight: "bold" }}>
        {status.toUpperCase()} REVIEW STATUS
      </span>
    </div>
  )
}

function getTrafficLight(result) {
  if (result.requiresHumanReview) return "red"
  if (result.confidence?.gradingConfidence < 0.95) return "yellow"
  return "green"
}

function App() {

  // State variables to hold the uploaded files and evaluation result

  const [paper, setPaper] = useState([])
  const [rubric, setRubric] = useState([])
  const [solutions, setSolutions] = useState([])

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {

    setLoading(true)

    const formData = new FormData()

    // formData.append("paper", paper)
    // formData.append("rubric", rubric)
    // formData.append("solutions", solutions)

    paper.forEach(file => {
      formData.append("paperImages", file)
    })

    rubric.forEach(file => {
      formData.append("rubricImages", file)
    })

    solutions.forEach(file => {
      formData.append("solutionImages", file)
    })

    // API call to backend to evaluate the exam paper using the provided rubric and solutions
    try {

      const response = await fetch("http://192.168.0.109:8080/api/exam/evaluate", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      // const data = mockResult

      setResult(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }
  }

  // JSX for rendering the UI
  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <img
          src={maasiBanner}
          alt="Maasi Marker"
          style={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        />
      </div>


      <div>
        <p>Student Paper</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPaper(Array.from(e.target.files))}
        />
      </div>

      <div>
        <p>Rubric</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setRubric(Array.from(e.target.files))}
        />
      </div>

      <div>
        <p>Official Solution</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setSolutions(Array.from(e.target.files))}
        />
      </div>

      <br />

      <button onClick={handleSubmit}>
        Evaluate
      </button>

      <br />
      <br />

      {loading && (
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 16,
            height: 16,
            border: "2px solid #ccc",
            borderTop: "2px solid #333",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ margin: 0 }}>Evaluating exam paper...</p>
        </div>
      )}


      {result && (
        <div style={{ marginTop: 20, padding: 20 }}>

          <h1>Grade Report</h1>

          {result && (
            <div style={{ marginBottom: 15 }}>
              <TrafficLight status={getTrafficLight(result)} />
            </div>
          )}

          <h3>{result.studentName}</h3>

          <p>
            <b>Marks:</b> {result.marksAwarded} / {result.maxMarks}
          </p>

          <hr />

{/* // TEMP: disabled until UI rework
// strengths, improvements, summary, teacherComments */}

          {/* Summary */}
          {/* <Section title="Summary">
            <p style={text}>{result.evaluationSummary}</p>
          </Section> */}

          <Section title="Coverage Gaps">
            <p style={text}>{result.coverageGaps}</p>
          </Section>


          {/* Strengths */}
          {/* <Section title="Strengths">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.strengths?.map((item, i) => (
                <li style={text} key={i}>{item}</li>
              ))}
            </ul>
          </Section> */}

          {/* Improvements */}
          {/* <Section title="Improvements">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.improvements?.map((item, i) => (
                <li style={text} key={i}>{item}</li>
              ))}
            </ul>
          </Section> */}

          {/* Factual Errors */}
          {result.factualErrors?.length > 0 && (
            <Section title="Factual Errors">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {result.factualErrors.map((item, i) => (
                  <li style={text} key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* {result.teacherComments?.length > 0 && (
            <Section title="Teacher Comments">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {result.teacherComments.map((item, i) => (
                  <li style={text} key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )} */}

          <div style={{ marginTop: 20, padding: 15, border: "1px solid #ddd", borderRadius: 8, backgroundColor: "#fafafa" }}>
            <h3>Evaluation</h3>
            <Section title="Evaluation Summary">
              <p style={text}>{result.evaluationSummary}</p>
            </Section>

            <CollapsibleSection
              title="Accuracy"
              items={result.evaluation.accuracy}
            />

            <CollapsibleSection
              title="Coverage"
              items={result.evaluation.coverage}
            />

            <CollapsibleSection
              title="Use of Resources"
              items={result.evaluation.useOfResources}
            />

            <CollapsibleSection
              title="Structure"
              items={result.evaluation.structure}
            />

            <CollapsibleSection
              title="Relevance"
              items={result.evaluation.relevance}
            />

            <Section title="Student Answer Transcription">
              <p style={text}>{result.studentSolutionTranscription}</p>
            </Section>


          </div>

        </div>



      )}



      {result && (
        <JsonBlock title="Raw JSON (Debug View)" data={result} />
      )}

    </div>
  )
}

export default App