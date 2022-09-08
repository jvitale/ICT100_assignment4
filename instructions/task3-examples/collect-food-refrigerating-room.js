/*
This is some sample code.
You can copy and paste this code in the function robotChef() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// let's say we want to get a steak
let steakInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('steak');
// the method above is an async method. That means that we need to use the keyword await
// so that we wait for the robot chef to reach the refrigerating room and collect the food
// before moving to the next instruction.
// Now that the previous action is completed, we can inspect the value of the variable
// steakInventoryIndex
log(`steak index: ${steakInventoryIndex}`); 
// this is the inventory's index where our steak was stored.
// let's get some vegetables as well
let veggiesInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('vegetables');
// and let's inspect the new inventory's index for the collected vegetables
log(`vegetables index: ${veggiesInventoryIndex}`);
// you can also collect mashed-potatoes
let mashedPotatoesInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('mashed-potatoes');
log(`mashed potatoes index: ${mashedPotatoesInventoryIndex}`);
// if you need to throw away food (for example to empty an inventory's slot)
// you can do so with the following method
// this method requires the inventory index of the food you want to throw away
// in this case we are throwing away the mashed potatos
await kitchenController.throwAwayFoodAtSink(mashedPotatoesInventoryIndex);

// Note! if you copy the following instructions you will generate errors
// These instructions are here just to show you the potential errors
// you may generate by using this method

// Error 1: wrong food type
// You cannot collect food that is not available in the game, for example ice-cream
let icecreamInventoryIndex = await kitchenController.getFoodFromRefrigeratingRoom('ice-cream');

// Error 2: no space in the inventory
// If you try to collect food when your inventory is full, you will get an error as well!
// you can try to generate this type of error by using this loop
for (let i = 0; i < 10; i++){
    let curIdx = await kitchenController.getFoodFromRefrigeratingRoom('steak');
}
