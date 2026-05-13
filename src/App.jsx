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

      <h1>Exam Marker MVP</h1>

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



      {result && (<div style={{ marginTop: 20, padding: 20 }}>

          <h2>Evaluation Report</h2>

          <h3>{result.studentName}</h3>

          <p>
            <b>Marks:</b> {result.marksAwarded} / {result.maxMarks}
          </p>

          <hr />

          <h4>Summary</h4>
          <div style={card}>
            <p style={text}>{result.evaluationSummary}</p>
          </div>


          <h4>Strengths</h4>
          <ul>
            {result.strengths?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h4>Improvements</h4>
          <ul>
            {result.improvements?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {result.factualErrors?.length > 0 && (
            <>
              <h4>Factual Errors</h4>
              <ul>
                {result.factualErrors.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

        </div>
      )}


      {result && (


        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

    </div>
  )
}

export default App