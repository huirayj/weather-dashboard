const searchBtnEle = document.querySelector('.search-btn');
const clearBtnEle = document.querySelector('.clear-btn')
const ulEle = document.querySelector('ul');
const liEle = document.querySelector('li');
const cityNameEle = document.querySelector('#cityName');
const dateEle = document.querySelector('#date');
const inputEle = document.querySelector('.search-box');
const userFormEle = document.querySelector('.index-search-form');
const mainEle = document.querySelector('main');
const articleEle = document.querySelector('article');

const mainTempEle = document.querySelector('#temp-main');
const mainWindEle = document.querySelector('#wind-main');
const mainHumidEle = document.querySelector('#humid-main');
const mainUviEle = document.querySelector('#uvi-main');
const mainIconEle = document.querySelector('#icon-main');

let currentDate = new Date();
let cityList = [];

const getWeatherData = (cityName) => {
    let key = '4f728aead6452710e67cf962fa16f0bb';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => {
            let lat = weatherData.coord.lat;
            let lon = weatherData.coord.lon;
            let apiUrlOne = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={minutely, hourly}&appid=${key}`;

            fetch(apiUrlOne)
                .then(response => response.json())
                .then(weatherDataOne => {
                    renderWeatherMain(weatherDataOne);
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
}

const getWeatherFiveData = (cityName) => {
    let key = '4f728aead6452710e67cf962fa16f0bb';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${key}`;
    console.log(apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => {
            renderWeatherFive(weatherData);
        })
        .catch(error => console.log(error));
}

const submitHandler = (e) => {
    e.preventDefault;

    let cityName = capitalize(inputEle.value.trim());
    const liEle = document.createElement('li');

    mainEle.classList.remove('hidden');
    articleEle.classList.remove('hidden');

    if (cityName && !cityList.includes(cityName)) {
        cityNameEle.textContent = cityName;
        ulEle.appendChild(liEle);
        liEle.textContent = cityName;
        cityList.push(cityName);
        clearBtnEle.classList.remove('hidden');

        getWeatherData(cityName);
        getWeatherFiveData(cityName);
    }
}

const renderWeatherMain = (weatherData) => {
    let current = weatherData.current;
    let temp = Math.round(current.temp);
    let humid = current.humidity;
    let wind = current.wind_speed;
    let uvi = current.uvi;
    let icon = current.weather[0].icon;

    mainTempEle.textContent = `Temp: ${temp} °F`;
    mainHumidEle.textContent = `Humidity: ${humid}%`;
    mainWindEle.textContent = `Wind: ${wind} mph`;
    mainUviEle.append(document.createElement('span'));
    document.querySelector('span').textContent = uvi;
    document.querySelector('span').classList.add(checkUviColor(uvi));
    mainIconEle.setAttribute('src', `./assets/images/icons/${icon}.svg`);
}

const renderWeatherFive = (weatherData) => {
    let weatherNoon = weatherData.list.filter(item => item.dt_txt.includes('12:00:00'));

    for (let i = 0; i < 5; i++) {
        let icon = weatherNoon[i].weather[0].icon;
        let nextDay = new Date()
        nextDay.setDate(currentDate.getDate() + i + 1);

        document.querySelector(`#date-${i}`).textContent = nextDay.toDateString();
        document.querySelector(`#icon-${i}`).setAttribute('src', `./assets/images/icons/${icon}.svg`);
        document.querySelector(`#temp-${i}`).textContent = `Temp: ${weatherNoon[i].main.temp} °F`;
        document.querySelector(`#humid-${i}`).textContent = `Humidity: ${weatherNoon[i].main.humidity}%`;
    }
}

const checkUviColor = (uvi) => {
    switch (true) {
        case uvi <= 2:
            return 'low';
            break;
        case uvi > 2 && uvi < 6:
            return 'moderate';
            break;
        case uvi >= 6 && uvi < 8:
            return 'high';
            break;
        case uvi >= 8:
            return 'veryHigh';
            break;
        default:
            return '';
            break;
    }
}

const setCurrentDate = () => {
    dateEle.textContent = currentDate.toDateString();
}

const capitalize = (str) => str && str[0].toUpperCase() + str.slice(1);

const clearList = () => {
    cityList = [];
    ulEle.innerHTML = '';
    clearBtnEle.classList.add('hidden');
    mainEle.classList.add('hidden');
    articleEle.classList.add('hidden');
}

window.onload = setCurrentDate;
searchBtnEle.addEventListener('click', submitHandler);
clearBtnEle.addEventListener('click', clearList);
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        let cityName = e.target.textContent;

        cityNameEle.textContent = cityName;

        getWeatherData(cityName);
        getWeatherFiveData(cityName);
    }
});
