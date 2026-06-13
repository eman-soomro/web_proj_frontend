const supabaseUrl = "https://ewastpsqndqjtiuaagwy.supabase.co";
const supabaseKey = "sb_publishable_H4cWNsOmEAPu1ymPdhFxSw_YjRgoWDT";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let chart;

// Section toggle
window.showSection = function (id) {
  document.getElementById("notesSection").style.display = "none";
  document.getElementById("predictionSection").style.display = "none";
  document.getElementById(id).style.display = "block";
};

// Logout
window.logout = async function () {
  await supabase.auth.signOut();
  window.location.href = "auth.html";
};

// Load notes
async function loadNotes() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id);

  document.getElementById("notesList").innerHTML = data.map(n => `
    <div class="card">
      <h3>${n.title}</h3>
      <p>${n.content}</p>
      <small>${n.date} → ${n.value}</small>
    </div>
  `).join("");

  document.getElementById("totalNotes").textContent = data.length;
  if (data.length)
    document.getElementById("latestValue").textContent =
      data[data.length - 1].value;
}

loadNotes();

// Add note
document.getElementById("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notes").insert([{
    user_id: user.id,
    title: noteTitle.value,
    content: noteContent.value,
    date: noteDate.value,
    value: parseFloat(noteValue.value)
  }]);

  loadNotes();
});

// Forecast
document.getElementById("forecastForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("notes")
    .select("date,value")
    .eq("user_id", user.id);

  const res = await fetch("https://web-proj-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      records: data,
      prediction_horizon: parseInt(horizon.value)
    })
  });

  const forecast = await res.json();

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("forecastChart"), {
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
