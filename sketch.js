let kb_padding = 0.9;
let kb_spacing = 1.25;

let box_spacing = 1.25;

let word_len = 5;
let num_guess = 6;

let title_space = 0.1;
let title_elements = 2;

let kb = [];
let guesses = [];
let curr_guess = 0;
let curr_letter = 0;
let score = 0;

let gameWon = false;

let guessColor = ["#000000", "#2c3032", "#917f2f", "#42713e"];
let kbColor = ["#5e666a", "#2c3032", "#917f2f", "#42713e"];
let bgColor = "#0e0f10";

let wordList = [];
let answerList = [];

let answer = "";

function preload() {
  wordList = loadStrings('wordlist.txt');
  answerList = loadStrings('answerlist.txt');
}

function setup() {
  let cnv = null;
  if (windowWidth > windowHeight) {
    cnv = createCanvas(windowHeight * 0.5, windowHeight);
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
  } else {
    cnv = createCanvas(windowWidth, windowHeight);
  }

  kb = [];
  guesses = [];
  curr_guess = 0;
  curr_letter = 0;

  answer = answerList[floor(random(answerList.length))];

  let top = "QWERTYUIOP";
  let mid = "ASDFGHJKL";
  let btm = "ZXCVBNM";

  let keyboard_x = (kb_padding * width) / (top.length * kb_spacing);
  let keyboard_y = keyboard_x * 1.5;

  let x0_top =
    (width - (keyboard_x * kb_spacing * (top.length - 1) + keyboard_x)) / 2;
  for (let i = 0; i < top.length; i++) {
    kb.push(
      new Button(
        x0_top + kb_spacing * keyboard_x * i,
        height - 3 * kb_spacing * keyboard_y - kb_padding,
        keyboard_x,
        keyboard_y,
        top[i]
      )
    );
  }

  let x0_mid =
    (width - (keyboard_x * kb_spacing * (mid.length - 1) + keyboard_x)) / 2;
  for (let i = 0; i < mid.length; i++) {
    kb.push(
      new Button(
        x0_mid + kb_spacing * keyboard_x * i,
        height - 2 * kb_spacing * keyboard_y - kb_padding,
        keyboard_x,
        keyboard_y,
        mid[i]
      )
    );
  }

  let x0_btm =
    (width - (keyboard_x * kb_spacing * (btm.length - 1) + keyboard_x)) / 2;
  for (let i = 0; i < btm.length; i++) {
    kb.push(
      new Button(
        x0_btm + kb_spacing * keyboard_x * i,
        height - kb_spacing * keyboard_y - kb_padding,
        keyboard_x,
        keyboard_y,
        btm[i]
      )
    );
  }

  kb.push(
    new Button(
      x0_top + kb_spacing * keyboard_x * top.length - 1.8 * keyboard_x,
      height - kb_spacing * keyboard_y - kb_padding,
      1.65 * keyboard_x,
      keyboard_y,
      "back",
      true
    )
  );
  kb.push(
    new Button(
      x0_top,
      height - kb_spacing * keyboard_y - kb_padding,
      1.65 * keyboard_x,
      keyboard_y,
      "enter",
      true
    )
  );

  let game_h =
    height -
    4 * kb_spacing * keyboard_y -
    height * title_space * title_elements;
  let game_w =
    (keyboard_x * kb_spacing * (top.length - 1) + keyboard_x) / box_spacing;
  let box_size = min(game_w, game_h) / (word_len * box_spacing);

  let game_x =
    width / 2 - ((word_len - 1) * box_size * box_spacing) / 2 - box_size / 2;
  let game_y =
    game_h / 2 -
    ((word_len - 1) * box_size * box_spacing) / 2 -
    box_size / 2 +
    (height * title_space) / title_elements;
  game_y = (height * title_space * title_elements) / 2 + box_size;

  for (let i = 0; i < num_guess; i++) {
    guesses.push(
      new Guess(game_x, game_y + i * box_size * box_spacing, box_size)
    );
  }
}

function draw() {
  if (gameWon) {
    background(bgColor);
    textSize(height * title_space * 0.5);
    fill("white");
    text("You are a victor!", width / 2, (title_space * height) / 2);
    textSize(height * title_space * 0.25);
    text("Score: " + score, width / 2, (2 * title_space * height) / 2);
  } else {
    background(bgColor);

    textSize(height * title_space * 0.5);
    fill("white");
    text("Hungle Games", width / 2, (title_space * height) / 2);
    

    for (let i = 0; i < kb.length; i++) {
      kb[i].render();
    }

    for (let i = 0; i < guesses.length; i++) {
      guesses[i].render();
    }
    
    fill('white');
    if (curr_guess == num_guess) {
      textSize(height * title_space * 0.3);
      text("Word: " + answer, width / 2, (2 * title_space * height) / 2);
    }
    else {
      textSize(height * title_space * 0.25);
      text("Score: " + score, width / 2, (2 * title_space * height) / 2);
    }
    
  }
}

