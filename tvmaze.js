"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $episodesList = $("#episodes-list");
const $searchForm = $("#search-form");
const BASE_API_URL = "http://api.tvmaze.com/";
const MISSING_IMAGE_URL = " https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
 async function getShowsByTerm(searchTerm) {
  const response = await axios.get(`${BASE_API_URL}search/shows?q=${searchTerm}`);
  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" data-show-name="${show.name}" data-show-summary="${show.summary}" data-show-image-src="${show.image}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.image} 
              alt=${MISSING_IMAGE_URL} 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}

function populateShow(show) {
  $showsList.empty();
  console.log(show);

  const $show = $(
    `<div data-show-id="${show.id}" data-show-name="${show.name}" data-show-summary="${show.summary}" data-show-image-src="${show.image}" class="Show col-md-12 col-lg-6 mb-4">
     <div class="media">
       <img 
          src=${show.image} 
          alt=${MISSING_IMAGE_URL} 
          class="w-25 mr-3">
       <div class="media-body">
         <h5 class="text-primary">${show.name}</h5>
         <div><small>${show.summary}</small></div>
         <button class="btn btn-outline-light btn-sm Show-getEpisodes">
           Episodes
         </button>
       </div>
     </div>  
   </div>
  `);

$showsList.append($show);
}

// async function getShowBy(id){
//   $showsList.empty();
//   const response = await axios.get(`${BASE_API_URL}/shows/${id})`);
//   console.log(results.data);
//   return response.data.map(result => {
//     const show = result.show;
//     return {
//       id: show.id,
//       name: show.name,
//       summary: show.summary,
//       image: show.image ? show.image.medium : MISSING_IMAGE_URL,
//     };
//   });
// }


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  console.log(shows);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const response = await axios.get(`${BASE_API_URL}shows/${id}/episodes`);
  return response.data.map(episode =>({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty();
  for (let episode of episodes) {
    const $e = $(`<li>${episode.name} (Season ${episode.season}, Number ${episode.number})</li>`);
    $episodesList.append($e);  
  }
  // $showsList.empty();

  $episodesArea.show();
}

async function searchForEpisodesAndDisplay(event) {
  
  const id = $(event.target).closest(".Show").data("show-id");
  const name = $(event.target).closest(".Show").data("show-name");
  const image = $(event.target).closest(".Show").data("show-image-src");
  const summary = $(event.target).closest(".Show").data("show-summary");
  const show = {id,name,image,summary,};

  const episodes = await getEpisodesOfShow(id);
  populateShow(show);
  populateEpisodes(episodes);
}

$showsList.on("click",".Show-getEpisodes",searchForEpisodesAndDisplay);

