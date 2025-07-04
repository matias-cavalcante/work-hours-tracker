//if (localStorage.getItem("isLoggedIn") !== "true") {
//  window.location.href = "../index.html"; // send them back to login if not logged in
//}

const apiKey = "96028edf5c98fa122c4985559bde10c1"; // replace with your actual key
const city = "Reykjavik"; // or any city you want

fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
)
  .then((response) => response.json())
  .then((data) => {
    const temp = data.main.temp;
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    document.querySelector(".weather").innerHTML = `
      <div style="text-align: center;">
          <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" style="width: 70px; height: 50px;" />
        <p style="font-size: 1.8rem; font-weight: 400;">${city}</p>
        <p>${Math.round(temp)}°C - ${desc}</p>
      </div>
    `;
  })
  .catch((error) => {
    console.error("Error fetching weather:", error);
    document.querySelector(".weather").innerHTML = `<p>Weather unavailable</p>`;
  });

const dateWidget = document.getElementById("date-widget");

const options = { weekday: "long", day: "numeric", month: "long" };
const today = new Date().toLocaleDateString("en-US", options);

// Capitalize first letter (to match the style you had)
const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);
//const formattedDate = today.toUpperCase();

dateWidget.textContent = formattedDate;

document.addEventListener("DOMContentLoaded", () => {
  const clockEl = document.getElementById("digitalClock");
  const dot = document.getElementById("movingDot");

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${hours}:${minutes}`;

    const seconds = now.getSeconds();
    const angle = (seconds / 60) * 360;

    const radius = 50;
    const centerX = 60;
    const centerY = 60;

    const rad = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);

    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
  }

  setInterval(updateClock, 1000);
  updateClock();
});

const dummyWeeklyHours = {
  Mon: 6,
  Tue: 9,
  Wed: 7,
  Thu: 4,
  Fri: 8,
  Sat: 2,
  Sun: 0,
};

const maxHours = 10; // adjust based on realistic upper bound

document.querySelectorAll(".bar").forEach((bar) => {
  const day = bar.getAttribute("data-day");
  const height = (dummyWeeklyHours[day] / maxHours) * 100;
  bar.style.setProperty("--height", `${height}%`);
});

function updateShiftStatus() {
  const now = new Date();
  const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours + minutes / 60; // Convert to decimal

  const statusEl = document.querySelector(".status");

  if (day >= 1 && day <= 5 && time >= 10.5 && time < 18.5) {
    statusEl.textContent = "ON SHIFT";
  } else {
    statusEl.textContent = "OFF SHIFT";
    statusEl.style.color = "rgb(154, 149, 149)";
  }
}

// Initial call
updateShiftStatus();

// Update every minute
setInterval(updateShiftStatus, 60000);
