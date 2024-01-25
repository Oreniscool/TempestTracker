const cityInput = document.querySelector('.city-input');
const citySearch = document.querySelector('.city-search');

async function getWeather(city) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=4b981c0db24644f78cc160529242301&q=${city}`, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
}

const setValues = (data) => {
    const currentDetails=data.current;
    const locationDetails=data.location;
    console.log(currentDetails,locationDetails);

    setWeatherDetails(currentDetails);
    setLocationDetails(locationDetails);
}

const setWeatherDetails = (currentDetails) => {
    const weatherIcon = document.querySelector('.weather-icon');
    const tempearture = document.querySelector('.temperature');
    const condition = document.querySelector('.condition');
    const timeOfDay = document.querySelector('.time-of-day');
    
    getIcon(currentDetails.condition.code).then(function(fulfill){
        if(currentDetails.is_day==1) {
            weatherIcon.src = `./weatherIcons/day/${fulfill}.svg`;
        }
        else {
            weatherIcon.src = `./weatherIcons/night/${fulfill}.svg`;
        }
    })
    .catch((err)=> {
        console.error(err);
    });
    tempearture.textContent=`${currentDetails.temp_c}°C`;
    condition.textContent=currentDetails.condition.text;
    timeOfDay.textContent=getNightOrDay(currentDetails.is_day);
}

async function getIcon(code) {
    const response = await fetch('./weather_conditions.json');
    const iconData = await response.json();

    for(element of iconData) {
        if(element.code==code) {
            return element.icon;
        }
    }
}

const getNightOrDay = (isDay) => {
    if(isDay==1) {
        return "☀️Day";
    }
    return "😴Night";
}


const setLocationDetails = (locationDetails) => {
    const date = document.querySelector('.date');
    const day = document.querySelector('.day-and-time');
    const locationName = document.querySelector(".place");

    const localTime = new Date(locationDetails.localtime)

    date.textContent=`${localTime.getDate()}-${localTime.getMonth()+1}-${localTime.getFullYear()}`;
    day.textContent=`${getDayOfWeek(localTime.getDay())}`;
    locationName.textContent=`${locationDetails.name}, ${locationDetails.country}`;

}

const getDayOfWeek = (dayNumber) => {
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days[dayNumber];
}

const removeError = () => {
    cityInput.classList.remove('invalid');
}
const indicateError = () => {
    cityInput.classList.add('invalid');
}


citySearch.addEventListener('submit', (e)=> {
    if(!(cityInput.value=="")) {
        getWeather(cityInput.value).then(function(fulfill){
            setValues(fulfill);
            removeError();
        })
        .catch((err)=>{
            console.error(err);
            indicateError();
        })
    }
    e.preventDefault();
})