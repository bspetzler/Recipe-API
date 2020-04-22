'use strict';
const STORE = {
  apiKey: '7675276694fb970af08da98b031a5175',
  appID: '0093db1a',
  searchURL: 'https://api.edamam.com/search',
  youApiKey: 'AIzaSyA94uYzNGWPFgv_lpJqkJx_2oXup7KGb1w',
  youSearchURL: 'https://www.googleapis.com/youtube/v3/search',
}

function formatQueryParams(params) { //puts query together
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function filterDietLabel(arrayOfObjects, arrayOfFilters){
  const newArray = arrayOfObjects.filter(function(elementOfArray){
    // the first true or false statement revolves around whether the dietLabels array contains all the elements of arrayOfFilters
    // arrayOfFilters is an array of all the available filters possible for diet choices (dietLabels)
    // enter into diet labels array
     const dietFilt = elementOfArray.recipe.dietLabels.filter(function(element){
       return arrayOfFilters.includes(element);
       // look at the arrayOfFilters and see if it inlcudes the element of dietLabels that is focused on
       // if it does not it will filter it out
       // the end result of this function is an array only of the dietLabels elements that can be found in arrayOfFilters
     })
     return dietFilt.length == arrayOfFilters.length;
     // does the length of filtered dietLabels match the length of arrayOfFilters
     // if every time a diet label element isn't seen in the arrayOfFilters, it gets eliminated. Then the length of arrayOfFilters and dietLabels will only be the same if dietLabels includes all the elements of arrayOfFilters
  }) 
  return newArray;
    };

function filterHealthLabel(arrayOfObjects, arrayOfFilters){ // uses the same methodology as filterDietLabel function
  const newArray = arrayOfObjects.filter(function(elementOfArray){

     const healthFilt = elementOfArray.recipe.healthLabels.filter(function(element){
       return arrayOfFilters.includes(element);
     })
     return healthFilt.length == arrayOfFilters.length;
  }) 
  return newArray;
    };

function displayResults(responseJson, responseTubes, dietLabels, healthLabels) {
  // if there are previous results, remove them
  $('#results-list').empty();
  $('#js-error-message').html("");

  // iterate through the items array
  /*const dietLabels = Object.values($("input[class='dietLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2; // there are 2 extra elements in this array always
  }).map(e => e.id);
  const healthLabels = Object.values($("input[class='healthLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2;
  }).map(e => e.id);*/

  if (dietLabels.length || healthLabels.length > 0){ // decide which use-case is needed. dietLabels and healthLabels are in 2 different arrays within the response object even though they look the same to the user
    if (dietLabels.length && healthLabels.length > 0){
      const result = filterHealthLabel(filterDietLabel(responseJson.hits, dietLabels), healthLabels);
      createContent(result, responseTubes);
    } else if (dietLabels.length > 0){
      const result = filterDietLabel(responseJson.hits, dietLabels);
      createContent(result, responseTubes);
    } else {
      const result = filterHealthLabel(responseJson.hits, healthLabels);
      createContent(result, responseTubes);
    }
  } else {
    createContent(responseJson.hits, responseTubes);
  }
};

function createContent(results, responseJson){ // create content to display on page
  if (responseJson.pageInfo.totalResults != 0 & results.length != 0){

    // display videos
    $('#results-list').append(
      `<li><h3 class='search-results-header search-section header'>Videos</h3></li>`
    )
    
    for (let i = 0; i < responseJson.items.length; i++){
      $('#results-list').append(
        `<li class='result'><h3><a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target='_blank'>${responseJson.items[i].snippet.title}</a></h3>
        <img class='result-img' style="width:150px" src='${responseJson.items[i].snippet.thumbnails.default.url}' alt='${responseJson.items[i].snippet.title}'>
        </li>`
      )};

      // display recipes
      $('#results-list').append(
        `<li><h3 class='search-results-header search-section header'>Recipes</h3></li>`
      )

      for (let i = 0; i < results.length; i++){
        $('#results-list').append(
          `<li class='result'>
            <h3><a href='${results[i].recipe.url}' target='_blank'>${results[i].recipe.label}</a></h3>
            <img class='result-img' style="width:266px" src='${results[i].recipe.image}' alt='${results[i].recipe.label} image'>
            <ul class='result-ul'>
              <li>${String(results[i].recipe.ingredientLines).replace(/,/g,'</li><li>').split('</li><li> ').join(', ').split('</li><li>for').join(' for').split('</li><li>chilled').join(' chilled').split('</li><li>well').join(' well')}</li>
            </ul>
          </li>`
        )};
    } else if (responseJson.pageInfo.totalResults != 0){
      // display videos
      $('#results-list').append(
        `<li><h3 class='search-results-header search-section header'>Videos</h3></li>`
      )
      
      for (let i = 0; i < responseJson.items.length; i++){
        $('#results-list').append(
          `<li class='result'><h3><a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target='_blank'>${responseJson.items[i].snippet.title}</a></h3>
          <img class='result-img' style="width:150px" src='${responseJson.items[i].snippet.thumbnails.default.url}' alt='${responseJson.items[i].snippet.title}'>
          </li>`
        )};
      //display the results section  
      $('#results').removeClass('hidden');
  } else {
    $('#results-list').append(
        `<h3>Sorry, no matches were found</h3>`
    );
  }
  
  //display the results section
  $('#results').removeClass('hidden');
}

function getRests(ingredient, maxResults) { //creates url and uses fetch to get data
  const params = {
    app_key: STORE.apiKey,
    app_id: STORE.appID,
    q: ingredient,
    to: 100,
  };

  const queryString = formatQueryParams(params)
  const url = STORE.searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => getYouTubeVideos(ingredient, maxResults, responseJson))
    .catch(err => {
      $('#js-error-message').html("");
      $('#js-error-message').append(`Oops, something must have gone wrong: wait and try again`);
    })
}

function getYouTubeVideos(query, maxResults=10, responseJson) {
  const dietLabels = Object.values($("input[class='dietLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2; // there are 2 extra elements in this array always
  }).map(e => e.id);
  const healthLabels = Object.values($("input[class='healthLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2;
  }).map(e => e.id);

    let serch = '';
    for (let i=0; i< dietLabels.length; i++){
      serch = serch + dietLabels[i].toString() + ' ';
    }
    for (let i=0; i< healthLabels.length; i++){
      serch = serch + healthLabels[i].toString() + ' ';
    }
  
  const params = {
    key: STORE.youApiKey,
    q: serch + query + ' ' + 'recipe',
    part: 'snippet',
    maxResults,
    type: 'video'
  };

  const queryString = formatQueryParams(params)
  const url = STORE.youSearchURL + '?' + queryString;


  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseTubes => displayResults(responseJson, responseTubes, dietLabels, healthLabels))
    .catch(err => {
      $('#js-error-message').html("");
      $('#js-error-message').append(`Oops, something must have gone wrong: wait and try again`);
    });
}

function watchForm() { //gets strings from input once 'search' is pressed
  $('form').submit(event => {
    event.preventDefault();
    const ing = $('#search-term').val();
    const maxResults = 10;
    getRests(ing, maxResults);
  });
}

$(watchForm);