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
var winner = "";
var p1Win = false;


$cat = $('.cat-icon')
$playerOneEyebrows = $('.player-one-eyebrows')
$playerTwoEyebrows = $('.player-two-eyebrows')
$playerOneEyes = $('.player-one-eyes')
$playerTwoEyes = $('.player-two-eyes')
$choices = $('.choice');
$p1Text = $('.player-one-text')
$p2Text = $('.player-two-text')
$p1Img = $('.player-one img')
$p2Img = $('.player-two img')
$resetScreen = $('.reset-screen')
$catSpace = $('.cat-space')
$playAgainBtn = $('.play-again-btn')
$('body').on('click', '.play-again-btn', newGame);


//////////////////////////////////
// OBJECTS AND HELPER FUNCTIONS //
//////////////////////////////////

// References the moves array with three categories and their various strengths TODO Add more moves
var moves;
function setMoves(){
  moves = Array.prototype.concat(initMoves);
}

// Create a cat object with weaknesses to certain kinds of moves.
// TODO In the future it would be awesome to have random cat stats or multiple cats
cAttributes = [.5, 1, 1.5 , 2, 3]

var cat = {};

function newCat(){
  cat.bias = {
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
  animateEyebrows();
}

// Moving cat animation that also checks for winners and changes turns
 function moveCat(){
  // finds current cat position in pixels, converts it to a number and assigns it to a value
  currentCatMargin = parseInt($cat.css("margin-left"));
  // console.log(currentCatMargin + " cat's position moveCat");
  // moves cat to the left based on move data if it is P1 Turn
  $cat.attr("src", "images/cat_run.gif")
  if (turn){
    catMoveRaw = 0 - catMoveRaw
  }
  //otherwise it will move it to the right
  $cat.animate({marginLeft: (currentCatMargin + (catMoveRaw)) + "px"}, 1000);

  // Declare winner after animation is finished
  setTimeout(function(){
    declareWinner();
    if (!gameOver){
      setTimeout(nextTurn, [1000]);
    }
  },1000)
}

// Player Eyebrow Animations
function animateEyebrows(){
  if (catMoveRaw > 90){
    if (turn){
      $playerOneEyebrows.animate({marginTop: "115px"})
      $playerTwoEyebrows.animate({marginTop: "140px"})
    }
    else {
      $playerTwoEyebrows.animate({marginTop: "115px"})
      $playerOneEyebrows.animate({marginTop: "140px"})
    }
  }
  else {
    $playerTwoEyebrows.animate({marginTop: "130px"})
    $playerOneEyebrows.animate({marginTop: "130px"})
  }
}

function blink(whoBlink){
  setTimeout(function() {
    whoBlink.animate({height: "1px", marginTop: "147px"}, 200, function(){
      whoBlink.animate({height: "15px", marginTop: "140px"}, 200, false)
    })
    blink(whoBlink)
  }, Math.floor(Math.random() * (10000))+1000)
}

blink($playerOneEyes)
blink($playerTwoEyes)

// Logic for declaring a winner if cat reaches player goal line
// TODO split into check and declare
function declareWinner(){
  // gets cat current position
  currentCatMargin = parseInt($cat.css("margin-left"));
  // console.log(currentCatMargin + " cat's position declareWinner")
  if (currentCatMargin < -13){
    console.log("Player One Wins!")
    $p1Text.text("P1 WINS!")
    $p1Img.attr("src", "images/person1_win.gif")
    p1win = true;
    setGameOver()
  }
  else if (currentCatMargin > 485){
    console.log("Player Two Wins!")
    $p2Text.text("P2 WINS!")
    $p2Img.attr("src", "images/person2_win.gif")
    setGameOver()
  }
}

// function whoWon(){
//   if (p1Win){ <- THIS ISNT TRUE SOON ENOUGH FOR IT TO WORK
//     winner = "PLAYER 1 WINS"
//   }
//   else
//   {
//     winner = "PLAYER 2 WINS"
//   }
// }

// // Game Over Logic
function setGameOver(){
  gameOver = true;
  // Toggles between play space and the game over screen
  $catSpace.toggleClass('display-none');
  $resetScreen.toggleClass('display-none');
  // whoWon();
  // TODO Logic in whoWon not working
  // $resetScreen.html("<br><br>" +winner+ "<br><br>" + "<button class='play-again-btn'>Play Again?</button>")
}

// New Game Logic
function newGame(){
  gameOver = false;
  // finds the midpoint of the cat container, finds the mid point of the cat image, then places the cat at that midpoint
  // var containerMidpoint = $(this).parent().width() / 2
  // var catMidPoint = $cat.width() / 2
  // $cat.animate({marginLeft: containerMidpoint - catMidPoint},1000)
  $cat.animate({marginLeft: "236px"},1000)
  // $catSpace.toggleClass('display-none')
  $catSpace.attr("style" "z-axis:-1")
  $resetScreen.toggleClass('display-none')
  $p1Img.attr("src", "images/person1.png")
  $p2Img.attr("src", "images/person2.png")

  setMoves()
  newMoves()
  nextTurn()
  newCat()
  lockAllow = true
  turnCounter = 0
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

// Makes sure it is the right player's turn
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
  turnCounter ++;
  console.log("Turn Counter: " + turnCounter)
}

// Starts Game with moves on board and a new random cat
setMoves();
newMoves();
newCat();
