// Function to fetch data/meals from api
const fetchMealsThroughApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// Configure local storage for favourite items
const favMealDB = "favouriteMealList";
if (localStorage.getItem(favMealDB) == null) {
    localStorage.setItem(favMealDB, JSON.stringify([]));
}


// Function to check if Meal ID is in the Favourite list
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
    const counter = document.getElementById('total-counter');
    const favItemArray = JSON.parse(localStorage.getItem(favMealDB));
    if(counter.innerText != null){
        counter.innerText = favItemArray.length;
    }
}


// Function to add or remove meal from the favourite list/local storage
function addRemoveFromFavList(id) {
    let db = JSON.parse(localStorage.getItem(favMealDB));

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

    localStorage.setItem(favMealDB, JSON.stringify(db));

    updateFavCounter();
    showAllMeals();
}


// Function to show the count of Number of Favourite items on the Home page when the page loads for the first time
const favCount = function (){
    var count = document.getElementById('total-counter');
    var favItemArray = JSON.parse(localStorage.getItem(favMealDB));
    if(count.innerText != null){
        count.innerText = favItemArray.length;
    }
}();


// Function to return truncated string greater than 50
function shortenString(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + "..." : str;
}

// Function to show Meals cards based on search
async function showAllMeals() {
    const list = JSON.parse(localStorage.getItem(favMealDB));
    const inputValue = document.getElementById("search-input").value;
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealsData = await fetchMealsThroughApi(url, inputValue);
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
                                    ${shortenString(element.strInstructions, 50)}
                                    <span>Know More</span>
                                </div>
                            </div>
                        </a>

                        <div class="card-bottom">
                            <i class="fa-solid fa-heart ${isFav(list, element.idMeal)?'active':''} " onclick="addRemoveFromFavList(${element.idMeal})"></i>
                        </div>
                    </div>
                `
                }).join('');

        document.getElementById('cards-holder').innerHTML = html;
    }
}

