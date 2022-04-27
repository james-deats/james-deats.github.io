var kb_padding = 0.9;
var kb_spacing = 1.25;

var box_spacing = 1.25;

var word_len = 5;
var num_guess = 6;

var title_space = 0.1;
var title_elements = 2;

var kb = [];
var guesses = [];
var curr_guess = 0;
var curr_letter = 0;
var score = 0;

var gameWon = false;

var guessColor = ["#000000", "#2c3032", "#917f2f", "#42713e"];
var kbColor = ["#5e666a", "#2c3032", "#917f2f", "#42713e"];
var bgColor = "#0e0f10";

var wordList = [];
var answerList = [];

var answer = "";

function preload() {
  wordList = loadStrings('wordlist.txt');
  answerList = loadStrings('answerlist.txt');
}

function setup() {
  var cnv = null;
  if (windowWidth > windowHeight) {
    cnv = createCanvas(windowHeight * 0.5, windowHeight);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
  } else {
    cnv = createCanvas(windowWidth, windowHeight);
  }

  kb = [];
  guesses = [];
  curr_guess = 0;
  curr_letter = 0;

  answer = answerList[floor(random(answerList.length))];

  var top = "QWERTYUIOP";
  var mid = "ASDFGHJKL";
  var btm = "ZXCVBNM";

  var keyboard_x = (kb_padding * width) / (top.length * kb_spacing);
  var keyboard_y = keyboard_x * 1.5;

  var x0_top =
    (width - (keyboard_x * kb_spacing * (top.length - 1) + keyboard_x)) / 2;
  for (var i = 0; i < top.length; i++) {
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

  var x0_mid =
    (width - (keyboard_x * kb_spacing * (mid.length - 1) + keyboard_x)) / 2;
  for (var i = 0; i < mid.length; i++) {
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

  var x0_btm =
    (width - (keyboard_x * kb_spacing * (btm.length - 1) + keyboard_x)) / 2;
  for (var i = 0; i < btm.length; i++) {
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

  var game_h =
    height -
    4 * kb_spacing * keyboard_y -
    height * title_space * title_elements;
  var game_w =
    (keyboard_x * kb_spacing * (top.length - 1) + keyboard_x) / box_spacing;
  var box_size = min(game_w, game_h) / (word_len * box_spacing);

  var game_x =
    width / 2 - ((word_len - 1) * box_size * box_spacing) / 2 - box_size / 2;
  var game_y =
    game_h / 2 -
    ((word_len - 1) * box_size * box_spacing) / 2 -
    box_size / 2 +
    (height * title_space) / title_elements;
  game_y = (height * title_space * title_elements) / 2 + box_size;

  for (var i = 0; i < num_guess; i++) {
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
    textSize(height * title_space * 0.25);
    text("Score: " + score, width / 2, (2 * title_space * height) / 2);

    for (var i = 0; i < kb.length; i++) {
      kb[i].render();
    }

    for (var i = 0; i < guesses.length; i++) {
      guesses[i].render();
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
  for (var i = 0; i < kb.length; i++) {
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
  for (var i = 0; i < word.length; i++) {
    for (var j = 0; j < kb.length; j++) {
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
    for (var i = 0; i < word_len; i++) {
      this.color.push(0);
    }
  }

  render() {
    for (var i = 0; i < word_len; i++) {
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
    var original_value = a.toUpperCase();
    var guessed_value = original_value.split("");
    var newColor = [];
    for (var i = 0; i < this.guess.length; i++) {
      newColor[i] = 1;
      if (guessed_value.includes(this.guess[i])) {
        newColor[i] = 2;
        guessed_value[guessed_value.indexOf(this.guess[i])] = " ";
      }
      this.color[i] = newColor;
    }
    for (var i = 0; i < this.guess.length; i++) {
      if (this.guess[i] == original_value[i]) {
        newColor[i] = 3;
      }
    }
    this.color = newColor;
    updateKbColor(this.guess, newColor);
  }
}
