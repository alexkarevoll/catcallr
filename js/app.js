//////////////////////
// GLOBAL VARIABLES //
//////////////////////

var turn = true;
var turnCounter = 0;
var gameOver = false;
var lockAllow = true;
var newTurnAllow = false;
var currentMoveSet = [];
var playerMove = {};


$cat = $('.cat-icon')
$choices = $('.choice');
$p1Text = $('.player-one-text')
$p2Text = $('.player-two-text')
$resetScreen = $('.reset-screen')
$catSpace = $('.cat-space')
$playAgainBtn = $('.play-again-btn')

//////////////////////////////////
// OBJECTS AND HELPER FUNCTIONS //
//////////////////////////////////

// References the moves array with three categories and their various strengths TODO Add more moves
console.log(initMoves);
var moves;
function setMoves(){
  moves = Array.prototype.concat(initMoves);
}

// Create a cat object with weaknesses to certain kinds of moves.
// TODO In the future it would be awesome to have random cat stats or multiple cats
var cAttributes = [.5,1,2,3]

var cat = {};

function newCat(){
  cat.bias ={
    // sets cat's biases based on possible biases
    // currently only happens once
    reason : cAttributes[Math.floor(Math.random()*cAttributes.length)],
    amuse : cAttributes[Math.floor(Math.random()*cAttributes.length)],
    treat : cAttributes[Math.floor(Math.random()*cAttributes.length)],
  }
}


// Helper function that picks a random item out of a given array no matter how long, then removes that item from the original array. Thanks, Mike and Kate
function pickRandom(arr) {
  // picks a random item and sets it to choice
  var i = Math.floor(Math.random()*arr.length);
  var choice = arr[i]
  // removes that random item from the array to prevent duplicates from being entered into the future array
  arr.splice(i,1)
  // returns that random item
  return choice
};

// Choice lights up on click
$choices.on('click', function(){
  $choices.removeClass('selected-move')
  $(this).toggleClass('selected-move')
})

//////////////////////////
/////// GAME LOGIC ///////
//////////////////////////

// Function to populate board with four new random moves

function newMoves(){
  // reset the move set
  currentMoveSet = [];

  // pushes the random array item into a new move set
  for (var i = 0; i<$choices.length; i++){
    currentMoveSet.push(pickRandom(moves))
  }
  // displays each move's text on the screen
  $('#choice-one').text(currentMoveSet[0].text);
  $('#choice-two').text(currentMoveSet[1].text);
  $('#choice-three').text(currentMoveSet[2].text);
  $('#choice-four').text(currentMoveSet[3].text);
}


// Logic for player choosing a move
function playerChoose(){
  // gets the id of the item clicked
  var id = this.id;
  // based on the given id, stores the move object clicked to a variable called playerMove
  if (id === 'choice-one'){
    playerMove = currentMoveSet[0];
  }
  else if (id === 'choice-two'){
    playerMove = currentMoveSet[1];
  }
  else if (id === 'choice-three'){
    playerMove = currentMoveSet[2];
  }
  else if (id === 'choice-four'){
    playerMove = currentMoveSet[3];
  }
}

// On click for choices

$choices.on('click', playerChoose)
$choices.on('click', lockIn)

// Logic for comparing chosen move to cat's weakness
// Take the strength of the player's chosen move and multiply it by the strength of the cat's bias to moves of that type. Output that move data.
function calcCatMove() {
  catMoveRaw = playerMove.str * cat.bias[playerMove.type];
  console.log(catMoveRaw + "rawCatMove");
}

// Moving cat animation that also checks for winners and changes turns
 function moveCat(){
  // finds current cat position in pixels, converts it to a number and assigns it to a value
  currentCatMargin = parseInt($cat.css("margin-left"));
  console.log(currentCatMargin + " cat's position moveCat");
  // moves cat to the left based on move data if it is P1 Turn
  $cat.attr("src", "images/cat_run.gif")
  if (turn){
    catMoveRaw = 0 - catMoveRaw
  }
  //otherwise it will move it to the right
  $cat.animate({marginLeft: (currentCatMargin + (catMoveRaw)) + "px"}, 1000);

  setTimeout(function(){
    declareWinner();
    if (!gameOver){
      setTimeout(nextTurn, [1000]);
    }
  },1000)
}

// Logic for declaring a winner if cat reaches player goal line
// TODO split into check and declare
function declareWinner(){
  // gets cat position
  currentCatMargin = parseInt($cat.css("margin-left"));
  console.log(currentCatMargin + " cat's position declareWinner")
  if (currentCatMargin < -13){
    console.log("Player One Wins!")
    $p1Text.text("P1 WINS!")
    setGameOver()
  }
  else if (currentCatMargin > 485){
    console.log("Player Two Wins!")
    $p2Text.text("P2 WINS!")
    setGameOver()
  }
}

// // Game Over Logic
function setGameOver(){
  gameOver = true;
  $catSpace.toggleClass('display-none');
  $resetScreen.toggleClass('display-none');
}

// New Game Logic

function newGame(){
  gameOver = false;
  $catSpace.toggleClass('display-none');
  $resetScreen.toggleClass('display-none');
  // $cat.animate({marginLeft: "236px"},1000)
  var containerMidpoint = $(this).parent().width() / 2
  var catMidPoint = $cat.width() / 2

  $cat.animate({marginLeft: containerMidpoint - catMidPoint},1000)
  setMoves()
  newMoves()
  nextTurn()
  newCat()
  lockAllow = true
  turnCounter = 0
}

//Call New Game on click
$playAgainBtn.on('click', newGame);

// Lock In Choice Logic

function lockIn(){
  if(lockAllow){
    if(playerMove.text !== undefined){ // makes sure player has made a choice
      calcCatMove();
      moveCat();
      // prevent button mashing until new turn, maybe not needed anymore since buttons were removed
      lockAllow = false;
      newTurnAllow = true;
    }
  }
}

// Next Turn logic

function nextTurn() {
  if(newTurnAllow){
    setMoves();
    newMoves();
    takeTurn();
    // prevent button mashing until lock-in
    lockAllow = true;
    newTurnAllow = false;
    playerMove = [];
    // Reset colors
    $choices.removeClass('selected-move')
  }
}

function takeTurn(){
  // If it was P1's turn, make it p2's turn, print that out, and flip the cat to face the opponent.
  if (turn){
    turn = false;
    $p1Text.text("");
    $p2Text.text("P2 TURN")
    $cat.attr("src", "images/CatLeft.png")
    $cat.toggleClass('flip-img')
  }
  else{
    turn = true;
    $p1Text.text("P1 TURN")
    $p2Text.text("")
    $cat.attr("src", "images/CatLeft.png")
    $cat.toggleClass('flip-img')
  }
}

// Starts Game with moves on board and a new random cat
setMoves();
newMoves();
newCat();

// Hides researt game screet
// $('.reset-screen').toggleClass('display-none');
