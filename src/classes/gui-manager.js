class GUIManager{

    #mainCanvasID = 'main-canvas';
    #buttonSimulation ='button-simulation';
    #titleDivID = "task-title-panel";

    constructor(){
    }

    getMainCanvas(){
        return document.getElementById(this.#mainCanvasID);
    }

    getMainCanvasSize(){
        let canvas = this.getMainCanvas();
        let bbox = canvas.getBoundingClientRect();
        return [bbox.width, bbox.height];
    }

    getButtonSimulation(){
        return document.getElementById(this.#buttonSimulation);
    }

    getTitleDiv(){
        return document.getElementById(this.#titleDivID);
    }

    updateLogPanel(msg){
        let log = msg.logMessage;
        const logPanel = document.getElementById('logs');
        const newLogElement = document.createElement('div');
        newLogElement.innerText = `${msg.logType.toUpperCase()}:: ${log}`;
        let cssClass = 'log-message';
        if (msg.logType !== 'info'){
            cssClass += ' log-' + msg.logType;
        }
        newLogElement.className = cssClass;
        logPanel.appendChild(newLogElement);
    }

    log(msg){
        this.updateLogPanel(
            {
                logMessage: msg,
                logType: "info"
            }
        );
    }

    logError(msg){
        this.updateLogPanel(
            {
                logMessage: msg,
                logType: "error"
            }
        );
    }

    logWarning(msg){
        this.updateLogPanel(
            {
                logMessage: msg,
                logType: "warning"
            }
        );
    }

    logEvent(msg){
        this.updateLogPanel(
            {
                logMessage: msg,
                logType: "event"
            }
        );
    }

    logScore(msg){
        this.updateLogPanel(
            {
                logMessage: msg,
                logType: "score"
            }
        );
    }
}

const guiManager = new GUIManager();