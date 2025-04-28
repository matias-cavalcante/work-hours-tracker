if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"; // send them back to login if not logged in
}

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
          <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" style="width: 60px; height: 60px;" />
        <p style="font-size: 1.1rem;">${city}</p>
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
