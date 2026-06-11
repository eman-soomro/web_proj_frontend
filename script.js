const backendUrl = "https://web-proj-backend.onrender.com/"; 

document.getElementById("forecastForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const domain = document.getElementById("domain").value;
  const keywords = document.getElementById("keywords").value.split(",");
  const horizon = parseInt(document.getElementById("horizon").value);

  const res = await fetch(`${backendUrl}/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, keywords, prediction_horizon: horizon })
  });
  const data = await res.json();
  document.getElementById("forecastResult").textContent = JSON.stringify(data, null, 2);
});

document.getElementById("ragForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = document.getElementById("ragKeyword").value;

  const res = await fetch(`${backendUrl}/rag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword })
  });
  const data = await res.json();
  document.getElementById("ragResult").textContent = JSON.stringify(data, null, 2);
});
