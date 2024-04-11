(function(){ // # Comments by Joe.
    var obj         = {};
    obj.internal    = {};

	var global = {

        gravity: 50,

        mapScene: function(instanceId){
            // find all tiles and map them into a 2D array.
            var scene = Agtk.scenes.get(Agtk.sceneInstances.getCurrent().sceneId);
            var layer = scene.getLayerById(scene.getLayerIdByName("Layer 2"));//-----------------------------------------
            var tileset;
            var wallDetect;

            var widthVar= scene.horzScreenCount * Agtk.settings.screenWidth / Agtk.settings.tileWidth;
            var heightVar = scene.vertScreenCount * Agtk.settings.screenHeight / Agtk.settings.tileHeight;
            //create xy graph object and store array of scene there
            var map = [];
            for (var x = 0; x < widthVar; x++) {
                map[x] = [];
            }

            for (var y = 0; y < heightVar; y++) {
                for (var x = 0; x < widthVar; x++) {
                    tileset = layer.getTileInfo(x, y);
                    try {
                        // check for layer 2 tiles
                        wallDetect = Agtk.tilesets.get(tileset.tilesetId).getWallBits(tileset.x, tileset.y)
                        map[x][y] = {
                            wallID: wallDetect,
                            visitCondition: false,
                        }
                    } catch (err) {
                        try {
                            // check layer 3 for ladder tiles
                            tileset = scene.getLayerById(scene.getLayerIdByName("Layer 3")).getTileInfo(x, y);
                            wallDetect = Agtk.tilesets.get(tileset.tilesetId).getWallBits(tileset.x, tileset.y)
                            map[x][y] = {
                                wallID: wallDetect,
                                visitCondition: false,
                            }
                        } catch (err) {
                            // mark as air tile
                            map[x][y] = {
                                wallID: -1,
                                visitCondition: false,
                            }
                        }
                        
                    }                  
                }
            }
            Agtk.log("mapScene ran");
            this.findRoute(instanceId, map);
        },

        // find a path from player location to unit location using bfs and treating tiles as nodes
        findRoute: function(instanceId, map) {
            
            // this finds the unit's current xy tile coord
            var self = Agtk.objectInstances.get(instanceId).variables;
            var xinit = Math.floor(self.get(self.XId).getValue() / Agtk.settings.tileWidth);
            var yinit = Math.floor(self.get(self.YId).getValue() / Agtk.settings.tileHeight);
            
            // Create visited list and toVisit queue. 
            var queue = [];
            var list =[];
            
            // Initialize arrays and variables
            queue.push({
                x: xinit, 
                y: yinit,
            });
            list.push({
                x: xinit, 
                y: yinit,
                parentx: xinit,
                parenty: yinit,
            });
            Agtk.log(xinit + ", " + yinit);
            map[xinit][yinit].visitCondition = true;
            var currentTile = {
                x: xinit, 
                y: yinit,
            };

            // Locate player
            var player = Agtk.objectInstances.get(Agtk.objectInstances.getIdByName(-1, "Player Body")).variables;
            var playerCoord = {
                x: Math.floor(player.get(player.XId).getValue() / Agtk.settings.tileWidth),
                y: Math.floor(player.get(player.YId).getValue() / Agtk.settings.tileHeight),
            }
            Agtk.log("PLAYER LOCATION: " + playerCoord.x + "," + playerCoord.y);            

            // initialize pathfinder starting location
            this.initPathfinder(currentTile, map);
            
            // while loop
            while (queue.length != 0 && !(currentTile.x == playerCoord.x && currentTile.y == playerCoord.y)) {
                currentTile = queue.shift();   
                this.pathfinder(queue, list, playerCoord, instanceId, currentTile, map);
            }
            this.retraceSteps(list);
            Agtk.log("Finished running findRoute--------")  
            Agtk.log("wall detection is: " + map[25][80].wallID);
        },

        // Not used anymore
        // findAdjacentTiles: function (queue, list, playerCoord, currentTile, map) {
        //     // Visit adjacent tiles and push them to queue if they are not visited yet
        //     Agtk.log("Current tile: " + currentTile.x + "," + currentTile.y);
        //     for (var xIter = currentTile.x - 1; xIter <= currentTile.x + 1; xIter++) {
        //         for(var yIter = currentTile.y - 1; yIter <= currentTile.y + 1; yIter++) {
        //             if (currentTile.x == playerCoord.x && currentTile.y == playerCoord.y) {
        //                 Agtk.log("I found the player!");
        //                 return this.retraceSteps(list);
        //             }
        //             if (0 <= xIter && 0 <= yIter) {
        //                 // Javascript reads the entire if-condition, so going out of bounds will crash the function. This is why we need to separate the if-conditions.
        //                 if (!map[xIter][yIter].visitCondition) {
        //                     Agtk.log("Child tile: " + xIter + "," + yIter);
        //                     queue.push({
        //                         x: xIter, 
        //                         y: yIter,
        //                     });
        //                     list.push({
        //                         x: xIter, 
        //                         y: yIter,
        //                         parentx: currentTile.x,
        //                         parenty: currentTile.y,
        //                     });
        //                 }
        //                 if (xIter == playerCoord.y && yIter == playerCoord.y) {
        //                     Agtk.log("I found the player!");
        //                     return this.retraceSteps(list);
        //                 }
        //                 map[xIter][yIter].visitCondition = true;
        //             }
        //         }   
        //     }
        // },

        // CURRENT PROJECT - THIS WILL BE THE FINAL PATHFINDER
        // pathfinder, finds the shortest path to the player, take jumping, falling, and ladders into account
        pathfinder: function(queue, list, playerCoord, instanceId, currentTile, map) {
            // IF TILE BELOW CURRENT TILE IS AN UNVISITED AIR TILE, THEN THE ITERATOR MUST FALL DOWN
            var falling = {
                x: 0,
                y: 1,
            }
            var scene = Agtk.scenes.get(Agtk.sceneInstances.getCurrent().sceneId);
            var sceneHeight = scene.vertScreenCount * Agtk.settings.screenHeight / Agtk.settings.tileHeight;
            
            while (currentTile.y + falling.y < sceneHeight) {
                // SHOULD FALLING REMEMBER TILES??????????????? no, can block jump paths
                var sum = currentTile.y + falling.y;
                // needs to check coord for being within map scene
                if (!map[currentTile.x][sum].visitCondition && map[currentTile.x][sum].wallID == -1) {
                    this.pushTile(queue, list, {x: currentTile.x, y: sum}, currentTile, map);
                    currentTile.y = sum;
                } else {
                    break;
                }
            }          

            // Find nearby tiles. Do not take diagonal tiles since their distances are greater than 1. 
            var adjOrder = [{name: "Left", x: -1, y: 0}, {name: "Right", x: 1, y: 0}, {name: "Up", x: 0, y: -1}, {name: "Down", x: 0, y: 1} ];
            Agtk.log("Current tile: " + currentTile.x + "," + currentTile.y);

            for (var i = 0; i < adjOrder.length; i++) {
                var nextTile = {
                    x: currentTile.x + adjOrder[i].x,
                    y: currentTile.y + adjOrder[i].y,
                };
                if (0 <= nextTile.x && nextTile.x < map.length && 0 <= nextTile.y && nextTile.y < sceneHeight) {
                    switch (adjOrder[i].name) {
                        case "Up":
                            // climb up ladders
                            if (!map[nextTile.x][nextTile.y].visitCondition && map[currentTile.x][currentTile.y].wallID == 7) {
                                Agtk.log("up ran here-----");
                                this.pushTile(queue, list, nextTile, currentTile, map);
                            }

                            // check for jump tiles only if touching the floor
                            if (this.isWithinScene(currentTile.x, nextTile.y, map) 
                            // && !map[currentTile.x][nextTile.y].visitCondition 
                            && map[currentTile.x][nextTile.y].wallID == -1
                            && map[currentTile.x][currentTile.y + adjOrder[3].y].wallID % 2 == 1) {
                                this.findJumpTiles(queue, list, nextTile, currentTile, map, instanceId);    
                                Agtk.log("floor below is: -----------------------" + map[currentTile.x][currentTile.y + adjOrder[3].y].wallID % 2);                           
                            }
                            
                            break;
                        case "Down":
                            // if unit encounters ladders below, climb down ladders
                            if (!map[nextTile.x][nextTile.y].visitCondition && map[nextTile.x][nextTile.y].wallID == 7) {
                                this.pushTile(queue, list, nextTile, currentTile, map);
                                Agtk.log("down ran here-----");
                            }
                            break;
                        default:
                            // move left or right
                            // how to detect ladder tiles without messing with the left-right pathing?
                            if (!map[nextTile.x][nextTile.y].visitCondition && (map[nextTile.x][nextTile.y].wallID == -1 || map[nextTile.x][nextTile.y].wallID == 7)) {
                                this.pushTile(queue, list, nextTile, currentTile, map);
                                Agtk.log("left/right ran here-----");
                            }
                    } 
                }
                if (nextTile.x == playerCoord.x && nextTile.y == playerCoord.y) {
                    Agtk.log("I found the player!");
                    currentTile.x = nextTile.x;
                    currentTile.y = nextTile.y;
                    break;
                }
            }
        },
        
        pathfinderLadder: function(queue, list, playerCoord, currentTile, map) {
            // Find coord above and beside current tile. Do not take diagonal tiles since their distances are greater than 1.
            // Vertical prio
            var adjOrder = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
            Agtk.log("Current tile: " + currentTile.x + "," + currentTile.y);

            for (var i = 0; i < adjOrder.length; i++) {
                var iter = {
                    x: currentTile.x + adjOrder[i].x,
                    y: currentTile.y + adjOrder[i].y,
                }
                if (0 <= iter.x && iter.x < map.length && 0 <= iter.y && iter.y < map[0].length) {
                    Agtk.log("Child tile: " + iter.x + "," + iter.y);
                    if (!map[iter.x][iter.y].visitCondition && map[iter.x][iter.y].wallID == -1) {
                        queue.push({
                            x: iter.x, 
                            y: iter.y,
                        });
                        list.push({
                            x: iter.x, 
                            y: iter.y,
                            parentx: currentTile.x,
                            parenty: currentTile.y,
                        });
                    }
                    if (iter.x == playerCoord.x && iter.y == playerCoord.y) {
                        Agtk.log("I found the player!");
                        return this.retraceSteps(list);
                    }
                    map[iter.x][iter.y].visitCondition = true;
                }
            }
        },

        // Retrace our steps to find our shortest path
        retraceSteps: function (list){
            // create path list and initialize
            // PATH SHOULD ALSO CONTAIN DIRECTION INFO SUCH AS LEFT, RIGHT, OR JUMP. CALCULATE DIRECTION BY COMPARING PARENT TO CURRENT TILE
            var path =[];
            path[0] = {
                x: list[list.length - 1].x,
                y: list[list.length - 1].y,
                parentx: list[list.length - 1].parentx,
                parenty: list[list.length - 1].parenty,
            }
            Agtk.log("Initial path parent coord: " + path[0].x + "," + path[0].y);
            for (var i = list.length - 2; 0 < i; i--) {
                if (list[i].x == path[path.length - 1].parentx && list[i].y == path[path.length - 1].parenty) {
                    path.push({
                        x: list[i].x,
                        y: list[i].y,
                        parentx: list[i].parentx,
                        parenty: list[i].parenty,
                    });
                }
            }

            // Reverse the path so that it starts at the original unit's location
            path = path.reverse();
            Agtk.log("path length: " + path.length);
            for (var i =0; i < path.length; i++) {
                Agtk.log(path[i].x + "," + path[i].y);
            }
        },

        // push tile info to queue and list, AND DIRECTION??? LEFT, RIGHT, UP, DOWN
        pushTile: function(queue, list, iter, currentTile, map) {
            queue.push({
                x: iter.x, 
                y: iter.y,
            });
            list.push({
                x: iter.x, 
                y: iter.y,
                parentx: currentTile.x,
                parenty: currentTile.y,
            });
            Agtk.log("Pushing coord to queue: " + iter.x + ", " + iter.y);
            map[iter.x][iter.y].visitCondition = true;
        },

        findJumpTiles: function(queue, list, iter, currentTile, map, instanceId) {
            // find max jump height and push tiles to queue and list only if tiles are air tiles
            // h = -1/2 * a * t^2 + v0 * t + h0, v1 = v0 - a * t  --> t = v0 / a, v1 = 0
            var self = Agtk.objectInstances.get(instanceId).variables;
            var jumpspeed = self.get(self.InitialJumpSpeedId).getValue();
            var maxHeight = currentTile.y - (Math.floor(1 / 2 * jumpspeed * jumpspeed / this.gravity) / 4 + 2);
            Agtk.log("max jump height: " + (Math.floor(1 / 2 * jumpspeed * jumpspeed / this.gravity) / 4 + 2));
            Agtk.log("height value: " + currentTile.y);
            for (var tileY = currentTile.y - 1; 
                (tileY > 0) && 
                (tileY > maxHeight) && 
                (this.isWithinScene(currentTile.x, tileY, map) && 
                //!map[currentTile.x][tileY].visitCondition && 
                map[currentTile.x][tileY].wallID == -1); 
                tileY--) {
                var iter = {
                    x: currentTile.x,
                    y: tileY,
                }
                this.pushTile(queue, list, iter, currentTile, map);
                    currentTile = iter;
            }
            
        },

        isWithinScene: function(xCoord, yCoord, map) {
            return (0 <= xCoord && 0 <= yCoord && xCoord <= map.length && yCoord <= map[0].length)
        },

        initPathfinder: function(currentTile, map) {
            var falling = {
                x: 0,
                y: 1,
            }
            var scene = Agtk.scenes.get(Agtk.sceneInstances.getCurrent().sceneId);
            var sceneHeight = scene.vertScreenCount * Agtk.settings.screenHeight / Agtk.settings.tileHeight;
            
            while (currentTile.y + falling.y < sceneHeight) {
                // SHOULD FALLING REMEMBER TILES??????????????? no, can block jump paths
                var sum = currentTile.y + falling.y;
                // needs to check coord for being within map scene
                if (!map[currentTile.x][sum].visitCondition && map[currentTile.x][sum].wallID == -1) {
                    currentTile.y = sum;
                } else {
                    break;
                }
            } 
        }
    }
	

    obj.getInfo = function(category){
        if(category == 'name'){
            return "Plug-in Name";
        } else if(category == 'description'){
            return "Contains global functions used through out the game.";
        } else if(category == 'author'){
            return "Nawlej";
        } else if(category == 'help'){
            return "Contains global functions used through out the game.";
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
                {id: 1, name: 'MapSceneInit', description: 'Map the scene. Find floor and ladder tiles. Place their coord into an array.', parameter: [
                    {id: 1, name: 'MapSceneInit:', type: 'Array', defaultValue: []}
                ]},
                {id: 2, name: '[ActionCommand2]', description: 'description', parameter: []}
            ];
        } else if(category == 'linkCondition'){
            // # Parameters of link conditions.
            // # The process is defined in obj.execLinkCondition
            // return []; // if you don't use
            return [];
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
                global.mapScene(instanceId);
                // var paramValue = obj.getValueJson(valueJson, 1); // Gets the value of the parameter id: 1. (Numeric input value)
                // Agtk.log("The parameter entered for [ActionCommand1] is "+temp+".");
                
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
                Agtk.log("[LinkCondition1] is executed.");
                var ten = 10;
                return ten > 5; // # true
                break;
            case 2: // # id: 2
                Agtk.log("[LinkCondition2] is executed.");
                var ten = 10;
                return ten < 5; // # false
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