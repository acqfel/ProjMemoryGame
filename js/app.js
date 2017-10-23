/*
 * Create a list that holds all of your cards
 */
let diamond = '<li class="card"><i class="fa fa-diamond"></i></li>';
let paperPlane = '<li class="card"><i class="fa fa-paper-plane-o"></i></li>';
let anchor = '<li class="card"><i class="fa fa-anchor"></i></li>';
let bolt = '<li class="card"><i class="fa fa-bolt"></i></li>';
let cube = '<li class="card"><i class="fa fa-cube"></i></li>';
let leaf = '<li class="card"><i class="fa fa-leaf"></i></li>';
let bycicle = '<li class="card"><i class="fa fa-bicycle"></i></li>';
let bomb = '<li class="card"><i class="fa fa-bomb"></i></li>';

let allCards = [diamond,diamond,paperPlane,paperPlane,anchor,anchor,bolt,bolt,
                cube,cube,leaf,leaf,bycicle,bycicle,bomb,bomb];
let deckId;
let listOpenCards = [];
let blockClick = false;
let movesNumber = 0;
let cardsMatched = 0;
let counterTime = 0;
let myInterval;
let starsNumber = 3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// @description Shuffle the list of cards
shuffle(allCards);

// @description Loop through each card and create its HTML
deckId = $('#deck');

function cardHtml(array) {
    for (let i=0 ; i<array.length; i++){
        deckId.append(array[i]);
    }
    //return console.log(i);
}

// @description post cards on the deck
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

// @description restart the game
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
    starsNumber = 3;
    startTime();
}

// @description Event listener for a restart button
$( '.restart' ).on( 'click', 'i', function( evt ) {
    let clicked = $( evt.target );
    restart();
    //console.log(clicked);
});

// @description Event listener for a play again button
$( '.modal-footer' ).on( 'click', '#play-again', function( evt ) {
    let clicked = $( evt.target );
    restart();
    console.log("Play again btn: "+clicked);
});

 // @description Time Elapsed - Clock
function startTime() {
     myInterval = setInterval(function () {
         ++counterTime;
         $('#txt').text(counterTime);
     }, 1000);
 }

startTime();

 // @description Event listener for a card
 $( '#deck' ).on( 'click', 'li', function( evt ) {
     let clickedCard = $( evt.target );

     if (!blockClick) {
         clickedCard.addClass('disable-click');
         openShow(clickedCard);
     }
     //console.log(evt);
 });

// @description display the card's symbol
function openShow(card){
    card.addClass('open show2');
    openCards(card);
}

// @description add card open to listOpenCards
function openCards(card){
    let x = card.children().attr('class');
    console.log(x);
    // block 'click' in open card
    //card.off("click");
    //add card to listOpenCards
    listOpenCards.push(card);
    console.log(listOpenCards);

    checkCards();
}

// @description calculates the star rating based on the number of moves
function starRating() {
    if ( movesNumber === 20 ) {
        $('.stars li:nth-child(1)').children().removeClass('rating');
        starsNumber--;
    }
    if ( movesNumber === 40 ) {
        $('.stars li:nth-child(2)').children().removeClass('rating');
        starsNumber--;
    }
}

// @description check to see if the two cards match
function checkCards(){
    if (listOpenCards.length === 2) {
        // add +1 to Moves - update star rating
        movesNumber++;
        starRating();
        $('.moves').text(movesNumber);
        //
        let classCard1 = listOpenCards[0].children().attr('class');
        let classCard2 = listOpenCards[1].children().attr('class');
        //console.log(classCard1,classCard2);
        // block to choice other cards
        blockClick = true;
        // compare if the cards are the same
        if (classCard1 === classCard2){
            lockCards();
        }
        else {
            flipCards();
        }
    }
}

// @description cards do match, lock the cards in the open position
function lockCards() {

    listOpenCards[0].removeClass('open show2').addClass('match');
    listOpenCards[1].removeClass('open show2').addClass('match');
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
                if (cardsMatched == 8){
                    $('#myModal').modal('toggle');
                    $('#moves-number').text(movesNumber);
                    $('#counter-time').text(counterTime);
                    $('#stars-number').text(starsNumber);
                    // window.confirm("You Win\n"+
                    //                 "Moves: "+movesNumber+
                    //                 "\nTime elapsed: "+counterTime+" seconds");
                    //restart();
                }

        });

    }

// @description cards do not match
function flipCards() {
    cardEffect();

}

// @description generates the effect fade Out and In (jQuery)
function cardEffect() {
    listOpenCards[0].delay(300).fadeOut("slow").fadeIn("slow");
    listOpenCards[1].delay(300).fadeOut("slow").fadeIn("slow", function() {
        hideCards();
    });
    //hideCards();
}

// @description Hide the cards
function hideCards() {
    console.log(listOpenCards);
    listOpenCards[0].removeClass("open show2");
    listOpenCards[1].removeClass("open show2");
    listOpenCards[0].removeClass("disable-click");
    listOpenCards[1].removeClass("disable-click");
    removeCardsFromList();

}

// @description Removes the cards from the list that stores them
function removeCardsFromList() {
    listOpenCards.shift();
    listOpenCards.shift();
    console.log("pos: ",listOpenCards);
    // unblock to choice other cards
    blockClick = false;
}
