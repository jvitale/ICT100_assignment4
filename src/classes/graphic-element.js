class GraphicElement {
    constructor(elementID, tileClass, labelClass, label) {
        this.containerElement = document.createElement('graphic-container');
        this.containerElement.setAttribute('id', `${elementID}`);

        this.tileElement = document.createElement('element-tile');
        this.tileElement.classList.value = tileClass;
        this.containerElement.appendChild(this.tileElement);

        this.labelElement = document.createElement('element-label');
        this.containerElement.appendChild(this.labelElement);
        if (labelClass !== undefined){
            this.labelElement.classList.value = labelClass;
        }
        if (label !== undefined){
            this.labelElement.innerHTML = label;
        }

        this.statusElement = document.createElement('element-status');
        this.containerElement.appendChild(this.statusElement);
    }

    setCSSClass(className){
        this.tileElement.classList.value = className;
    }

    getCSSClass(){
        return this.tileElement.classList.value;
    }

    displayTo(mainCanvasElement){
        mainCanvasElement.appendChild(this.containerElement);
    }

    getContainerElement(){
        return this.containerElement;
    }

    getLabelElement(){
        return this.labelElement;
    }

    getLabel(){
        return this.labelElement.innerHTML;
    }

    getTileElement(){
        return this.tileElement;
    }

    setLabel(label){
        this.labelElement.innerHTML = label;
    }

    setStatus(statusClass, innerHTML){
        this.statusElement.classList.value = statusClass;
        this.statusElement.innerHTML = innerHTML;
    }

    getElementSize(element){
        if (element === undefined){
            element = this.getTileElement();
        }
        let bbox = element.getBoundingClientRect();
       return [bbox.width, bbox.height];
    }

    getLabelSize(){
        return this.getElementSize(this.getLabelElement());
    }

    getTileSize(){
        return this.getElementSize(this.getTileElement());
    }

    getContainerSize(){
        return this.getElementSize(this.getContainerElement());
    }

    setLabelOrientation(orientation){
        let labelSize = this.getLabelSize();
        let tileSize = this.getTileSize();
        let labelMiddle = [
            `${(tileSize[0] - labelSize[0])/2}px`,
            `${(tileSize[1] - labelSize[1])/2}px`,
        ];
        let labelLeft = [`-${labelSize[0]}px`, `${(tileSize[1]-labelSize[1])/2}px`];
        let labelRight = [`${tileSize[0]}px`, `${(tileSize[1]-labelSize[1])/2}px`];
        let labelTop = [`${(tileSize[0] - labelSize[0])/2}px`, `-${labelSize[1]}px`];
        let labelBottom = [`${(tileSize[0] - labelSize[0])/2}px`, `${tileSize[1]}px`];
        let position;
        switch (orientation){
            case 'top':
                position = labelTop;
                break;
            case 'bottom':
                position = labelBottom;
                break;
            case 'left':
                position = labelLeft;
                break;
            case 'right':
                position = labelRight;
                break;
            default:
                //middle
                position = labelMiddle;

        }
        this.getLabelElement().style.left = position[0];
        this.getLabelElement().style.top = position[1];
    }

    setElementPosition(left, top, rotation){
        if (typeof(left) == 'number'){
            left = `${left}px`;
        }
        if (typeof(top) == 'number'){
            top = `${top}px`;
        }
        this.getContainerElement().style.left = `${left}`;
        this.getContainerElement().style.top = `${top}`;
        this.getTileElement().style.transform = 'rotate(' + rotation + 'deg)';
    }

    getElementPosition(){
        let rotation = 0;
        let pattern = /rotate\((.+)deg\)/;
        let rotationTxt = this.getTileElement().style.transform;
        if (rotationTxt){
            let regexOutput = pattern.exec(rotationTxt);
            if (regexOutput.length > 1){
                rotation = regexOutput[1];
            } 
        } 
        let position = [
            parseInt(window.getComputedStyle(this.getContainerElement()).left || 0),
            parseInt(window.getComputedStyle(this.getContainerElement()).top || 0),
            rotation
        ];
        return position;
    }
}