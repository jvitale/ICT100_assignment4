/*
This is some sample code.
You can copy and paste this code in the function robotChef() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

let orders = kitchenController.getOrdersList();
// the log function used in the next instruction below is 
// a global function to log messages on the Log console
// differently from the console.log, you need to stringify object variables
// before logging them on the Log console with the method JSON.stringify
log(JSON.stringify(orders)); 
// or you can log them on the debugging console
console.log(orders);
// the orders are store in an array structure, so if you want
// to get the first order in the list you can write:
let firstOrder = orders[0];
// you can try to print the information about the order in the log console
log(JSON.stringify(firstOrder));
// and then we can also retrieve each single detail about the order
// for example the order id:
let orderID = firstOrder['order-id'];
// the cooking level required for the stake
let steakLevel = firstOrder['steak-level'];
// and the side chosen for this order
let sideType = firstOrder['side'];
// now we can log all this information
log(`The first order has ID = ${orderID}, it requires the stake to be cooked ${steakLevel} and it includes ${sideType} as a side.`);