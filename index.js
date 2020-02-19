'use strict';

/*You can start using this key to make web service requests. Simply pass your key in the URL when making a web request. Here's an example:

https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=6eF2xuvqcgZ9wOQZRyKBJJ8yjyh4Haot9QXKTdCU

OR

HTTP Header
curl -H 'X-Api-Key: INSERT-API-KEY-HERE' 'https://developer.nps.gov/api/v1/parks?parkCode=acad'

*/

// put your own value below!
const apiKey = '7675276694fb970af08da98b031a5175';
const appID = '0093db1a';
const searchURL = 'https://api.edamam.com/search';

//https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972


function formatQueryParams(params) { //puts query together
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
  console.log(queryItems.join('&'));
}

/*$('#add-field').on.click(
  $('#js-form').append(
    '<input type="text" name="search-term" id="js-search-term" required>'
  )};
);*/

function filterDietLabel(arrayOfObjects, arrayOfFilters){
  let newArray = arrayOfObjects.filter(function(elementOfArray){
    //console.log('elementOfArray' + elementOfArray);
    // the first true or false statement revolves around whether the healthLabels array contains all the elements of arrayOfFilters

    // enter into health labels array
     let dietFilt = elementOfArray.recipe.dietLabels.filter(function(element){
       return arrayOfFilters.includes(element);
       // look at the arrayOfFilters and see if it inlcudes the element of healthLabels that is focused on
       // if it does not it will filter it out
       // the end result of this function is an array only of the healthLabels elements that can be found in arrayOfFilters
     })
     //console.log(healthFilt);
     return dietFilt.length == arrayOfFilters.length;
     // does the length of filtered healthLabels match the length of arrayOfFilters
     // if every time a health label element isn't seen in the arrayOfFilters it gets eliminated, then the length of arrayOfFilters and healthLabels will only be the same if healthLabels includes all the elements of arrayOfFilters
  }) 
  return newArray;
    };

function filterHealthLabel(arrayOfObjects, arrayOfFilters){
  //console.log(arrayOfObjects);
  //console.log(arrayOfFilters);
  let newArray = arrayOfObjects.filter(function(elementOfArray){
    //console.log('elementOfArray' + elementOfArray);
    // the first true or false statement revolves around whether the healthLabels array contains all the elements of arrayOfFilters

    // enter into health labels array
     let healthFilt = elementOfArray.recipe.healthLabels.filter(function(element){
       return arrayOfFilters.includes(element);
       // look at the arrayOfFilters and see if it inlcudes the element of healthLabels that is focused on
       // if it does not it will filter it out
       // the end result of this function is an array only of the healthLabels elements that can be found in arrayOfFilters
     })
     //console.log(healthFilt);
     return healthFilt.length == arrayOfFilters.length;
     // does the length of filtered healthLabels match the length of arrayOfFilters
     // if every time a health label element isn't seen in the arrayOfFilters it gets eliminated, then the length of arrayOfFilters and healthLabels will only be the same if healthLabels includes all the elements of arrayOfFilters
  }) 
  return newArray;
    }

function displayResults(responseJson) {
  // if there are previous results, remove them
  // console.log($("input[name='answer']:checked").val());
  // console.log(responseJson.hits[0].recipe.dietLabels);
  $('#results-list').empty();

  // iterate through the items array
  let dietLabels = Object.values($("input[class='dietLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2;
  }).map(e => e.id);
  let healthLabels = Object.values($("input[class='healthLabels']:checked")).filter(function(e,i,arr){
    return i < arr.length - 2;
  }).map(e => e.id);
  //console.log('diet labels amt: ' + dietLabels.length);
  //console.log(dietLabels);

  if (dietLabels.length || healthLabels.length > 0){
    if (dietLabels.length && healthLabels.length > 0){
      //console.log('diet and health labels');
      let result = filterHealthLabel(filterDietLabel(responseJson.hits, dietLabels), healthLabels);
      createContent(result);
    } else if (dietLabels.length > 0){
      //console.log('only diet labels');
      let result = filterDietLabel(responseJson.hits, dietLabels);
      console.log(result);
      createContent(result);
    } else {
      //console.log('only health labels');
      let result = filterHealthLabel(responseJson.hits, healthLabels);
      //console.log(result);
      createContent(result);
    }
    //console.log(responseJson.hits);
  }
};

function createContent(results){
  if (results.length != 0){
    for (let i = 0; i < results.length; i++){
      //<li>${String(responseJson.hits[i].recipe.ingredientLines).replace(/,/g,'</li><li>').split('</li><li> peeled').join(', peeled').split('</li><li> thawed').join(', thawed').split('</li><li> quartered').join(', quarted').split('</li><li> finely').join(', finely').split('</li><li> roughly').join(', roughly').split('</li><li> to').join(', to').split('</li><li> smashed').join(', smashed').split('</li><li> seeded').join(', seeded').split('</li><li> softened').join(', softened').split('</li><li> or').join(', or').split('</li><li> sliced').join(', sliced').split('</li><li> and').join(', and').split('</li><li> plus').join(', plus').split('</li><li> bones').join(', bones').split('</li><li> rind').join(', rind').split('</li><li> skin').join(', skin').split('</li><li> about').join(', about').split('</li><li> cut').join(', cut').split('</li><li> at').join(', at').split('</li><li> as').join(', as').split('</li><li> crushed').join(', crushed').split('</li><li> use').join(', use').split('</li><li> flank').join(', flank').split('</li><li> for').join(', for').split('</li><li> divided').join(', divided').split('</li><li> warmed').join(', warmed').split('</li><li> cooked').join(', cooked').split('</li><li> each').join(', each').split('</li><li> heated').join(', heated').split('</li><li>for').join(' for').split('</li><li> cooled').join(', cooled').split('</li><li> sifted').join(', sifted').split('</li><li> melted').join(', melted').split('</li><li> homemade').join(', homemade').split('</li><li> optional').join(', optional').split('</li><li> well').join(', well').split('</li><li> cooled').join(', cooled').split('</li><li>well').join(', well').split('</li><li> room').join(', room').split('</li><li> slightly').join(', slightly').split('</li><li> very').join(', very').split('</li><li> picked').join(', picked').split('</li><li> diced').join(', diced').split('</li><li> halved').join(', halved').split('</li><li> dressed').join(', dressed').split('</li><li> juiced').join(', juiced').split('</li><li> golden').join(', golden').split('</li><li> chopped').join(', chopped').split('</li><li> bag').join(', bag')}</li>`
      $('#results-list').append(
        `<h3>${results[i].recipe.label}</h3>
        <img src='${results[i].recipe.image}' alt='${results[i].recipe.label} image'>
        <li>${String(results[i].recipe.ingredientLines).replace(/,/g,'</li><li>').split('</li><li> ').join(', ').split('</li><li>for').join(' for')}</li>
        <a href='${results[i].recipe.url}'>Link to Recipe</a>`
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

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Oops, something must have gone wrong: try again`);
    });
}

function watchForm() { //gets strings from input once 'search' is pressed
  $('form').submit(event => {
    event.preventDefault();
    const ing = $('#search-term').val();

    //const progressive = $('#js-search-term').val();

    getRests(ing);
  });
}

$(watchForm);