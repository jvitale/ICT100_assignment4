class KitchenController{

    #errInventoryFull = `The inventory is full. You cannot take any more items. You first need to empty a slot from the inventory.`;
    #errStoveIdx = (val, maxN) => `The stove ID '${val}' is an invalid value. The stove ID can be a number from 1 to ${maxN}.`;
    #errInventoryIdx = (val, maxN) => `The inventory ID '${val}' is an invalid value. The inventory ID can be a number from 1 to ${maxN}.`;
    #errStoveUnavailable = (val) => `There is already food in the pan for the stove fire at index '${val}'. You need to first remove food from the pan before placing other food.`;
    #errNotFoodForStove = (val) => `The item '${val} is not food that can be cooked on the stove.`;
    #errNoFoodOnStove = (val) => `There is no food on the stove fire at index ${val}.`;
    #errChefUnavailable = `The robot chef is performing another action and cannot perform a new one until the previous action is complete. Try using 'await' or Promise.then`;
    #errRestrictedTopic = (topic) => `The topic '${topic} is a restricted topic. You cannot publish messages on this topic, only subscribe to it.`;
    #errNotASteak = (invIdx, itemType) => `The item at the index ${invIdx} of the inventory is a '${itemType}' and not a steak.`;
    #errNotASide = (invIdx, itemType) => `The item at the index ${invIdx} of the inventory is a '${itemType}' and not a side ('vegetables' or 'mashed potatoes').`;
    #errNotAMeal = (invIdx) => `The item at the index ${invIdx} of the inventory is not a meal and it cannot be served.`;
    #errNotADirtyPlate = (invIdx) => `The item at the index ${invIdx} of the inventory is not a dirty plate and it cannot be washed at the sink.`;
    #errNotACleanPlate = (invIdx) => `The item at the index ${invIdx} of the inventory is not a clean plate and it cannot be stored on the benchtop table.`;
    #errNotAFood = (invIdx) => `The item at the index ${invIdx} of the inventory is not food and it cannot be thrown away.`;
    #errWrongSteakLevel = (steakLevel) => `The steak's cooking level '${steakLevel}' cannot be used to prepare a meal. Only the following levels are allowed: 'rare', 'medium rare', 'medium', 'medium well', 'well done'.`;
    #errWrongSideLevel = (sideLevel) => `The side's cooking level '${sideLevel}' cannot be used to prepare a meal. Only 'cooked' sides are allowed for meals.`;
    #noMoreCleanPlates = `There are no more clean plates at the benchtop. Consider collecting the dirty plates from the returning window and clean them.`;
    #errWrongSpeed = (speedVal) => `The value ${speedVal} for the game's speed is not a valid value. A valid speed value is an integer between 1 and 10.`;
    #errNoDirtyPlates = `There are no dirty plates available for collection at the returning window.`;
    #errNoItemAt = (invIdx) => `There is no item at index ${invIdx} of the inventory.`;

    #kitchen = null;

    constructor (kitchenObj){
        this.#kitchen = kitchenObj;
    }

    #getStationID(kitchenStation){
        switch (kitchenStation){
            case 'stove':
                return 'stove';
            case 'sink':
                return 'sink';
            case 'benchtop':
                return 'benchtop';
            case 'benchtop-table':
                return 'benchtop';
            case 'benchtop table':
                return 'benchtop';
            case 'serving-window':
                return 'serving-window';
            case 'serving window':
                return 'serving-window';
            case 'returning window':
                return 'returning-window';
            case 'returning-window':
                return 'returning-window';
            case 'refrigerating room':
                return 'refrigerating-room';
            case 'refrigerating-room':
                return 'refrigerating-room';
            default:
                return false;
        }
    }

    #getFoodTypeID(foodType){
        switch(foodType){
            case 'steak':
                return 'steak';
            case 'vegetables':
                return 'vegetables';
            case 'veggies':
                return 'veggies';
            case 'mashed potatoes':
                return 'mashed-potatoes';
            case 'mashed-potatoes':
                return 'mashed-potatoes';
            default:
                return false;
        }
    }

    #whichItemAt(inventoryIndex){
        let inventory = this.#kitchen.getInventory();
        let item = inventory.whichItemAt(inventoryIndex);
        if (item === null){
            throw(Error(this.#errNoItemAt(inventoryIndex)));
        }
        return item;
    }

    getOrdersList(){
        let orders = this.#kitchen.getOrdersList();
        return orders;
    }

    setSpeed(speedTimes){
        if (speedTimes < 1 || speedTimes > 10){
            throw(Error(this.#errWrongSpeed(speedTimes)));
        }
        this.#kitchen.setSpeed(speedTimes);
    }

    #moveChefTo(kitchenStation){
        let stationIdx = this.#getStationID(kitchenStation);
        if (stationIdx === false){
            throw(Error(`The station ID '${kitchenStation}' is not a valid ID.`));
        }
        if (!this.#kitchen.isRobotChefAvailable()){
            throw(Error(this.#errChefUnavailable));
        }
        return this.#kitchen.moveChefTo(stationIdx);
    }

    async getFoodFromRefrigeratingRoom(foodType){
        await this.#moveChefTo('refrigerating-room');

        let foodID = this.#getFoodTypeID(foodType);
        if (foodID === false){
            throw(Error(`The food type '${foodType}' is not a valid type. Food can be either 'steak', 'vegetables' or 'mashed potatoes'.`));
        }
        let inventory = this.#kitchen.getInventory();
        let indexes = inventory.getEmptyIndexes();
        if (indexes.length === 0){
            throw(Error(this.#errInventoryFull));
        }
        let refrigeratingRoom = this.#kitchen.getKitchenStationByID('refrigerating-room');
        let food = refrigeratingRoom.getFood(foodType);
        inventory.setItemAt(food, indexes[0]);
        return indexes[0];
    }

    #checkStoveIndex(stoveIndex){
        let stove = this.#kitchen.getKitchenStationByID('stove');
        let maxN = stove.getNumberOfFires();
        if (stoveIndex < 1 || stoveIndex > maxN){
            throw(Error(this.#errStoveIdx(stoveIndex, maxN)));
        }
    }

    isStoveFireAvailable(stoveIndex){
        this.#checkStoveIndex(stoveIndex);
        let stove = this.#kitchen.getKitchenStationByID('stove');
        return stove.isStoveFireAvailable(stoveIndex);
    }

    isStoveFireOn(stoveIndex){
        this.#checkStoveIndex(stoveIndex);
        let stove = this.#kitchen.getKitchenStationByID('stove');
        return stove.isStoveFireOn(stoveIndex);
    }

    async placeFoodOnStove(inventoryIndex, stoveIndex){
        await this.#moveChefTo('stove');

        this.#checkStoveIndex(stoveIndex);
        let stove = this.#kitchen.getKitchenStationByID('stove');
        let inventory = this.#kitchen.getInventory();
        let maxNInv = inventory.getMaxItems();
        if(!stove.isStoveFireAvailable(stoveIndex)){
            throw(Error(this.#errStoveUnavailable(stoveIndex)));
        }
        if (inventoryIndex < 1 || inventoryIndex > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndex, maxNInv)));
        }
        let invItem = this.#whichItemAt(inventoryIndex);
        if (invItem['type'] !== 'steak' && invItem['type'] !== 'vegetables' && invItem['type'] !== 'mashed-potatoes'){
            throw(Error(this.#errNotFoodForStove(invItem['type'])));
        }
        
        let food = inventory.getItemAt(inventoryIndex);
        stove.placeFood(food, stoveIndex);
    }

    async getFoodFromStove(stoveIndex){
        await this.#moveChefTo('stove');

        this.#checkStoveIndex(stoveIndex);
        let stove = this.#kitchen.getKitchenStationByID('stove');
        if(stove.isStoveFireAvailable(stoveIndex)){
            throw(Error(this.#errNoFoodOnStove(stoveIndex)));
        }
        let inventory = this.#kitchen.getInventory();
        let indexes = inventory.getEmptyIndexes();
        if (indexes.length === 0){
            throw(Error(this.#errInventoryFull));
        }

        let food = stove.collectFood(stoveIndex);
        inventory.setItemAt(food, indexes[0]);
        return indexes[0];
    }

    turnOnFire(stoveFireIdx){
        this.#checkStoveIndex(stoveFireIdx);
        let stove = this.#kitchen.getKitchenStationByID('stove');
        stove.turnOnFire(stoveFireIdx);
    }

    turnOffFire(stoveFireIdx){
        this.#checkStoveIndex(stoveFireIdx);
        let stove = this.#kitchen.getKitchenStationByID('stove');
        stove.turnOffFire(stoveFireIdx);
    }

    async prepareMealOnBenchtop(inventoryIndexSteak, inventoryIndexSide, orderID){
        await this.#moveChefTo('benchtop');

        let inventory = this.#kitchen.getInventory();
        let benchtop = this.#kitchen.getKitchenStationByID('benchtop');

        let maxNInv = inventory.getMaxItems();
        if (inventoryIndexSteak < 1 || inventoryIndexSteak > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndexSteak, maxNInv)));
        }
        if (inventoryIndexSide < 1 || inventoryIndexSide > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndexSide, maxNInv)));
        }
        let invSteak = this.#whichItemAt(inventoryIndexSteak);
        let invSide = this.#whichItemAt(inventoryIndexSide);
        if (invSteak['type'] !== 'steak'){
            throw(Error(this.#errNotASteak(inventoryIndexSteak, invSteak['type'])));
        }
        if (invSide['type'] !== 'vegetables' && invSide['type'] !== 'mashed-potatoes'){
            throw(Error(this.#errNotASide(inventoryIndexSide, invSide['type'])));
        }
        let validSteakLevels = ['rare', 'medium rare', 'medium', 'medium well', 'well done'];
        if (!validSteakLevels.includes(invSteak['status'])){
            throw(Error(this.#errWrongSteakLevel(invSteak['status'])));
        }
        if (invSide['status'] != 'cooked'){
            throw(Error(this.#errWrongSideLevel(invSide['status'])));
        }
        if (benchtop.getNumOfCleanPlates() <= 0){
            throw(Error(this.#noMoreCleanPlates));
        }

        let steak = inventory.getItemAt(inventoryIndexSteak);
        let side = inventory.getItemAt(inventoryIndexSide);
        let plate = benchtop.removePlate();
        plate.prepareMeal(steak, side, orderID);
        await this.#tick(1500);
        benchtop.hidePlate(plate);
        let indexes = inventory.getEmptyIndexes();
        inventory.setItemAt(plate, indexes[0]);
        return indexes[0];
    }

    async serveMealOnServingWindow(inventoryIndex){
        await this.#moveChefTo('serving-window');

        let inventory = this.#kitchen.getInventory();
        let sw = this.#kitchen.getKitchenStationByID('serving-window');

        let maxNInv = inventory.getMaxItems();
        if (inventoryIndex < 1 || inventoryIndex > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndex, maxNInv)));
        }
        let item = this.#whichItemAt(inventoryIndex);
        if (item['type'] !== 'plate' || item['status'] !== 'meal'){
            throw(Error(this.#errNotAMeal(inventoryIndex)));
        }
        
        let meal = inventory.getItemAt(inventoryIndex);
        sw.serveMeal(meal);
    }

    async collectDirtyPlateFromReturningWindow(){
        await this.#moveChefTo('returning-window');

        let inventory = this.#kitchen.getInventory();
        let rw = this.#kitchen.getKitchenStationByID('returning-window');
        let indexes = inventory.getEmptyIndexes();
        if (indexes.length === 0){
            throw(Error(this.#errInventoryFull));
        }
        if (rw.getNumDirtyPlates() <= 0){
            throw(Error(this.#errNoDirtyPlates));
        }

        let plate = rw.collectPlate();
        inventory.setItemAt(plate, indexes[0]);
        return indexes[0];
    }

    async washDirtyPlateAtSink(inventoryIndex){
        await this.#moveChefTo('sink');

        let inventory = this.#kitchen.getInventory();
        let sink = this.#kitchen.getKitchenStationByID('sink');
        let maxNInv = inventory.getMaxItems();
        if (inventoryIndex < 1 || inventoryIndex > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndex, maxNInv)));
        }
        let item = this.#whichItemAt(inventoryIndex);
        if (item['type'] !== 'plate' || item['status'] !== 'dirty'){
            throw(Error(this.#errNotADirtyPlate(inventoryIndex)));
        }

        sink.sinkOn();
        let plate = inventory.getItemAt(inventoryIndex);
        sink.washDirtyPlate(plate);
        await this.#tick(1500);
        inventory.setItemAt(plate, inventoryIndex);
        sink.sinkOff();
    }

    async storeCleanPlateOnBenchtop(inventoryIndex){
        await this.#moveChefTo('benchtop');

        let inventory = this.#kitchen.getInventory();
        let benchtop = this.#kitchen.getKitchenStationByID('benchtop');
        let maxNInv = inventory.getMaxItems();
        if (inventoryIndex < 1 || inventoryIndex > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndex, maxNInv)));
        }
        let item = this.#whichItemAt(inventoryIndex);
        if (item['type'] !== 'plate' || item['status'] !== 'clean'){
            throw(Error(this.#errNotACleanPlate(inventoryIndex)));
        }
        
        let plate = inventory.getItemAt(inventoryIndex);
        await this.#tick(1000);
        benchtop.addPlate(plate);
    }

    async throwAwayFoodAtSink(inventoryIndex){
        await this.#moveChefTo('sink');

        let inventory = this.#kitchen.getInventory();
        let maxNInv = inventory.getMaxItems();
        if (inventoryIndex < 1 || inventoryIndex > maxNInv){
            throw(Error(this.#errInventoryIdx(inventoryIndex, maxNInv)));
        }
        let item = this.#whichItemAt(inventoryIndex);
        let validTypes = ['steak', 'vegetables', 'mashed-potatoes'];
        if (!validTypes.includes(item['type'])){
            throw(Error(this.#errNotAFood(inventoryIndex)));
        }
        let food = inventory.getItemAt(inventoryIndex);
        return true;
    }

    publish(topic, msg){
        // restricted topics
        let restricted = true;
        switch (topic){
            case 'temperature_sensor': break;
            case 'stove_clock': break;
            case 'meal_ready': break;
            case 'return_plates': break;
            default:
                restricted = false;
        }
        if (restricted){
            throw(Error(this.#errRestrictedTopic(topic)));
        }
        this.#kitchen.publish(topic, msg);
    }

    subscribe(topic, callback){
        let subID = this.#kitchen.subscribe(topic, callback);
        if (topic === 'weight_sensor'){
            let rw = this.#kitchen.getKitchenStationByID('returning-window');
            rw.publishWeight();
        }
        return subID;
    }

    unsubscribe(subscriberID){
        return this.#kitchen.unsubscribe(subscriberID);
    }

    async #tick(waitTime){
        if (waitTime === undefined)
            waitTime = 100 + Math.floor(Math.random() * 350);
        await this.#kitchen.tick(waitTime);
    }

    async waitOnCondition(conditionFunction){
        let wait;
        do{
            wait = !conditionFunction();
            await this.#tick();
        }while(wait);
    }

}