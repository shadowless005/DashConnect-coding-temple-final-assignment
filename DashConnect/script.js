// ==========================
// Shared helpers (arrow functions)
// ==========================
const addText = (output, text, tag = "p") => {
  const element = document.createElement(tag);
  // API text is displayed as text, not interpreted as HTML.
  element.textContent = text;
  output.appendChild(element);
  return element;
};

const showError = (output, message) => {
  output.replaceChildren();
  addText(output, message).classList.add("error");
};

const fetchJSON = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

// Each card loads independently. Finally re-enables its button on success or failure.
const loadSection = async (id, message, render) => {
  const output = document.getElementById(id);
  const button = output.closest("section").querySelector("button");
  if (button.disabled) return;
  button.disabled = true;
  output.setAttribute("aria-busy", "true");
  output.textContent = "Loading...";
  try {
    await render(output);
  } catch (error) {
    console.error(message, error);
    showError(output, `${message} Please try again.`);
  } finally {
    button.disabled = false;
    output.setAttribute("aria-busy", "false");
  }
};

// Waiting for image loading allows broken image URLs to reach the card's catch.
const loadImage = (url, alt) => new Promise((resolve, reject) => {
  if (typeof url !== "string" || !url.startsWith("https://")) {
    reject(new Error("Missing or invalid image URL."));
    return;
  }
  const image = document.createElement("img");
  image.alt = alt;
  const timeout = setTimeout(() => {
    image.onload = null;
    image.onerror = null;
    reject(new Error("Image loading timed out."));
  }, 15000);
  image.onload = () => {
    clearTimeout(timeout);
    resolve(image);
  };
  image.onerror = () => {
    clearTimeout(timeout);
    reject(new Error("Image could not be loaded."));
  };
  image.src = url;
});

// ==========================
// Dog: object response + destructuring
// ==========================
async function getDogImage() {
  await loadSection("dog-output", "Unable to load dog image.", async (output) => {
    const { message: imageUrl, status } = await fetchJSON("https://dog.ceo/api/breeds/image/random");
    if (status !== "success") throw new Error("Dog API returned an error.");
    const image = await loadImage(imageUrl, "Random dog");
    output.replaceChildren(image);
  });
}

// Cat: array containing an object
async function getCatImage() {
  await loadSection("cat-output", "Unable to load cat image.", async (output) => {
    const data = await fetchJSON("https://api.thecatapi.com/v1/images/search");
    if (!Array.isArray(data) || !data[0]?.url) throw new Error("No cat image returned.");
    const [{ url }] = data;
    const image = await loadImage(url, "Random cat");
    output.replaceChildren(image);
  });
}

// Weather: nested object response; fixed location is New York City
async function getWeather() {
  await loadSection("weather-output", "Unable to load weather data.", async (output) => {
    const { current: { temperature_2m, wind_speed_10m } } = await fetchJSON(
      "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh"
    );
    if (![temperature_2m, wind_speed_10m].every(Number.isFinite)) throw new Error("Missing weather data.");
    output.replaceChildren();
    addText(output, `🌡 Temperature: ${temperature_2m}°C`);
    addText(output, `💨 Wind: ${wind_speed_10m} km/h`);
  });
}

// Currency: nested rates object
async function getExchangeRates() {
  await loadSection("currency-output", "Unable to load exchange rates.", async (output) => {
    const { result, rates } = await fetchJSON("https://open.er-api.com/v6/latest/USD");
    const currencies = ["EUR", "GBP", "JPY"];
    if (result !== "success" || !currencies.every((code) => Number.isFinite(rates?.[code]))) {
      throw new Error("Missing exchange rates.");
    }
    output.replaceChildren();
    currencies.forEach((code) => addText(output, `1 USD → ${rates[code].toFixed(4)} ${code}`));
  });
}

// TVmaze: first five shows in the index, not a trending movie list.
// Keep getMovies to match the original button's onclick function name.
async function getMovies() {
  await loadSection("movies-output", "Unable to load TV shows.", async (output) => {
    const data = await fetchJSON("https://api.tvmaze.com/shows?page=0");
    if (!Array.isArray(data) || !data.length) throw new Error("No shows returned.");
    const shows = data.slice(0, 5).map((show) => show.name);
    const list = document.createElement("ul");
    shows.forEach((name) => addText(list, name, "li"));
    output.replaceChildren(list);
  });
}

// GitHub: profile object
async function getGitHubUser() {
  await loadSection("github-output", "Unable to load GitHub user.", async (output) => {
    const { login, avatar_url, followers, public_repos } = await fetchJSON("https://api.github.com/users/octocat");
    if (!login || !Number.isFinite(followers) || !Number.isFinite(public_repos)) {
      throw new Error("Missing profile data.");
    }
    const image = await loadImage(avatar_url, `${login}'s GitHub avatar`);
    image.width = 120;
    output.replaceChildren(image);
    addText(output, login);
    addText(output, `Followers: ${followers}`);
    addText(output, `Public repos: ${public_repos}`);
  });
}

// Joke: setup and punchline properties
async function getJoke() {
  await loadSection("joke-output", "Unable to load joke.", async (output) => {
    const { setup, punchline } = await fetchJSON("https://official-joke-api.appspot.com/random_joke");
    if (!setup || !punchline) throw new Error("Missing joke text.");
    output.replaceChildren();
    addText(output, setup);
    addText(output, punchline, "strong");
  });
}

// API of your choice: Cat Fact
async function getPublicApiInfo() {
  await loadSection("publicapi-output", "Unable to load cat fact.", async (output) => {
    const { fact } = await fetchJSON("https://catfact.ninja/fact");
    if (typeof fact !== "string" || !fact.trim()) throw new Error("No fact returned.");
    output.replaceChildren();
    addText(output, fact);
  });
}
