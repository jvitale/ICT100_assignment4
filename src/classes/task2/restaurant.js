class Restaurant {
    constructor() {

        this._tables = [];

        for (let i = 0; i < 8; i++)
            this._tables[i] = new Table(i+1);

        this._tables[0].setTablePosition(25, 50);
        this._tables[1].setTablePosition(200, 50);
        this._tables[2].setTablePosition(400, 50);
        this._tables[3].setTablePosition(90, 200);
        this._tables[4].setTablePosition(250, 200);
        this._tables[5].setTablePosition(25, 350);
        this._tables[6].setTablePosition(250, 350);
        this._tables[7].setTablePosition(450, 350);

        this._robots = [
            new RobotWaiter('pink'),
            new RobotWaiter('yellow'),
            new RobotWaiter('blue'),
            new RobotWaiter('green'),
        ];
    }

    getTables(){
        return this._tables;
    }

    getNumTables(){
        return this._tables.length;
    }

    getRobots(){
        return this._robots;
    }

    getNumRobots(){
        return this._robots.length;
    }

    getRobotByID(robotID){
        let robots = this.getRobots();
        for (let i = 0; i < robots.length; i++){
            if (robots[i].getRobotID() === robotID){
                return robots[i];
            }
        }
    }

    getTableByID(tableID){
        let tables = this.getTables();
        for (let i = 0; i < tables.length; i++){
            if (tables[i].getTableID() === tableID){
                return tables[i];
            }
        }
    }

    addRobot(robot, landmark){
        if (landmark.attendedByRobot === null){
            landmark.attendedByRobot = robot;
        } else {
            throw(Error('The landmark ' + landmark.landmarkID + ' is already attended by ' + landmark.attendedByRobot.robotID));
        }
        robot.curRobotLandmark = landmark;
        this.robots[robot.robotID] = robot;
        this.addTileToCanvas(robot.htmlElement.getContainerElement());
        landmark.displayElementAtLocation(robot, 'default');
    }

    addLandmark(landmark){
        this.landmarks[landmark.landmarkID] = landmark;
    }

    getRobotsIds() {
        let robotList = [];
        for (let [robotID, robot] of Object.entries(this.robots)){
            robotList.push(robotID);
        }
        return robotList;
    }

    getLandmarksIds() {
        let landmarkList = [];
        for (let [landmarkID, landmark] of Object.entries(this.landmarks)){
            landmarkList.push(landmarkID);
        }
        return landmarkList;
    }

    getRobot(robotId){
        if (robotId in this.robots){
            return this.robots[robotId];
        } else {
            throw(Error(`There is no robot with id ${robotId}`));
        }
    }

    getLandmark(landmarkId){
        if (landmarkId in this.landmarks){
            return this.landmarks[landmarkId];
        } else {
            throw(Error(`There is no landmark with id ${landmarkId}`));
        }
    }

    getRobotAtLandmark(landmarkID){
        if (landmarkID in this.landmarks){
            return this.getLandmark(landmarkID).attendedByRobot;
        } else {
            throw(Error(`${landmarkID} is not a valid landmark. Is there a typo?`));
        }
    }

    getFreeLandmarks(){
        let landmarkList = [];
        for (let [landmarkID, landmark] of Object.entries(this.landmarks)){
            if (landmark.attendedByRobot === null){
                landmarkList.push(landmarkID);
            }
        }
        return landmarkList;
    }

    addTileToCanvas(tile){
        let mainCanvas = this._guiManager.getMainCanvas();
        mainCanvas.appendChild(tile);
    }
}