'use strict';

const apiKey = '7675276694fb970af08da98b031a5175';
const appID = '0093db1a';
const searchURL = 'https://api.edamam.com/search';

function formatQueryParams(params) { //puts query together
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function filterDietLabel(arrayOfObjects, arrayOfFilters){
  let newArray = arrayOfObjects.filter(function(elementOfArray){
    // the first true or false statement revolves around whether the dietLabels array contains all the elements of arrayOfFilters
    // enter into diet labels array
     let dietFilt = elementOfArray.recipe.dietLabels.filter(function(element){
       return arrayOfFilters.includes(element);
       // look at the arrayOfFilters and see if it inlcudes the element of dietLabels that is focused on
       // if it does not it will filter it out
       // the end result of this function is an array only of the healthLabels elements that can be found in arrayOfFilters
     })
     return dietFilt.length == arrayOfFilters.length;
     // does the length of filtered dietLabels match the length of arrayOfFilters
     // if every time a diet label element isn't seen in the arrayOfFilters, it gets eliminated. Then the length of arrayOfFilters and dietLabels will only be the same if dietLabels includes all the elements of arrayOfFilters
  }) 
  return newArray;
    };

function filterHealthLabel(arrayOfObjects, arrayOfFilters){ // uses the same methodology as filterDietLabel function
  let newArray = arrayOfObjects.filter(function(elementOfArray){

     let healthFilt = elementOfArray.recipe.healthLabels.filter(function(element){
       return arrayOfFilters.includes(element);
     })
     return healthFilt.length == arrayOfFilters.length;
  }) 
  return newArray;
    };

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();
  $('#js-error-message').html("");

  // iterate through the items array
  let dietLabels = Object.values($("input[class='dietLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2; // there are 2 extra elements in this array always
  }).map(e => e.id);
  let healthLabels = Object.values($("input[class='healthLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2;
  }).map(e => e.id);

  if (dietLabels.length || healthLabels.length > 0){ // decide which use-case is needed. dietLabels and healthLabels are in 2 different arrays within the response object even though they look the same to the user
    if (dietLabels.length && healthLabels.length > 0){
      let result = filterHealthLabel(filterDietLabel(responseJson.hits, dietLabels), healthLabels);
      createContent(result);
    } else if (dietLabels.length > 0){
      let result = filterDietLabel(responseJson.hits, dietLabels);
      createContent(result);
    } else {
      let result = filterHealthLabel(responseJson.hits, healthLabels);
      createContent(result);
    }
  } else {
    createContent(responseJson.hits);
  }
};

function createContent(results){ // create content to display on page
  if (results.length != 0){
    for (let i = 0; i < results.length; i++){
      $('#results-list').append(
        `<div class='result'>
          <h4><a href='${results[i].recipe.url}'>${results[i].recipe.label}</a></h4>
          <img class='result-img' src='${results[i].recipe.image}' alt='${results[i].recipe.label} image'>
          <ul class='result-ul'>
            <li>${String(results[i].recipe.ingredientLines).replace(/,/g,'</li><li>').split('</li><li> ').join(', ').split('</li><li>for').join(' for').split('</li><li>chilled').join(' chilled').split('</li><li>well').join(' well')}</li>
          </ul>
        </div><br>`
      )};
  } else {
    $('#results-list').append(
        `<h3>Sorry, no matches were found</h3>`
    );
  }
  
  //display the results section
  $('#results').removeClass('hidden');
}

function getRests(ingredient) { //creates url and uses fetch to get data
  const params = {
    app_key: apiKey,
    app_id: appID,
    q: ingredient,
    to: 100,
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').append(`Oops, something must have gone wrong: wait and try again`);
    });
}

function watchForm() { //gets strings from input once 'search' is pressed
  $('form').submit(event => {
    event.preventDefault();
    const ing = $('#search-term').val();

    getRests(ing);
  });
}

$(watchForm);