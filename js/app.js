//////////////////////
// GLOBAL VARIABLES //
//////////////////////

var turn = true;
var currentMoveSet = [];
var playerMove = {};

$cat = $('.cat-icon')
$newTurnBtn = $('.new-turn-btn')
$lockInBtn = $('.lock-in-btn')
$choices = $('.choice');

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
// Take the strength of the player's chosen move and multiply it by the strength of the cat's bias to moves of that type.
function calcCatMove() {
  catMoveRaw = playerMove.str * cat.bias[playerMove.type];
  console.log(catMoveRaw);
}

// Moving cat animation
// Broken now that its not on click

 function moveCat(){
  // finds current cat position in pixels, converts it to a number and assigns it to a value
  currentCatMargin = parseInt($cat.css("margin-left"));
  console.log(currentCatMargin);
  // moves cat to the left based on how effective user choice weakness
  // - could be changed for + if it was second player's turn
  $cat.animate({marginLeft: (currentCatMargin + (catMoveRaw)) + "px"}, "slow");
}

// Lock In Choice button
$lockInBtn.on("click", function(){
  calcCatMove();
  moveCat();
  declareWinner();

})

// New Turn button

$newTurnBtn.on("click", function() {
  newMoves();
})

//////////////////
// TAKING TURNS //
//////////////////
function takeTurn(){
  if (turn){
    turn = false;
  }
  else{
    turn = true;
  }
}

// Logic for declaring a winner if cat reaches player goal line
function declareWinner(){
  if (currentCatMargin < 0){
    console.log("Player One Wins!")
    $('.player-one-text').text("P1 WINS!")
  }
  else if (currentCatMargin > 475){
    console.log("Player Two Wins!")
    $('.player-two-text').text("P2 WINS!")
  }
}



// Restart game button
