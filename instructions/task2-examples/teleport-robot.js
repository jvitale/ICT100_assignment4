/*
This is some sample code.
You can copy and paste this code in the function safeTeleportTo() and see
what is the result.
You can re-use and adapt this code in your solution as you wish.
*/

// To teleport a robot you can use the method 
// restaurantController.teleportRobotAtTable(robotID, tableID)
// In this example, we will try to move the pink robot to the target table
// with the id stored in the parameter tableID
// but first, let's log where the pink robot is just for fun
// we can use the method below
let pinkLocation = restaurantController.whereIsRobot('pink');
log(`Pink is currently at table ${pinkLocation}`);
// And let's also find out if the target table is currenlty attended
// we can use the method below
let isThereARobot = restaurantController.isTableAttended(tableID);
if (isThereARobot){
    // It looks like there is a robot at the target table
    // Let's find out which robot is there
    // we can use the method below
    let otherRobot = restaurantController.whichRobotAtTable(tableID);
    // and let's log that information
    log(`It looks like there is another robot at ${tableID}: ${otherRobot}`);
    // Since there is already a robot at that table, we cannot move pink 
    // or else we will generate an error :(
} else {
    // the table is unattended!
    log(`The table ${tableID} is unattended!`);
    // we can now move pink
    // we can use the method below
    // the method needs the id of the robot to teleport and the id of
    // the destination table
    // This method is async, so if you want to wait until the teleportation
    // process is complete, you must use the keyword await
    let success = await restaurantController.teleportRobotAtTable('pink', tableID);

    //Please, note that the teleportation process may fail if:
    // 1) The robot you are currently trying to teleport is busy or 
    // acquired by another process (has the clock icon on top)
    // 2) The destination table is currently attended by another robot
    // This will depend on the random conditions for the scenario
    // at the time of the simulation.
    if (success){
        log(`This teleportation was a success!`);
    } else {
        log(`This teleportation was not a success :(`);
    }
}

// For the assignment you will need to teleport the correct robot
// with its id being the value stored in the parameter robotID
