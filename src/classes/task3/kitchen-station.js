class KitchenStation{

    constructor (stationID, tileClass, labelClass, stationLabel) {
        this._kitchenStationID = stationID;
        this._tileClass = tileClass;
        this._labelClass = labelClass;
        this._htmlElement = new GraphicElement(this._kitchenStationID, this._tileClass, this._labelClass, stationLabel);
    }

    getStationID(){
        return this._kitchenStationID;
    }

    getStationSize(){
        try{
            return this._htmlElement.getElementSize();
        } catch (err){
            return null;
        }
        
    }

    getStationPosition(){
        try{
            return this._htmlElement.getElementPosition();
        } catch(err){
            return null;
        }
    }

    setStationPosition(x, y, rotation){
        try{
            this._htmlElement.setElementPosition(x, y, rotation);
        } catch(err){}
    }

    getHTMLElement(){
        return this._htmlElement;
    }
}

class Pan {

    #panClass = 'pan';

    constructor(elementID){
        this._htmlElement = new GraphicElement(elementID, this.#panClass, '', '');
        this._food = null;
        this._cooking = false;
    }

    getFood(){
        return this._food;
    }

    collectFood(){
        let foodItem = this._food;
        foodItem.stopCooking();
        this._htmlElement.getContainerElement().removeChild(foodItem.getHTMLElement().getContainerElement());
        this._food = null;
        return foodItem;
    }

    setFood(foodItem){
        foodItem.setElementPosition(5, 10, 0);
        foodItem.displayTo(this._htmlElement.getContainerElement());
        this._food = foodItem;
    }

    setElementPosition(x, y, rotation){
        this._htmlElement.setElementPosition(x, y, rotation);
    }

    displayTo(parentElement){
        this._htmlElement.displayTo(parentElement);
    }
}

class Food {

    constructor(elementID, elementClass, speedFunction){
        this._foodID = elementID;
        this._htmlElement = new GraphicElement(elementID, elementClass, '', '');
        this._foodType = elementClass;
        this._foodStatus = 'uncooked';
        this._isCooking = false;
        this._currentTemperature = 20;
        this._currentCookingTime = 0;
        this._speedFunction = speedFunction;
    }

    sleep(waitTime) {
        waitTime = Math.floor(waitTime / this._speedFunction());
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    async startCooking(){
        this._isCooking = true;
        while (this._isCooking){
            let rndTime = 250 + Math.floor(Math.random() * 1500);
            let rndTempIncrease = 1 + Math.floor(Math.random() * 2);
            await this.sleep(rndTime);
            if (this._isCooking){
                this._currentCookingTime += rndTime;
                this._currentTemperature += rndTempIncrease;
                this._setStatus();
            }
        }
    }

    stopCooking(){
        this._isCooking = false;
    }

    _setStatus(){
        let prevFoodStatus = this._foodStatus;
        let timeSec = Math.floor(this._currentCookingTime / 1000);
        switch (this._foodType){
            case 'steak':
                if (this._currentTemperature < 52){
                    this._foodStatus = 'uncooked';
                } else if (this._currentTemperature < 57){
                    this._foodStatus = 'rare';
                } else if (this._currentTemperature < 62){
                    this._foodStatus = 'medium rare';
                } else if (this._currentTemperature < 67){
                    this._foodStatus = 'medium';
                } else if (this._currentTemperature < 72){
                    this._foodStatus = 'medium well';
                } else if (this._currentTemperature < 77){
                    this._foodStatus = 'well done';
                } else {
                    this._foodStatus = 'overcooked';
                }
                break;
            case 'vegetables':
                if (timeSec < 7){
                    this._foodStatus = 'uncooked';
                } else if (timeSec < 13){
                    this._foodStatus = 'cooked';
                } else {
                    this._foodStatus = 'overcooked';
                }
                break;
            case 'mashed-potatoes':
                if (timeSec < 9){
                    this._foodStatus = 'uncooked';
                } else if (timeSec < 16){
                    this._foodStatus = 'cooked';
                } else {
                    this._foodStatus = 'overcooked';
                }
        }
    }

    getTemperature(){
        return this._currentTemperature;
    }

    getCookingTime(){
        return this._currentCookingTime;
    }

    getFoodStatus(){
        return this._foodStatus;
    }

    getHTMLElement(){
        return this._htmlElement;
    }

    setElementPosition(x, y, rotation){
        this._htmlElement.setElementPosition(x, y, rotation);
    }

    displayTo(parentElement){
        this._htmlElement.displayTo(parentElement);
    }

    getItemInfo(){
        return {
            'type': this._foodType,
            'status': this._foodStatus
        }
    }

    toStringDescription(){
        return `${this._foodType} (${this._foodStatus})`;
    }
}

class Plate {

