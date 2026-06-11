const backendUrl = "https://web-proj-backend.onrender.com";

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
    document.getElementById("forecastResult").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error("Forecast error:", err);
    document.getElementById("forecastResult").textContent = "Error: " + err.message;
  }
});

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
    document.getElementById("ragResult").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error("RAG error:", err);
    document.getElementById("ragResult").textContent = "Error: " + err.message;
  }
});
