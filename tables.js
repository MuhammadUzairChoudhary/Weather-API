const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const weatherTable = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumberDisplay = document.getElementById('pageNumber');

let forecastData = []; // Store fetched weather data
let currentPage = 1; // Track the current page
const entriesPerPage = 10; // Number of entries per page


document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("#weatherTable tbody");

    const observer = new MutationObserver(() => {
        const rows = table.querySelectorAll("tr");
        let weatherData = [];

        rows.forEach((row, index) => {
            const day = row.cells[0]?.innerText?.trim();
            const time = row.cells[1]?.innerText?.trim();
            const temp = row.cells[2]?.innerText?.trim();
            const weather = row.cells[3]?.innerText?.trim();
            const humidity = row.cells[4]?.innerText?.trim();

            if (day && time && temp && weather && humidity) {
                weatherData.push({ day, time, temp, weather, humidity });
            } else {
                console.warn(`Incomplete data in row ${index + 1}`);
            }
        });

        // Log the table data to ensure it's being correctly updated
        console.log("Weather data extracted:", weatherData);
    });

    observer.observe(table, { childList: true, subtree: true });
});

async function askChatbot(userQuery) {
    const query = userQuery.toLowerCase();

    // Extract the date from the user's query
    const dateRegex = /(\d{2}\/\d{2}\/\d{4})/;
    const dateMatch = query.match(dateRegex);

    if (query.includes("weather") || query.includes("temperature") || query.includes("humidity")) {
        let response = "I couldn't retrieve any weather data for the provided date.";

        if (dateMatch && weatherData.length > 0) {
            const queryDate = dateMatch[0];  // Get the date from the query
            const filteredData = weatherData.filter(entry => entry.day === queryDate);

            // If data is found for the query date
            if (filteredData.length > 0) {
                response = `Here is the weather information for ${queryDate}:\n\n`;
                filteredData.forEach(entry => {
                    response += `At ${entry.time}, the temperature was ${entry.temp}°C. The weather was ${entry.weather} with a humidity of ${entry.humidity}%. \n`;
                });
            } else {
                response = `I couldn't find any weather information for ${queryDate}.`;
            }
        }
        return response;
    } 
    // Handle non-weather related queries with Gemini API
    else {
        const geminiResponse = await fetch("https://api.gemini.com/v1/query", {
            method: "POST",
            headers: {
                "Authorization": `Bearer AIzaSyBEOajMAbOHzxcWYVnCHnULS_NNFpunFCY`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: userQuery }),
        });

        const data = await geminiResponse.json();
        const chatbotAnswer = data.response;

        if (chatbotAnswer.includes("not related") || chatbotAnswer.includes("unable to help")) {
            return "I am only able to answer table-related queries at this moment.";
        }

        return chatbotAnswer;
    }
}

document.getElementById("askButton").addEventListener("click", async () => {
    const userQuery = document.getElementById("userQuery").value;
    const answerArea = document.getElementById("chatbotAnswer");

    if (userQuery.trim()) {
        answerArea.innerHTML = "Thinking...";

        const response = await askChatbot(userQuery);
        answerArea.innerHTML = response;
    }
});


// Custom weather icons mapping
const customIcons = {
    "light rain": "Resources/rain.png",
    "overcast clouds": "Resources/cloudy.png",
    "moderate rain": "Resources/rain.png",
    "clear sky": "Resources/sun.png",
    "few clouds": "Resources/cloudy.png",
    "scattered clouds": "Resources/cloudy.png",
    "broken clouds": "Resources/cloudy.png",
    "shower rain": "Resources/rain.png",
    "rain": "Resources/rain.png",
    "thunderstorm": "Resources/rain.png",
    "snow": "Resources/snow.png",
    "mist": "Resources/mist.png"
};

