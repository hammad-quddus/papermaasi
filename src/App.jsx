import { useState } from 'react'

function App() {

  const [paper, setPaper] = useState(null)
  const [rubric, setRubric] = useState(null)
  const [solutions, setSolutions] = useState(null)

  const [result, setResult] = useState(null)

  
  async function handleSubmit() {

    const formData = new FormData()

    formData.append("paper", paper)
    formData.append("rubric", rubric)
    formData.append("solutions", solutions)

    const response = await fetch("http://localhost:8080/api/exam/evaluate", {
      method: "POST",
      body: formData
    })

    const data = await response.json()

    setResult(data)
  }

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

      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

    </div>
  )
}

export default App