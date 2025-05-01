import Weather from "./Weather.js";

class OpenWeatherMap extends Weather {
    constructor(settings) {
        super(settings);
        this.baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    }

    async getWeather() {
        const url = `${this.baseUrl}?q=${this.settings.city}&appid=${this.settings.apiKey}&units=metric`;
        const data = await this.fetchData(url);
        return this.formatData(data);
    }

    formatData(data) {
        return {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            description: data.weather[0].description,
            windSpeed: data.wind.speed,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            icon: data.weather[0].icon
        };
    }
}

export default OpenWeatherMap;