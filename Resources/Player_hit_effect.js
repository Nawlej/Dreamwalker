(function(){ // # Comments by Joe.
    var obj         = {};
    obj.internal    = {};
    var instanceID  = 0; 
    var movement = {
        BottomLeftBit: (1 << 1),
        BottomBit: (1 << 2),
        BottomRightBit: (1 << 3),
        LeftBit: (1 << 4),
    
        RightBit: (1 << 6),
        TopLeftBit: (1 << 7),
        TopBit: (1 << 8),
        TopRightBit: (1 << 9),
    
        AllDirectionBit: 0x3DE
    }
    var PLAYER_BODY = "Player Body"
    var PLAYER_LEGS = "Player Legs"

    // Agtk.constants.controllers = {
    //     OperationKeyA: 1,
    //     OperationKeyB: 2,
    //     OperationKeyX: 3,
    //     OperationKeyY: 4,
    //     OperationKeyR1: 5,
    //     OperationKeyR2: 6,
    //     OperationKeyL1: 7,
    //     OperationKeyL2: 8,
    //     OperationKeyUp: 9,
    //     OperationKeyDown: 10,
    //     OperationKeyLeft: 11,
    //     OperationKeyRight: 12,
    //     OperationKeyLeftStickUp: 13,
    //     OperationKeyLeftStickDown: 14,
    //     OperationKeyLeftStickLeft: 15,
    //     OperationKeyLeftStickRight: 16,
    //     OperationKeyRightStickUp: 17,
    //     OperationKeyRightStickDown: 18,
    //     OperationKeyRightStickLeft: 19,
    //     OperationKeyRightStickRight: 20,
    //     OperationKeyLeftClick: 21,
    //     OperationKeyRightClick: 22,
    //     OperationKeyStart: 23,
    //     OperationKeySelect: 24,
    //     OperationKeyHome: 25,
    //     OperationKeyOk: 26,
    //     OperationKeyCancel: 27,
    
    //     ReservedKeyCodePc_W: 0,
    //     ReservedKeyCodePc_A: 1,
    //     ReservedKeyCodePc_S: 2,
    //     ReservedKeyCodePc_D: 3,
    //     ReservedKeyCodePc_LeftClick: 4,
    //     ReservedKeyCodePc_RightClick: 5,
    //     ReservedKeyCodePc_Up: 10,
    //     ReservedKeyCodePc_Right: 11,
    //     ReservedKeyCodePc_Down: 12,
    //     ReservedKeyCodePc_Left: 13,
    //     ReservedKeyCodePc_MiddleClick: 22,
    //     ReservedKeyCodePc_WheelUp: 24,
    //     ReservedKeyCodePc_WhellDown: 26,
    //     ReservedKeyCodePc_MousePointer: 28,
    // };
    
    function hitEffect(objectPart, enemyTop, enemyRight, enemyLeft, enemyBot, trackpath) {
        direction = getCharacterVariableByName("Declare atk action");
        connectionID = findAnimationTrackID(trackpath);

        if(isObjectHit(4)){
            // if player hits an object, show sparks
            showParticles(objectPart, true, connectionID, 300);
            if (direction == movement.BottomBit) {
                // perform a jump if player hits an object with a down attack
                performAction(PLAYER_LEGS, "Jump");
            }
        } else if (isObjectHit(-1)) {
            // if player hits an enemy, increase player hp 
            var playerID = Agtk.objectInstances.getIdByName(-1, PLAYER_BODY);
            var hpID = Agtk.objectInstances.get(playerID).variables.getIdByName("HP");
            var hp = Agtk.objectInstances.get(playerID).variables.get(hpID).getValue();
            Agtk.objectInstances.get(playerID).variables.get(hpID).setValue(hp+1);

            // determine attack direction
            if(direction == movement.TopBit){
                // up attack
                showParticles(enemyTop, true, connectionID, 300);
            } else if(direction == movement.BottomBit) {
                // down attack
                performAction(PLAYER_LEGS, "Jump");
                showParticles(enemyBot, true, connectionID, 300);
            } else if (facingDirection(movement.RightBit)){
                // right attack
                showParticles(enemyRight, true, connectionID, 300);
            } else {
                // left attack
                showParticles(enemyLeft, true, connectionID, 300);
            }
        }
    }

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
            "connectId": connectId, 
            "adjustX": 0,
            "adjustY": 0,
            "duration300": duration300,
            "durationUnlimited": false
        }
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

    function findAnimationTrackID(trackpath) {
        path = trackpath.split("/");
        id = Agtk.animations.getIdByName(path[0]); 
        motions = Agtk.animations.get(id).motions
        
        motionID = motions.getIdByName(path[1]);
        directionID = motions.get(motionID).directions.getIdByName(path[2]);
        
        trackID = motions.get(motionID).directions.get(directionID).tracks.getIdByName(path[3]);
        return trackID;
    }

    obj.getInfo = function(category){
        if(category == 'name'){
            return "Plug-in Name";
        } else if(category == 'description'){
            return "Plug-in Description";
        } else if(category == 'author'){
            return "Plug-in Author";
        } else if(category == 'help'){
            return "Plug-in Help";
        } else if(category == 'parameter'){
            // # Parameters of this Plug-in.
            // return [{id: 1, name: "Select the Image", type: "ImageId", defaultValue: -1}]
            return [];
        } else if(category == 'internal'){
            // # Run at the moment of saving.
            // # Must be defined to return JSON format.
            // return null; // if you don't use
            return obj.internal;
        } else if(category == 'actionCommand'){
            // # Parameters of action commands.
            // # The process is defined in obj.execActionCommand
            // return []; // if you don't use
            return [
                {id: 1, 
                name: 'Handle Hit Effects', 
                description: 'Handles the interaction of when the player hits an object or enemy.', 
                parameter: [
                    {id: 1,
                        name: "Hit an object: ",
                        type: "AnimationId", 
                        defaultValue: "",
                    },
                    {id: 2,
                        name: "Hit enemy's topside: ",
                        type: "AnimationId",
                        defaultValue: "",
                    },
                    {id: 3,
                        name: "Hit enemy's rightside: ",
                        type: "AnimationId",
                        defaultValue: "",
                    },
                    {id: 4,
                        name: "Hit enemy's leftside: ",
                        type: "AnimationId",
                        defaultValue: "",
                    },
                    {id: 5,
                        name: "Hit enemy's downside: ",
                        type: "AnimationId",
                        defaultValue: "",
                    },
                    {id: 6,
                        name: "Attack Animation Path: ",
                        type: "String",
                        defaultValue: "",
                    },
                ]},
                {id: 2, name: '[ActionCommand2]', description: 'description', parameter: []}
            ];
        } else if(category == 'linkCondition'){
            // # Parameters of link conditions.
            // # The process is defined in obj.execLinkCondition
            // return []; // if you don't use
            return [
                {
                    id: 1, 
                    name: 'Check walk inputs', 
                    description: 'Checks if both left stick left and right directions are not pressed', 
                    parameter: []
                },
                {id: 2, name: '[LinkCondition2]', description: 'description', parameter: []}
            ];
        }
        return null;
    };
    obj.initialize = function(settings){
        // # Runs immediately after the plug-in is loaded into the game or editor.
    };
    obj.finalize = function(){
        // # Runs when the plug-in is unloaded.
    };
    obj.setLocale = function(_locale){
        // # For setting the language of the plug-in.
        // # Runs immediately after the plug-in is loaded into the game or editor.

        // var ja = _locale.substr(0, 2) == 'ja';
    };
    obj.setInternal = function(settings){
        // # Runs immediately after loading.
        // # Used when the data of the plug-in is kept by save load.
        // # If you don't use it, don't need the code below.
        obj.internal = settings;
    };
    obj.setParamValue = function(param){
        // # Used when setting the parameters in a action or link.
    };
    obj.call = function(name, param1, param2){
        // # This is a dedicated function for auto tiles and is not normally used.
    };
    obj.update = function(dt){
        // # Runs every frame on the game side. 'dt' is the delta time. (1 / dt is FPS)
    };
    obj.execActionCommand = function(index, valueJson, objectId, instanceId, actionId, commandId){
        // # Action Commands
        var paramId = obj.getInfo("actionCommand")[index].id;
        valueJson = obj.completeValueJson(index, valueJson, "actionCommand");
        switch(paramId){ // # Branch the command where is executed by paramId.
            case 1: // # id: 1
                var objectPart = obj.getValueJson(valueJson, 1);
                var enemyTop = obj.getValueJson(valueJson, 2);
                var enemyRight = obj.getValueJson(valueJson, 3);
                var enemyLeft = obj.getValueJson(valueJson, 4);
                var enemyBot = obj.getValueJson(valueJson, 5);
                var trackpath = obj.getValueJson(valueJson, 6);
                instanceID = instanceId;
                hitEffect(objectPart, enemyTop, enemyRight, enemyLeft, enemyBot, trackpath);
                break;
            case 2: // # id: 2
                Agtk.log("[ActionCommand2] is executed.");
                break;
        }
        // # The behavior of the action after executing the command is selected.
        // # In addition to Next (transition to the next command), there are Loop, Block, Break.
        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
    };
    obj.execLinkCondition = function(index, valueJson, objectId, instanceId, actionLinkId){
        // # Link Conditions
        var paramId = obj.getInfo("linkCondition")[index].id;
        valueJson = obj.completeValueJson(index, valueJson, "linkCondition");
        switch(paramId){
            case 1: // # id: 1
                return areWalkInputsReleased(15, 16);
                break;
            case 2: // # id: 2
                Agtk.log("[LinkCondition2] is executed.");
                var ten = 10;
                break;
        }
        // Have to the link condition returns a true or false result.
        return false;
    };
    obj.completeValueJson = function(index, valueJson, type){
        // # Formats and returns the parameter JSON (valueJson).
        var vj = obj.getInfo(type)[index];
        var parameter = vj.parameter;
        if(!!parameter){
            var paramLen = parameter.length;
            for(var _i = 0; _i < paramLen; _i++){
                var id = parameter[_i].id;
                var found = false;
                var valueLen = valueJson.length;
                for(var j = 0; j < valueLen; j++){
                    if(valueJson[j].id == id){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    valueJson.push({id: id, value: parameter[_i].defaultValue});
                }
            }
        }
        return valueJson;
    };
    obj.getValueJson = function(valueJson, id){
        // # Extracts the value of the specified id from the parameter JSON.
        var len = valueJson.length;
        for(var _i = 0; _i < len; _i++){
            if(valueJson[_i].id == id){
                return valueJson[_i].value;
            }
        }
        return null;
    };
    return obj;
}())