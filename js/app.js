import { categories } from './categories.js';
const d = document;
const start = d.getElementById('start');
const selectInput = d.getElementById('select');
const btnStart = d.getElementById('btn-start');
const btnAdd = d.getElementById('btn-add');
const add = d.getElementById('add');
const newWordInput = d.getElementById('new-word');
const btnAddWord = d.getElementById('btn-addWord');
const btnSaveWordAndStart = d.getElementById('btn-save');
const btnCancel = d.getElementById('btn-cancel');
const okInvalid = d.getElementById('ok-invalid');
const okInclude = d.getElementById('ok-include');
const okAdd = d.getElementById('ok-add');
const game = d.getElementById('game');
const word = d.getElementById('word');
const msgGameOver = d.getElementById('game-over');
const msgGameWin = d.getElementById('game-win');
const okGameWin = d.getElementById('okGameWin');
const okGameOver = d.getElementById('okGameOver');
const btnNewGame = d.getElementById('btn-newGame');
const btnDesist = d.getElementById('btn-desist');
const msgError = d.getElementById('msg-wordInvalid');
const msgWordInclude = d.getElementById('msg-wordInclude');
const msgWordAdd = d.getElementById('msg-wordAdd');
const lettersContainer = d.getElementById('right-word');
const imgContainer = d.getElementById('img-container');
const solution = d.getElementById('solution');
const abc = d.getElementById('abc');
const lettersABC = d.querySelectorAll('.abc__letter');
const category = d.getElementById('category');
const categoryContainer = d.getElementById('category-container');
const failuresContainer = d.getElementById('failures-container');
const counter = d.getElementById('counter');

let intentosCorrectos = 0;
let intentosIncorrectos = 0;
let intentosPermitidos = 7;
let intentosNecesarios = [];
let letters = [];
let letterUser;
let words;
let wordRandom;

localStorage.setItem("categories", JSON.stringify(categories));
let catRecupered = JSON.parse(localStorage.getItem("categories"));

function quitarAcentos(cadena) {
  const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
  return cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
};

function startGame() {
  const userCategory = selectInput.value;
  words = catRecupered[userCategory];

  category.textContent = userCategory;
  categoryContainer.style.visibility = "visible";

  words = words.filter(word => word.length < 9);
  wordRandom = words[Math.floor(Math.random() * words.length)];
  wordRandom = quitarAcentos(wordRandom.toString().toUpperCase()).split(",");

  solution.innerText = [...wordRandom].join("");
  
  createWordContainer(wordRandom.join(""));

  abc.addEventListener('click', e => {
    if (e.target && e.target.tagName === "BUTTON") {
      e.preventDefault();
      e.stopImmediatePropagation();
      letterUser = e.target;
      let letterUserValue = e.target.innerText;
      letters = wordRandom.toString().split("");
  
      let letterValue = d.querySelectorAll('.letter__value');
      let lettersUniques = [...new Set(letterValue)];
      lettersUniques = lettersUniques.map(input => input.innerHTML);
  
      for (let i = 0; i < letters.length; i++) {
        if (!intentosNecesarios.includes(letters[i]) && letters[i] !== " ") {
          intentosNecesarios.push(letters[i]);
        };
      };
      if (letters.includes(letterUserValue)) {
        intentosCorrectos++;
        letterUser.classList.add('abc__letter--correct');
        letterUser.disabled = true;
        for (let i = 0; i < letterValue.length; i++) {
          if (letterValue[i].innerHTML === letterUserValue) {
            letterValue[i].style.visibility = "visible";
          }
        }
        if (intentosCorrectos === intentosNecesarios.length) {
          msgGameWin.style.display = "flex";
          btnNewGame.disabled = true;
          abc.disabled = true;
        }
      } else {
        intentosIncorrectos++;
        letterUser.classList.add('abc__letter--incorrect');
        letterUser.disabled = true;
        switch (intentosIncorrectos) {
          case 1:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-2.svg");
            spanIncorrectos.innerText = "1";
            spanIncorrectos.classList.add('green');
            break;
          case 2:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-3.svg");
            spanIncorrectos.innerText = "2";
            spanIncorrectos.classList.add('green');
            break;
          case 3:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-4.svg");
            spanIncorrectos.innerText = "3";
            spanIncorrectos.classList.add('green');
            break;
          case 4:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-5.svg");
            spanIncorrectos.innerText = "4";
            spanIncorrectos.classList.remove('green');
            spanIncorrectos.classList.add('orange');
            break;
          case 5:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-6.svg");
            spanIncorrectos.innerText = "5";
            spanIncorrectos.classList.remove('green');
            spanIncorrectos.classList.add('orange');
            break;
          case 6:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-7.svg");
            spanIncorrectos.innerText = "6";
            spanIncorrectos.classList.remove('green');
            spanIncorrectos.classList.remove('orange');
            spanIncorrectos.classList.add('red');
            break;
          case intentosPermitidos:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-8.svg");
            spanIncorrectos.innerText = "7";
            spanIncorrectos.classList.remove('green');
            spanIncorrectos.classList.remove('orange');
            spanIncorrectos.classList.add('red');
            msgGameOver.style.display = "flex";
            btnNewGame.disabled = true;
            abc.disabled = true;
            break;
          default:
            imgDinamica.setAttribute('src', "./assets/munieco/juego-error-1.svg");
            spanIncorrectos.innerText = "0";
            break;
        };
      };
    };
  });
};

