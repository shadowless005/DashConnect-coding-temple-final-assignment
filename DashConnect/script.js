// ==========================
// Helper (Arrow Function)
// ==========================
const showError = (output, message) => {
  output.innerHTML = `<p style="color:red;">${message}</p>`;
};

// ==========================
// 🐶 Random Dog Image
// ==========================
async function getDogImage() {
  const output = document.getElementById("dog-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();

    const { message: imageUrl } = data;

    output.innerHTML = `<img src="${imageUrl}" alt="Dog">`;
  } catch (error) {
    showError(output, "Unable to load dog image.");
  }
}

// ==========================
// 🐱 Random Cat Image
// ==========================
async function getCatImage() {
  const output = document.getElementById("cat-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();

    const [{ url }] = data;

    output.innerHTML = `<img src="${url}" alt="Cat">`;
  } catch (error) {
    showError(output, "Unable to load cat image.");
  }
}

// ==========================
// ☀️ Weather (Open-Meteo)
// ==========================
async function getWeather() {
  const output = document.getElementById("weather-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,wind_speed_10m",
    );

    const {
      current: { temperature_2m, wind_speed_10m },
    } = await response.json();

    output.innerHTML = `
            <p>🌡 Temperature: ${temperature_2m}°C</p>
            <p💨 Wind: ${wind_speed_10m} km/h</p>
        `;
  } catch (error) {
    showError(output, "Unable to load weather data.");
  }
}

// ==========================
// 💱 Currency Exchange
// ==========================
async function getExchangeRates() {
  const output = document.getElementById("currency-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await response.json();

    const { rates } = data;

    output.innerHTML = `
            <p>USD → EUR: ${rates.EUR}</p>
            <p>USD → GBP: ${rates.GBP}</p>
            <p>USD → JPY: ${rates.JPY}</p>
        `;
  } catch (error) {
    showError(output, "Unable to load exchange rates.");
  }
}

// ==========================
// 🎬 Movies (TVMaze API)
// ==========================
async function getMovies() {
  const output = document.getElementById("movies-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch("https://api.tvmaze.com/shows");
    const data = await response.json();

    const movies = data.slice(0, 5).map((show) => show.name);

    output.innerHTML = `
            <ul>
                ${movies.map((name) => `<li>${name}</li>`).join("")}
            </ul>
        `;
  } catch (error) {
    showError(output, "Unable to load movies.");
  }
}

// ==========================
// 🧑‍💻 GitHub User
// ==========================
async function getGitHubUser() {
  const output = document.getElementById("github-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch("https://api.github.com/users/octocat");
    const { login, avatar_url, followers, public_repos } =
      await response.json();

    output.innerHTML = `
            <img src="${avatar_url}" alt="GitHub Avatar" width="120">
            <p><strong>${login}</strong></p>
            <p>Followers: ${followers}</p>
            <p>Repos: ${public_repos}</p>
        `;
  } catch (error) {
    showError(output, "Unable to load GitHub user.");
  }
}

// ==========================
// 🤣 Random Joke
// ==========================
async function getJoke() {
  const output = document.getElementById("joke-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke",
    );
    const { setup, punchline } = await response.json();

    output.innerHTML = `
            <p>${setup}</p>
            <strong>${punchline}</strong>
        `;
  } catch (error) {
    showError(output, "Unable to load joke.");
  }
}

// ==========================
// 📚 Public API (Cat Fact)
// ==========================
async function getPublicApiInfo() {
  const output = document.getElementById("publicapi-output");

  try {
    output.innerHTML = "Loading...";

    const response = await fetch("https://catfact.ninja/fact");
    const { fact } = await response.json();

    output.innerHTML = `<p>${fact}</p>`;
  } catch (error) {
    showError(output, "Unable to load fact.");
  }
}
