/*
This is some sample code.
You can copy and paste this code in the function robotChef() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// Subscribing to the weight sensor is similar to subscribing
// to the temperature and clock sensors, but this time
// you will not need to turn on a stove with food, as
// the weight sensor topic will publish a message whenever
// you subscribe to it and then at each time the number
// of plates on the returning window changes.
// So let's start by creating a callback function to log
// the message of the weight sensor topic
function logWeightMessage(msg){
    log(`Weight sensor message: ${JSON.stringify(msg)}`);
}

// then let's subscribe to the weight sensor topic
kitchenController.subscribe('weight_sensor', logWeightMessage);
// if you copy and paste the code up to the instruction above in
// the robotChef function and you start the simulation,
// you will see a message from the weight sensor topic
// informing you that there is one plate on the returning window

// we can then take that dirty plate and wash it to see what
// would happen in the log panel when we do so
// the method below will collect 1 plate from the returning window
// and place it in the inventory at the index returned by the method
// in this example we are storing the inventory index in the variable
// inventoryIdx
let inventoryIdx = await kitchenController.collectDirtyPlateFromReturningWindow();
// and we can log the inventoryIdx so to inspect its value
log(`The dirty plate is in the inventory at index ${inventoryIdx}`);
// and we can also clean the collected dirty plate to return it to
// the benchtop table.
// the method below needs to know at which inventory index the dirty plate
// to wash is stored. The plate will be washed and returned back
// at the same inventory index. 
await kitchenController.washDirtyPlateAtSink(inventoryIdx);
// if you copy and paste the code up to the instruction above
// in the function robotChef and you run the simulation
// now you will see two messages in the log panel,
// one with 1 plate (we get that when we subscribe to the weight sensor)
// and one with 0 paltes (we get that when we collect a dirty plate from the returning window)
// In the log panel you will also see the inventory index where the collected dirty plate was stored
// and you will also see the chef washing the dirty plate.

// we can then return the washed plate to the benchtop table
await kitchenController.storeCleanPlateOnBenchtop(inventoryIdx);

// if you need to collect more than one plate, you might want to use a loop
