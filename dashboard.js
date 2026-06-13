const SUPABASE_URL = "https://ewastpsqndqjtiuaagwy.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let chart;

// UI NAV
window.showSection = function (id) {
  document.getElementById("notesSection").style.display = "none";
  document.getElementById("predictionSection").style.display = "none";
  document.getElementById(id).style.display = "block";
};

// LOGOUT
window.logout = async function () {
  await client.auth.signOut();
  window.location.href = "auth.html";
};

// LOAD NOTES
async function loadNotes() {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return;

  const { data } = await client
    .from("notes")
    .select("*")
    .eq("user_id", user.id);

  notesList.innerHTML = data.map(n => `
    <div class="card">
      <h3>${n.title}</h3>
      <p>${n.content}</p>
      <small>${n.date} → ${n.value}</small>
    </div>
  `).join("");

  totalNotes.innerText = data.length;
  if (data.length) latestValue.innerText = data[data.length - 1].value;
}

loadNotes();

// ADD NOTE
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { data: { user } } = await client.auth.getUser();

  await client.from("notes").insert([{
    user_id: user.id,
    title: noteTitle.value,
    content: noteContent.value,
    date: noteDate.value,
    value: Number(noteValue.value)
  }]);

  loadNotes();
});

// FORECAST
forecastForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { data } = await client
    .from("notes")
    .select("date,value");

  const res = await fetch("https://web-proj-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      records: data,
      prediction_horizon: Number(horizon.value)
    })
  });

  const forecast = await res.json();

  if (chart) chart.destroy();

  chart = new Chart(forecastChart, {
    type: "line",
    data: {
      labels: forecast.map(f => f.ds),
      datasets: [{
        label: "Forecast",
        data: forecast.map(f => f.yhat),
        borderColor: "#38bdf8",
        fill: true,
        tension: 0.4
      }]
    }
  });
});
