Weather Chatbot Web Application
Project Overview
This project is a Weather Chatbot Web Application that allows users to:

Query weather-related data from a dynamically populated weather table.
Use a chatbot powered by the Gemini Chatbot API to answer weather queries.
Handle non-weather related queries using Gemini as a general chatbot API.
The application uses:

OpenWeather API to fetch weather data.
Gemini Chatbot API to respond to non-weather related questions.
Vanilla JavaScript, HTML, and CSS for the frontend user interface.
Features
Dynamic weather data displayed in a table.
Chatbot interface for asking questions.
The chatbot will only answer questions related to the weather data in the table.
If the user asks something unrelated to the weather, the chatbot will respond with: "I am only able to answer table-related queries."
Technology Stack
Frontend: HTML, CSS, JavaScript
Backend API: OpenWeather API, Gemini Chatbot API
Weather API Key: 09443768acf6bf5a1c542fca74f1c41e
Gemini API Key: AIzaSyBEOajMAbOHzxcWYVnCHnULS_NNFpunFCY
Instructions to Run Locally
Prerequisites
Before running the project locally, you will need:

A web browser (Chrome, Firefox, Edge, etc.)
Text editor (Visual Studio Code, Sublime Text, etc.)
Internet connection to fetch API data from OpenWeather and Gemini.
Step 1: Clone the Repository
If you have a GitHub repository, clone the repository to your local machine using the following command:

bash
Copy code
git clone 
Alternatively, download the files as a ZIP, and extract them to a local folder.

Step 2: Set Up Your API Keys
You should already have the OpenWeather API key and Gemini API key.

Replace the OPENWEATHER_API_KEY in the JavaScript file with your key:
javascript
Copy code
const weatherApiKey = '09443768acf6bf5a1c542fca74f1c41e'; // Replace with your key
Replace the GEMINI_API_KEY in the chatbot logic with your key:
javascript
Copy code
const geminiApiKey = 'AIzaSyBEOajMAbOHzxcWYVnCHnULS_NNFpunFCY'; // Replace with your key
Step 3: Open the Project in a Web Browser
Open the project folder in a text editor like Visual Studio Code.
Navigate to the index.html file and double-click it or open it in your preferred web browser.
Alternatively, if you're using Visual Studio Code:

Open the terminal and use the Live Server extension to run the project.
Step 4: Running the Application
Once the project is opened in your browser, the application will work as follows:

Table: The weather table will be populated dynamically with weather data (from static data or through API integration).
Chatbot Interface: At the bottom of the page, you will find a prompt bar and a "Search" button.
You can ask about the weather by entering a query (e.g., "What is the weather on 10/19/2024?").
If the chatbot detects a query about the weather, it will search the weather data table and provide the answer.
If you ask any other questions (outside the scope of weather data), it will respond with: "I am only able to answer table-related queries."
Step 5: Modifying Data
You can modify the weather data inside the HTML table, and the chatbot will dynamically answer based on this data.
How it Works
Weather Table:

The weather data is stored in a table, and this data is accessed dynamically via JavaScript.
When a user enters a query, the application checks the table for the relevant date and time.
Gemini Chatbot API:

For non-weather-related queries, the chatbot uses the Gemini API to process the user's query and return an appropriate response.
Date Matching:

The chatbot extracts the date from the user's query and matches it against the table data. If a match is found, it returns the relevant weather information.
Example Queries
"What is the weather condition on 10/19/2024?"
"What was the temperature on 10/19/2024 at 8:00 AM?"
"What is the humidity on 10/19/2024?"
For non-weather related queries, you can try:

"Tell me a joke."
"What is the capital of Canada?"
The chatbot will only answer the weather-related questions and return: "I am only able to answer table-related queries" for unrelated questions.

Contributing
If you would like to contribute to this project, feel free to fork the repository and submit a pull request with any improvements or fixes.

License
This project is open-source and available under the MIT License. You are free to use and modify the project as per the terms of the license.

Troubleshooting
If you are not getting results from the chatbot, ensure that the table is correctly populated with data, and the date format matches the query.
Make sure your API keys are valid and properly configured.
For further issues, open an issue on the repository or ask a question here.

This README can be customized further depending on the structure and requirements of your project. Let me know if you need any additional details!