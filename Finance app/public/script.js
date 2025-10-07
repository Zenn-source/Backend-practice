async function updateTime() {
  const res = await fetch("/api/time");
  const data = await res.json();
  const hour = String(data.hour).padStart(2, "0");
  const minute = String(data.minute).padStart(2, "0");
  const seconds = String(data.seconds).padStart(2, "0");
  document.getElementById("time").textContent = `${hour}:${minute}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);
