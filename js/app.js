//////////////////////
// GLOBAL VARIABLES //
//////////////////////

var turn = true;
var gameOver = false;
var lockAllow = true;
var newTurnAllow = false;
var currentMoveSet = [];
var playerMove = {};


$cat = $('.cat-icon')
$choices = $('.choice');
$p1Text = $('.player-one-text')
$p2Text = $('.player-two-text')

//////////////////////////////////
// OBJECTS AND HELPER FUNCTIONS //
//////////////////////////////////

// Create a moves array with three categories of three moves and their various strengths
var moves;
function setMoves(){
  moves = [
  {
    text: "attempt to speak to cat in it's native tongue",
    str: 20,
    type: 'reason',
  },
  {
    text: "draw a simple chart with an arrow pointing from the cat to you",
    str: 40,
    type: 'reason',
  },
  {
    text: "deliver dissertation on the advantages of human companionship",
    str: 60,
    type: 'reason',
  },
  {
    text: "click your tongue against the roof of your mouth",
    str: 20,
    type: 'amuse',
  },
  {
    text: "pull out your car keys and start jingling them",
    str: 40,
    type: 'amuse',
  },
  {
    text: "craft rudimentary catnip cigar toy",
    str: 60,
    type: 'amuse',
  },
  {
    text: "hold out some pocket lint, but make it look like food",
    str: 20,
    type: 'treat',
  },
  {
    text: "scavenge for a sardine can in a nearby trash can",
    str: 40,
    type: 'treat',
  },
  {
    text: "peel the lox off of your work lunch and dangle it in front of you",
    str: 60,
    type: 'treat',
  }
];
}

// Create a cat object with weaknesses to certain kinds of moves.
// TODO In the future it would be awesome to have random cat stats or multiple cats

var cat = {};

cat.bias ={
  reason : .5,
  amuse : 1,
  treat : 10, //set for testing
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
  // moves cat to the left based on move data.
  if (turn){
    $cat.animate({marginLeft: (currentCatMargin - (catMoveRaw)) + "px"}, "slow", function(){
      // checks to see if anyone won
      declareWinner();
      // Let next player play after animation finishes as long as the game isnt over
      if (!gameOver){
        setTimeout(nextTurn, [1000]);
      }
    });
    }
  // - changed for + if it is second player's turn
  else {
    $cat.animate({marginLeft: (currentCatMargin + (catMoveRaw)) + "px"}, "slow", function(){
      declareWinner();
      if (!gameOver){
        setTimeout(nextTurn, [1000]);
      }
    });
  }
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

  }
  else if (currentCatMargin > 485){
    console.log("Player Two Wins!")
    $p2Text.text("P2 WINS!")
  }
}

// Game Over Logic
var gameOver = function(){
  gameOver = true;
  $('.cat-space').toggleClass('display-none');
  $('.reset-screen').toggleClass('display-none');
}

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

// New Turn button
// TODO remove this button

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
    $cat.toggleClass('flip-img')
  }
  else{
    turn = true;
    $p1Text.text("P1 TURN")
    $p2Text.text("")
    $cat.toggleClass('flip-img')
  }
}

// Starts Game with moves on board
setMoves();
newMoves();

// Hides researt game screet
// $('.reset-screen').toggleClass('display-none');
