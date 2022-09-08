class Table {

    #tableClass = 'table';
    #tableLabelClass = 'table-label';

    constructor (tableNumber) {
        this._tableID = `table-${tableNumber}`;
        this._htmlElement = new GraphicElement(this._tableID, this.#tableClass, this.#tableLabelClass, tableNumber);
        this._attendedByRobot = null;
    }

    getTableSize(){
        return this._htmlElement.getElementSize();
    }

    getTablePosition(){
        return this._htmlElement.getElementPosition();
    }

    setTablePosition(x, y, rotation){
        this._htmlElement.setElementPosition(x, y, rotation);
    }

    getRobotAtTable(){
        return this._attendedByRobot;
    }

    setRobotAtTable(robotObj){
        this._attendedByRobot = robotObj;
    }

    getTableID(){
        return this._tableID;
    }

    getHTMLElement(){
        return this._htmlElement;
    }

    isAttended(){
        return this._attendedByRobot !== null;
    }
}