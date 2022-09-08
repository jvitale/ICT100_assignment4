/*
This is some sample code.
You can copy and paste this code in the function robotChef() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// to subscribe to a topic of the game you can use
// the method kitchenController.subscribe(topicName, callback)
// However, to use this method we also need a callback function
// to invoke when a new message is published on the desired topic.
// So let's create a simple callback function that just log
// the message gathered by the subscriber
function logTemperatureMessage(msg){
    log(`Temperature sensor msg: ${JSON.stringify(msg)}`);
}

// Now that we have a callback, we can subscribe to the
// topic for the temperature sensors and use that callback
// to handle every new message
kitchenController.subscribe('temperature_sensor', logTemperatureMessage);
// if you copy and paste the code up to the instruction above
// and run the simulation, you will not see any output in the log panel
// the reason is that the temperature sensors will only update once
// there is food on at least one stove and the stove is on.
// So let's start from grabbing a steak
let steakInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('steak');
// and let's place this steak on a stove
// the method below needs the inventory index where to take the food from
// and the index of the stove to use. The stove index can be 1, 2, 3 or 4
// in this example we will use the first stove, so index 1
await kitchenController.placeFoodOnStove(steakInventoryIndex, 1);
// then we need to turn on the stove
// Again, for this method we need to provide the index of the stove
// we want to turn on, in this case it is the first stove, so 1
kitchenController.turnOnFire(1);
// If you copy and paste the code up to the instruction above in the robotChef function
// and you run the simulation, now you will be able to see
// the messages from the temperature sensor after the robot will place food
// on the stove and turn the fire on.

// we can also subscribe to the stove clock sensor and log the messages for
// this topic. Let's create a new callback function similar to the first one
function logClockMessage(msg){
    log(`Stove clock msg: ${JSON.stringify(msg)}`);
}
// and then let's subscribe to it using the function above as its callback
kitchenController.subscribe('stove_clock', logClockMessage);
// if you copy and paste the code up to the instruction above and
// start the simulation, you will now see also the messages from the
// stove clock. This is because there is already food cooking on the stove
// so the stove_clock sensor will publish any updates in terms of cooking
// time for the stoves with food currently cooking.