const form = document.getElementById('form-search');

form.addEventListener('submit', e => {
  e.preventDefault();
  searchCampgrounds(e.target.elements[0].value.toLowerCase());
});

function searchCampgrounds (searchText) {
  const campgroundCards = document.querySelectorAll('[data-campground]'); 
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
    } else {
      el.style.display = 'none';
    }
  });
}