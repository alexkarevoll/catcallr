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
$newTurnBtn = $('.new-turn-btn')
$lockInBtn = $('.lock-in-btn')
$choices = $('.choice');
$p1Text = $('.player-one-text')
$p2Text = $('.player-two-text')

//////////////////////////////////
// OBJECTS AND HELPER FUNCTIONS //
//////////////////////////////////

// Create a moves array with three categories of three moves and their various strengths

var moves = [
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

// Create a cat object with weaknesses to certain kinds of moves.
// TODO In the future it would be awesome to have random cat stats or multiple cats

var cat = {};

cat.bias ={
  reason : .5,
  amuse : 1,
  treat : 2,
}

// Helper function that picks a random item out of a given array no matter how long. Thanks, Mike!
function pickRandom(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
};

//////////////////////////
// MOVE SELECTION SPACE //
//////////////////////////

// Function to populate board with four new random moves
// TODO No duplicates would be ideal

function newMoves(){
  currentMoveSet = [];

  for (var i = 0; i<$choices.length; i++){
    currentMoveSet.push(pickRandom(moves))
  }
  $('#choice-one').text(currentMoveSet[0].text);
  $('#choice-two').text(currentMoveSet[1].text);
  $('#choice-three').text(currentMoveSet[2].text);
  $('#choice-four').text(currentMoveSet[3].text);
}


// Logic for player choosing a move
$choices.on('click', function(){
  var id = this.id;
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
})

// Logic for comparing chosen move to cat's weakness
// Take the strength of the player's chosen move and multiply it by the strength of the cat's bias to moves of that type. Out put move data.
function calcCatMove() {
  catMoveRaw = playerMove.str * cat.bias[playerMove.type];
  console.log(catMoveRaw + "rawCatMove");
}

// Moving cat animation

 function moveCat(){
  // finds current cat position in pixels, converts it to a number and assigns it to a value
  currentCatMargin = parseInt($cat.css("margin-left"));
  console.log(currentCatMargin + " cat's position moveCat");
  // moves cat to the left based on move data.
  if (turn){
    $cat.animate({marginLeft: (currentCatMargin - (catMoveRaw)) + "px"}, "slow", function(){
      // sets final position after animation is complete
      // currentCatMargin = parseInt($cat.css("margin-left"))
      declareWinner();
    });
    }
  // - changed for + if it is second player's turn
  else {
    $cat.animate({marginLeft: (currentCatMargin + (catMoveRaw)) + "px"}, "slow", function(){
      // sets final position after animation is complete
      // currentCatMargin = parseInt($cat.css("margin-left"))
      declareWinner();
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


// Lock In Choice button
$lockInBtn.on("click", function(){
  if(lockAllow){
    newTurnAllow = true;
    calcCatMove();
    moveCat();
    // prevent button mashing until new turn
    lockAllow = false;
  }


})

// New Turn button

$newTurnBtn.on("click", function() {
  if(newTurnAllow){
    newMoves();
    $newTurnBtn.text("Next Turn")
    takeTurn();
    lockAllow = true;
    newTurnAllow = false;
  }
})


//////////////////
// TAKING TURNS //
//////////////////
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
newMoves();

// Restart game button
