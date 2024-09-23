(function(){ // # Comments by Joe.
    var obj         = {};
    obj.internal    = {};

    var global = {

        gravity: 50,
        mapObject: [],
        unitMapObject:[],
        list: [],
        direction: [],
        range: 5,
        ladderName: "LADDER",
        ladderID: 12,
        ladderTopID: 13,
        jumpRange: 17,

        movement: {
            Left: 270,
            Right: 90,
            Up: 0,
            Down: 180,
            Jump: "jump",
            FallDown: "falling",
        },

        mapScene: function(){
            // find all tiles and map them into a 2D array.
            var scene = Agtk.scenes.get(Agtk.sceneInstances.getCurrent().sceneId);
            var tileset;
            var widthVar = scene.horzScreenCount * Agtk.settings.screenWidth / Agtk.settings.tileWidth;
            var heightVar = scene.vertScreenCount * Agtk.settings.screenHeight / Agtk.settings.tileHeight;
            //create xy graph object and store array of scene there
            var map = [];
            for (var x = 0; x < widthVar; x++) {
                map[x] = [];
            }

            // optimization: reduce mapping area, skip the insides of walls, once the function checks the wall
            for (var y = 0; y < heightVar; y++) {
                for (var x = 0; x < widthVar; x++) {
                    // check if tileset will be null
                    if (scene.getLayerById(scene.getLayerIdByName("Layer 2")).getTileInfo(x, y)) {
                        tileset = scene.getLayerById(scene.getLayerIdByName("Layer 2")).getTileInfo(x, y);
                        var wallID = Agtk.tilesets.get(tileset.tilesetId).getWallBits(tileset.x, tileset.y)

                        if (Agtk.tilesets.get(tileset.tilesetId).name.contains(this.ladderName)) {
                            wallID = this.ladderName;
                        }
                        map[x][y] = {
                            wallID: wallID,
                            visitCondition: false,
                        }                    
                    } else if (scene.getLayerById(scene.getLayerIdByName("Layer 3")).getTileInfo(x, y)) {
                        tileset = scene.getLayerById(scene.getLayerIdByName("Layer 3")).getTileInfo(x, y);
                        Agtk.log("ladder tile name: " + Agtk.tilesets.get(tileset.tilesetId).name);
                        map[x][y] = {
                            wallID: this.ladderName,
                            visitCondition: false,
                        }
                    } else {
                        map[x][y] = {
                            wallID: -1,
                            visitCondition: false,
                        }
                    }                 
                }
            }
            Agtk.log("mapScene ran");
            this.mapObject = map;
            this.unitMapObject = new Map();
            // this.findRoute(instanceId, map);
            // this.pathInstructions(list, currentTile, map, instanceId);
        },

        findPathtoPlayer: function(instanceId, map) {
            // this finds the unit's current xy tile coord
            var self = Agtk.objectInstances.get(instanceId).variables;
            var xinit = Math.floor(self.get(self.XId).getValue() / Agtk.settings.tileWidth);
            var yinit = Math.floor(self.get(self.YId).getValue() / Agtk.settings.tileHeight);
            
            var currentTile = {
                x: xinit, 
                y: yinit,
            };

            // initialize pathfinder starting location
            this.initPathfinder(currentTile);
            Agtk.log("Unit LOCATION: " + currentTile.x + "," + currentTile.y);            

            // Create visited list and toVisit queue. 
            var queue = [];
            var list =[];
            
            // Initialize arrays and variables
            queue.push({
                x: currentTile.x, 
                y: currentTile.y,
            });
            list.push({
                x: currentTile.x, 
                y: currentTile.y,
                parentx: currentTile.x,
                parenty: currentTile.y,
            });
            Agtk.log(xinit + ", " + yinit);
            map[xinit][yinit].visitCondition = true;

            // Locate player
            var player = Agtk.objectInstances.get(Agtk.objectInstances.getIdByName(-1, "Player Body")).variables;
            var playerCoord = {
                x: Math.floor(player.get(player.XId).getValue() / Agtk.settings.tileWidth),
                y: Math.floor(player.get(player.YId).getValue() / Agtk.settings.tileHeight + 2),
            }

            
            // while loop
            while (queue.length != 0 && !(currentTile.x == playerCoord.x && currentTile.y == playerCoord.y)) {
                currentTile = queue.shift();   
                this.pathfinder(queue, list, playerCoord, instanceId, currentTile, map);
            }
            if (queue.length != 0 && currentTile.x == playerCoord.x && currentTile.y == playerCoord.y) {
                this.retraceSteps(list, instanceId);
            }
            Agtk.log("Finished running findRoute--------")  
        },

        // original pathfinding model
        pathfinder: function(queue, list, playerCoord, instanceId, currentTile, map) {
            // IF TILE BELOW CURRENT TILE IS AN UNVISITED AIR TILE, THEN THE ITERATOR MUST FALL DOWN
            var falling = {
                x: 0,
                y: 1,
            }
            var sceneHeight = map[0].length;            
            while (currentTile.y + falling.y < sceneHeight) {
                var sum = currentTile.y + falling.y;
                // needs to check coord for being within map scene
                if (!map[currentTile.x][sum].visitCondition && map[currentTile.x][sum].wallID == -1) {
                    var nextTile = {
                        x: currentTile.x, 
                        y: sum, 
                        direction: this.movement.FallDown
                    }
                    list.push({
                        x: nextTile.x, 
                        y: nextTile.y,
                        direction: nextTile.direction,
                        parentx: currentTile.x,
                        parenty: currentTile.y,
                    });
                    currentTile.y = sum;
                    map[nextTile.x][nextTile.y].visitCondition = true;
                } else {
                    break;
                }
            }         
            // Find nearby tiles. Do not take diagonal tiles since their distances are greater than 1. 
            // add a new variable: wall spacing that determines how far away enemies will stay away from walls
            var nextTile = [{direction: this.movement.Left, x: (currentTile.x - 1), y: currentTile.y, wallSpace: (-3),}, 
                            {direction: this.movement.Right, x: (currentTile.x + 1), y: currentTile.y, wallSpace: (3),}, 
                            {direction: this.movement.Up, x: currentTile.x, y: (currentTile.y - 1)}, 
                            {direction: this.movement.Down, x: currentTile.x, y: (currentTile.y + 1)}];
            // Agtk.log("Current tile: " + currentTile.x + "," + currentTile.y);

            for (var i = 0; (i < nextTile.length) && (this.isWithinScene(nextTile[i].x, nextTile[i].y)); i++) {
                // move left or right
                // detects ladder (wallId = 7)
                switch (nextTile[i].direction) {
                    case this.movement.Up:
                        // climb up ladders
                        if (!map[nextTile[i].x][nextTile[i].y].visitCondition 
                            && map[currentTile.x][currentTile.y].wallID == this.ladderName 
                            && this.getTileInfo(currentTile.x, currentTile.y) == 7) {
                            // Agtk.log("ladder found at:" + currentTile.x + ", " + currentTile.y)
                            this.pushTile(queue, list, nextTile[i], currentTile, map);
                        }

                        // check for jump tiles only if current tile is above the floor
                        // Agtk.log("next tile: " + nextTile[i].x + "," + nextTile[3].y);
                        if (this.isWithinScene(nextTile[i].x, nextTile[3].y)){
                            if (map[nextTile[i].x][nextTile[3].y].wallID % 2 == 1 && map[nextTile[i].x][nextTile[i].y].wallID == -1) {
                                this.pushJumpTiles(queue, list, nextTile[i], currentTile, map, instanceId);  
                            }
                        } 
                        
                    break;
                    case this.movement.Down:
                        // if unit encounters ladders below, climb down ladders
                        if (!map[nextTile[i].x][nextTile[i].y].visitCondition 
                            && map[nextTile[i].x][nextTile[i].y].wallID == this.ladderName 
                            && this.getTileInfo(currentTile.x, currentTile.y) == 7) {
                            this.pushTile(queue, list, nextTile[i], currentTile, map);
                        }
                    break;
                    default:
                        // move left or right
                        // detects ladder (wallId = 7)
                        if (!map[nextTile[i].x][nextTile[i].y].visitCondition 
                            && (map[nextTile[i].x][nextTile[i].y].wallID == -1 || map[nextTile[i].x][nextTile[i].y].wallID == this.ladderName)
                            && this.isWithinJumpRange(nextTile[i].x, nextTile[i].y, nextTile[i].direction)
                        ) {
                            this.pushTile(queue, list, nextTile[i], currentTile, map);
                        }
                    break;
                }            
                if (Math.abs(nextTile[i].x - playerCoord.x) == 0 && (nextTile[i].y - playerCoord.y) == 0) {
                    Agtk.log("I found the player!" + nextTile[i].x + ", " + nextTile[i].y);
                    this.pushTile(queue, list, nextTile[i], currentTile, map);
                    currentTile.x = nextTile[i].x;
                    currentTile.y = nextTile[i].y;
                    break;
                }           
            }                  
        },

        // Retrace our steps to find our actual path 
        retraceSteps: function (list, instanceId){
            // create path list and initialize
            // PATH SHOULD ALSO CONTAIN DIRECTION INFO SUCH AS LEFT, RIGHT, OR JUMP. CALCULATE DIRECTION BY COMPARING PARENT TO CURRENT TILE
            var path =[];
            path[0] = {
                x: list[list.length - 1].x,
                y: list[list.length - 1].y,
                parentx: list[list.length - 1].parentx,
                parenty: list[list.length - 1].parenty,
            };
            Agtk.log("Initial path parent coord: " + path[0].x + "," + path[0].y);
            for (var i = list.length - 2; 0 < i; i--) {
                if (list[i].x == path[path.length - 1].parentx && list[i].y == path[path.length - 1].parenty) {
                    path.push({
                        x: list[i].x,
                        y: list[i].y,                        
                        direction: list[i].direction,
                        parentx: list[i].parentx,
                        parenty: list[i].parenty,
                    });
                }
            }

            // Reverse the path so that it starts at the original unit's location. Set the global.list == path so our unit will remember it. Each unit will 
            path = path.reverse();
            Agtk.log("path length: " + path.length);
            for (var i =0; i < path.length; i++) {
                Agtk.log(path[i].x + "," + path[i].y + " direction: " + path[i].direction);
            }

            // Trim the path to contain only nodes where we change directions
            var newpath = [];
            newpath.push(path[0]);
            for (var i = 0; i < path.length; i++) {
                if ((newpath[newpath.length-1].x != path[i].x && newpath[newpath.length-1].y != path[i].y) 
                || (path[i].direction != this.movement.Jump && newpath[newpath.length-1].direction == this.movement.Jump)
                || (path[i].direction == this.movement.Jump && newpath[newpath.length-1].direction != this.movement.Jump)
                || (path[i].direction != this.movement.Up && newpath[newpath.length-1].direction == this.movement.Up)
                || (path[i].direction == this.movement.Up && newpath[newpath.length-1].direction != this.movement.Up)
                || (path[i].direction != this.movement.Down && newpath[newpath.length-1].direction == this.movement.Down)
                || (path[i].direction == this.movement.Down && newpath[newpath.length-1].direction != this.movement.Down)
                || (i == path.length -1)) {
                    newpath.push(path[i]);
                }
            }
            Agtk.log("NEWPATH length: " + newpath.length + "--------------------");
            for (var i =0; i < newpath.length; i++) {
                Agtk.log(newpath[i].x + "," + newpath[i].y + " direction: " + newpath[i].direction);
            }
            this.list = new Map();
            this.direction = new Map();
            this.list.set(instanceId, newpath); 
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
                direction: iter.direction,
                parentx: currentTile.x,
                parenty: currentTile.y,
            });
            map[iter.x][iter.y].visitCondition = true;
        },

        pushJumpTiles: function(queue, list, iter, currentTile, map, instanceId) {
            // find max jump height and push tiles to queue and list only if tiles are air tiles
            var maxHeight = currentTile.y - this.jumpRange;

            for (var tileY = currentTile.y - 1; 
                    (tileY > maxHeight) && 
                    (this.isWithinScene(currentTile.x, tileY) && 
                    map[currentTile.x][tileY].wallID == -1); 
                tileY--) {
                var iter = {
                    x: currentTile.x,
                    y: tileY,
                    direction: this.movement.Jump,
                }
                this.pushTile(queue, list, iter, currentTile, map);
                    currentTile = iter;
            }
        },

        getCurrentLocation: function(instanceId) {
            var self = Agtk.objectInstances.get(instanceId).variables;
            var location = {
                x: Math.floor(self.get(self.XId).getValue() / Agtk.settings.tileWidth),
                y: Math.floor(self.get(self.YId).getValue() / Agtk.settings.tileHeight),
            }
            return location;
        },

        isWithinScene: function(xCoord, yCoord) {
            return (0 <= xCoord && 0 <= yCoord && xCoord < this.mapObject.length && yCoord < this.mapObject[0].length)
        },

        initPathfinder: function(currentTile) {
            var falling = {
                x: 0,
                y: 1,
            }
            var map = this.mapObject;
            var scene = Agtk.scenes.get(Agtk.sceneInstances.getCurrent().sceneId);
            var sceneHeight = scene.vertScreenCount * Agtk.settings.screenHeight / Agtk.settings.tileHeight;            
            while ((currentTile.y + falling.y) < sceneHeight) {
                Agtk.log("loop ran here")
                // SHOULD FALLING REMEMBER TILES??????????????? no, can block jump paths
                var sum = currentTile.y + falling.y;
                // needs to check coord for being within map scene
                if (!global.mapObject[currentTile.x][sum].visitCondition
                && map[currentTile.x][sum].wallID == -1) {
                    currentTile.y = sum;
                } else {
                    break;
                }
            } 
        },

        moveToLocation: function(instanceId, list) {
            // coord with common x or y values will be removed from pathing list so we will only have a list of nodes where we change directions
            // unit is to move to coord
            // unit will climb ladders when required
            var i = 0;
            var currentTile = list[i];

            // last index is player coord so we do not need to move unit anywhere once we reach the last index
            if (list.length > 1) {

                var nextTile = list[i + 1];
                var self = this.getCurrentLocation(instanceId);
                var xdistance = nextTile.x - self.x;
                var ydistance = nextTile.y - self.y;
                var range = 2;              

                switch (currentTile.direction) {
                    case this.movement.Left:
                        var direction = 270;
                        var distance = xdistance;
                        var args = {
                            "direction": direction,
                            "directionId": -2,
                            "moveDistance": Math.abs(distance * Agtk.settings.tileWidth),
                            "moveDistanceEnabled": false,
                        }
                        this.direction.set(instanceId, this.movement.Left);
                        Agtk.objectInstances.get(instanceId).execCommandDirectionMove(args);
                        break;
                    case this.movement.Right:
                        var direction = 90;
                        var distance = xdistance;
                        var args = {
                            "direction": direction,
                            "directionId": -2,
                            "moveDistance": Math.abs(distance * Agtk.settings.tileWidth),
                            "moveDistanceEnabled": false,
                        }
                        this.direction.set(instanceId, this.movement.Right);
                        Agtk.objectInstances.get(instanceId).execCommandDirectionMove(args);
                        break;
                    case this.movement.Up:
                        var direction = 0;
                        var distance = ydistance;
                        //  WIP below. Unit swaps to ladder climbing 
                        var index = Agtk.objectInstances.get(instanceId).variables.AreaAttributeId;
                        var areaDetection = Agtk.objectInstances.get(instanceId).variables.get(index).getValue();
                        if (areaDetection == this.ladderID) {
                            var args = {
                                "moveType": 1,
                                "horizontalMoveStartRight": false,
                                "horizontalMoveDuration300": 300,
                                "horizontalInfinite": false,
                                "verticalMoveStartDown": false,
                                "verticalMoveDuration300": 600,
                                "verticalInfinite": true,
                                "randomMoveDuration300": 300,
                                "randomMoveStop300": 300,
                                "nearObjectGroup": 0,
                                "nearObjectLockedObjectPrior":false,
                                "nearPlayerLockedPlayerPrior": false,
                                "apartNearObjectGroup": -1,
                                "apartNearObjectLockedObjectPrior": false,
                                "apartNearPlayerLockedPlayerPrior": false,
                                "fallFromStep": true,
                                "ignoreOtherObjectWallArea": false,
                                "ignoreWall": true
                            }
                            Agtk.objectInstances.get(instanceId).execCommandTemplateMove(args);
                        }
                        break;
                    case this.movement.Down:
                        var direction = 180;
                        var distance = ydistance;
                        var index = Agtk.objectInstances.get(instanceId).variables.AreaAttributeId;
                        var areaDetection = Agtk.objectInstances.get(instanceId).variables.get(index).getValue();
                        if (areaDetection == this.ladderTopID) {
                            var args = {
                                "moveType": 1,
                                "horizontalMoveStartRight": false,
                                "horizontalMoveDuration300": 300,
                                "horizontalInfinite": false,
                                "verticalMoveStartDown": true,
                                "verticalMoveDuration300": 600,
                                "verticalInfinite": true,
                                "randomMoveDuration300": 300,
                                "randomMoveStop300": 300,
                                "nearObjectGroup": 0,
                                "nearObjectLockedObjectPrior":false,
                                "nearPlayerLockedPlayerPrior": false,
                                "apartNearObjectGroup": -1,
                                "apartNearObjectLockedObjectPrior": false,
                                "apartNearPlayerLockedPlayerPrior": false,
                                "fallFromStep": true,
                                "ignoreOtherObjectWallArea": false,
                                "ignoreWall": true
                            }
                            Agtk.objectInstances.get(instanceId).execCommandTemplateMove(args);
                        }
                        break;
                    case this.movement.Jump:
                        var direction = this.movement.Jump;
                        var distance = xdistance;
                        var args = {
                            "distanceOverride": false,
                            "moveDistance": Math.abs(distance * Agtk.settings.tileWidth),
                            "reverse": false
                        }
                        Agtk.objectInstances.get(instanceId).execCommandDisplayDirectionMove(args);
                        break;
                    case this.movement.FallDown:
                        // this way, the unit maintains its course and can fall into the hole
                        var direction = this.movement.FallDown;
                        var distance = 0;
                        // following needs to be edited, so when object come into contact with side walls it will also trigger
                        if (this.isWallContact(8, instanceId) || this.isWallContact(2, instanceId) || this.isWallContact(4, instanceId)) {
                            distance = 1;
                        }
                        var args = {
                            "distanceOverride": true,
                            "moveDistance": Math.abs(distance * Agtk.settings.tileWidth),
                            "reverse": false,
                        }
                        Agtk.objectInstances.get(instanceId).execCommandDisplayDirectionMove(args);
                        break;
                    default:
                        var direction = 0;
                        break;
                }
    
                Agtk.log("direction is: " + direction + " at location: " + self.x + ", " + self.y + " at distance of: " + xdistance);
                var range = 0;//this.range;
                // when unit reaches the tile, push the next tile (movement command) to the front
                if (currentTile.direction == this.movement.Left 
                    && (xdistance >= range || this.isWallContact(6, instanceId)
                        || (nextTile.direction == this.movement.Jump && xdistance >= this.range)
                    )) {
                        Agtk.log("was moving left, now shifting list at: " + self.x + ", " + self.y);
                        list.shift();
                }
                if (currentTile.direction == this.movement.Right 
                    && (xdistance <= range || this.isWallContact(6, instanceId)
                        || (nextTile.direction == this.movement.Jump && xdistance <= this.range)
                    )) {
                        Agtk.log("was moving right, now shifting list at: " + self.x + ", " + self.y);
                        list.shift();
                }
                if (currentTile.direction == this.movement.Up 
                    && (self.y - nextTile.y) <= -this.range) {
                        // this unit is climbing a ladder
                        Agtk.log("finshed climb up ladder")
                        list.shift();
                }
                if (currentTile.direction == this.movement.Down 
                    && (this.mapObject[self.x][(self.y + 10)].wallID > 0) 
                    ) {
                        Agtk.log("finished climb down ladder " + nextTile.x + ", " + nextTile.y);
                        list.shift();
                }
                if (currentTile.direction == this.movement.FallDown
                && Math.abs(self.y - nextTile.y) <= 5) {
                    Agtk.log("fall down");
                    list.shift();
                }
            } else if (list.length == 1) {
                Agtk.log("pathfinder list of coordinates only had 1 index. Assuming the unit has reached location and now will stop the moveTo() function.");
                currentTile = list.shift();
                var distance = this.getCurrentLocation(instanceId).x - currentTile.x;
                Agtk.log("distance: "+distance)
                var args = {
                    "distanceOverride": true,
                    "moveDistance": Math.abs(distance * Agtk.settings.tileWidth),
                    "reverse": false
                }
                Agtk.objectInstances.get(instanceId).execCommandDisplayDirectionMove(args);
            } else {
                Agtk.log("list not found");
            }
        },

        isWallContact: function(wallID, instanceId) {
            var args = {
                "wallBit": wallID,
                "useTileGroup": false,
                "tileGroup": 0
            }
            return Agtk.objectInstances.get(instanceId).isWallTouched(args);
        },

        isWallAhead: function (wallID, instanceId) {
            var args = {
                "wallBit": wallID,
                "useTileGroup": false,
                "tileGroup": 0
            }
            return Agtk.objectInstances.get(instanceId).isWallAhead(args);
        },

        getTileInfo: function(x, y){
            // returns the value of the wall detection in layers 2 and 3. Returns -1 if there is no tile in that location.
            var scene = Agtk.scenes.get(Agtk.sceneInstances.getCurrent().sceneId);
            var tileset;

            if (scene.getLayerById(scene.getLayerIdByName("Layer 2")).getTileInfo(x, y)) {
                tileset = scene.getLayerById(scene.getLayerIdByName("Layer 2")).getTileInfo(x, y)
                return Agtk.tilesets.get(tileset.tilesetId).getWallBits(tileset.x, tileset.y)
            } else if (scene.getLayerById(scene.getLayerIdByName("Layer 3")).getTileInfo(x, y)) {
                tileset = scene.getLayerById(scene.getLayerIdByName("Layer 3")).getTileInfo(x, y);
                return Agtk.tilesets.get(tileset.tilesetId).getWallBits(tileset.x, tileset.y)
            } else {
                return -1;
            }
        },

        moveDistance: function(instanceId, destination) {
            var distance = this.getCurrentLocation(instanceId).x - destination.x;
                var args = {
                    "distanceOverride": true,
                    "moveDistance": Math.abs(distance * Agtk.settings.tileWidth),
                    "reverse": false
                }
                Agtk.log("moving to: " + destination.x + ", " + destination.y + " distance is: " + distance);
                Agtk.objectInstances.get(instanceId).execCommandDisplayDirectionMove(args);
        },

        isWithinJumpRange: function(x, y, direction) {
            for (var j = (y); j <= (y + this.jumpRange); j++) {
                if (direction == this.movement.Left) {
                    // if object jumps left
                    for (var i = (x); i <= (x + this.jumpRange); i++) {
                        if (this.isWithinScene(i, j)) {
                            if ((this.mapObject[i][j].wallID % 2 == 1 || this.mapObject[i][j].wallID == this.ladderName)
                                && ((Math.pow((x - i), 2) + Math.pow((y - j), 2)) <= Math.pow(this.jumpRange, 2))) {
                                    return true;
                            }
                        
                        }
                    }
                } else {
                    // if object jumps right
                    for (var i = (x - this.jumpRange); i <= (x); i++) {
                        if (this.isWithinScene(i, j)) {
                            if ((this.mapObject[i][j].wallID % 2 == 1 || this.mapObject[i][j].wallID == this.ladderName)
                                && ((Math.pow((x - i), 2) + Math.pow((y - j), 2)) <= Math.pow(this.jumpRange, 2))) {
                                    return true;
                            }
                        
                        }
                    }
                }
            }
            return false;
        },
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
                {id: 1, name: 'Map the scene', description: 'Finds all the tiles in layers 2 and 3 and remembers their wall detection.'},
                {id: 2, name: 'Find route to player', description: 'Find the shortest route to the player. This is the basic pathfinding algorithm.'}, 
                {id: 3, name: 'Pathfinding to location', description: 'Unit moves along the path to location. Requires running Find route to player.'},
                {id: 4, name: 'Travel jump distance', description: 'Handles unit jump distance. Requires running Find route to player. WIP: allow user to select location coord.', 
                parameter: [{id: 1, name: 'X Coord', type: 'Number', minimumValue: 0, defaultValue: 0}, {id: 2, name: 'Y Coord', type: 'Number', minimumValue: 0, defaultValue: 0}]},
            ];
        } else if(category == 'linkCondition'){
            // # Parameters of link conditions.
            // # The process is defined in obj.execLinkCondition
            // return []; // if you don't use
            return [
                {id: 1, name: 'Check jump conditions', description: 'Checks if jump conditions are met while moving towards a location.', 
                parameter: [{id: 1, name: 'Description:', type: 'Array', defaultValue: []}]},
                {id: 2, name: 'Check ladder climb conditions', description: 'Checks if ladder climbing conditions are met while moving towards a location.', 
                parameter: [{id: 2, name: 'Description:', type: 'Array', defaultValue: []}]},
                {id: 3, name: 'Unit reached top of ladder', description: 'Checks if unit finished climbing the ladder.', 
                parameter: [{id: 3, name: 'Description:', type: 'Array', defaultValue: []}]},
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
        // # Action Commands, you must link the cases to the proper functions that you want to run (so cases 1 will run mapScene)
        var paramId = obj.getInfo("actionCommand")[index].id;
        valueJson = obj.completeValueJson(index, valueJson, "actionCommand");
        switch(paramId){ // # Branch the command where is executed by paramId.
            case 1: // # id: 1
                global.mapScene();
                // var paramValue = obj.getValueJson(valueJson, 1); // Gets the value of the parameter id: 1. (Numeric input value)
                // Agtk.log("The parameter entered for [ActionCommand1] is "+temp+".");              
                break;
            case 2: // # id: 2
                global.unitMapObject.set(instanceId, global.mapObject);
                global.findPathtoPlayer(instanceId, global.unitMapObject.get(instanceId));
                break;
            case 3:         
                if (global.list.length != 0 && global.list.get(instanceId) != 0) {
                    global.moveToLocation(instanceId, global.list.get(instanceId));
                    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorLoop;
                }
                break;
            case 4:
                global.moveDistance(instanceId, global.list.get(instanceId)[1]);
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
            case 1: 
                if (global.list.length != 0) {
                    var list = global.list.get(instanceId);
                    var self = global.getCurrentLocation(instanceId);
                    // checks if unit can jump, will need to account for changing directions when jumping (e.g. moving right then jumping to the left side of a platform above)
                    if (list.length > 1) {
                        var currentTile = list[0];
                        var landingTile = list[1];
                        var directions = global.movement.Up;
                        var range = global.range;
                        if (currentTile.direction == global.movement.Jump && global.isWallContact(8, instanceId)) {
                            // short jumps meant for jumping up onto higher platfomrs
                            if (landingTile.direction == global.movement.Left
                                && ((currentTile.x - self.x) <= -range)
                                && (list[2].direction != global.movement.FallDown || Math.abs(list[2].x - self.x) > global.jumpRange)) {
                                    Agtk.log("short left jump, at: " + + self.x + ", " + self.y + " direction: ");
                                    directions = global.movement.Left;  
                                    var args = {
                                        "direction": directions,
                                        "directionId": -2,
                                        "moveDistance": 0,
                                        "moveDistanceEnabled": false,
                                    }    
                                    Agtk.objectInstances.get(instanceId).execCommandDirectionMove(args);
                                    list.shift();
                                    return true;          
                            }
    
                            if (landingTile.direction == global.movement.Right 
                                && ((self.x - currentTile.x) <= -range )
                                && (list[2].direction != global.movement.FallDown || Math.abs(list[2].x - self.x) > global.jumpRange)
                            ) {
                                    Agtk.log("short right jump, at: " + + self.x + ", " + self.y + " direction: ")
                                    directions = global.movement.Right;   
                                    var args = {
                                        "direction": directions,
                                        "directionId": -2,
                                        "moveDistance": 0,
                                        "moveDistanceEnabled": false,
                                    }    
                                    Agtk.objectInstances.get(instanceId).execCommandDirectionMove(args);
                                    list.shift();
                                    return true;                                       
                            }
                            
                            // for jumping over high gaps
                            if (Math.abs(self.x - currentTile.x) <= 0
                                && global.direction.get(instanceId) == landingTile.direction) {
                                Agtk.log("far forward jump at " + self.x + ", " + self.y);
                                list.shift();
                                return true;
                            }
                        }
                    }       
    
                    // due to current pathfinder algorithm, units prefer to fall down and jump immediately back up instead of just jumping over gaps that have a platform below. This condition checks for that issue and orders the unit to jump.
                    if (list.length >= 3) {
                        if ((list[0].direction == global.movement.FallDown 
                            && list[2].direction == global.movement.Jump 
                            && Math.abs(list[2].x - list[0].x) <= 15
                            && Math.abs(self.x - list[0].x) <= 1)
                        ) {
                                Agtk.log("jumping over a small gap at " + self.x + ", " + self.y);
                                list.shift();
                                list.shift();
                                list.shift();
                                return true;  
                        }
                    }  
                }            
                break;
            case 2: // # id: 2
                if (global.list.length != 0) {
                    var list = global.list.get(instanceId);
                    var index = Agtk.objectInstances.get(instanceId).variables.AreaAttributeId;
                    // checks if unit can jump, will need to account for changing directions when jumping (e.g. moving right then jumping to the left side of a platform above)
                    if (list.length > 1) {
                        var currentTile = list[0];
                        if ((currentTile.direction == global.movement.Up || currentTile.direction == global.movement.Down)
                            // && Agtk.objectInstances.get(instanceId).variables.get(index).getValue() == global.ladderID
                        ) {
                            Agtk.log("[LinkCondition2] is executed.");
                            return true;
                        }
                    }       
                }
                break; 
            case 3:
                if (global.list.length != 0) {
                    // checks if unit finished climbing ladder
                    var list = global.list.get(instanceId);
                    if (list.length > 1) {
                        var currentTile = list[0];
                        if (currentTile.direction != global.movement.Up && currentTile.direction != global.movement.Down) {
                            Agtk.log("[LinkCondition3] is executed.");
                            return true;
                        }
                    }       
                }
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