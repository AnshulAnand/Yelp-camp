const form = document.getElementById('form-search');

form.addEventListener('submit', e => {
  e.preventDefault();
  searchCampgrounds(e.target.elements[0].value.toLowerCase().trim());
});

function searchCampgrounds (searchText) {
  const notFoundImage = document.getElementById('not-found');
  const campgroundCards = document.querySelectorAll('[data-campground]'); 
  let found = false;
  campgroundCards.forEach(el => {
    if (
      el
        .firstElementChild
        .children[1]
        .firstElementChild
        .firstElementChild
        .innerText
        .toLowerCase()
        .includes(searchText)
    ) {
      el.style.display = 'block';
      found = true;
    } else {
      el.style.display = 'none';
    }
  });
  if (found == false) {
    notFoundImage.style.display = 'block';
  } else {
    notFoundImage.style.display = 'none';
  }
}