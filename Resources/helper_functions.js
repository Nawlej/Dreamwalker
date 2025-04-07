// # Helper functions stored here for easy access for future plugins since PGMMV cannot perform imports.

function areWalkInputsReleased(key1, key2) {
    var array = new Array(arguments.length);

    for (var iter = 0; iter < arguments.length; iter++) {
        for(var i = 0; i <= Agtk.controllers.MaxControllerId; i++) {
            if (Agtk.controllers.getOperationKeyPressed(i, arguments[iter])) {
                array[iter] = true;
            }
        }
    }

    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            return false;
        }
    }
    return true;
}

function isObjectHit(objectGroup){
    var args = {
        "wallBit": 15,
        "objectType": 0,
        "objectTypeByType": 0,
        "objectGroup": objectGroup,
        "objectId": -1
    }
    var condition = Agtk.objectInstances.get(instanceID).isObjectHit(args);
    if(condition){
        return true;
    }
    return false;
}

function showParticles(particleID, useConnect, connectId, duration300){
    var args = {
        "particleId": particleID,
        "positionType": 0,
        "useConnect": useConnect,
        "connectId": connectId, // default connection id = 4
        "adjustX": 0,
        "adjustY": 0,
        "duration300": duration300,
        "durationUnlimited": false
    }
    Agtk.log("Hit connected--------------");
    Agtk.objectInstances.get(instanceID).execCommandParticleShow(args);
}

function facingDirection(direction) {
    var args = {
        "otherDirections": false,
        "objectDirection": false,
        "directionBit": direction,
        "objectType": 1,
        "objectTypeByType": 0,
        "objectGroup": 0,
        "objectId": -2
    }
    Agtk.log("ran directions ----------");
    var condition = Agtk.objectInstances.get(instanceID).isObjectFacingDirection(args);
    if(condition){
        return true;
    }
    return false;
}

function performAction(objectName, actionName) {
    var args = {
        "objectId": Object.getObjectByName(objectName).id,
        "qualifierId": -1,
        "actionId": Object.getActionByName(actionName).id
    }
    Agtk.objectInstances.get(instanceID).execCommandActionExec(args);
}

function getCharacterVariableByName(string) {
    var varID = Agtk.objectInstances.get(instanceID).variables.getIdByName(string);
    var value = Agtk.objectInstances.get(instanceID).variables.get(varID).getValue();
    Agtk.log("variable value: " + value);
    return value;
}

var Object = {
    getObjectByName: function (objectName) {
        var id = Agtk.objects.getIdByName(objectName);
        this.instance = Agtk.objects.get(id);
        return this.instance;
    }, 

    getActionByName: function (actionName) {
        var actionID = this.instance.actions.getIdByName(actionName);
        this.action = this.instance.actions.get(actionID)
        return this.action;
    },
}
function getObjectByName(objectName) {
    var id = Agtk.objects.getIdByName(objectName);
    var object = Agtk.objects.get(id);
    return object;
};

function getActionByName(actionName) {
    var actionID = actions.getIdByName(actionName);
    return actions.get(actionID);
};

function areInputsPressed(array) {
    var array = new Array(arguments.length);

    for (var iter = 0; iter < arguments.length; iter++) {
        for(var i = 0; i <= Agtk.controllers.MaxControllerId; i++) {
            if (Agtk.controllers.getOperationKeyPressed(i, arguments[iter])) {
                array[iter] = true;
            }
        }
    }

    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            return false;
        }
    }
    return true;
}

/**
 * takes a string that describes the path to the track name. 
 * Format: [Animations List]/[Motion]/[Direction]/[Track name]
 */
function findAnimationTrackID(trackpath) {
    path = trackpath.split("/");
    id = Agtk.animations.getIdByName(path[0]); 
    motions = Agtk.animations.get(id).motions
    
    motionID = motions.getIdByName(path[1]);
    directionID = motions.get(motionID).directions.getIdByName(path[2]);
    
    trackID = motions.get(motionID).directions.get(directionID).tracks.getIdByName(path[3]);
    return trackID;
}