    constructor(elementID){
        this._plateID = elementID;
        this._htmlElement = new GraphicElement(elementID, 'plate', 'plate-label', '');
        this._type = 'plate';
        this._status = 'clean';
        this._meal = {'steak': null, 'side': null};
        this._orderID = null;
    }

    setLabel(label){
        this._htmlElement.setLabel(label);
    }

    getLabel(label){
        return this._htmlElement.getLabel();
    }

    setStatus(status){
        // status can be clean, dirty or meal
        switch(status){
            case 'clean':
                this._htmlElement.setCSSClass('plate');
                break;
            case 'dirty':
                this._htmlElement.setCSSClass('plate dirty');
                break;
            case 'meal':
                this._htmlElement.setCSSClass('plate meal');
                break;
            default:
                this._htmlElement.setCSSClass('plate');
                status = 'plate';
                break;
        }
        this._status = status;
    }

    getStatus(){
        return this._status;
    }

    isMealReady(){
        return this._meal['steak'] !== null && this._meal['side'] !== null && this._orderID !== null;
    }

    prepareMeal(steak, side, orderID){
        this._meal['steak'] = steak;
        this._meal['side'] = side;
        this._orderID = orderID
        this.setElementPosition(40, 0, 0);
        this.setStatus('meal');
    }

    getHTMLElement(){
        return this._htmlElement;
    }

    setElementPosition(x, y, rotation){
        this._htmlElement.setElementPosition(x, y, rotation);
    }

    displayTo(parentElement){
        this._htmlElement.displayTo(parentElement);
    }

    getMealInfo(){
        if (this.isMealReady()){
            return {
                'steak': this._meal['steak'].getItemInfo(),
                'side': this._meal['side'].getItemInfo(),
                'order-id': this._orderID
            }
        } else {
            return null;
        }
    }

    getItemInfo(){
        return {
            'type': this._type,
            'status': this._status
        }
    }

    toStringDescription(){
        let desc;
        if (this._status === 'meal'){
            desc = `meal (oID: ${this._orderID}): ${this._meal['steak'].toStringDescription()} with ${this._meal['side'].getItemInfo()['type']}`;
        } else {
            let status = this._status;
            desc = `${status} plate`;
        }
        return desc;
    }
}

class KitchenStove extends KitchenStation{

    #foodClasses = {
        'steak': 'steak',
        'vegetables': 'vegetables',
        'mashed-potato': 'mashed-potato'
    }

    #panPositions = {
        1: [10, 5],
        2: [50, 5],
        3: [10, 40],
        4: [50, 40]
    };

    constructor () {
        super('stove', 'kitchen-stove', 'kitchen-stove-label', 'stove');
        this._firesStatus = {
            1: false,
            2: false,
            3: false,
            4: false
        }

        this._pans = {
            1: null,
            2: null,
            3: null,
            4: null
        }

        for (let i = 1; i <= 4; i++){
            this._displayPan(i);
        }

    }

    _displayPan(stoveFireIdx){
        let pan = new Pan(`pan-${stoveFireIdx}`);
        this._pans[stoveFireIdx] = pan;
        let panPos = this.#panPositions[stoveFireIdx];
        pan.setElementPosition(panPos[0], panPos[1]);
        pan.displayTo(this._htmlElement.getContainerElement());
    }

    getNumberOfFires(){
        return Object.keys(this._firesStatus).length;
    }

    isStoveFireAvailable(stoveFireIdx){
        let food = this._pans[stoveFireIdx].getFood();
        return food === null;
    }

    placeFood(foodItem, stoveFireIdx){
        let pan = this._pans[stoveFireIdx];
        pan.setFood(foodItem);
        if (this._firesStatus[stoveFireIdx] === true){
            foodItem.startCooking();
        }
    }

    collectFood(stoveFireIdx){
        let pan = this._pans[stoveFireIdx];
        let foodItem = pan.collectFood();
        return foodItem;
    }

    getFoodTemperature(stoveFireIdx){
        let foodItem = this._pans[stoveFireIdx].getFood();
        if (foodItem !== null){
            return foodItem.getTemperature();
        } else {
            return null;
        }
    }

    getCookingTime(stoveFireIdx){
        let foodItem = this._pans[stoveFireIdx].getFood();
        if (foodItem !== null){
            return foodItem.getCookingTime();
        } else {
            return null;
        }
    }

    getStoveFireStatus(stoveFireIdx){
        return this._firesStatus[stoveFireIdx];
    }

    turnOnFire(stoveFireIdx){
        this._firesStatus[stoveFireIdx] = true;
        // check if there is food on the pan
        let food = this._pans[stoveFireIdx].getFood();

        if (food !== null){
            food.startCooking();
        }
    }

