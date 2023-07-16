// Function to fetch data/meals from api
const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// Configure local storage for favourite items
const dbObjectFavList = "favouriteMealList";
if (localStorage.getItem(dbObjectFavList) == null) {
    localStorage.setItem(dbObjectFavList, JSON.stringify([]));
}


// Checks if ID is in the Favourite list
function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
            break;
        }
    }
    return res;
}

// Function to update the counter of Favourite items when the item is added or removed from Favourite list
function updateFavCounter(){
    const favCounter = document.getElementById('total-counter');
    const favItemArray = JSON.parse(localStorage.getItem(dbObjectFavList));
    if(favCounter.innerText != null){
        favCounter.innerText = favItemArray.length;
    }
}

function addRemoveToFavList(id) {
    let db = JSON.parse(localStorage.getItem(dbObjectFavList));
    console.log(db);
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;
            break;
        }

    } 
    
    if (ifExist) {
        db.splice(db.indexOf(id), 1);

    } else {
        db.push(id);
    }

    localStorage.setItem(dbObjectFavList, JSON.stringify(db));

    updateFavCounter();
    showFavMealList();
    showMealList();
}


// To Show List of Favourite Meals
async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> 
                <h1> Nothing To Show.....</h1> 
                </div>`
    } 
    else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item" onclick="showMealDetails(${element.idMeal},'${generateOneCharString()}')">

            
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                            ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}


// Function to show the count of Number of Favourite items on the Home page
const favCount = function (){
    var count = document.getElementById('total-counter');
    var favItemArray = JSON.parse(localStorage.getItem(dbObjectFavList));
    if(count.innerText != null){
        count.innerText = favItemArray.length;
    }
}();


// It returns truncated string greater than 50
function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + "..." : str;
}

// Function to show Meals based on search
async function showMealList() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const inputValue = document.getElementById("search-input").value;
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealsData = await fetchMealsFromApi(url, inputValue);
    let html = '';
    if (mealsData.meals) {
        html = mealsData.meals.map(element => {

                return `
                    <div class="card">

                        <a href="mealDetail.html?itemId=${element.idMeal}" target="_blank">
                            <div class="card-top">
                                <div class="dish-photo" >
                                    <img src="${element.strMealThumb}" alt="Image of the Meal">
                                </div>
                                
                                <div class="dish-details">
                                    <h4>${element.strMeal}</h4>
                                    ${truncate(element.strInstructions, 50)}
                                    <span>Know More</span>
                                </div>
                            </div>
                        </a>

                        <div class="card-bottom">
                            <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " onclick="addRemoveToFavList(${element.idMeal})"></i>
                        </div>
                    </div>
                `
                }).join('');

        document.getElementById('cards-holder').innerHTML = html;
    }
}

