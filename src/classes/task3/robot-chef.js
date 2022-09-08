class RobotChef{

    #chefTileClass = 'bot-chef';
    #chefLabelClass = '';

    constructor (elementID) {
        this._htmlElement = new GraphicElement(elementID, this.#chefTileClass, this.#chefLabelClass, '');
        this._location = null;
        this._isAvailable = true;
    }

    getHtmlElementSize(){
        try{
            return this._htmlElement.getElementSize();
        } catch (err){
            return null;
        }
        
    }

    getChefPosition(){
        try{
            return this._htmlElement.getElementPosition();
        } catch(err){
            return null;
        }
    }

    getChefSize(){
        return this._htmlElement.getElementSize();
    }

    setChefPosition(x, y, rotation){
        try{
            this._htmlElement.setElementPosition(x, y, rotation);
        } catch(err){}
    }

    rotate(rotation){
        try{
            let pos = this.getChefPosition();
            this._htmlElement.setElementPosition(pos[0], pos[1], rotation);
        } catch(err){}
    }

    getLocation(){
        return this._location;
    }

    setLocation(stationID){
        this._location = stationID;
    }

    isAvailable(){
        return this._isAvailable;
    }

    setAvailable(status){
        this._isAvailable = status;
    }

    getHTMLElement(){
        return this._htmlElement;
    }
}