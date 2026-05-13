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

function App() {

  // State variables to hold the uploaded files and evaluation result
  const [paper, setPaper] = useState(null)
  const [rubric, setRubric] = useState(null)
  const [solutions, setSolutions] = useState(null)

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {

    setLoading(true)

    const formData = new FormData()

    formData.append("paper", paper)
    formData.append("rubric", rubric)
    formData.append("solutions", solutions)

    // API call to backend to evaluate the exam paper using the provided rubric and solutions
    try {

      // const response = await fetch("http://localhost:8080/api/exam/evaluate", {
      //   method: "POST",
      //   body: formData
      // })

      // const data = await response.json()

      const data = mockResult

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

      <h1>Paper Marker Proto</h1>

      <div>
        <p>Student Paper</p>
        <input type="file" onChange={(e) => setPaper(e.target.files[0])} />
      </div>

      <div>
        <p>Rubric</p>
        <input type="file" onChange={(e) => setRubric(e.target.files[0])} />
      </div>

      <div>
        <p>Solutions</p>
        <input type="file" onChange={(e) => setSolutions(e.target.files[0])} />
      </div>

      <br />

      <button onClick={handleSubmit}>
        Evaluate
      </button>

      <br />
      <br />

      {loading && <p>Evaluating exam paper...</p>}



      {result && (
        <div style={{ marginTop: 20, padding: 20 }}>

          <h1>Grade Report</h1>

          <h3>{result.studentName}</h3>

          <p>
            <b>Marks:</b> {result.marksAwarded} / {result.maxMarks}
          </p>

          <hr />

          {/* Summary */}
          <Section title="Summary">
            <p style={text}>{result.evaluationSummary}</p>
          </Section>

          {/* Strengths */}
          <Section title="Strengths">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.strengths?.map((item, i) => (
                <li style={text} key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          {/* Improvements */}
          <Section title="Improvements">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.improvements?.map((item, i) => (
                <li style={text} key={i}>{item}</li>
              ))}
            </ul>
          </Section>

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

          {result.teacherComments?.length > 0 && (
            <Section title="Teacher Comments">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {result.teacherComments.map((item, i) => (
                  <li style={text} key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}


          <h3>Evaluation</h3>


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
          <CollapsibleSection
            title="EvaluationSummary"
            items={[result.evaluationSummary]}
          />
        </div>
      )}

      {result && (


        <pre style={text}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

    </div>
  )
}

export default App