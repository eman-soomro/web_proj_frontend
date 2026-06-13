
// ---------------- RAG (kept for later use) ----------------
async function runRag(keyword) {
  try {
    const res = await fetch(`${backendUrl}/rag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword })
    })
    const data = await res.json()
    console.log("RAG response:", data)
    return data
  } catch (err) {
    console.error("RAG error:", err)
  }
}

// document.getElementById("ragForm").addEventListener("submit", async (e) => {
//   e.preventDefault()
//   const keyword = document.getElementById("ragKeyword").value
//   const results = await runRag(keyword)
//   document.getElementById("ragResult").innerHTML = JSON.stringify(results, null, 2)
// })

