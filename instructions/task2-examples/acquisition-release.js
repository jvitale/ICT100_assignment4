/*
This is some sample code.
You can copy and paste this code in the function safeTeleportTo() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// For this example we will try to acquire and release pink
// First, we need to declare a variable for the acquisition token
// The acquisition token is an ID referring to the current acquisition
// that we can use later on to release such acquisition
let acquisitionToken;

// Then, it is good practice to wrap the acquisition-release process 
// in a try-catch-finally statement
try{
    // We can now acquire the pink robot with the method below
    // This method is async, so if you want to block the execution
    // of the script until the robot gets available for acquisition
    // you must use the keyword await
    acquisitionToken = await restaurantController.acquireRobot('pink');
    log(`Pink was acquired`);

    // at this point you might want to teleport the robot to the target table
    // this action may result in an error
    let success = await restaurantController.teleportRobotAtTable('pink', tableID);
    log(`Was a success? ${success}`);
} catch(err){
    // if an error occurs in the try block
    // we can catch it here and handle it
    // In this example we will limit to log it in the console
    log(`An error occurred: ${err.message}`);
} finally {
    // This block is always executed after the try-catch, with or without errors
    // In here you want to make sure that you release your robot
    // we can do so with the method below
    // This method needs the robot id to release and the acquisition token
    // we retrieved at the time of acquisition
    restaurantController.releaseRobot('pink', acquisitionToken);
    log(`Pink was released`);
}

// If you want to check if a robot has already been acquired,
// you can do so with the method below
// For example, we can check if pink is still acquired
// by some process
let isPinkAcquired = restaurantController.isRobotAcquired('pink');
if (isPinkAcquired){
    log(`Pink is still acquired`);
} else {
    log(`Pink is not acquired`);
}
// This method may be useful in some situations, for example
// if you are considering using a recursive call on safeTeleportTo