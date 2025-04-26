class Weather {
  constructor(weatherSettings) {
    this.weatherSettings = weatherSettings;
  }

  async getWeather() {
    if (this.weatherSettings.apiKey === "") {
      throw new Error("API key is missing");
    }
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.weatherSettings.city}&appid=${this.weatherSettings.weatherAPIKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }
    return await response.json();
  }
}

export default Weather;