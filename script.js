import { createClient } from '@supabase/supabase-js'

const backendUrl = "https://web-proj-backend.onrender.com"
const supabaseUrl = "https://ewastpsqndqjtiuaagwy.supabase.co"
const supabaseKey = "sb_publishable_H4cWNsOmEAPu1ymPdhFxSw_YjRgoWDT"
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    document.getElementById("loginResult").innerText = "Error: " + error.message
  } else {
    document.getElementById("loginResult").innerText = "Logged in!"
    loadNotes()
  }
})

document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return alert("Please login first")

  const title = document.getElementById("noteTitle").value
  const content = document.getElementById("noteContent").value
  const date = document.getElementById("noteDate").value
  const value = parseFloat(document.getElementById("noteValue").value)

  const { error } = await supabase
    .from("notes")
    .insert([{ user_id: user.id, title, content, date, value }])

  if (error) {
    alert("Error: " + error.message)
  } else {
    alert("Note added!")
    loadNotes()
  }
})

async function loadNotes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)

  if (!error) {
    document.getElementById("notesList").innerHTML = data.map(note => `
      <div class="card">
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <p>${note.date} → ${note.value}</p>
      </div>
    `).join("")
  }
}

document.getElementById("forecastForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const horizon = parseInt(document.getElementById("horizon").value)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return alert("Please login first")

  const { data } = await supabase
    .from("notes")
    .select("date,value")
    .eq("user_id", user.id)

  try {
    const res = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: data, prediction_horizon: horizon })
    })

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
    const forecast = await res.json()
    document.getElementById("forecastResult").innerHTML = JSON.stringify(forecast, null, 2)
  } catch (err) {
    document.getElementById("forecastResult").innerHTML = `<div class="error">Error: ${err.message}</div>`
  }
}

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

});
