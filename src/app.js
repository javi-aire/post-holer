const  searchInput = document.querySelector('.app__search--input'),
  searchButton = document.querySelector('.app__search-btn');
let limit = document.querySelector('[name=results-limit]'),
  filters = {
    hot: false,
    top: false,
    new: false,
    comment: false
  };

searchButton.addEventListener('click', () => {
  const subreddit = document.querySelector('.app__search--subreddit');
  console.log('subreddit:', subreddit.value);

  fetch(`https://reddit.com/r/${subreddit.value}${searchInput.value ? 'search/'+searchInput.value : '.json'}`)
    .then(response => { return response.json(); })
    .then(json => {
      document.body.innerHTML = `<div class="container">${JSON.stringify(json.data)}</div>`;
    })
    .catch(err => {
      console.error(err);
    })
})

console.log(`${limit}`);