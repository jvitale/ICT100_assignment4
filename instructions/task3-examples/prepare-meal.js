/*
This is some sample code.
You can copy and paste this code in the function robotChef() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// To run the simulation faster, let's increase the speed
kitchenController.setSpeed(5);

// A meal needs a steak and a side
// The steak must not be undercooked or overcooked
// The side must be cooked for the right amount of time
// In this example let's cook a rare steak with a side of veggies
// First we need the two ingredients from the refrigerating room
let steakInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('steak');
let veggiesInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('vegetables');
log('Food collected!');

// Now we can place the food on two stove fires
await kitchenController.placeFoodOnStove(steakInventoryIndex, 1);
await kitchenController.placeFoodOnStove(veggiesInventoryIndex, 2);
log('Food placed on the stove!');

// we need a function to monitor the temperature of the steak
// and turn off the fire when the temperature is reached
let steakTemperatureReached = false
function updateWhenSteakReady(msg){
    let currentTemperature = msg['stove-1'];
    if (currentTemperature >= 53){
        if (!steakTemperatureReached)
            log('The desired temperature for the steak has been reached!')
        steakTemperatureReached = true;
        kitchenController.turnOffFire(1);
    } else {
        steakTemperatureReached = false;
    }
}

// and we also need a function to monitor the time for the veggies
// and turn off the fire when the time is reached
let veggiesTimeReached = false;
function updateWhenVeggiesReady(msg){
    let currentTime = msg['stove-2'];
    if (currentTime >= 8){
        if(!veggiesTimeReached)
            log('The desired time for the veggies has been reached!')
        veggiesTimeReached = true;
        kitchenController.turnOffFire(2);
    } else {
        veggiesTimeReached = false;
    }
}

// now we can set the subscribers
let steakSubID = kitchenController.subscribe('temperature_sensor', updateWhenSteakReady);
let veggiesSubID = kitchenController.subscribe('stove_clock', updateWhenVeggiesReady);

// then we can turn on the fires
kitchenController.turnOnFire(1);
kitchenController.turnOnFire(2);
log('Fires are on!');

// and wait until both the meals are ready
// (remember that when in an arrow function you do not
// use the { } block, the function will return the value
// produced by the single instruction in the function)
await kitchenController.waitOnCondition(
    () => steakTemperatureReached && veggiesTimeReached
);
log('Both the steak and the veggies are ready!');

// At this point the food is ready!
// we need to unsubscribe and collect the food
kitchenController.unsubscribe(steakSubID);
kitchenController.unsubscribe(veggiesSubID);
let cookedSteakIdx = await kitchenController.getFoodFromStove(1);
let cookedVeggiesIdx = await kitchenController.getFoodFromStove(2);
log('Food collected from the stove!');

// Now we can plate the meal
// You can use the method kitchenController.prepareMealOnBenchtop(steakInventoryIndex, sideInventoryIndex, orderID)
// This method takes the inventory index of the cooked steak you want to use for preparing the meal
// the inventory index of the cooked side you want to use for preparing the meal
// and an order ID.
// The method returns the inventory index where the meal is stored
let orderID = 1234; // a sample ID used for this sample code (in your solution you should get this information from the orders list)
let mealInventoryIdx = await kitchenController.prepareMealOnBenchtop(cookedSteakIdx, cookedVeggiesIdx, orderID);
log('The meal has been prepared!');

// And serve it
// the method below requires the inventory index where the prepared meal is stored
await kitchenController.serveMealOnServingWindow(mealInventoryIdx);
log('The meal has been served!');

// Congratulation! The meal will be served and consumed by the guests
// If the simulation is still running, after a period of time, 
// a robot waiter will bring back the dirty plates
// on the returning window.
