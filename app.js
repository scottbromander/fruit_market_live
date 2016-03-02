/*
Prime Group jQuery Challenge
jQuery is great! It allows us to do so many things! You and your group will need
to flex everything you know about Javascript, jQuery, and Bootstrap to tackle
this challenge.

The Fruit Market
For this challenge, you will be working with 4 commodities; Apples, Oranges,
Bananas, and Grapes. Delicious, right?

When the application loads, you will need to have information for each of the
commodities, specifically the name and the ‘market price’ of each.

TODO: This information will need to be displayed in a meaningful way on the DOM.

TODO: Every 15 seconds, the prices should change however, and with it, the
listed price on the DOM.
  - Specifically, the market price of each of the items should fluctuate up or down
  50 cents (between 1 cent and 50 cents) with each 15 second interval.
  - Any given fruit is not allowed to go below a cost of 50 cents,
  or above the cost of 9 dollars and 99 cents.

The information displayed for each of the fruit should have a ‘button like’
functionality where the user can interact with each of the fruit displays.

Available to the user is a ‘total cash’ and an inventory display that shows
how much of each of the fruits they have purchased. Also in the user display,
should be an ‘average purchased price’, which shows, on average, how much money
they have spent on a given fruit in their inventory.

Meaning that by clicking on the display for each of the fruits, allows the
user to ‘buy’ one of the fruits, at market price, which will be deducted from the
total cash. The user is not allowed to spend more than they have.

The user will start with $100.

Hard Mode
Create a button below each of the Fruit buttons that allows the User to ‘sell’
one of their fruits of the same type at the current market price. This will
also remove one from their inventory. The user should be not able to sell fruits
they do not already own.

Pro Mode
Limit the application experience to five minutes. At the end, stop the price
fluctuation, sell all of the fruits in their inventory at current market price,
and then display the total money they earned from the experience.

Master Mode
Try your hand at styling everything using Bootstrap!
*/

//CONFIGURATION VARS
var playerStartingCash = 100;
var fruitArray = ["Apples", "Oranges", "Bananas", "Grapes"];
var fruitStartingPrice = 5;
var priceSwing = 0.5;
var maxFruitPrice = 10.00;
var minFruitPrice = 0.50;

var user = new User();

//CORE APPLICATION

$(document).ready(function(){
    init();
});

function init(){
  for(var i = 0; i < fruitArray.length; i++){
      var fruit = new Fruit(fruitArray[i]);
      fruitArray[i] = fruit;

      user[fruit.name.toLowerCase() + "Inventory"] = [];
  }

  constructMarket();
  enabled();
  var gameTimer = setInterval(gameInterval, 2000);
}

function enabled(){
  $(".fruit-market").on("click", ".buy", buyFruit);
  $(".fruit-market").on("click", ".sell", sellFruit);
}

function gameInterval(){
  for(var i = 0; i < fruitArray.length; i++){
    var fruit = fruitArray[i];
    fruit.adjustPrice();
  }

  constructMarket();
}

function buyFruit(){
    var fruit = $(this).parent().data("fruit");
    for(var i = 0; i < fruitArray.length; i++){
        if(fruit == fruitArray[i].name){
          if(user.totalCash >= fruitArray[i].marketPrice){
            user.totalCash -= fruitArray[i].marketPrice;
            user.totalCash = user.totalCash.toFixed(2);
            user[fruitArray[i].name.toLowerCase() + "Inventory"].push(fruitArray[i].marketPrice);
          }
        }
    }
    constructMarket();
}

function sellFruit(){
  var fruit = $(this).parent().data("fruit");
  for(var i = 0; i < fruitArray.length; i++){
      if(fruit == fruitArray[i].name){
          var fruitInvRef = user[fruitArray[i].name.toLowerCase() + "Inventory"];

          //get market price
          //remove from inventory
          if(fruitInvRef.length > 0){
            fruitInvRef.pop();
            console.log("ARE YOU A STRING? ", user.totalCash);
            user.totalCash = parseFloat(user.totalCash) + parseFloat(fruitArray[i].marketPrice);
            constructMarket();
          }

      }
  }
}

//DOM METHODS
function constructMarket(){
  //build the whole market
  //point the user
  //probably use the fruit to help me construct the individual fruits

  $(".player-info").empty();
  $(".player-info").append("<p>TOTAL PLAYER CASH: " + user.totalCash + "</p>");

  $(".fruit-market").empty();
  for(var i = 0; i < fruitArray.length; i++){
    var fruit = fruitArray[i];

    buildFruitDisplay(fruit);


  }
}

function buildFruitDisplay(fruit){

  //build the individual cells

  var fruitInvRef = user[fruit.name.toLowerCase() + "Inventory"];

  $(".fruit-market").append("<div class='col-md-2'></div>");
  var $el = $(".fruit-market").children().last();

  $el.append("<button class='btn btn-info buy'>" + fruit.name + "</button>");
  $el.data("fruit", fruit.name);
  $el.append("<p>" + fruit.marketPrice + "</p>");
  $el.append("<button class='btn btn-success sell'> Owned : " + fruitInvRef.length + "</p>");
  $el.append("<p>Avg Price Paid: " + avgFruitPrice(fruitInvRef) + "</p>");
}

function avgFruitPrice(fruitInvRef){
  var total = 0;
  if(fruitInvRef.length > 0){
    for(var i = 0; i < fruitInvRef.length; i++){
        total += fruitInvRef[i];
    }

    total = total / fruitInvRef.length;
    total = total.toFixed(2);
  }



  for(var i = 0; i < fruitInvRef.length; i++){
    fruitInvRef[i] = parseFloat(total);
  }

  console.log( total, fruitInvRef);

  return total;
}

//CONSTRUCTOR FUNCTIONS
function Fruit(name){
  this.name = name;
  this.marketPrice = fruitStartingPrice;
  this.adjustPrice = function(){
      var adjustmentType = randomNumber(1,2);
      if(adjustmentType == 2){
        adjustmentType = -1;
      }

      var individualPriceAdjustment = priceSwing * 100; //.5 = 50, .25 = 25
      individualPriceAdjustment = randomNumber(1, individualPriceAdjustment);
      individualPriceAdjustment /= 100;
      individualPriceAdjustment *= adjustmentType;

      //toFixed
      this.marketPrice = this.marketPrice + individualPriceAdjustment;
      this.marketPrice = parseFloat(this.marketPrice.toFixed(2));

      //TODO : REALLY STRANGE NUMBER THING, COMEBACK TO ME

      if(this.marketPrice > maxFruitPrice){
        this.marketPrice = maxFruitPrice;
      } else if (this.marketPrice < minFruitPrice) {
        this.marketPrice = minFruitPrice;
      }
  };
}

function User(){
  this.startingCash = playerStartingCash; //will not change
  this.totalCash = this.startingCash; //will change as we play
  //Need something for each fruit, meaning some sort of Inventory for each fruit
  //that also captures price.
  //Dynamic?
  //To track how much paid, I am going create an Array for each fruit, that stores price.
  // appleInventory = [1,1,1,1,1,1,1,1,2,2,2,2];
}

//UTILITY FUNCTIONS
function randomNumber(min, max){
  return Math.floor(Math.random() * (1 + max - min) + min);
}
