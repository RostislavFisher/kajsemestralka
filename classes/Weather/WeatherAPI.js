import Weather from "./Weather.js";

class WeatherAPI extends Weather {
    constructor(settings) {
        super(settings);
        this.baseUrl = "https://api.weatherapi.com/v1/current.json";
    }

    async getWeather() {
        const url = `${this.baseUrl}?key=${this.settings.apiKey}&q=${this.settings.city}`;
        const data = await this.fetchData(url);
        return this.formatData(data);
    }

    formatData(data) {
        return {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text,
            windSpeed: data.current.wind_kph,
            icon: data.current.condition.icon
        };
    }
}

export default WeatherAPI;