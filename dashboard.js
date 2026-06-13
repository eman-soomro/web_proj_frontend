import { createClient } from '@supabase/supabase-js'
import Chart from 'chart.js/auto'

const backendUrl = "https://web-proj-backend.onrender.com"
const supabaseUrl = "YOUR_SUPABASE_URL"
const supabaseKey = "YOUR_SUPABASE_ANON_KEY"
const supabase = createClient(supabaseUrl, supabaseKey)

// Show sections
window.showSection = function(sectionId) {
  document.getElementById("notesSection").style.display = "none"
  document.getElementById("predictionSection").style.display = "none"
  document.getElementById(sectionId).style.display = "block"
}

// Notes CRUD
document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return alert("Please login first")

  const title = document.getElementById("noteTitle").value
  const content = document.getElementById("noteContent").value
  const date = document.getElementById("noteDate").value
  const value = parseFloat(document.getElementById("noteValue").value)

  const { error } = await supabase.from("notes").insert([{ user_id: user.id, title, content, date, value }])
  if (error) alert("Error: " + error.message)
  else loadNotes()
})

async function loadNotes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase.from("notes").select("*").eq("user_id", user.id)
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
loadNotes()

// Forecast
document.getElementById("forecastForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const horizon = parseInt(document.getElementById("horizon").value)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return alert("Please login first")

  const { data } = await supabase.from("notes").select("date,value").eq("user_id", user.id)

  const res = await fetch(`${backendUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records: data, prediction_horizon: horizon })
  })
  const forecast = await res.json()

  const ctx = document.getElementById("forecastChart")
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: forecast.map(f => f.ds),
      datasets: [{
        label: 'Forecast',
        data: forecast.map(f => f.yhat),
        borderColor: '#3498db',
        fill: false
      }]
    }
  })
})
