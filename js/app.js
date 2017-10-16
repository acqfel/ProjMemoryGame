/*
 * Create a list that holds all of your cards
 */
var diamond = '<li class="card"><i class="fa fa-diamond"></i></li>';
var paperPlane = '<li class="card"><i class="fa fa-paper-plane-o"></i></li>';
var anchor = '<li class="card"><i class="fa fa-anchor"></i></li>';
var bolt = '<li class="card"><i class="fa fa-bolt"></i></li>';
var cube = '<li class="card"><i class="fa fa-cube"></i></li>';
var leaf = '<li class="card"><i class="fa fa-leaf"></i></li>';
var bycicle = '<li class="card"><i class="fa fa-bicycle"></i></li>';
var bomb = '<li class="card"><i class="fa fa-bomb"></i></li>';

var allCards = [diamond,diamond,paperPlane,paperPlane,anchor,anchor,bolt,bolt,
                cube,cube,leaf,leaf,bycicle,bycicle,bomb,bomb];
var deckId;
var listOpenCards = [];
var blockClick = false;
var movesNumber = 0;
var cardsMatched = 0;
var counterTime = 0;
var myInterval;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Shuffle the list of cards
shuffle(allCards);

// Loop through each card and create its HTML
deckId = $('#deck');

function cardHtml(array) {
    for (var i=0 ; i<array.length; i++){
        deckId.append(array[i]);
    }
    //return console.log(i);
}

// post cards on the deck
cardHtml(allCards);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function restart() {
    listOpenCards = [];
    blockClick = false;
    movesNumber = 0;
    cardsMatched = 0;
    counterTime = 0;
    // to stop the counter
    clearInterval(myInterval);

    //$("#deck").children().removeClass("match");
    $("#deck").empty();

    shuffle(allCards);
    cardHtml(allCards);
    $('.moves').text(movesNumber);
    $('.stars li').children().addClass('rating');
    startTime();


}

//Event listener for a restart button
$( '.restart' ).on( 'click', 'i', function( evt ) {
    var clicked = $( evt.target );
    restart();
    console.log(clicked);
});

 // Time Elapsed - Clock
function startTime() {
     myInterval = setInterval(function () {
         ++counterTime;
         $('#txt').text(counterTime);
     }, 1000);
 }

startTime();

 // Event listener for a card
 $( '#deck' ).on( 'click', 'li', function( evt ) {
     var clickedCard = $( evt.target );

     if (!blockClick) {
        openShow(clickedCard);
     }
     //console.log(evt);
 });

//display the card's symbol
function openShow(card){
    card.addClass('open show');
    openCards(card);
}

// add card open to listOpenCards
function openCards(card){
    var x = card.children().attr('class');
    console.log(x);
    //add card to listOpenCards
    listOpenCards.push(card);
    console.log(listOpenCards);
    movesNumber++;
    starRating();
    $('.moves').text(movesNumber);
    checkCards();
}

function starRating() {
    if ( movesNumber === 4 ) {
        $('.stars li:nth-child(1)').children().removeClass('rating');
    }
    if ( movesNumber === 6 ) {
        $('.stars li:nth-child(2)').children().removeClass('rating');
    }
}

// check to see if the two cards match
function checkCards(){
    if (listOpenCards.length === 2) {
        var classCard1 = listOpenCards[0].children().attr('class');
        var classCard2 = listOpenCards[1].children().attr('class');
        //console.log(classCard1,classCard2);
        // block to choice other cards
        blockClick = true;

        if (classCard1 === classCard2){
            lockCards();
        }
        else {
            flipCards();
        }
    }
}

//cards do match, lock the cards in the open position
function lockCards() {

    listOpenCards[0].removeClass('open show').addClass('match');
    listOpenCards[1].removeClass('open show').addClass('match');
    listOpenCards[0].animate({
            height: '+=10px',
            width: '+=10px'
        },100).animate({
        	height: '-=10px',
            width: '-=10px'
        },100).animate({
            height: '+=10px',
            width: '+=10px'
        },100).animate({
        	height: '-=10px',
            width: '-=10px'
        },100);
    listOpenCards[1].animate({
            height: '+=10px',
            width: '+=10px'
        },100).animate({
        	height: '-=10px',
            width: '-=10px'
        },100).animate({
            height: '+=10px',
            width: '+=10px'
        },100).animate({
        	height: '-=10px',
            width: '-=10px'
        },100, function() {
                listOpenCards[0].off("click");
                listOpenCards[1].off("click");
                listOpenCards.shift();
                listOpenCards.shift();
                // unblock to choice other cards
                blockClick = false;
                cardsMatched++;
                if (cardsMatched == 2){

                    window.confirm("You Win\n"+
                                    "Moves: "+movesNumber+
                                    "\nTime elapsed: "+counterTime+" seconds");
                    restart();
                }

        });

    }

//cards do not match
function flipCards() {
    cardEffect();

}

function cardEffect() {
    listOpenCards[0].delay(300).fadeOut("slow").fadeIn("slow");
    listOpenCards[1].delay(300).fadeOut("slow").fadeIn("slow", function() {
        hideCards();
    });
    //hideCards();
}

function hideCards() {
    console.log(listOpenCards);
    listOpenCards[0].removeClass("open show");
    listOpenCards[1].removeClass("open show");
    removeCardsFromList();

}

function removeCardsFromList() {
    listOpenCards.shift();
    listOpenCards.shift();
    console.log("pos: ",listOpenCards);
    // unblock to choice other cards
    blockClick = false;
}


// to stop the counter
// clearInterval(myInterval);