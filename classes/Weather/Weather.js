class Weather {
  constructor(settings) {
    if (new.target === Weather) {
      throw new Error("Weather is an abstract class and cannot be instantiated directly");
    }
    this.settings = settings;
    this.validateSettings();
  }

  validateSettings() {
    if (!this.settings.apiKey || this.settings.apiKey === "") {
      throw new Error("API key is missing");
    }
    if (!this.settings.city || this.settings.city === "") {
      throw new Error("City is not specified");
    }
  }

  async getWeather() {
    throw new Error("Method 'getWeather()' must be implemented");
  }

  async fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }
    return await response.json();
  }
}

export default Weather;