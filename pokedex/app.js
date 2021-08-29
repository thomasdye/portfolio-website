// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const bButton = document.querySelector('.b-button');
const aButton = document.querySelector('.a-button');

// constants and variables
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;
let defaultFront = null;
let defaultBack = null;
let shinyFront = null;
let shinyBack = null;

// Functions

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

// reset screen when changing Pokemon
const resetScreen = () => {
  mainScreen.classList.remove('hide');
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

// fetch list for next and previous pokemon
const fetchPokeList = url => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { results, previous, next } = data;
      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < pokeListItems.length ; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

        if (resultData) {
          const { name, url } = resultData;
          const urlArray = url.split('/');
          const id = urlArray[urlArray.length - 2];
          console.log(id)
          if (id <= 151) {
            pokeListItem.textContent = id + '. ' + capitalize(name);
            rightButton.classList.add('right-button')
            rightButton.classList.remove('right-button-disabled')
            
          } else {
            pokeListItem.textContent = ''
            rightButton.classList.remove('right-button')
            rightButton.classList.add('right-button-disabled')
          }
        }
      }
    });
};

// fetch individual pokemon data
const fetchPokeData = id => {

  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      resetScreen();

      const dataTypes = data['types'];
      const dataFirstType = dataTypes[0];
      const dataSecondType = dataTypes[1];
      const sprites = data['sprites'];

      pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
      if (dataSecondType) {
        pokeTypeTwo.classList.remove('hide');
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
      } else {
        pokeTypeTwo.classList.add('hide');
        pokeTypeTwo.textContent = '';
      }
      mainScreen.classList.add(dataFirstType['type']['name']);

      pokeName.textContent = capitalize(data['name']);
      pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
      pokeWeight.textContent = data['weight'];
      pokeHeight.textContent = data['height'];
      defaultFront = sprites['front_default'] || '';
      defaultBack = sprites['back_default'] || '';
      shinyFront = sprites['front_shiny'] || ''
      shinyBack = sprites['back_shiny'] || '';
      pokeFrontImage.src = defaultFront;
      pokeBackImage.src = defaultBack;
      document.body.style.backgroundRepeat = "repeat-y-x";
      document.body.className = ""
      document.body.className += `${dataFirstType.type.name}`;
      document.body.style.backgroundImage = `url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

      // click b button
      const handleBClick = () => {
        if (pokeFrontImage.src === defaultFront) {
          pokeFrontImage.src = shinyFront;
          pokeBackImage.src = shinyBack;
        } else {
          console.log('already shiny')
        }
      };

      // click a button
      const handleAClick = () => {
        if (pokeFrontImage.src === shinyFront) {
          pokeFrontImage.src = defaultFront;
          pokeBackImage.src = defaultBack;
        } else {
          console.log('already default')
        }
      };

      bButton.addEventListener('click', handleBClick);
      aButton.addEventListener('click', handleAClick);
    });
};

// click previous button
const handleLeftButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
};

// click next button
const handleRightButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
};

// select pokemon from list
const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};

// add event listeners
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);


for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}

// init
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
