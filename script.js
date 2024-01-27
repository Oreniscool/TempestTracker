const cardInfo = (function(){
    const addToday = (currentDetails,dayDetails) => {
        create("Wind",currentDetails.wind_kph,"km/h",`<i class="fa-solid fa-wind"></i>`,getDir(currentDetails.wind_dir),'wind');
        create("Humidity",`${currentDetails.humidity}%`,'','','','humidity');
        create("Feels like",currentDetails.feelslike_c,'°C',`<i class="fa-solid fa-temperature-half"></i>`,'','real-feel');
        create("UV Index",currentDetails.uv,'','',getUVReading(currentDetails.uv),'uv-index');
        create("Pressure",currentDetails.pressure_mb,'mb','','','pressure');
        create("Chance of rain",`${dayDetails.day.daily_chance_of_rain}%`,'',`<i class="fa-solid fa-droplet"></i>`,'','chance-of-rain');
        tempRange(dayDetails.day);
        riseSet("Sun", dayDetails.astro.sunrise, dayDetails.astro.sunset,'','sun');
        riseSet("Moon", dayDetails.astro.moonrise, dayDetails.astro.moonset,'','moon');
    }
    const addTomorrow = (dayDetails) => {
        create("Wind",dayDetails.day.maxwind_kph,"km/h",`<i class="fa-solid fa-wind"></i>`,'','wind');
        create("Humidity",`${dayDetails.day.avghumidity}%`,'','','','humidity');
        create("Average temperature",dayDetails.day.avgtemp_c,'°C',`<i class="fa-solid fa-temperature-half"></i>`,'','real-feel');
        create("UV Index",dayDetails.day.uv,'','',getUVReading(dayDetails.day.uv),'uv-index');
        create("Average Pressure",getAvgPressure(dayDetails.hour),'mb','','','pressure');
        create("Chance of rain",`${dayDetails.day.daily_chance_of_rain}%`,'',`<i class="fa-solid fa-droplet"></i>`,'','chance-of-rain');
        tempRange(dayDetails.day);
        riseSet("Sun", dayDetails.astro.sunrise, dayDetails.astro.sunset,'','sun');
        riseSet("Moon", dayDetails.astro.moonrise, dayDetails.astro.moonset,'','moon');
    }
    const create = (titleText,number,unit,iconImage,footer,classTag) => {
        const card = document.querySelector(`.${classTag}`);
        const cardChildren = card.children;
        const title = cardChildren[0];
        const content = cardChildren[1];
        const subText = cardChildren[2];
        content.textContent='';
        const details = document.createElement('div');
        const icon = document.createElement('div');
        
        icon.classList.add('card-icon');

        title.textContent=titleText;
        details.textContent=`${number} ${unit}`;
        icon.innerHTML=iconImage;
        subText.textContent=footer;

        content.append(details,icon);
    }
    const tempRange = (day) => {
        const card = document.querySelector(`.temp-range`);
        const cardChildren = card.children;
        const title = cardChildren[0];
        const content = cardChildren[1];
        content.textContent='';
        const max = document.createElement('div');
        const min = document.createElement('div');
        const details = document.createElement('div');

        details.classList.add('details');
        max.classList.add('maxmin');
        min.classList.add('maxmin');

        title.textContent='Temperature range';
        max.innerHTML=`<i class="fa-solid fa-temperature-arrow-up"></i> <span>${day.maxtemp_c}</span> <span style="font-size:1rem;">°C</span>`;
        min.innerHTML=`<i class="fa-solid fa-temperature-arrow-down"></i> <span>${day.mintemp_c}</span> <span style="font-size:1rem;">°C</span>`;

        details.append(max,min);
        content.appendChild(details);
    }
    const riseSet = (titleText,riseTime,setTime,footer,classTag) => {
        const card = document.querySelector(`.${classTag}`);
        const cardChildren = card.children;
        const title = cardChildren[0];
        const content = cardChildren[1];
        const subText = cardChildren[2];
        content.textContent='';
        const rise = document.createElement('div');
        const set = document.createElement('div');
        const details = document.createElement('div');

        details.classList.add('details');
        rise.classList.add('rise-set-info');
        set.classList.add('rise-set-info');

        title.textContent=titleText;
        rise.innerHTML=`<span style="font-size:1rem; color: var(--text-100);">Rise</span><span>${riseTime}</span>`;
        set.innerHTML=`<span style="font-size:1rem; color: var(--text-100);">Set</span><span>${setTime}</span>`;
        subText.textContent=footer;

        details.append(rise,set);
        content.append(details,footer);        
    }
    const getDir = (code) => {
        if(code=='N') {
            return "North";
        }
        else if(code=='NE') {
            return "North East";
        }
        else if(code=='E') {
            return "East";
        }
        else if(code=='SE') {
            return "South East";
        }
        else if(code=='S') {
            return "South";
        }
        else if(code=='SW') {
            return "South West";
        }
        else if(code=='W') {
            return "West";
        }
        else if(code=='NW') {
            return "North West";
        }
        return code;
    }
    const getUVReading = (uv) => {
        if(uv>=11) {
            return "Extreme";
        }
        else if(uv>=8) {
            return "Very High";
        }
        else if(uv>=6) {
            return "High";
        }
        else if(uv>=3) {
            return "Moderate";
        }
        else if(uv>=1) {
            return "Low";
        }
        return "Incorrect reading";
    }
    const getAvgPressure = (hourData) => {
        let avgPressure=0;
        hourData.forEach((hour)=>{
            avgPressure+=hour.pressure_mb;
        })
        return Math.round(avgPressure/hourData.length);
    }
    
    return {addToday, addTomorrow};
})();


