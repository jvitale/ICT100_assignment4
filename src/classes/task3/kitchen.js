class Kitchen{

    #tickTime = 15;
    #errNoOrderID = (orderID) => `There is no order with ID '${orderID}'.`;
    #errOrderAlreadyCompleted = (orderID) => `The order with ID '${orderID}' was already completed.`;
    #errWrongOrder = (orderID, steakOrdered, sideOrdered, steakServed, sideServed) => `The order with ID '${orderID}' required a steak (${steakOrdered}) with ${sideOrdered} but it was served a steak (${steakServed}) with ${sideServed} instead.`;

    constructor (guiManager) {
        this._guiManager = guiManager;
        this._pubSubManager = new PubSubManager(false);
        this._subIDs = [];
        this._ordersList = [];
        this._ordersCompleted = [];
        this._collectingMeal = false;
        this._returningPlates = false;
        this._speed = 1;

        this._stations = [];
        this._stations.push(new KitchenStove());
        this._stations.push(new Sink());
        this._stations.push(new Benchtop(3));
        this._stations.push(new ServingWindow(this._pubSubManager));
        this._stations.push(new ReturningWindow(this._pubSubManager));
        this._stations.push(new RefrigeratingRoom(() => this.getSpeed()));
        this._robotChef = new RobotChef('chef');
        this._robotServer = new RobotChef('server');
        this._robotWaiter = new RobotChef('waiter');
        this._inventory = new Inventory(5);

        // positioning
        this.getKitchenStationByID('stove').setStationPosition(20, 100, 0);
        this.getKitchenStationByID('sink').setStationPosition(110, 100, 0);
        this.getKitchenStationByID('benchtop').setStationPosition(218, 150, 0);
        this.getKitchenStationByID('serving-window').setStationPosition(300, 400, 0);
        this.getKitchenStationByID('returning-window').setStationPosition(20, 400, 0);
        this.getKitchenStationByID('refrigerating-room').setStationPosition(530, 200, 0);

        //place one dirty plate
        let bt = this.getKitchenStationByID('benchtop');
        let plate = bt.removePlate();
        this.getKitchenStationByID('returning-window').placeDirtyPlate(plate);

        this._robotChef.setChefPosition(40, 195, 0);
        this._robotChef.setLocation('stove');

        this._sensorsStatus = false;
    }

    setOrdersList(ordersList){
        this._ordersList = ordersList;
        this._ordersCompleted = [];
    }

    getOrdersList(){
        let orders = [];
        for (let i = 0; i < this._ordersList.length; i++){
            let order = {
                'order-id': this._ordersList[i]['order-id'],
                'steak-level': this._ordersList[i]['steak-level'],
                'side': this._ordersList[i]['side']
            }
            orders.push(order);
        }
        return orders;
    }

    async getOrdersCompleted(){
        while(this._returningPlates){
            await this.tick(100);
        }
        return this._ordersCompleted;
    }

    setSpeed(speedTimes){
        this._speed = speedTimes;
    }

    getSpeed(){
        return this._speed;
    }

    async _returnDirtyPlates(msg){
        let rndTime = 8000 + Math.floor(Math.random() * 7000);
        await this.tick(rndTime);
        while(this._returningPlates){
            await this.tick(100);
        }
        this._returningPlates = true;
        let plates = msg['plates'];
        let cvSize = this._guiManager.getMainCanvasSize();
        let rw = this.getKitchenStationByID('returning-window');
        let rwPos = rw.getStationPosition();
        let rwSize = rw.getStationSize();
        let x = rwPos[0] + Math.floor(rwSize[0] / 2);
        this._robotWaiter.setChefPosition(x, cvSize[1]);
        this._robotWaiter.getHTMLElement().displayTo(this._guiManager.getMainCanvas());
        let targetY = rwPos[1] + rwSize[1] + 5;
        do {
            let waiterPos = this._robotWaiter.getChefPosition();
            if (waiterPos[1] <= targetY){
                break;
            }
            this._robotWaiter.setChefPosition(waiterPos[0], waiterPos[1]-1, 0);
            await this.tick(70);
        } while(true);
        for (let i = 0; i < plates.length; i++){
            rw.placeDirtyPlate(plates[i]);
            await this.tick(1000);
        }
        targetY = cvSize[1] + 50;
        do {
            let waiterPos = this._robotWaiter.getChefPosition();
            if (waiterPos[1] >= targetY){
                break;
            }
            this._robotWaiter.setChefPosition(waiterPos[0], waiterPos[1]+1, 180);
            await this.tick(70);
        } while(true);
        this._guiManager.getMainCanvas().removeChild(this._robotWaiter.getHTMLElement().getContainerElement());
        this._returningPlates = false;
    }

    async _collectMeal(){
        if (this._collectingMeal){
            return;
        }
        let cvSize = this._guiManager.getMainCanvasSize();
        try{
            this._collectingMeal = true;
            await this.tick(1000);
            let sw = this.getKitchenStationByID('serving-window');
            let swPos = sw.getStationPosition();
            let swSize = sw.getStationSize();
            let x = swPos[0] + Math.floor(swSize[0] / 2);
            this._robotServer.setChefPosition(x, cvSize[1]);
            this._robotServer.getHTMLElement().displayTo(this._guiManager.getMainCanvas());
            let targetY = swPos[1] + swSize[1] + 5;
            do {
                let serverPos = this._robotServer.getChefPosition();
                if (serverPos[1] <= targetY){
                    break;
                }
                this._robotServer.setChefPosition(serverPos[0], serverPos[1]-1, 0);
                await this.tick(70);
            } while(true);

            let errors = [];
            let collectedPlates = [];
            while(sw.getNumServedMeals() > 0){
                let meal = sw.collectMeal();
                collectedPlates.push(meal);
                await this.tick(1000);
                let mealInfo = meal.getMealInfo();
                let orderIdx = null;
                for (let i = 0; i < this._ordersList.length; i++){
                    let curOrder = this._ordersList[i];
                    if (curOrder['order-id'] === mealInfo['order-id']){
                        orderIdx = i;
                        break;
                    }
                }
                if (orderIdx === null){
                    errors.push(Error(this.#errNoOrderID(mealInfo['order-id'])));
                    continue;
                }
                if (this._ordersCompleted.includes(mealInfo['order-id'])){
                    errors.push(Error(this.#errOrderAlreadyCompleted(mealInfo['order-id'])));
                    continue;
                }
                let order = this._ordersList[orderIdx];
                if (order['steak-level'] === mealInfo['steak']['status'] && order['side'] === mealInfo['side']['type']){
                    this._ordersCompleted.push(mealInfo['order-id']);
                    this._guiManager.logScore(`Served a correct order! OrderID = ${mealInfo['order-id']}`);
                } else {
                    errors.push(Error(this.#errWrongOrder(mealInfo['order-id'], order['steak-level'], order['side'], mealInfo['steak']['status'], mealInfo['side']['type'])));
                    continue;
                }
            }
            if (collectedPlates.length > 0){
                this._pubSubManager.publish('return_plates', {'plates': collectedPlates});
            }
            for (let i = 0; i < errors.length; i++){
                throw(errors[i]);
            }
        } catch(err){
            this._guiManager.logWarning(`${err.message} The prepared meal will not be counted as a successful meal.`);
        } finally {
            let targetY = cvSize[1] + 50;
            do {
                let serverPos = this._robotServer.getChefPosition();
                if (serverPos[1] >= targetY){
                    break;
                }
                this._robotServer.setChefPosition(serverPos[0], serverPos[1]+1, 180);
                await this.tick(70);
            } while(true);
            this._guiManager.getMainCanvas().removeChild(this._robotServer.getHTMLElement().getContainerElement());
            this._collectingMeal = false;
        }
    }

    async startTemperatureSensor(){
        let temperatures = {};
        while (this._sensorsStatus === true){
            let stove = this.getKitchenStationByID('stove');
            let hasChanged = false;
            for (let i = 1; i <= 4; i++){
                let temp = stove.getFoodTemperature(i);
                if (Object.keys(temperatures).length === 0 || temp !== temperatures[`stove-${i}`]){
                    hasChanged = true;
                }
                temperatures[`stove-${i}`] = temp;
            }
            if (hasChanged){
                this._pubSubManager.publish('temperature_sensor', temperatures);
            }
            await this.tick(500);
        }
    }

    async startClock(){
        let times = {};
        while (this._sensorsStatus === true){
            let stove = this.getKitchenStationByID('stove');
            let hasChanged = false;
            for (let i = 1; i <= 4; i++){
                let curTime = null;
                if (stove.getCookingTime(i) !== null)
                    curTime = Math.floor(stove.getCookingTime(i) / 1000);
                if (Object.keys(times).length === 0 || curTime !== times[`stove-${i}`]){
                    hasChanged = true;
                }
                times[`stove-${i}`] = curTime;
            }
            if (hasChanged){
                this._pubSubManager.publish('stove_clock', times);
            }
            await this.tick(500);
        }
    }

    startSensors(){
        this._sensorsStatus = true;
        this.startTemperatureSensor();
        this.startClock();
        let subIDMeal = this._pubSubManager.subscribe('meal_ready', 
        async (msg) => {
            await this._collectMeal();
        }
        );
        //this._subIDs.push(subIDMeal);
        let subIDPlate = this._pubSubManager.subscribe('return_plates',
        async (msg) => {
            await this._returnDirtyPlates(msg);
        }
        );
        //this._subIDs.push(subIDPlate);
    }

    stopSensors(){
        this._sensorsStatus = false;
        for (let i = 0; i < this._subIDs.length; i++){
            this._pubSubManager.unsubscribe(this._subIDs[i]);
        }
    }

    getKitchenStationByID(stationID){
        for (let i = 0; i < this._stations.length; i++){
            if (this._stations[i].getStationID() === stationID){
                return this._stations[i];
            }
        }
        return null;
    }

    getKitchenStations(){
        return this._stations;
    }

    getRobotChef(){
        return this._robotChef;
    }

    getInventory(){
        return this._inventory;
    }

    isRobotChefAvailable(){
        return this._robotChef.isAvailable();
    }

    async moveChefTo(stationID){
        if (this._robotChef.getLocation() === 'moving'){
            throw(Error(`The chef is already moving. You must wait until the chef arrived at destination before moving again. Try using 'await' or 'Promise.then'.`));
        }
        if (this._robotChef.getLocation() === stationID){
            return true;
        }

        this._robotChef.setLocation('moving');
        this._robotChef.setAvailable(false);

        let station = this.getKitchenStationByID(stationID);
        let chef = this.getRobotChef();

        let stationPos = station.getStationPosition();
        let stationSize = station.getStationSize();
        let chefSize = chef.getChefSize();
        let chefPos = chef.getChefPosition();

        // moving on the x plane
        let step;
        let xTarget;
        if (stationID === 'refrigerating-room'){
            xTarget = stationPos[0] - chefSize[0];
        } else {
            xTarget = stationPos[0] - Math.floor(chefSize[0]/2) + Math.floor(stationSize[0] / 2);
        }
        if (xTarget > chefPos[0]){
            this._robotChef.rotate(90);
            step = 1;
        } else {
            this._robotChef.rotate(-90);
            step = -1;
        }

        let stop = false;
        while(!stop){
            let curChefPos = this._robotChef.getChefPosition();
            if (curChefPos[0] === xTarget){
                stop = true;
                break;
            } else {
                this._robotChef.setChefPosition(curChefPos[0] + step, curChefPos[1], curChefPos[2]);
                await this.tick();
            }
        }

        // move on the y plane
        let yTarget;
        if (stationID === 'refrigerating-room'){
            yTarget = stationPos[1]  + Math.floor(stationSize[1] / 2) - Math.floor(chefSize[1] / 2);
        } else {
            if (stationID === 'serving-window' || stationID === 'returning-window'){
                yTarget = stationPos[1] - 45;
            } else {
                yTarget = stationPos[1] + stationSize[1] + 5;
            }
        }
        if (yTarget > chefPos[1]){
            this._robotChef.rotate(180);
            step = 1;
        } else {
            this._robotChef.rotate(0);
            step = -1;
        }

        
        stop = false;
        while(!stop){
            let curChefPos = this._robotChef.getChefPosition();
            if (curChefPos[1] === yTarget){
                stop = true;
                break;
            } else {
                this._robotChef.setChefPosition(curChefPos[0], curChefPos[1] + step, curChefPos[2]);
                await this.tick();
            }
        }
        if (stationID === 'refrigerating-room'){
            this._robotChef.rotate(90);
        }

        await this.tick(500);

        this._robotChef.setLocation(stationID);
        this._robotChef.setAvailable(true);
    }

    publish(topic, msg){
        this._pubSubManager.publish(topic, msg);
    }

    subscribe(topic, callback){
        return this._pubSubManager.subscribe(topic, callback);
    }

    unsubscribe(subscriberID){
        return this._pubSubManager.unsubscribe(subscriberID);
    }

    tick(waitTime) {
        if (waitTime === undefined)
            waitTime = this.#tickTime
        waitTime = Math.floor(waitTime / this._speed);
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }
}