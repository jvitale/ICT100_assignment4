class RestaurantController{

    #restaurant = null;

    constructor (restaurantObj) {
        this.#restaurant = restaurantObj;
    }

    #getRobot(robotID){
        let robot = this.#restaurant.getRobotByID(robotID);
        if (robot === undefined){
            throw(Error(`Cannot find a robot with ID '${robotID}'. Perhaps there is a typo in the robotID.`));
        }
        return robot;
    }

    #getTable(tableID){
        let table = this.#restaurant.getTableByID(tableID);
        if (table === undefined){
            throw(Error(`Cannot find a table with ID '${tableID}'. Perhaps there is a typo in the tableID or you are using the wrong index.`));
        }
        return table;
    }

    whereIsRobot(robotID){
        let robot = this.#getRobot(robotID);
        let table = robot.whereIsRobot();
        if (table === null){
            throw(Error(`The robot is not attending any table. This is strange. 
            It might be a bug. Please check with the tutor or unit coordinator.`));
        }
        return table.getTableID();
    }

    isTableAttended(tableID){
        let table = this.#getTable(tableID);
        return table.isAttended();
    }

    whichRobotAtTable(tableID){
        let table = this.#getTable(tableID);
        let robot = table.getRobotAtTable();
        if (robot !== null){
            return robot.getRobotID();
        } else {
            return null;
        }
    }

    async acquireRobot(robotID){
        let robot = this.#getRobot(robotID);
        let acquireToken = await robot.acquire();
        return acquireToken;
    }

    releaseRobot(robotID, acquiredToken){
        let robot = this.#getRobot(robotID);
        return robot.release(acquiredToken);
    }

    isRobotAcquired(robotID){
        let robot = this.#getRobot(robotID);
        return !robot.canBeAcquired(robotID);
    }

    async teleportRobotAtTable(robotID, tableID){
        let robot = this.#getRobot(robotID);
        let table = this.#getTable(tableID);
        let outcome = await robot.teleportTo(table);
        return outcome;
    }
}