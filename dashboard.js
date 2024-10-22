const weatherDataContainer = document.querySelector('.weather-data .container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');

const barChartCtx = document.getElementById('barChart').getContext('2d');
const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
const lineChartCtx = document.getElementById('lineChart').getContext('2d');

let barChart = new Chart(barChartCtx, {
    type: 'bar',
    data: {
        labels: [], // Labels for 5 days
        datasets: [{
            label: 'Temperature',
            data: [], // Data will be populated later
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        animation: {
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !context.dropped) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    context.dropped = true;
                }
                return delay;
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 50
            }
        }
    }
});


let doughnutChart = new Chart(doughnutChartCtx, {
    type: 'doughnut',
    data: {
        labels: [], // Weather conditions
        datasets: [{
            label: 'Weather Conditions',
            data: [], // Data will be populated later
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        animation: {
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !context.dropped) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    context.dropped = true;
                }
                return delay;
            }
        }
    }
});


let lineChart = new Chart(lineChartCtx, {
    type: 'line',
    data: {
        labels: [], // Dates for 5 days
        datasets: [{
            label: 'Temperature',
            data: [], // Data will be populated later
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        animation: {
            onComplete: () => { }, // You can handle additional logic after completion
            duration: 1000, // Animation duration
            easing: 'easeOutBounce', // Easing for the drop effect
            y: {
                from: 0 // Animate from y = 0 for a drop effect
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 50
            }
        }
    }
});


search.addEventListener('click', () => {
    const APIKey = '677e3f3459429522174489f92e9ffc02';
    const searchInput = document.querySelector('.search-box input').value;

    if (searchInput === '') {
        return;
    }

    // Fetch 5-day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            const weatherImage = document.querySelector('.weather-box img');
            const weatherTemprature = document.querySelector('.weather-box .temperature');
            const weatherDescription = document.querySelector('.weather-box .description');
            const weatherHumidity = document.querySelector('.weather-details .humidity span');
            const weatherWind = document.querySelector('.weather-details .wind span');

            // Get weather for today
            const todayWeather = json.list[0];
            weatherTemprature.innerHTML = `${parseInt(todayWeather.main.temp)}<span>°C</span>`;
            weatherDescription.innerHTML = `${todayWeather.weather[0].description}`;
            weatherHumidity.innerHTML = `${todayWeather.main.humidity}%`;
            weatherWind.innerHTML = `${todayWeather.wind.speed} Km/h`;

            switch (todayWeather.weather[0].main) {
                case 'Clear':
                    weatherImage.src = 'Resources/sun.png';
                    break;
                case 'Rain':
                    weatherImage.src = 'Resources/rain.png';
                    break;
                case 'Snow':
                    weatherImage.src = 'Resources/snow.png';
                    break;
                case 'Clouds':
                    weatherImage.src = 'Resources/cloudy.png';
                    break;
                case 'Mist':
                case 'Haze':
                    weatherImage.src = 'Resources/mist.png';
                    break;
                default:
                    weatherImage.src = 'Resources/cloudy.png';
                    break;
            }

            // Extract temperatures and weather conditions for the next 5 days
            let dailyTemps = [];
            let weatherConditions = {};
            let days = [];

            // Iterate through the forecast data (every 3 hours) and pick one data point per day
            for (let i = 0; i < json.list.length; i += 8) { // 8 data points (3 hours each) in a day
                let dayData = json.list[i];
                let date = new Date(dayData.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });

                dailyTemps.push(dayData.main.temp);
                days.push(date);

                let condition = dayData.weather[0].main;
                weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
            }

            // Update Bar Chart (Daily Temperatures)
            barChart.data.labels = days;
            barChart.data.datasets[0].data = dailyTemps;
            barChart.update();

            // Update Doughnut Chart (Weather Conditions Percentage)
            doughnutChart.data.labels = Object.keys(weatherConditions);
            doughnutChart.data.datasets[0].data = Object.values(weatherConditions);
            doughnutChart.update();

            // Update Line Chart (Daily Temperatures)
            lineChart.data.labels = days;
            lineChart.data.datasets[0].data = dailyTemps;
            lineChart.update();
        })
        .catch(err => console.error('Error fetching weather data:', err));
});