function updateGuess(letter) {
  guess = guesses[curr_guess];
  if (letter == "enter") {
    if (guess.getNumLetters() == word_len) {
      submitGuess(guess);
    }
  } else if (letter == "back") {
    guess.backspace();
  } else if (curr_guess < num_guess) {
    guess.addLetter(letter);
  }
}

function submitGuess(guess) {
  guessed_word = guess.ToString().toLowerCase();
  if (wordList.includes(guessed_word) || answerList.includes(guessed_word)) {
    guess.updateColor(answer);

    if (guessed_word == answer.toLowerCase()) {
      resetGame(true);
    } else {
      curr_guess++;
      if (curr_guess == num_guess) {
        resetGame(false);
      }
    }
  }
}

function resetGame(won) {
  if (won) score++;
  if (answerList.length == 1) {
    gameWon = true;
  } else {
    answerList.splice(answerList.indexOf(answer), 1);
    setTimeout(setup, 1000);    
  }
}

function touchEnded() {
  for (let i = 0; i < kb.length; i++) {
    if (kb[i].isClicked(mouseX, mouseY)) {
      updateGuess(kb[i].ToString());
      break;
    }
  }
}

function keyPressed() {
  if (keyCode == 13) {
    updateGuess("enter");
    return;
  }
  if (keyCode == 8) {
    updateGuess("back");
    return;
  }
  if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122)) return;
  updateGuess(char(keyCode));
}

function updateKbColor(word, color) {
  for (let i = 0; i < word.length; i++) {
    for (let j = 0; j < kb.length; j++) {
      if (kb[j].ToString().toUpperCase() == word[i]) {
        if (kb[j].getColor() < color[i]) {
          kb[j].setColor(color[i]);
          break;
        }
      }
    }
  }
}

class Button {
  constructor(x, y, w, h, txt, isCmd) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = txt;
    this.color = 0;
    this.isCmd = isCmd || false;
  }

  render() {
    fill(kbColor[this.color]);
    noStroke();
    rect(this.x, this.y, this.w, this.h, this.w / 4);
    fill("white");
    textSize(this.isCmd ? this.w / 3 : this.w / 2);
    textAlign(CENTER, CENTER);
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);
  }

  isClicked(x, y) {
    return !(
      x < this.x ||
      y < this.y ||
      x > this.x + this.w ||
      y > this.y + this.h
    );
  }

  setColor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  ToString() {
    return this.text;
  }

  equals(str) {
    return this.text == str;
  }
}

class Guess {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.length = word_len;
    this.guess = [];
    this.color = [];
    for (let i = 0; i < word_len; i++) {
      this.color.push(0);
    }
  }

  render() {
    for (let i = 0; i < word_len; i++) {
      fill(guessColor[this.color[i]]);
      stroke("gray");
      strokeWeight(2);
      rect(this.x + i * this.size * box_spacing, this.y, this.size, this.size);
      if (i < this.guess.length) {
        fill("white");
        textSize(this.size / 2);
        textAlign(CENTER, CENTER);
        text(
          this.guess[i],
          this.x + i * this.size * box_spacing + this.size / 2,
          this.y + this.size / 2
        );
      }
    }
  }

  addLetter(l) {
    if (this.guess.length >= word_len) {
      return false;
    }
    this.guess.push(l);
  }

  backspace() {
    this.guess.pop();
  }

  getNumLetters() {
    return this.guess.length;
  }

  ToString() {
    return this.guess.join("");
  }

  updateColor(a) {
    let original_value = a.toUpperCase();
    let guessed_value = original_value.split("");
    let newColor = new Array(word_len).fill(1);
    for (let i = 0; i < this.guess.length; i++) {
      if (original_value[i] == this.guess[i]) {
        newColor[i] = 3;
        guessed_value[i] = ' ';
      }
    }
    for (let i = 0; i < this.guess.length; i++) {
      if (guessed_value.includes(this.guess[i]) && newColor[i] != 3) {
        newColor[i] = 2;
        guessed_value[guessed_value.indexOf(this.guess[i])] = ' ';
      }
    }
    this.color = newColor;
    updateKbColor(this.guess, newColor);
  }
}
