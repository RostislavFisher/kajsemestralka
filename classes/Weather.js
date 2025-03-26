class Weather {
  constructor(weatherSettings) {
    this.weatherSettings = weatherSettings;
  }

    async getWeather() {
      if (this.weatherSettings.apiKey === "") {
        throw new Error("API key is missing");
      }
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.weatherSettings.city},${this.weatherSettings.country}&appid=${this.weatherSettings.apiKey}&units=metric`);
      const responseData = await response.json();
      return responseData;
    }


}

export default Weather;