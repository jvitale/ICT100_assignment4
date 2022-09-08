/*
This is some sample code.
You can copy and paste this code in the function robotChef() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// This time we would like to subscribe to a topic
// and then unsubscribe to it once a certain condition has been met.
// Let's create a callback function for the temperature sensor
// that will update a boolean global variable once a certain temperature
// on the first stove has been reached
// Let's first declare the global variable we will use
let temperatureHasReached = false;

function updateWhenTemperatureReached(msg){
    // we need to read the temperature for the first stove
    // that's in the property 'stove-1' of the 
    // object literal msg
    let currentTemperature = msg['stove-1'];
    // we can log this temperature in the log panel
    log(`Current temperature is ${currentTemperature} degrees`);

    // if the temperature is above 53 degrees
    // we will update a global variable
    if (currentTemperature >= 53){
        temperatureHasReached = true;
    } else {
        temperatureHasReached = false;
    }
}

// now let's subscribe to the temperature sensor with this callback
// this time we will also store the subscriberID in a variable
// so that we can unsubscribe to this topic later on
let subID = kitchenController.subscribe('temperature_sensor', updateWhenTemperatureReached);

// now let's grab some food and place it on the stove
// but first, to speed up the game time, let's use the method below
// the speed can be an integer between 1 and 10
// the higher the number is, the faster the game will run
kitchenController.setSpeed(5);

// grabbing a steak
let steakInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('steak');
// placing it on the first stove
await kitchenController.placeFoodOnStove(steakInventoryIndex, 1);
// and turn on the fire
kitchenController.turnOnFire(1);

// At this point we would like to wait until the desired temperature
// has been reached.
// To wait on a specific condition we can use 
// the method kitchenController.waitOnCondition(conditionFunction)
// this method takes a function as a parameter
// this function must returns true if the condition has been met
// or false if the condition has not been met
// in our case the function can be defined as following
let conditionFunction = () => {
    if (temperatureHasReached){
        return true;
    } else {
        return false;
    }
}
// now that we have a function meeting the requirements for the
// method waitOnCondition, let's use it
await kitchenController.waitOnCondition(conditionFunction);
// remember to use the await keyword!

// at this point the chef will wait until the temperature has been reached
// since we are using await in the above instruction, the instructions
// below will be executed only after the desired temperature has been reached
// At this point we would like to unsubscribe from the topic
// by using the subscriber ID we stored in the variable we declared before
kitchenController.unsubscribe(subID);
// once we do so, you will see that the logs of the current
// temperature will stop to appear in the log panel

// and we can also collect the food from the stove
// to use the method below we need to specify the stove id with the food we
// want to collect. In this case the first stove, so 1.
let cookedSteakInventoryIdx = await kitchenController.getFoodFromStove(1);
// the method returns the inventory index where the cooked food has been stored
// you can log it in the log panel if you want
log(`Collected cooked steak and placed it at inventory index ${cookedSteakInventoryIdx}`);

// then we can turn off the fire
// the method below requires the stove id
// of the stove we need to turn off
kitchenController.turnOffFire(1);

