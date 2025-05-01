import Weather from "./Weather.js";

class WeatherAPI extends Weather {
    constructor(settings) {
        super(settings);
        this.baseUrl = "https://api.weatherapi.com/v1/current.json";
    }

    async getWeather() {
        const forecastUrl = `${this.baseUrl.replace('current.json', 'forecast.json')}?key=${this.settings.apiKey}&q=${this.settings.city}&days=1`;
        const forecastData = await this.fetchData(forecastUrl);

        const currentUrl = `${this.baseUrl}?key=${this.settings.apiKey}&q=${this.settings.city}`;
        const currentData = await this.fetchData(currentUrl);

        return this.formatData(currentData, forecastData);
    }

    formatData(currentData, forecastData) {
        const astro = forecastData?.forecast?.forecastday[0]?.astro || {};

        const sunriseTime = astro.sunrise ? this.timeStringToTimestamp(astro.sunrise) : 0;
        const sunsetTime = astro.sunset ? this.timeStringToTimestamp(astro.sunset) : 0;

        return {
            temperature: currentData.current.temp_c,
            humidity: currentData.current.humidity,
            description: currentData.current.condition.text,
            windSpeed: currentData.current.wind_kph,
            sunrise: sunriseTime,
            sunset: sunsetTime,
            icon: currentData.current.condition.icon
        };
    }

    timeStringToTimestamp(timeStr) {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const now = new Date();
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        return Math.floor(date.getTime() / 1000);
    }
}

export default WeatherAPI;