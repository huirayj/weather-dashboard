const searchBtnEle = document.querySelector('.search-btn');
const clearBtnEle = document.querySelector('.clear-btn')
const inputEle = document.querySelector('.search-box');
const ulEle = document.querySelector('ul');
const liEle = document.querySelector('li');

const dateEle = document.querySelector('#date');
const mainEle = document.querySelector('main');
const articleEle = document.querySelector('article');

const cityNameEle = document.querySelector('#cityName');
const mainTempEle = document.querySelector('#temp-main');
const mainWindEle = document.querySelector('#wind-main');
const mainHumidEle = document.querySelector('#humid-main');
const mainUviEle = document.querySelector('#uvi-main');
const mainIconEle = document.querySelector('#icon-main');

const currentDate = new Date();
let cityList = JSON.parse(localStorage.getItem('cityList')) || [];

const submitHandler = (e) => {
    e.preventDefault;

    let cityName = capitalize(inputEle.value.trim());
    const liEle = document.createElement('li');

    if (cityName && !cityList.includes(cityName)) {
        cityNameEle.textContent = cityName;
        liEle.textContent = cityName;
        ulEle.appendChild(liEle);

        cityList.push(cityName);
        cityList = [...new Set(cityList)];

        mainEle.classList.remove('hidden');
        articleEle.classList.remove('hidden');
        clearBtnEle.classList.remove('hidden');

        localStorage.setItem('cityList', JSON.stringify(cityList));

        getWeatherData(cityName);
        getWeatherFiveData(cityName);
    }
}

const getWeatherData = (cityName) => {
    const key = '4f728aead6452710e67cf962fa16f0bb';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => {
            let lat = weatherData.coord.lat;
            let lon = weatherData.coord.lon;
            let apiUrlOne = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={minutely, hourly}&appid=${key}`;

            fetch(apiUrlOne)
                .then(response => response.json())
                .then(weatherDataOne => renderWeatherMain(weatherDataOne))
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
}

const getWeatherFiveData = (cityName) => {
    const key = '4f728aead6452710e67cf962fa16f0bb';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${key}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => renderWeatherFive(weatherData))
        .catch(error => console.log(error));
}

const renderWeatherMain = (weatherData) => {
    const current = weatherData.current;
    const temp = Math.round(current.temp);
    const humid = current.humidity;
    const wind = current.wind_speed;
    const uvi = current.uvi;
    const icon = current.weather[0].icon;

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
        const icon = weatherNoon[i].weather[0].icon;
        const nextDay = new Date()
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

const renderTodoList = () => {
    ulEle.innerHTML = '';
    let str = '';
    cityList.forEach(item => {
        str += `<li>${item}</li>`
    });
    ulEle.innerHTML = str;
}

window.onload = () => {
    setCurrentDate();
    renderTodoList();
};
searchBtnEle.addEventListener('click', submitHandler);
clearBtnEle.addEventListener('click', clearList);
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        let cityName = e.target.textContent;
        cityNameEle.textContent = cityName;

        mainEle.classList.remove('hidden');
        articleEle.classList.remove('hidden');

        getWeatherData(cityName);
        getWeatherFiveData(cityName);
    }
});