const cardGrid = (function() {
    const infoElements = ["wind", "humidity", "real-feel", "uv-index", "pressure", "chance-of-rain", "temp-range","sun","moon"];
    const create = (currentDetails,dayDetails) => {
        const grid = document.querySelector('.card-grid');
        grid.textContent='';
        for(let i=0;i<9;i++) {
            createCard(grid,infoElements[i]);
        }
        cardInfo.addToday(currentDetails,dayDetails);
    }
    
    const createCard = (grid, cardClass) => {
        const card = document.createElement('div');
        const title = document.createElement('div');
        const content = document.createElement('div');
        const subText = document.createElement('div');
        
        //adding classes
        card.classList.add('card');
        card.classList.add(cardClass);
        title.classList.add('card-title');
        content.classList.add('card-content');
        subText.classList.add('card-sub-text');

        //appending
        card.append(title,content,subText);
        grid.appendChild(card);
    }
    return {create}
})();



const cityInput = document.querySelector('.city-input');
const citySearch = document.querySelector('.city-search');


async function getForecast(city,days) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=4b981c0db24644f78cc160529242301&q=${city}&days=${days}`, {mode: 'cors'});
    const forecastData = await response.json();
    return forecastData;
}

const setValues = (forecastData) => {
    const currentDetails=forecastData.current;
    const locationDetails=forecastData.location;
    const dayDetails=forecastData.forecast.forecastday[0];

    setWeatherDetails(currentDetails);
    setLocationDetails(locationDetails);
    cardGrid.create(currentDetails,dayDetails);
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
    getForecast(cityInput.value,2)
       .then(function(fulfill){
            setValues(fulfill);
            daySelector.add(fulfill);
            daySelector.removeSelected();
            document.querySelector('.today').classList.add('selected');
            removeError();
        })
        .catch((err)=>{
            console.error(err);
            indicateError();
        });
    }
    e.preventDefault();
})



const daySelector = (function() {
    const add = (forecastData) => {
        const options = Array.from(document.getElementsByClassName('option'));
        options.forEach(option => {
            option.addEventListener('click', ()=>{
                changeDay(option.classList[0],forecastData);
                removeSelected();
                option.classList.add('selected');
            })
        });
    }
    const changeDay = (option,forecastData) => {
        if(option=='today') {
            //change info to today
            cardInfo.addToday(forecastData.current,forecastData.forecast.forecastday[0]);
        }
        else if (option=='tomorrow') {
            //change info to tomorrow
            cardInfo.addTomorrow(forecastData.forecast.forecastday[1]);
        }   

    }
    
    const removeSelected = () => {
        const options = Array.from(document.getElementsByClassName('option'));
        options.forEach(option => {
            option.classList.remove('selected');
        });
    }
    return {add,removeSelected};
})();

getForecast("Mumbai",2)
.then(function(fulfill){
    setValues(fulfill);
    daySelector.add(fulfill);
    removeError();
})
.catch((err)=>{
    console.error(err);
    indicateError();
});