function createWordContainer(letters) {
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== " ") {
      const letter = d.createElement('div');
      letter.classList.add('letter');
      const letterValue = d.createElement('span');
      letterValue.textContent = `${letters[i]}`;
      letterValue.classList.add('letter__value');
      letterValue.style.visibility = "hidden";
      const line = d.createElement('span');
      line.classList.add('letter__line');
      line.style.visibility = "visible";
      letter.appendChild(letterValue);
      letter.appendChild(line);
      lettersContainer.appendChild(letter);
    } else {
      const letter = d.createElement('div');
      letter.classList.add('letter');
      const letterValue = d.createElement('span');
      letterValue.textContent = `${letters[i]}`;
      letterValue.classList.add('letter__value');
      letterValue.style.visibility = "hidden";
      const line = d.createElement('span');
      line.classList.add('letter__line');
      line.style.visibility = "hidden";
      letter.appendChild(letterValue);
      letter.appendChild(line);
      lettersContainer.appendChild(letter);
    };
  };
};

const imgDinamica = d.createElement('img');
const url = "./assets/munieco/juego-error-1.svg";
imgDinamica.setAttribute('src', url);
imgContainer.appendChild(imgDinamica);
const spanIncorrectos = d.createElement('span');
spanIncorrectos.innerText = 0;
counter.appendChild(spanIncorrectos);
failuresContainer.appendChild(counter);
const spanPermitidos = d.createElement('span');
spanPermitidos.innerText = " / 7";
counter.appendChild(spanPermitidos);
failuresContainer.appendChild(counter);

function reset() {
  while (lettersContainer.firstChild) {
    lettersContainer.removeChild(lettersContainer.firstChild);
  };

  lettersABC.forEach(letter => {
    letter.classList.remove('abc__letter--correct');
    letter.classList.remove('abc__letter--incorrect');
    letter.disabled = false;
  });

  imgDinamica.setAttribute("src", "./assets/munieco/juego-error-1.svg");
  spanIncorrectos.innerText = "0";
  spanIncorrectos.classList.remove('green');
  spanIncorrectos.classList.remove('orange');
  spanIncorrectos.classList.remove('red');
  msgGameOver.style.display = "none";
  msgGameWin.style.display = "none";

  intentosCorrectos = 0;
  intentosIncorrectos = 0;
  intentosPermitidos = 7;
  intentosNecesarios = [];
  letters = [];
}

btnAdd.addEventListener('click', e => {
  e.preventDefault();
  start.style.display = "none";
  add.style.display = "flex";
  newWordInput.focus();
});

btnAddWord.addEventListener('click', e => {
  e.preventDefault();
  const newWord = newWordInput.value.trim();
  if (newWord.length <= 1 && newWord.length >= 9) {
    msgError.style.display = "flex";
  } else if (JSON.parse(localStorage.getItem("categories").includes(newWord))) {
    msgError.style.display = "none";
    msgWordInclude.style.display = "flex";
    console.log(catRecupered.Mixed);
  } else {
    msgError.style.display = "none";
    msgWordInclude.style.display = "none";
    msgWordAdd.style.display = "flex";
    categories.Mixed.push(newWord);
    localStorage.setItem("categories", JSON.stringify(categories));
  }
});

btnSaveWordAndStart.addEventListener('click', e => {
  e.preventDefault();
  add.style.display = "none";
  game.style.display = "flex";
  word.style.display = "flex";
  startGame();
});

btnCancel.addEventListener('click', e => {
  e.preventDefault();
  newWordInput.value = "";
  add.style.display = "none";
  start.style.display = "flex";
});

btnStart.addEventListener('click', e => {
  e.preventDefault();
  start.style.display = "none";
  game.style.display = "flex";
  word.style.display = "flex";
  startGame();
});

okInvalid.addEventListener('click', e => {
  e.preventDefault();
  msgError.style.display = "none";
});

okInclude.addEventListener('click', e => {
  e.preventDefault();
  msgWordInclude.style.display = "none";
});

okAdd.addEventListener('click', e => {
  e.preventDefault();
  msgWordAdd.style.display = "none";
  newWordInput.value = "";
  newWordInput.focus();
});

okGameWin.addEventListener('click', e => {
  e.preventDefault();
  msgGameWin.style.display = "none";
  msgGameOver.style.display = "none";
  btnNewGame.disabled = false;
  reset();
});

okGameOver.addEventListener('click', e => {
  e.preventDefault();
  msgGameOver.style.display = "none";
  msgGameWin.style.display = "none";
  btnNewGame.disabled = false;
  reset();
});

btnNewGame.addEventListener('click', e => {
  e.preventDefault();
  abc.disabled = true;
  reset();
  startGame();
});

btnDesist.addEventListener('click', e => {
  e.preventDefault();
  location.reload();
});

let date = new Date;
let currentAge = date.getFullYear();
d.getElementById('age').innerText = currentAge;