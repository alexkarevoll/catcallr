// Define global variables

var turn = true;
var currentMoveSet = [];
var playerMove = {};

$choices = $('.choice');

// Create a moves object with three categories of three moves and their various strengths

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
// In the future it would be awesome to have random cat stats or multiple cats

var cat = {};

cat.bias ={
  reason : .5,
  amuse : 1,
  treat : 1.5,
}

// Function that picks a random item out of a given array no matter how long
function pickRandom(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
};

// MOVE SELECTION SPACE //
// Function to populate board with four new random moves
function newMoves(){

  for (var i = 0; i<$choices.length; i++){
    currentMoveSet.push(pickRandom(moves))
  }
  $('#choice-one').text(currentMoveSet[0].text);
  $('#choice-two').text(currentMoveSet[1].text);
  $('#choice-three').text(currentMoveSet[2].text);
  $('#choice-four').text(currentMoveSet[3].text);
}


// Logic for player choosing a move
function setMove(){
  if
  $('#choice-one').text(currentMoveSet[0].text);
  $('#choice-two').text(currentMoveSet[1].text);
  $('#choice-three').text(currentMoveSet[2].text);
  $('#choice-four').text(currentMoveSet[3].text);
}

// Logic for comparing chosen move to cat's weakness

// Logic for moving cat based on the comparison of weakness to user move, and printing status message to players

// Logic for declaring a winner if cat reaches player goal line

// Restart game button