    turnOffFire(stoveFireIdx){
        this._firesStatus[stoveFireIdx] = false;

        // check if there is food on the pan
        let food = this._pans[stoveFireIdx].getFood();

        if (food !== null){
            food.stopCooking();
        }
    }

    isStoveFireOn(stoveFireIdx){
        return this._firesStatus[stoveFireIdx];
    }
    
}

class RefrigeratingRoom extends KitchenStation{

    constructor (speedFunction) {
        super('refrigerating-room', 'kitchen-refrigerating-room', 'kitchen-refrigerating-room-label', 'refrigerating room');
        this._currentFoodIdx = 0;
        this._speedFunction = speedFunction;
    }

    getFood(foodType){
        this._currentFoodIdx++;
        return new Food(`food-${this._currentFoodIdx}`, foodType, () => this._speedFunction());
    }

    getSteak(){
        return this.getFood('steak');
    }

    getVegetables(){
        return this.getFood('vegetables');
    }

    getMashedPotatoes(){
        return this.getFood('mashed-potatoes');
    }
}

class Benchtop extends KitchenStation{

    constructor (maxPlates) {
        super('benchtop', 'kitchen-benchtop', 'kitchen-benchtop-label', 'benchtop table');
        this._cleanPlates = [];
        this._progressiveID = 0;
        this._maxPlates = maxPlates;

        for (let i = 0; i < this._maxPlates; i++){
            this.addPlate();
        }
    }

    addPlate(plate){
        if (plate === undefined){
            this._progressiveID++;
            plate = new Plate(`plate-${this._progressiveID}`);
        }
        this._cleanPlates.push(plate);
        plate.setElementPosition(0, 0, 0);
        plate.setLabel(this._cleanPlates.length);
        plate.displayTo(this._htmlElement.getContainerElement());
    }

    removePlate(){
        if (this._cleanPlates.length > 0){
            let plate = this._cleanPlates.pop();
            plate.setLabel('');
            return plate;
        } else {
            return null;
        }
    }

    hidePlate(plate){
        this._htmlElement.getContainerElement().removeChild(plate.getHTMLElement().getContainerElement());
    }

    getNumOfCleanPlates(){
        return this._cleanPlates.length;
    }
}

class ServingWindow extends KitchenStation{

    constructor (pubSubManager) {
        super('serving-window', 'kitchen-serving-table', 'kitchen-serving-table-label', 'serving window');
        this._meals = [];
        this._pubSubManager = pubSubManager;
    }

    serveMeal(mealPlate){
        this._meals.push(mealPlate);
        mealPlate.setElementPosition((this._meals.length - 1) * 30, 0, 0);
        mealPlate.setLabel('');
        mealPlate.displayTo(this._htmlElement.getContainerElement());
        this._pubSubManager.publish('meal_ready', {});
    }

    collectMeal(){
        if (this._meals.length > 0){
            let mealPlate = this._meals.pop();
            this._htmlElement.getContainerElement().removeChild(mealPlate.getHTMLElement().getContainerElement());
            return mealPlate;
        } else {
            return null;
        }
    }

    getNumServedMeals(){
        return this._meals.length;
    }
}

class ReturningWindow extends KitchenStation{

    constructor (pubSubManager) {
        super('returning-window', 'kitchen-serving-table', 'kitchen-serving-table-label', 'returning window');
        this._dirtyPlates = [];
        this._pubSubManager = pubSubManager;
    }

    publishWeight(){
        this._pubSubManager.publish('weight_sensor', {'plates-number': this._dirtyPlates.length});
    }

    placeDirtyPlate(plate){
        this._dirtyPlates.push(plate);
        plate.setStatus('dirty');
        plate.setElementPosition((this._dirtyPlates.length - 1) * 30, 0, 0);
        plate.setLabel('');
        plate.displayTo(this._htmlElement.getContainerElement());
        
        this.publishWeight();
    }

    collectPlate(){
        if (this._dirtyPlates.length > 0){
            let dirtyPlate = this._dirtyPlates.pop();
            this._htmlElement.getContainerElement().removeChild(dirtyPlate.getHTMLElement().getContainerElement());
            this.publishWeight();
            return dirtyPlate;
        } else {
            return null;
        }
    }

    getNumDirtyPlates(){
        return this._dirtyPlates.length;
    }
}

class Sink extends KitchenStation{

    constructor () {
        super('sink', 'kitchen-sink', 'kitchen-sink-label', 'sink');
    }

    washDirtyPlate(plate){
        plate.setStatus('clean');
        plate.setLabel('');
    }

    sinkOn(){
        this._htmlElement.setCSSClass('kitchen-sink sink-bubbles');
    }

    sinkOff(){
        this._htmlElement.setCSSClass('kitchen-sink');
    }
}

