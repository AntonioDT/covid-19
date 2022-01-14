let COVID_DATA;
let LIST;
$(document).ready(function () {
    LIST = $(".countries-list");
    getStats();
});

async function getStats() {
    fetch("https://covid-193.p.rapidapi.com/statistics", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "5dccc42600msh9ca2f3f963abe4bp1ba140jsnec925ab45d7e"
        }
    })
    .then(response => response.json())
    .then(response => {
        COVID_DATA = parseResponse(response);
        console.log(COVID_DATA);
        buildSelection();
    })
    .catch(err => {
        console.error(err);
    });
}

function parseResponse(response) {
    let data = [];
    response.response.forEach(item => {
        if (data.length) {
           let foundContinent = data.find(el => el.name === item.continent);
           if (foundContinent) {
                foundContinent.countries.push(item);
           } else {
               if (item.continent) {
                    data = createContinent(data,item);
               } else {
                    let others = data.find(el => el.name === "Others");
                    if (others) {
                        others.countries.push(item);
                    } else {
                        data = createContinent(data,item);
                    }
               }
           }
        } else {
            data = createContinent(data,item);
        }
       
    });
    return data;
}

function createContinent(data, item) {
    let continent = {
        name: item.continent ? item.continent : "Others",
        countries: [item]
    };
    data.push(continent);
    return data;
}

function selectContinent(e) {
    let defaultOption = $("#default");
    defaultOption.remove();
    let continentSelected = e.target.value;
    buildList(continentSelected);
    let filterInput = $(".filter");
    filterInput.removeClass("hidden");
    document.getElementsByTagName("input")[0].value = "";
}

function buildSelection() {
    let select = $('.selection').find("select");
    let options = COVID_DATA.map(el => {
        return el.name;
    });
    
    let defaultOption = document.createElement("option");
    $(defaultOption).attr("value", "Select a continent");
    $(defaultOption).attr("id", "default");
    $(defaultOption).text("Select a continent");
    select.append(defaultOption);
    options.forEach(opt => {
        let option = document.createElement("option");
        $(option).attr("value", opt);
        $(option).text(opt);
        select.append(option);
    });
    
}

function buildList(continent) {
    LIST.empty();
    COVID_DATA.forEach(element => {
        if (element.name === continent) {
            element.countries = sortByCountryName(element.countries);
            element.countries.forEach(country => {
                if (country.country !== continent) {
                    buildElement(country);
                }
            });
        }
    });
}

function buildElement(country) {
    let li = document.createElement("li");
    $(li).addClass("country")
    let title = document.createElement("h3");
    $(title).addClass("name")
    title.innerHTML = country.country;
    li.appendChild(title);
    let day = document.createElement("div");
    $(day).addClass("day");
    $(day).text(country.day ? country.day : "");
    li.appendChild(day);
    let divStats = document.createElement("div");
    $(divStats).addClass("stats-body flex flex-between");
    let divCases = document.createElement("div");
    $(divCases).addClass("cases");
    let casesTitle = document.createElement("h3");
    $(casesTitle).text("CASI");
    divCases.appendChild(casesTitle);
    for (let i = 0; i < 3; i++) {
        let p = document.createElement("p");
        switch(i) {
            case 0:
                p.innerHTML = "Nuovi: " + (country.cases.new ? country.cases.new : 0);
                break;
            case 1:
                p.innerHTML = "Ricoverati: " + (country.cases.recovered ? country.cases.recovered : 0);
                break;
            default:
                p.innerHTML = "Totale: " + (country.cases.total ? country.cases.total : 0);
                break;
        }
        divCases.appendChild(p);
    }
    divStats.appendChild(divCases);
    let divDeaths = document.createElement("div");
    $(divDeaths).addClass("deaths");
    let deathsTitle = document.createElement("h3");
    $(deathsTitle).text("MORTI");
    divDeaths.appendChild(deathsTitle);
    for (let i = 0; i < 2; i++) {
        let p = document.createElement("p");
        switch(i) {
            case 0:
                p.innerHTML = "Nuovi: " + (country.deaths.new ? country.deaths.new : 0);
                break;
            case 1:
                p.innerHTML = "Totale: " + (country.deaths.total ? country.deaths.total : 0);
                break;
        }
        divDeaths.appendChild(p);
    }
    divStats.appendChild(divDeaths);
    li.appendChild(divStats);
    LIST.append(li);
}

function sortByCountryName(countries) {
    countries.sort(function(countryA, countryB){
        let nameA = countryA.country.toUpperCase();
        let nameB = countryB.country.toUpperCase();
        if (nameA <= nameB) {
            return -1;
        } else
            return 1;
    });
    return countries;
}


