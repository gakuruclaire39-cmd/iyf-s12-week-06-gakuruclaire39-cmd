# Week 06: Asynchronous JavaScript - Weather Dashboard

## Author
- **Name:** Claire Gakuru
- **GitHub:** [@gakuruclaire39-cmd](https://github.com/gakuruclaire39-cmd)
- **Date:** November 11, 2026

## Project Description
For this week I had to learn async javascript. It was about callbacks, promises, async/await and fetch API. The main project was to build a weather dashboard using OpenWeatherMap API. You type a city and it shows you the weather. I also did the other small tasks like user directory with JSONPlaceholder. At first async was confusing but after practicing it made sense.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Fetch API
- OpenWeatherMap API
- JSONPlaceholder API for practice tasks

## Features
- Weather Dashboard that shows real weather for any city
- Shows temperature, feels like, humidity, wind, pressure, description and icon
- Search form with loading and error messages
- Handles errors like city not found and network error
- Recent searches saved in localStorage (last 5)
- Click on recent city to search again
- For the async tasks: callback hell example, promise chaining, Promise.all, Promise.race, async/await
- User directory page with search, sort A-Z, filter by city
- Form to create post using POST request

## How to Run
1. Clone this repo: git clone https://github.com/gakuruclaire39-cmd/iyf-s12-week-06-gakuruclaire39-cmd.git
2. You need a free API key from OpenWeatherMap - sign up on openweathermap.org
3. Copy config.example.js to config.js - `cp config.example.js config.js`
4. Open config.js and paste your API key inside: const API_KEY = "your_key_here"
5. config.js is git-ignored so it won't go to github, that's how we were told to do
6. Open index.html in browser for weather dashboard
7. Note: for the live version I set OPENWEATHER_API_KEY in repo secrets and used GitHub Actions to create config.js during deploy

## Lessons Learned
I learned difference between synchronous and asynchronous code. setTimeout with 0 still runs after normal code because of event loop. Callbacks get messy fast when nested - that's the pyramid of doom. Promises are better and async/await is even cleaner. I also learned fetch needs you to check response.ok yourself, it doesn't throw on 404. And Promise.all is much faster than awaiting one by one because it runs in parallel. For localStorage you have to use JSON.stringify to save and JSON.parse to load.

## Challenges Faced
I had many errors this week. First I got 401 error from weather API - my key was not activated yet, I had to wait like an hour. Then I got "Cannot set properties of null (innerHTML)" because I used same js file on different html pages and one page didn't have users-container, I fixed it by checking if element exists before using it. Another problem was top-level await SyntaxError, I wrapped it in async main function. For weather icons I had to build url like `https://openweathermap.org/img/wn/${icon}@2x.png`. Also git log was showing my key before, so I removed it and added config.js to .gitignore.

## Live Demo
[View Webpage](https://gakuruclaire39-cmd.github.io/iyf-s12-week-06-gakuruclaire39-cmd/)

[View my async-practice.html](https://gakuruclaire39-cmd.github.io/iyf-s12-week-06-gakuruclaire39-cmd/async-practice.html)
I added this to live demo in order to see my async-practice.js in console and to check fore errors in the code.

I added a fetch-practice.js file for Lessons 12 work since the app.js contains mini project and I did not want to interfere with it.
