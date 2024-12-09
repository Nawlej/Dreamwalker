(function(){
    var obj = {};
    obj.locale = null;

    obj.getInfo = function(category){
        if(category == 'name'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return 'SE音量調整';
			} else if(obj.locale.substr(0, 2) == 'zh'){
				return '调整效果的音量';
            } else {
                return 'SE Volume Adjustment';
            }
        } else if(category == 'description'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return 'ターゲット間の距離でSEの音量を変更します。';
			} else if(obj.locale.substr(0, 2) == 'zh'){
				return '通过目标之间的距离更改效果的音量。';
            } else {
                return 'Change the volume of SE by the Distance between Targets.';
            }
        } else if(category == 'author'){
            return 'Satomi Watanabe / Joe';
        } else if(category == 'help'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return "設定したオブジェクトとターゲットオブジェクト間の距離によってSEの音量を変更します。";
			} else if(obj.locale.substr(0, 2) == 'zh'){
				return "根据已设定的对象和目标对象之间的距离更改效果的音量。";
            } else {
                return "Change the volume of SE depending on the Distance between the Set Object and the Target Object.";
            }
        } else if(category == 'parameter'){
            return [
            ];
        } else if(category == 'internal'){
            return null;
        } else if(category == 'actionCommand'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
					{id: 1, name: 'ターゲット間の距離でSEの音量を変更', description: 'オブジェクト間の距離によってSEの音量を変更します', parameter: [
					// {id: 1, name: 'ターゲットオブジェクト:', type: 'ObjectId', defaultValue: -1},
                    {id: 2, name: 'SE', type: 'SeId', defaultValue: -1},
                    {id: 10, name: '', type: 'Embedded'},
                    {id: 3, name: '最大音量', type: 'Number', minimumValue: 0, maximumValue: 100, defaultValue: 80},
                    {id: 4, name: '最小音量', type: 'Number', minimumValue: 0, maximumValue: 100, defaultValue: 30},
                    {id: 5, name: '音程', type: 'Number', minimumValue: -50, maximumValue: 50, defaultValue: 0}
		　　		]}  
                ];
			} else if(obj.locale.substr(0, 2) == 'zh'){
				return [
					{id: 1, name: '通过目标之间的距离更改效果的音量', description: '根据对象之间的距离更改效果的音量。', parameter: [
					// {id: 1, name: '目标对象:', type: 'ObjectId', defaultValue: -1},
                    {id: 2, name: '效果', type: 'SeId', defaultValue: -1},
                    {id: 10, name: '', type: 'Embedded'},
                    {id: 3, name: '最大音量', type: 'Number', minimumValue: 0, maximumValue: 100, defaultValue: 80},
					{id: 4, name: '最小音量', type: 'Number', minimumValue: 0, maximumValue: 100, defaultValue: 30},
                    {id: 5, name: '音调', type: 'Number', minimumValue: -50, maximumValue: 50, defaultValue: 0}
		　　		]}  
                ];
            } else {
                return [
					{id: 1, name: 'Change the volume of SE by the Distance between Targets', description: 'Change the volume of SE depending on the Distance between Objects.', parameter: [
                    // {id: 1, name: 'Target Object:', type: 'ObjectId', defaultValue: -1},
                    {id: 2, name: 'SE', type: 'SeId', defaultValue: -1},
                    {id: 10, name: '', type: 'Embedded'},
                    {id: 3, name: 'Max Volume', type: 'Number', minimumValue: 0, maximumValue: 100, defaultValue: 80},
					{id: 4, name: 'Min Volume', type: 'Number', minimumValue: 0, maximumValue: 100, defaultValue: 30},
                    {id: 5, name: 'Pitch', type: 'Number', minimumValue: -50, maximumValue: 50, defaultValue: 0}
		　　		]}   
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

    obj.call = function(name, param1, param2){
    };

    obj.setParamValue = function(param){
        obj.paramValue = param;
    }

    obj.execActionCommand = function(index, valueJson, objectId, instanceId, actionId, commandId){
        valueJson = obj.completeValueJson(index, valueJson, 'actionCommand');
        var params = {
            seId: obj.getValueJson(valueJson, 2),
            maxVol: obj.getValueJson(valueJson, 3),
            minVol: obj.getValueJson(valueJson, 4),
            pitch: obj.getValueJson(valueJson, 5)
        };

        var instance = Agtk.objectInstances.get(instanceId);
		var variable = null;
        var seId = params.seId;
		var maxVol = params.maxVol;
		var minVol = params.minVol;
        var pitch = params.pitch;
		
		// maxの距離
        var maxDistance = Math.sqrt( Math.pow( Agtk.settings.screenWidth, 2 ) + Math.pow( Agtk.settings.screenHeight, 2 ) );
		
		// 位置を取得
		var x = instance.variables.get(instance.variables.XId).getValue();
		var y = instance.variables.get(instance.variables.YId).getValue();

        var currentScene = Agtk.sceneInstances.getCurrent();
        var cameraPos = currentScene.getCurrentCameraTargetPos();
        var tX = cameraPos.x;
        var tY = cameraPos.y;

		// 2点の距離
        var distance = Math.sqrt( Math.pow( tX-x, 2 ) + Math.pow( tY-y, 2 ) );
		
		var vol = maxVol - ((distance*maxVol)/maxDistance);
		if(vol < minVol){
			vol = minVol;
		} else if(maxVol < vol){
			vol = maxVol;
		}

        // 左右バランス
        var maxDistanceX = Math.sqrt( Math.pow( Agtk.settings.screenWidth, 2 ) );
        var distanceX = Math.sqrt( Math.pow( tX-x, 2 ) );
        var xVol = maxVol - ((distanceX*maxVol)/maxDistanceX);
        if(xVol < minVol){
            xVol = minVol;
        } else if(maxVol < xVol){
            xVol = maxVol;
        }
        pan = 50 - (xVol/2);
        if(tX-x > 0){pan *= -1;}
        if(pan > 50){
            pan = 50;
        }else if(pan < -50){
            pan = -50;
        }
		
        if(vol > 0){
    		instance.execCommandSoundPlay({seId: seId, volume: vol, pitch: pitch, pan: pan});
        }

        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
    };

    obj.update = function(dt){
        
    };

    obj.completeValueJson = function(index, valueJson, type){
        var vj = obj.getInfo(type)[index];
        var parameter = vj.parameter;
        if(!!parameter){
            var paramLen = parameter.length;
            for(var i=0; i<paramLen|0; i++){
                var id = parameter[i].id;
                var found = false;
                var valueLen = valueJson.length;
                for(var j=0; j<valueLen|0; j++){
                    if(valueJson[j].id == id){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    valueJson.push({id: id, value: parameter[i].defaultValue});
                }
            }
        }
        return valueJson;
    };
    obj.getValueJson = function(valueJson, id){
        var len = valueJson.length;
        for(var i=0; i<len|0; i++){
            if(valueJson[i].id == id){
                return valueJson[i].value;
            }
        }
        return null;
    };

    return obj;
}())
