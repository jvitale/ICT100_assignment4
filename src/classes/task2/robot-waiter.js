class RobotWaiter {

    #portalClass = 'portal';
    #botClass = 'robot-waiter';

    constructor(colour) {
        this._robotID = colour;
        this._htmlElement = new GraphicElement(`robot-${colour}`, `robot-waiter colour-${colour}`, 'agent-label', colour);
        this._curRobotTable = null;
        this._currentAction = null;
        this._nextAcquisitionToken = 0;
        this._acquisitionTokens = [];
    }

    getHTMLElement(){
        return this._htmlElement;
    }

    whereIsRobot(){
        return this._curRobotTable;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    #displayPortalTile(){
        this._htmlElement.getTileElement().classList.value = `${this.#portalClass} colour-${this.getRobotID()}`;
    }

    #displayRobotTile(){
        this._htmlElement.getTileElement().classList.value = `${this.#botClass} colour-${this.getRobotID()}`;
    }

    isAvailable(){
        return this._currentAction === null;
    }

    getRobotID(){
        return this._robotID;
    }

    async acquire(){
        let token = this._nextAcquisitionToken++;
        if (this._acquisitionTokens.length == 0){
            this._acquisitionTokens.push([token, () => {}]);
            this._htmlElement.setStatus('clock', '');
        } else {
            // there was already an acquisition
            let acquisitionPromise = new Promise(
                (resolve) => {
                    this._acquisitionTokens.push([
                        token,
                        () => {
                            resolve();
                        }
                    ]);
                }
            );
            await acquisitionPromise;
        }
        return token;
    }

    release(token) {
        let tokenIdx = this._acquisitionTokens.findIndex((value) => {return value[0] === token});
        if (tokenIdx >= 0){
            this._acquisitionTokens.splice(tokenIdx,1);
            if (this._acquisitionTokens.length > 0){
                // execute the resolve function for the first token in queue
                let resolve = this._acquisitionTokens[0][1];
                if (resolve !== undefined){
                    resolve();
                }
            } else {
                this._htmlElement.setStatus('', '');
            }
            return true;
        } else {
            return false;
        }
    }

    canBeAcquired(){
        return this._acquisitionTokens.length == 0;
    }

    // private
    #startProcess(actionName){
        if (this._currentAction !== null){
            // bot already busy, throw error
            let error = `${this._robotID} is currently busy processing another action: ${actionName}`;
            throw(Error(error));
        }

        // set a new lock
        this._currentAction = actionName;
    }

    //to hide in the game wrapper
    moveToTable(tableObj){
        if (this._curRobotTable !== null)
            this._curRobotTable.setRobotAtTable(null);
        tableObj.setRobotAtTable(this);
        this._curRobotTable = tableObj;
        let tableSize = tableObj.getTableSize();
        let tablePosition = tableObj.getTablePosition();

        this._htmlElement.setElementPosition(
            tablePosition[0] + tableSize[0] + 5,
            tablePosition[1] + Math.floor(tableSize[1] / 2),
            -90
        );
    }

    // private
    #endProcess(){
        this._currentAction = null;
    }

    // public
    async teleportTo(table){
        this.#startProcess(`teleportTo(${table._tableID})`);
        try{
            let teleportationTime = parseInt(2000 + Math.random() * 5000);

            let robotAtTable = table.getRobotAtTable();
            if (robotAtTable !== null){
                if (robotAtTable === this) {
                    // this robot already there, no waiting time
                    teleportationTime = 1;
                } else {
                    let error = `${this.getRobotID()} cannot teleport to ${table.getTableID()} because 
                    that table is already attended by ${robotAtTable.getRobotID()}`;
                    throw(Error(error));
                }
            }
            
            this.#displayPortalTile();

            // immediately teleporting
            this.moveToTable(table);
            
            await this.sleep(teleportationTime);

            this.#displayRobotTile();
        } catch (error) {
            throw(error);
        } finally {
            this.#endProcess();
        }
        
        return true;
    }

    resetRobot(){
        this._currentAction = null;
        this._nextAcquisitionToken = 0;
        this._acquisitionTokens = [];
    }
    
}