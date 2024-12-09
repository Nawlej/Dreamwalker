(function(){
    var obj = {};
    obj.locale = null;
    obj.internal = {};

    obj.getInfo = function(category){
        if(category == 'name'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return 'ゲーム画面上での座標を取得';
            } else if(obj.locale == 'zh_CN'){
                return '在游戏屏幕中取得对象坐标';
            } else {
                return 'Get Object Coordinates from Game Screen';
            }
        } else if(category == 'description'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return 'ゲーム画面上での座標を取得します。';
            } else if(obj.locale == 'zh_CN'){
                return '在游戏屏幕中取得对象坐标。';
            } else {
                return 'Get Object Coordinates from Game Screen.';
            }
        } else if(category == 'author'){
            return 'Keiji Agusa';
        } else if(category == 'help'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return "ゲーム画面上での座標を取得します。";
            } else if(obj.locale == 'zh_CN'){
                return "在游戏屏幕中取得对象坐标。";
            } else {
                return "Get Object Coordinates from Game Screen.";
            }
        } else if(category == 'parameter'){
            return [];
        } else if(category == 'internal'){
            return obj.internal;
        } else if(category == 'actionCommand'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: 'ゲーム画面上での座標を取得', description: 'このアクションを実行したオブジェクトの、ゲーム画面上での座標位置を設定された変数に格納します。', parameter: [
                        {id: 1, name: 'X:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1},
                        {id: 101, name: '', type: 'VariableId', referenceId: 1, withNewButton: true, defaultValue: -1},
                        {id: 2, name: 'Y:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1},
                        {id: 102, name: '', type: 'VariableId', referenceId: 2, withNewButton: true, defaultValue: -1}
                    ]},
                ];
            } else if(obj.locale == 'zh_CN'){
                return [
                    {id: 1, name: '在游戏屏幕中取得对象坐标', description: '执行此操作的对象，在游戏屏幕上的坐标位置存储在已被设置的变数中。', parameter: [
                        {id: 1, name: 'X:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1},
                        {id: 101, name: '', type: 'VariableId', referenceId: 1, withNewButton: true, defaultValue: -1},
                        {id: 2, name: 'Y:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1},
                        {id: 102, name: '', type: 'VariableId', referenceId: 2, withNewButton: true, defaultValue: -1}
                    ]},
                ];
            } else {
                return [
                    {id: 1, name: 'Get Object Coordinates from Game Screen', description: 'This Action collects the Object\'s coordinates from within the current screen during gameplay and stores it in the assigned variable.', parameter: [
                        {id: 1, name: 'X:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1},
                        {id: 101, name: '', type: 'VariableId', referenceId: 1, withNewButton: true, defaultValue: -1},
                        {id: 2, name: 'Y:', type: 'SwitchVariableObjectId', option: ['SelfObject'], defaultValue: -1},
                        {id: 102, name: '', type: 'VariableId', referenceId: 2, withNewButton: true, defaultValue: -1}
                    ]},
                ];
            }
        }
        return null;
    };
    obj.initialize = function(settings){
    };
    obj.finalize = function(){
    };

    obj.setLocale = function(_locale){
        obj.locale = _locale;
    };

    obj.setInternal = function(settings){
    };
    obj.call = function(name, param1, param2){
    };

    obj.execActionCommand = function(index, valueJson, objectId, instanceId, actionId, commandId){
        var cameraPos = Agtk.sceneInstances.getCurrent().getCurrentCameraTargetPos();
        var displayScale = Agtk.sceneInstances.getCurrent().getCurrentCameraDisplayScale();
        var xObjId = valueJson[0].value;
        var xVarId = valueJson[1].value;
        var variable = null;
        var instance = Agtk.objectInstances.get(instanceId);
        var layerId = instance.layerId;
        var layerIndex = instance.layerIndex;
        var sceneInstance = Agtk.sceneInstances.getCurrent();
        var layerNode = sceneInstance.getMenuLayerById(layerId);
        var isMenu = true;
        if(layerNode === null){
            isMenu = false;
            layerNode = sceneInstance.getLayerByIndex(layerIndex);
        }
        if(xObjId == Agtk.constants.switchVariableObjects.ProjectCommon){
            variable = Agtk.variables.get(xVarId);
        } else if(xObjId == Agtk.constants.switchVariableObjects.SelfObject){
            variable = instance.variables.get(xVarId);
        } else if(xObjId == Agtk.constants.switchVariableObjects.ParentObject){
            var parentInstanceId = instance.variables.get(Agtk.constants.objects.variables.ParentObjectInstanceIDId);
            var parentInstance = Agtk.objectInstances.get(parentInstanceId);
            variable = parentInstance.variables.get(xVarId);
        }
        if(variable !== null){
            var posX = instance.variables.get(Agtk.constants.objects.variables.XId).getValue() + layerNode.x;
            if(!isMenu){
                posX = (posX - cameraPos.x) / displayScale.x + Agtk.settings.screenWidth / 2;
            }
            variable.setValue(posX);
        }

        var yObjId = valueJson[2].value;
        var yVarId = valueJson[3].value;
        if(yObjId == Agtk.constants.switchVariableObjects.ProjectCommon){
            variable = Agtk.variables.get(yVarId);
        } else if(yObjId == Agtk.constants.switchVariableObjects.SelfObject){
            variable = instance.variables.get(yVarId);
        } else if(yObjId == Agtk.constants.switchVariableObjects.ParentObject){
            var parentInstanceId = instance.variables.get(Agtk.constants.objects.variables.ParentObjectInstanceIDId);
            var parentInstance = Agtk.objectInstances.get(parentInstanceId);
            variable = parentInstance.variables.get(yVarId);
        }
        if(variable !== null){
            var posY = instance.variables.get(Agtk.constants.objects.variables.YId).getValue() + layerNode.y;
            if(!isMenu){
                posY = (posY - cameraPos.y) / displayScale.y + Agtk.settings.screenHeight / 2;
            }
            variable.setValue(posY);
        }
    };

    obj.update = function(dt){
    };

    return obj;
}())
