const backendUrl = "https://web-proj-backend.onrender.com";

function renderForecast(data) {
  if (data.error) {
    return `<div class="error">⚠️ ${data.error}</div>`;
  }

  let html = `
    <div class="card">
      <h2>📊 Forecast Results</h2>
      <p><strong>Domain:</strong> ${data.domain}</p>
      <p><strong>Prediction Horizon:</strong> ${data.prediction_horizon} days</p>
      <p><strong>Model Trained:</strong> ${data.model_trained ? "✅ Yes" : "❌ No"}</p>
      <h3>Keywords:</h3>
  `;

  for (const [keyword, details] of Object.entries(data.keywords || {})) {
    html += `
      <div class="keyword-block">
        <h4>${keyword}</h4>
        <p><strong>Trend:</strong> ${details.trend}</p>
        <p><strong>Current Interest:</strong> ${details.current_interest}</p>
        <p><strong>Change %:</strong> ${details.change_percent}</p>
        <p><strong>Forecast Interest:</strong> ${details.forecast_interest}</p>
        ${details.graph ? `<img src="${details.graph}" alt="${keyword} forecast graph" class="forecast-graph">` : ""}
        <table>
          <thead>
            <tr><th>Date</th><th>Predicted Interest</th></tr>
          </thead>
          <tbody>
            ${details.forecast.map(f => `
              <tr>
                <td>${f.date}</td>
                <td>${f.predicted_interest}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

// Helper: format RAG results
function renderRag(results) {
  if (results.error) {
    return `<div class="error">⚠️ ${results.error}</div>`;
  }

  return `
    <div class="card">
      <h2>📚 RAG Results</h2>
      <ul>
        ${results.map(paper => `
          <li>
            <strong>${paper.properties?.title || "Untitled"}</strong><br>
            <em>${paper.properties?.authors || "Unknown authors"} (${paper.properties?.year || "N/A"})</em><br>
            Citations: ${paper.properties?.citations || 0}<br>
            <p>${paper.properties?.abstract || "No abstract available"}</p>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

// Forecast form handler
document.getElementById("forecastForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const domain = document.getElementById("domain").value;
  const keywords = document.getElementById("keywords").value.split(",");
  const horizon = parseInt(document.getElementById("horizon").value);

  try {
    const res = await fetch(`${backendUrl}/forecast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, keywords, prediction_horizon: horizon })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Forecast response:", res.status, data);
    document.getElementById("forecastResult").innerHTML = renderForecast(data);
  } catch (err) {
    console.error("Forecast error:", err);
    document.getElementById("forecastResult").innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
});

// RAG form handler
document.getElementById("ragForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = document.getElementById("ragKeyword").value;

  try {
    const res = await fetch(`${backendUrl}/rag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log("RAG response:", res.status, data);
    document.getElementById("ragResult").innerHTML = renderRag(data);
  } catch (err) {
    console.error("RAG error:", err);
    document.getElementById("ragResult").innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
});
