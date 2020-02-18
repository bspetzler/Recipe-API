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
  // console.log(queryItems.join('&'));
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  // console.log($("input[name='answer']:checked").val());
  // console.log(responseJson.hits[0].recipe.dietLabels);
  $('#results-list').empty();
  createContent(responseJson.hits);
  console.log(responseJson);
};

function createContent(object){
  console.log(object);
  for (let i = 0; i < object.length; i++){
    console.log(i);
    //<li>${String(responseJson.hits[i].recipe.ingredientLines).replace(/,/g,'</li><li>').split('</li><li> peeled').join(', peeled').split('</li><li> thawed').join(', thawed').split('</li><li> quartered').join(', quarted').split('</li><li> finely').join(', finely').split('</li><li> roughly').join(', roughly').split('</li><li> to').join(', to').split('</li><li> smashed').join(', smashed').split('</li><li> seeded').join(', seeded').split('</li><li> softened').join(', softened').split('</li><li> or').join(', or').split('</li><li> sliced').join(', sliced').split('</li><li> and').join(', and').split('</li><li> plus').join(', plus').split('</li><li> bones').join(', bones').split('</li><li> rind').join(', rind').split('</li><li> skin').join(', skin').split('</li><li> about').join(', about').split('</li><li> cut').join(', cut').split('</li><li> at').join(', at').split('</li><li> as').join(', as').split('</li><li> crushed').join(', crushed').split('</li><li> use').join(', use').split('</li><li> flank').join(', flank').split('</li><li> for').join(', for').split('</li><li> divided').join(', divided').split('</li><li> warmed').join(', warmed').split('</li><li> cooked').join(', cooked').split('</li><li> each').join(', each').split('</li><li> heated').join(', heated').split('</li><li>for').join(' for').split('</li><li> cooled').join(', cooled').split('</li><li> sifted').join(', sifted').split('</li><li> melted').join(', melted').split('</li><li> homemade').join(', homemade').split('</li><li> optional').join(', optional').split('</li><li> well').join(', well').split('</li><li> cooled').join(', cooled').split('</li><li>well').join(', well').split('</li><li> room').join(', room').split('</li><li> slightly').join(', slightly').split('</li><li> very').join(', very').split('</li><li> picked').join(', picked').split('</li><li> diced').join(', diced').split('</li><li> halved').join(', halved').split('</li><li> dressed').join(', dressed').split('</li><li> juiced').join(', juiced').split('</li><li> golden').join(', golden').split('</li><li> chopped').join(', chopped').split('</li><li> bag').join(', bag')}</li>`
    $('#results-list').append(
      `<h3>${object[i].recipe.label}</h3>
      <img src='${object[i].recipe.image}' alt='${object[i].recipe.label} image'>
      <li>${String(object[i].recipe.ingredientLines).replace(/,/g,'</li><li>').split('</li><li> ').join(', ').split('</li><li>for').join(' for')}</li>`
    )};
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
  console.log(url);
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
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() { //gets strings from input once 'search' is pressed
  $('form').submit(event => {
    event.preventDefault();
    const ing = $('#js-search-term').val();

    //const progressive = $('#js-search-term').val();

    getRests(ing);
  });
}

$(watchForm);