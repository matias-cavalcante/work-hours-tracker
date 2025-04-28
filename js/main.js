const CLIENT_ID =
  "1026185107031-j28evobancm2eba97j2u4g3sa3i8cha0.apps.googleusercontent.com";
const API_KEY = "AIzaSyAbjJ5NuIT_vQsAUoigSbWRS4O_kwwQ20M";
const SPREADSHEET_ID = "1cbSe9lsIoX1UTcxm2QfYlt-4KxkqpFRI6997ptW5YUc";
const RANGE = "Sheet1!A:D";

let tokenClient;
let gapiInited = false;
let tokenGranted = false;

function gapiLoaded() {
  gapi.load("client", async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ],
    });
    gapiInited = true;
    maybeEnableForm();
  });
}

window.gapiLoaded = gapiLoaded;

window.onload = () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    callback: (tokenResponse) => {
      if (tokenResponse.error) {
        console.error(tokenResponse);
        alert("Authorization failed.");
        return;
      }
      console.log("Access token granted.");

      gapi.client.setToken({
        access_token: tokenResponse.access_token,
      });

      tokenGranted = true;
      maybeEnableForm();

      localStorage.setItem("isLoggedIn", "true");

      // ✅ Redirect to dashboard
      window.location.href = "../dashboard.html";
    },
  });

  document.getElementById("authorize_button").onclick = () => {
    tokenClient.requestAccessToken();
  };
};

function maybeEnableForm() {
  if (gapiInited && tokenGranted) {
    document.getElementById("hoursForm").style.display = "block";
    document.getElementById("authorize_button").style.display = "none";
  }
}

document.getElementById("hoursForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const date = form.date.value;
  const clockIn = form.clockIn.value;
  const clockOut = form.clockOut.value;
  const totalHours = calculateHours(clockIn, clockOut);

  const values = [[date, clockIn, clockOut, totalHours]];

  try {
    const res = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });
    console.log("Saved to sheet:", res);
    alert("Saved!");
  } catch (err) {
    console.error("Error saving to sheet", err);
    alert("Failed to save.");
  }
});

function calculateHours(start, end) {
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  const total = h2 + m2 / 60 - (h1 + m1 / 60);
  return parseFloat(total.toFixed(2));
}