// Add event listener to the search button to fetch data
searchButton.addEventListener('click', () => {
    const city = searchInput.value;

    if (city !== '') {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=677e3f3459429522174489f92e9ffc02`)
            .then(response => response.json())
            .then(data => {
                forecastData = processForecastData(data.list); // Process the data with date and time
                currentPage = 1; // Reset to the first page
                updateTable(); // Update the table with the first 10 entries
                updatePagination(); // Update pagination buttons
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    } else {
        alert('Please enter a city name.');
    }
});

// Function to process the forecast data and include both date and time in each entry
function processForecastData(data) {
    return data.map(entry => {
        const dateTime = new Date(entry.dt * 1000); // Convert to JavaScript Date object
        const date = dateTime.toLocaleDateString(); // Get the date
        const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get the time (hours and minutes)
        const temperature = entry.main.temp; // Current temperature
        const condition = entry.weather[0].description; // Weather condition
        const humidity = entry.main.humidity; // Humidity

        // Use the custom icon based on the weather condition
        const iconUrl = customIcons[condition] || "Resources/cloudy.png"; // Fallback to a default icon if condition not found

        return {
            date: date,
            time: time,
            temperature: temperature,
            condition: condition,
            humidity: humidity,
            iconUrl: iconUrl // Use the custom icon URL
        };
    });
}

// Function to update the table with the data for the current page
function updateTable() {
    weatherTable.innerHTML = ''; // Clear the previous rows

    const start = (currentPage - 1) * entriesPerPage; // Calculate the start index
    const end = start + entriesPerPage; // Calculate the end index

    const currentEntries = forecastData.slice(start, end); // Get the data for the current page

    currentEntries.forEach(item => {
        const row = weatherTable.insertRow();

        // Insert new cells with data for date, time, temperature, condition, humidity, and icon
        row.insertCell(0).textContent = item.date;
        row.insertCell(1).textContent = item.time;
        row.insertCell(2).textContent = item.temperature + '°C';
        row.insertCell(3).textContent = item.condition;
        row.insertCell(4).textContent = item.humidity + '%';

        // Insert custom weather icon
        const iconCell = row.insertCell(5);
        const weatherIcon = document.createElement('img');
        weatherIcon.src = item.iconUrl; // Set the custom icon source
        weatherIcon.alt = item.condition; // Set alt text for accessibility
        weatherIcon.width = 50; // Set a fixed size for the icon
        weatherIcon.height = 50;
        iconCell.appendChild(weatherIcon); // Append the image to the cell
    });
}

// Function to update pagination buttons
function updatePagination() {
    const totalPages = Math.ceil(forecastData.length / entriesPerPage); // Calculate total pages

    prevPageBtn.disabled = currentPage === 1; // Disable "Previous" button on the first page
    nextPageBtn.disabled = currentPage === totalPages; // Disable "Next" button on the last page
    pageNumberDisplay.textContent = `Page ${currentPage}`; // Update the page number display
}

// Event listener for the "Previous" button
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
        updatePagination();
    }
});

// Event listener for the "Next" button
nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(forecastData.length / entriesPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
        updatePagination();
    }
});



// Fetching the weather data from the table and storing it
let weatherData = [];

document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll("#weatherTable tbody tr");
    rows.forEach(row => {
        const day = row.cells[0].innerText;
        const time = row.cells[1].innerText;
        const temp = row.cells[2].innerText;
        const weather = row.cells[3].innerText;
        const humidity = row.cells[4].innerText;

        weatherData.push({ day, time, temp, weather, humidity });
    });
});

// Function to handle sending query to the Gemini Chatbot API
async function askChatbot(userQuery) {
    const query = userQuery.toLowerCase();

    // Checking if the query is weather-related or related to the table
    if (query.includes("weather") || query.includes("temperature") || query.includes("humidity")) {
        // Return the data from the table related to the weather in dynamic sentences
        let response = "Here is the weather information for the upcoming days:\n\n";

        if (weatherData.length > 0) {
            weatherData.forEach(entry => {
                response += `On ${entry.day} at ${entry.time}, the temperature was ${entry.temp}°C. The weather was ${entry.weather} with a humidity of ${entry.humidity}%. \n`;
            });
        } else {
            response += "I couldn't retrieve any weather data from the table.";
        }

        return response;
    } else if (query.includes("day") || query.includes("time") || query.includes("weather")) {
        // Respond using the table data with a more detailed response
        let found = false;
        for (let entry of weatherData) {
            if (query.includes(entry.day.toLowerCase()) || query.includes(entry.time.toLowerCase())) {
                found = true;
                return `On ${entry.day}, at ${entry.time}, the temperature was ${entry.temp}°C. The weather conditions were ${entry.weather}, with humidity at ${entry.humidity}%.`;
            }
        }
        if (!found) {
            return "I'm sorry, I couldn't find any matching data in the table for that query.";
        }
    } else {
        // If the question is unrelated to the table or weather, send the query to Gemini API
        const geminiResponse = await fetch("https://api.gemini.com/v1/query", {
            method: "POST",
            headers: {
                "Authorization": `Bearer AIzaSyBEOajMAbOHzxcWYVnCHnULS_NNFpunFCY`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: userQuery }),
        });

        const data = await geminiResponse.json();
        const chatbotAnswer = data.response;

        // Check if the answer is outside the scope
        if (chatbotAnswer.includes("not related") || chatbotAnswer.includes("unable to help")) {
            return "I am only able to answer table-related queries at this moment.";
        }

        // Otherwise, return the dynamic response from Gemini
        return chatbotAnswer;
    }
}

// Handling user input and displaying the chatbot response
document.getElementById("askButton").addEventListener("click", async () => {
    const userQuery = document.getElementById("userQuery").value;
    const answerArea = document.getElementById("chatbotAnswer");

    if (userQuery.trim()) {
        answerArea.innerHTML = "Thinking...";

        const response = await askChatbot(userQuery);
        answerArea.innerHTML = response;
    }
});
