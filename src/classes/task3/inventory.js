class Inventory {
    constructor(maxItems){
        this._maxItems = maxItems;

        this._containerElement = document.createElement('graphic-container');
        this._containerElement.setAttribute('id', `inventory`);

        let title = document.createElement('div');
        title.setAttribute('id', 'inventory-title');
        title.innerHTML = 'Inventory:';
        this._containerElement.appendChild(title);

        this._htmlList = document.createElement('ol');
        this._htmlList.setAttribute('id', `inventory-list`);
        
        this._itemsList = {};
        for (let i = 1; i <= maxItems; i++){
            this._itemsList[i] = null;
            let listItem = document.createElement('li');
            listItem.setAttribute('id', `inventory-item-${i}`);
            this._htmlList.appendChild(listItem);
        }

        this._containerElement.appendChild(this._htmlList);
    }

    getHTMLElement(){
        return this._containerElement;
    }

    displayTo(mainCanvasElement){
        mainCanvasElement.appendChild(this._containerElement);
    }

    _checkValidIndex(index){
        if (index < 1 || index > this._maxItems){
            throw(Error(`The value ${index} is an invalid index for the inventory. Valid indexes have values between 1 and ${this._maxItems}.`));
        }
    }

    whichItemAt(index){
        this._checkValidIndex(index);
        let item = this._itemsList[index];
        if (item !== null){
            return item.getItemInfo();
        } else {
            return null;
        }
    }

    getItemAt(index){
        this._checkValidIndex(index);
        let item = this._itemsList[index];
        if (item === null){
            throw(Error(`There is no item in the inventory at index ${index}.`));
        }
        this._itemsList[index] = null;
        let htmlItem = document.getElementById(`inventory-item-${index}`);
        htmlItem.innerHTML = '';
        return item;
    }

    setItemAt(item, index){
        this._checkValidIndex(index);
        let oldItem = this._itemsList[index];
        if (oldItem !== null){
            throw(Error(`There is already an item in the inventory at index ${index}.`));
        }
        this._itemsList[index] = item;
        let htmlItem = document.getElementById(`inventory-item-${index}`);
        htmlItem.innerHTML = item.toStringDescription();
    }

    throwAwayItemAt(index){
        this.getItemAt(index);
    }

    getItemsByTypeAndStatus(type, status){
        let items = [];
        for (let i = 1; i <= this._maxItems; i++){
            let itemInfo = this.whichItemAt(i);
            if (itemInfo !== null && itemInfo['type'] === type && itemInfo['status'] === status){
                let item = this.getItemAt(i);
                items.push(item);
            }
        }
        return items;
    }

    getEmptyIndexes(){
        let indexes = [];
        for (let i = 1; i <= this._maxItems; i++){
            let itemInfo = this.whichItemAt(i);
            if (itemInfo === null){
                indexes.push(i);
            }
        }
        return indexes;
    }

    isInventoryFull(){
        let emptyIdx = this.getEmptyIndexes();
        if (emptyIdx.length === 0){
            return true;
        } else {
            return false;
        }
    }

    getMaxItems(){
        return this._maxItems;
    }

}