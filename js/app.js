//////////////////////
// GLOBAL VARIABLES //
//////////////////////

var turn = true;
var currentMoveSet = [];
var playerMove = {};

$choices = $('.choice');
$cat = $('.cat-icon')

//////////////////////////////////
// OBJECTS AND HELPER FUNCTIONS //
//////////////////////////////////

// Create a moves array with three categories of three moves and their various strengths

var moves = [
  {
    text: "reason1text",
    str: 2,
    type: 'reason',
  },
  {
    text: "reason2text",
    str: 4,
    type: 'reason',
  },
  {
    text: "reason3text",
    str: 6,
    type: 'reason',
  },
  {
    text: "amuse1text",
    str: 2,
    type: 'amuse',
  },
  {
    text: "amuse2text",
    str: 4,
    type: 'amuse',
  },
  {
    text: "amuse3text",
    str: 6,
    type: 'amuse',
  },
  {
    text: "treat1text",
    str: 2,
    type: 'treat',
  },
  {
    text: "treat2text",
    str: 4,
    type: 'treat',
  },
  {
    text: "treat3text",
    str: 6,
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

// New Turn button

$newTurnBtn = $('.new-turn-btn')
$newTurnBtn. on("click", function() {
  newMoves();
})

// Moving cat animation

$cat.on('click', function (){
  var currentMargin = $(this).css("margin-left");
  console.log(currentMargin);
  $(this).animate({marginLeft: (parseInt(currentMargin) + catMoveRaw) + "px"}, "slow");
})




// Animation for moving cat based on the raw move score, taking into account which player chose

//Prints movement result message to players

// Logic for declaring a winner if cat reaches player goal line

// Restart game button
