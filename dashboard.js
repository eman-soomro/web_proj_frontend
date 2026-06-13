const SUPABASE_URL = "https://ewastpsqndqjtiuaagwy.supabase.co";
const SUPABASE_KEY = "sb_publishable_H4cWNsOmEAPu1ymPdhFxSw_YjRgoWDT";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


window.showSection = function (id) {
  document.getElementById("notesSection").style.display = "none";
  document.getElementById("predictionSection").style.display = "none";

  document.getElementById(id).style.display = "block";
};


window.logout = async function () {
  await client.auth.signOut();
  window.location.href = "index.html";
};

async function loadNotes() {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  const { data, error } = await client
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const notesList = document.getElementById("notesList");
  const totalNotes = document.getElementById("totalNotes");
  const latestValue = document.getElementById("latestValue");

  notesList.innerHTML = data
    .map(
      (note) => `
      <div class="card">
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <small>
          ${note.date} → ${note.value}
        </small>
      </div>
    `
    )
    .join("");

  totalNotes.innerText = data.length;

  latestValue.innerText =
    data.length > 0
      ? data[data.length - 1].value
      : 0;
}

loadNotes();

document
  .getElementById("noteForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const {
      data: { user }
    } = await client.auth.getUser();

    if (!user) {
      alert("Please login.");
      return;
    }

    const title =
      document.getElementById("noteTitle").value;

    const content =
      document.getElementById("noteContent").value;

    const date =
      document.getElementById("noteDate").value;

    const value = Number(
      document.getElementById("noteValue").value
    );

    const { error } = await client
      .from("notes")
      .insert([
        {
          user_id: user.id,
          title,
          content,
          date,
          value
        }
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    document.getElementById("noteForm").reset();

    loadNotes();
  });


document
  .getElementById("forecastForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const keyword =
      document
        .getElementById("forecastKeyword")
        .value
        .trim();

    const horizon = parseInt(
      document.getElementById("horizon").value
    );

    const forecastLoading =
      document.getElementById("forecastLoading");

    const forecastResult =
      document.getElementById("forecastResult");

    forecastLoading.style.display = "block";
    forecastResult.innerHTML = "";

    try {
      const response = await fetch(
        "https://web-proj-backend.onrender.com/forecast",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            domain: "general",
            keywords: [keyword],
            prediction_horizon: horizon
          })
        }
      );

      const data = await response.json();

      forecastLoading.style.display = "none";

      const result = data.keywords?.[keyword];

      if (!result || result.error) {
        forecastResult.innerHTML = `
          <div class="card">
            <h3>Error</h3>
            <p>
              ${
                result?.error ||
                "Unable to generate forecast."
              }
            </p>
          </div>
        `;
        return;
      }

      const trendClass = result.trend;

      forecastResult.innerHTML = `
        <div class="forecast-container">

          <div class="forecast-header">

            <div class="forecast-stat">
              <h4>Current Interest</h4>
              <p>${result.current_interest}</p>
            </div>

            <div class="forecast-stat">
              <h4>Forecast Interest</h4>
              <p>${result.forecast_interest}</p>
            </div>

            <div class="forecast-stat">
              <h4>Trend</h4>
              <p class="${trendClass}">
                ${result.trend.toUpperCase()}
              </p>
            </div>

            <div class="forecast-stat">
              <h4>Change</h4>
              <p class="${trendClass}">
                ${result.change_percent}%
              </p>
            </div>

          </div>

          <div class="forecast-graph">
            <img
              src="https://web-proj-backend.onrender.com${result.graph}?t=${Date.now()}"
              alt="Forecast Graph"
            >
          </div>

          <div class="forecast-table">

            <table>

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Predicted Interest</th>
                </tr>
              </thead>

              <tbody>

                ${result.forecast
                  .map(
                    (row) => `
                    <tr>
                      <td>${row.date}</td>
                      <td>${row.predicted_interest}</td>
                    </tr>
                  `
                  )
                  .join("")}

              </tbody>

            </table>

          </div>

        </div>
      `;
    } catch (err) {
      forecastLoading.style.display = "none";

      forecastResult.innerHTML = `
        <div class="card">
          <h3>Error</h3>
          <p>${err.message}</p>
        </div>
      `;
    }
  });
