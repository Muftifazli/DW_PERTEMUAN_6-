const apiKey = '1bbf392f3d574a7498f23111241510'; // API key Anda
const city = 'Jakarta';

// URL API WeatherAPI
const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

// Fungsi untuk menampilkan pesan error
function displayError(message) {
    document.getElementById('current-weather').innerHTML = `<p>${message}</p>`;
    document.getElementById('weather-forecast').innerHTML = `<p>Ramalan cuaca tidak dapat ditampilkan.</p>`;
}

// Fungsi untuk mengambil data cuaca dari API
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Debugging untuk melihat data API

        const currentWeatherDiv = document.getElementById('current-weather');
        const currentWeather = data.current;

        // Cek apakah cuaca cerah
        const isSunny = currentWeather.condition.text.toLowerCase().includes('sunny');

        currentWeatherDiv.innerHTML = `
            <h2>Cuaca Hari Ini</h2>
            ${isSunny ? `<img src="./images/sun.png" alt="Sunny" class="weather-icon sun-icon">` : ''}
            <img src="https:${currentWeather.condition.icon}" 
                 alt="${currentWeather.condition.text}" 
                 class="weather-icon">
            <p>Suhu: ${currentWeather.temp_c}°C</p>
            <p>Deskripsi: ${currentWeather.condition.text}</p>
            <p>Kecepatan Angin: ${currentWeather.wind_kph} km/h</p>
            <p>Kelembapan: ${currentWeather.humidity}%</p>
        `;

        const forecastDiv = document.getElementById('weather-forecast');
        let forecastHTML = '';

        data.forecast.forecastday.forEach((day) => {
            const date = new Date(day.date);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('id-ID', options);

            const isForecastSunny = day.day.condition.text.toLowerCase().includes('sunny');

            forecastHTML += `
                <div class="day">
                    <h4>${formattedDate}</h4>
                    ${isForecastSunny ? `<img src="./images/sun.png" alt="Sunny" class="weather-icon sun-icon">` : ''}
                    <img src="https:${day.day.condition.icon}" 
                         alt="${day.day.condition.text}" 
                         class="weather-icon">
                    <p>Suhu Siang: ${day.day.maxtemp_c}°C</p>
                    <p>Suhu Malam: ${day.day.mintemp_c}°C</p>
                    <p>Cuaca: ${day.day.condition.text}</p>
                </div>
            `;
        });

        forecastDiv.innerHTML = forecastHTML;
    })
    .catch(error => {
        console.error('Error:', error);
        displayError('Terjadi kesalahan saat mengambil data cuaca. Silakan coba lagi nanti.');
    });
