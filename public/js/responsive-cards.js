function responsiveCard() {
  const screenWidth = screen.width;
  const card1 = document.getElementById('card-1');
  const card2 = document.getElementById('card-2');
  const div = document.getElementById('div-to-hide');
  if (screenWidth <= 768) {
    if (card1.classList.contains('col-6')) {
      card1.classList.remove('col-6');
      card1.classList.add('col-12');
    }
    if (card2.classList.contains('col-6')) {
      card2.classList.remove('col-6');
      card2.classList.add('col-12');
    }
    if (div.classList.contains('d-none')) {
      div.classList.remove('d-none');
    }
  } else {
    if (card1.classList.contains('col-12')) {
      card1.classList.remove('col-12');
      card1.classList.add('col-6');
    }
    if (card2.classList.contains('col-12')) {
      card2.classList.remove('col-12');
      card2.classList.add('col-6');
    }
    if (!div.classList.contains('d-none')) {
      div.classList.add('d-none');
    }
  }
}
window.onresize = responsiveCard();
