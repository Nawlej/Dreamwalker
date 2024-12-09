(function(){
    var obj = {};
    obj.locale = null;

    obj.getInfo = function(category){
        if(category == 'name'){
            return obj.locale.substr(0, 2) == 'ja' ? 'オートタイル(RPGツクールMV)' : 'AutoTile(RPG Maker MV)';
        } else if(category == 'description'){
            return obj.locale.substr(0, 2) == 'ja' ? 'RPGツクールMVフォーマット用オートタイルプラグイン' : 'AutoTile plugin for RPG Maker MV tileset format';
        } else if(category == 'author'){
            return 'Keiji Agusa / Jumpei Shinozaki';
        } else if(category == 'help'){
            return obj.locale.substr(0, 2) == 'ja' ? "RPGツクールMVフォーマットのタイルセットを使ってオートタイルを描くことができます。\n※プロジェクト設定のタイルサイズが48x48の場合のみ、RPGツクールMVのタイル素材をそのまま使用できます。\n　プロジェクトのタイルサイズが違う場合は、RPGツクールMVのタイル素材を調整してください。" : "You can draw autotiles using a tileset in RPG Maker MV Tileset format, \n* Only when the tile size of the project setting is 48 x 48, you can use the tile material of RPG Maker MV as it is.\n  If the tile size of the project is different, please adjust the tile material of RPG Maker MV.";
        } else if(category == 'parameter'){
            return [
            ];
        } else if(category == 'internal'){
            return null;
        } else if(category == 'autoTile'){
            return [
                {
                    id: 1,
                    name: obj.locale.substr(0, 2) == 'ja' ? 'タイルセットタイプ' : 'Tileset type',
                    type: 'CustomId',
                    customParam: [
                        {id: 1, name: "World_A1"},
                        {id: 2, name: "World_A2"},
                        //{id: 3, name: "World_B"},
                        //{id: 4, name: "World_C"},
                        //{id: 5, name: "Outside_A1"},
                        //{id: 6, name: "Outside_A2"},
                        //{id: 7, name: "Outside_A3"},
                        {id: 8, name: "Outside_A4"}
                    ],
                    defaultValue: 1
                }
            ];
        }
        return null;
    };
    obj.initialize = function(settings){
    };
    obj.finalize = function(){
    };

    obj.setLocale = function(_locale){
        console.log("autoTile_RPGMV.setLocale: " + _locale);
        obj.locale = _locale;
    }
    obj.getParamValue = function(param, id){
        if(id in param){
            return param[id];
        }
        var valueList = param.valueList;
        for(var len = valueList.length, i = 0; i < len; i++){
            if(valueList[i].id == id){
                return valueList[i].value;
            }
        }
        var arr = obj.getInfo('autoTile');
        for(var i = 0; i < arr.length; i++){
            if('defaultValue' in arr[i]){
                return arr[i].defaultValue;
            }
        }
        return null;
    };
    obj.getFrontIndex = function(typeParam, tileX, tileY){
        var backTileList = typeParam.backTileList;
        for(var i = 0; i < backTileList.length; i++){
            var backTile = backTileList[i];
            if(tileX >= backTile[0]
            && tileX < backTile[0] + backTile[2]
            && tileY >= backTile[1]
            && tileY < backTile[1] + backTile[3]){
                return i;
                break;
            }
        }
        return -1;
        return frontIndex;
    }
    obj.typeParamList = [
        {
            //World_A1
            horzCount: 8,
            vertCount: 2,
            frontTileList: [
                [0, 0], [0, 3], [6, 0], [6, 3],  [8, 0], [14, 0], [8, 3], [14, 3],
                [0, 6], [6, 6], [0, 9], [6, 9],  [8, 6], [14, 6], [8, 9], [14, 9]
            ],
            backTileList: [
                [0, 0, 6, 3], [0, 3, 6, 3], [6, 0, 2, 3], [6, 3, 2, 3],  [8, 0, 6, 3], [14, 0, 2, 3], [8, 3, 6, 3], [14, 3, 2, 3],
                [0, 6, 6, 3], [6, 6, 2, 3], [0, 9, 6, 3], [6, 9, 2, 3],  [8, 6, 6, 3], [14, 6, 2, 3], [8, 9, 6, 3], [14, 9, 2, 3]
            ],
            animInfoList: [
                [0, 0, 2, 3, [[2, 0], [4, 0], [2, 0]]], [0, 3, 2, 3, [[2, 3], [4, 3], [2, 3]]], [8, 0, 2, 3, [[10, 0], [12, 0], [10, 0]]], [14, 0, 2, 1, [[14, 1], [14, 2]]], [8, 3, 2, 3, [[10, 3], [12, 3], [10, 3]]], [14, 3, 2, 1, [[14, 4], [14, 5]]],
                [0, 6, 2, 3, [[2, 6], [4, 6], [2, 6]]], [6, 6, 2, 1, [[6, 7], [6, 8]]], [0, 9, 2, 3, [[2, 9], [4, 9], [2, 9]]], [6, 9, 2, 1, [[6, 10], [6, 11]]],  [8, 6, 2, 3, [[10, 6], [12, 6], [10, 6]]], [14, 6, 2, 1, [[14, 7], [14, 8]]], [8, 9, 2, 3, [[10, 9], [12, 9], [10, 9]]], [14, 9, 2, 1, [[14, 10], [14, 11]]]
            ],
            attributeList: [
                'sea', 'sea', 'sea', 'sea',  'swamp', 'any', 'lava', 'any',
                'lake', 'any', 'snow', 'any',  'hole', 'any', 'snow_hole', 'any'
            ],
            borderTypeList: [
                'soil', 'soil', 'soil', 'soil',  'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil',  'soil', 'soil', 'soil', 'soil'
            ]
        },
        {
            //World_A2
            horzCount: 8,
            vertCount: 4,
            frontTileList: [
                [0, 0], [2, 0], [4, 0], [6, 0],  [8, 0], [10, 0], [12, 0], [14, 0],
                [0, 3], [2, 3], [4, 3], [6, 3],  [8, 3], [10, 3], [12, 3], [14, 3],
                [0, 6], [2, 6], [4, 6], [6, 6],  [8, 6], [10, 6], [12, 6], [14, 6],
                [0, 9], [2, 9], [4, 9], [6, 9],  [8, 9], [10, 9], [12, 9], [14, 9]
            ],
            backTileList: [
                [0, 0, 2, 3], [2, 0, 2, 3], [4, 0, 2, 3], [6, 0, 2, 3],  [8, 0, 2, 3], [10, 0, 2, 3], [12, 0, 2, 3], [14, 0, 2, 3],
                [0, 3, 2, 3], [2, 3, 2, 3], [4, 3, 2, 3], [6, 3, 2, 3],  [8, 3, 2, 3], [10, 3, 2, 3], [12, 3, 2, 3], [14, 3, 2, 3],
                [0, 6, 2, 3], [2, 6, 2, 3], [4, 6, 2, 3], [6, 6, 2, 3],  [8, 6, 2, 3], [10, 6, 2, 3], [12, 6, 2, 3], [14, 6, 2, 3],
                [0, 9, 2, 3], [2, 9, 2, 3], [4, 9, 2, 3], [6, 9, 2, 3],  [8, 9, 2, 3], [10, 9, 2, 3], [12, 9, 2, 3], [14, 9, 2, 3]
            ],
            animInfoList: [
            ],
            attributeList: [
                'grass', 'grass', 'forest', 'forest',  'tree1', 'tree2', 'mountain1', 'mountain2',
                'wasteland', 'wasteland', 'depression', 'depression',        'dead_tree', 'sand', 'mountain3', 'mountain4',
                'sand_hill', 'sand_hill', 'rocky', 'rocky',        'palm_tree', 'round_tile', 'mountain5', 'mountain6',
                'chilly', 'snow_mountain', 'snow_forest', 'snow_forest',        'snow_tree', 'hole', 'mountain7', 'mountain8'
            ],
            borderTypeList: [
                'soil', 'soil', 'soil', 'soil',  'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil',  'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil',  'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil',  'soil', 'soil', 'soil', 'soil'
            ]
        },
        {
            //World_B
            horzCount: 0,
            vertCount: 0,
            frontTileList: [
            ],
            backTileList: [
            ],
            animInfoList: [
            ],
            attributeList: [
            ],
            borderTypeList: [
            ]
        },
        {
            //World_C
            horzCount: 0,
            vertCount: 0,
            frontTileList: [
            ],
            backTileList: [
            ],
            animInfoList: [
            ],
            attributeList: [
            ],
            borderTypeList: [
            ]
        },
        {
            //Outside_A1
            horzCount: 0,
            vertCount: 0,
            frontTileList: [
            ],
            backTileList: [
            ],
            animInfoList: [
            ],
            attributeList: [
            ],
            borderTypeList: [
            ]
        },
        {
            //Outside_A2
            horzCount: 0,
            vertCount: 0,
            frontTileList: [
            ],
            backTileList: [
            ],
            animInfoList: [
            ],
            attributeList: [
            ],
            borderTypeList: [
            ]
        },
        {
            //Outside_A3
            horzCount: 0,
            vertCount: 0,
            frontTileList: [
            ],
            backTileList: [
            ],
            animInfoList: [
            ],
            attributeList: [
            ],
            borderTypeList: [
            ]
        },
        {
            //Outside_A4
            horzCount: 8,
            vertCount: 6,
            frontTileList: [
                [0, 0], [2, 0], [4, 0], [6, 0],  [8, 0], [10, 0], [12, 0], [14, 0],
                [[0, 6], [3, 6], [0, 9], [3, 9]], [[4, 6], [7, 6], [4, 9], [7, 9]], [[8, 6], [11, 6], [8, 9], [11, 9]], [[12, 6], [15, 6], [12, 9], [15, 9]],
                [[16, 6], [19, 6], [16, 9], [19, 9]], [[20, 6], [23, 6], [20, 9], [23, 9]], [[24, 6], [27, 6], [24, 9], [27, 9]], [[28, 6], [31, 6], [28, 9], [31, 9]],
                [0, 5], [2, 5], [4, 5], [6, 5],  [8, 5], [10, 5], [12, 5], [14, 5],
                [[0, 16], [3, 16], [0, 19], [3, 19]], [[4, 16], [7, 16], [4, 19], [7, 19]], [[8, 16], [11, 16], [8, 19], [11, 19]], [[12, 16], [15, 16], [12, 19], [15, 19]],
                [[16, 16], [19, 16], [16, 19], [19, 19]], [[20, 16], [23, 16], [20, 19], [23, 19]], [[24, 16], [27, 16], [24, 19], [27, 19]], [[28, 16], [31, 16], [28, 19], [31, 19]],
                [0, 10], [2, 10], [4, 10], [6, 10],  [8, 10], [10, 10], [12, 10], [14, 10],
                [[0, 26], [3, 26], [0, 29], [3, 29]], [[4, 26], [7, 26], [4, 29], [7, 29]], [[8, 26], [11, 26], [8, 29], [11, 29]], [[12, 26], [15, 26], [12, 29], [15, 29]],
                [[16, 26], [19, 26], [16, 29], [19, 29]], [[20, 26], [23, 26], [20, 29], [23, 29]], [[24, 26], [27, 26], [24, 29], [27, 29]], [[28, 26], [31, 26], [28, 29], [31, 29]]
            ],
            backTileList: [
                [0, 0, 2, 3], [2, 0, 2, 3], [4, 0, 2, 3], [6, 0, 2, 3],  [8, 0, 2, 3], [10, 0, 2, 3], [12, 0, 2, 3], [14, 0, 2, 3],
                [0, 3, 2, 2], [2, 3, 2, 2], [4, 3, 2, 2], [6, 3, 2, 2],  [8, 3, 2, 2], [10, 3, 2, 2], [12, 3, 2, 2], [14, 3, 2, 2],
                [0, 5, 2, 3], [2, 5, 2, 3], [4, 5, 2, 3], [6, 5, 2, 3],  [8, 5, 2, 3], [10, 5, 2, 3], [12, 5, 2, 3], [14, 5, 2, 3],
                [0, 8, 2, 2], [2, 8, 2, 2], [4, 8, 2, 2], [6, 8, 2, 2],  [8, 8, 2, 2], [10, 8, 2, 2], [12, 8, 2, 2], [14, 8, 2, 2],
                [0, 10, 2, 3], [2, 10, 2, 3], [4, 10, 2, 3], [6, 10, 2, 3],  [8, 10, 2, 3], [10, 10, 2, 3], [12, 10, 2, 3], [14, 10, 2, 3],
                [0, 13, 2, 2], [2, 13, 2, 2], [4, 13, 2, 2], [6, 13, 2, 2],  [8, 13, 2, 2], [10, 13, 2, 2], [12, 13, 2, 2], [14, 13, 2, 2]
            ],
            animInfoList: [
            ],
            attributeList: [
                'Wall_A_Top',  'Wall_B_Top',  'Wall_C_Top',  'Wall_D_Top',  'Wall_E_Top',  'Wall_F_Top',  'Wall_G_Top',  'Wall_H_Top',
                'Wall_A_Side', 'Wall_B_Side', 'Wall_C_Side', 'Wall_D_Side', 'Wall_E_Side', 'Wall_F_Side', 'Wall_G_Side', 'Wall_H_Side',
                'Wall_I_Top',  'Wall_J_Top',  'Wall_K_Top',  'InteriorWall_A_Top',  'InteriorWall_B_Top',  'Wall_L_Top',  'Wall_M_Top',  'Wall_N_Top',
                'Wall_I_Side', 'Wall_J_Side', 'Wall_K_Side', 'InteriorWall_A_Side', 'InteriorWall_B_Side', 'Wall_L_Side', 'Wall_M_Side', 'Wall_N_Side',
                'InteriorWall_C_Top',  'InteriorWall_D_Top',  'InteriorWall_E_Top',  'InteriorWall_F_Top',  'InteriorWall_G_Top',  'InteriorWall_H_Top',  'Wall_O_Top',  'Wall_P_Top',
                'InteriorWall_C_Side', 'InteriorWall_D_Side', 'InteriorWall_E_Side', 'InteriorWall_F_Side', 'InteriorWall_G_Side', 'InteriorWall_H_Side', 'Wall_O_Side', 'Wall_P_Side'
            ],
            borderTypeList: [
                'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil',
                'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil', 'soil'
            ]
        }
    ];
    obj.getTypeParam = function(type){
        if(type-1 < 0 || type-1 >= obj.typeParamList.length){
            console.log("Unknown type: " + [JSON.stringify(type), obj.typeParamList.length].join(", "));
            return null;
        }
        return obj.typeParamList[type - 1];
    };
    obj.getAttribute = function(param, x, y){
        var type = obj.getParamValue(param, 1);
        var typeParam = obj.getTypeParam(type);
        if(typeParam === null){
            return 'none';
        }
        var frontIndex = obj.getFrontIndex(typeParam, x, y);
        if(frontIndex < 0 || frontIndex >= typeParam.attributeList.length){
            return 'none';
        }
        return typeParam.attributeList[frontIndex];
    };
    obj.getBorderType = function(param, x, y){
        var type = obj.getParamValue(param, 1);
        var typeParam = obj.getTypeParam(type);
        if(typeParam === null){
            return 'none';
        }
        var frontIndex = obj.getFrontIndex(typeParam, x, y);
        if(frontIndex < 0 || frontIndex >= typeParam.borderTypeList.length){
            return 'none';
        }
        return typeParam.borderTypeList[frontIndex];
    };
    obj.callExternal = function(tilesetId, func, tileX, tileY){
        var tileset = Agtk.tilesets.getById(tilesetId);
        if(tileset === null) return null;
        var pluginId = tileset.getPluginId();
        if(pluginId < 0){
            return null;
        }
        var plugin = Agtk.plugins.getById(pluginId);
        if(plugin === null){
            return null;
        }
        var param = tileset.getPluginParam();
        return plugin.call(param, func, tileX, tileY);
    };
    obj.getAttributeLocal = function(typeParam, frontIndex){
        if(frontIndex < 0){
            return 'none';
        }
        var attributeList = typeParam.attributeList;
        if(frontIndex >= 0 && frontIndex < attributeList.length){
            return attributeList[frontIndex];
        }
        return 'none';
    }
    obj.getBorderTypeLocal = function(typeParam, frontIndex){
        if(frontIndex < 0){
            return 'none';
        }
        var borderTypeList = typeParam.borderTypeList;
        if(frontIndex >= 0 && frontIndex < borderTypeList.length){
            return borderTypeList[frontIndex];
        }
        return 'none';
    }
    obj.getWallType = function(type, attribute) {
       if (type == 8) {
           return attribute.substr(attribute.lastIndexOf("_") + 1);
       }
       return '';
    }
    obj.isSameWallTile = function(typeParam, layer, x, y, tilesetId, attribute) {
        var tile = layer.getTileInfo(x, y);
        if (tile === null) {
            return false;
        }
        if(tile.tilesetId != tilesetId){
            return false;
        }
        var fi = obj.getFrontIndex(typeParam, tile.tileX, tile.tileY);
        if (obj.getAttributeLocal(typeParam, fi) != attribute) {
            return false;
        }
        return true;
    }
    obj.isWallTile = function(layer, x, y, tilesetId) {
        var tile = layer.getTileInfo(x, y);
        if (tile !== null) {
            if(tile.tilesetId == tilesetId){
                return true;
            }
        }
        return false;
    }
    obj.call = function(param, func, param1, param2){
        var type = obj.getParamValue(param, 1);
        var typeParam = obj.getTypeParam(type);
        if(func == 'getHorzCount'){
            if(typeParam === null){
                return 0;
            }
            return typeParam.horzCount;
        } else if(func == 'getVertCount'){
            if(typeParam === null){
                return 0;
            }
            return typeParam.vertCount;
        } else if(func == 'getFrontTileList'){
            if(typeParam === null){
                return [];
            }
            return typeParam.frontTileList;
        } else if(func == 'getBackTileList'){
            if(typeParam === null){
                return [];
            }
            return typeParam.backTileList;
        } else if(func == 'getAttributeList'){
            if(typeParam === null){
                return [];
            }
            return typeParam.attributeList;
        } else if(func == 'getAttribute'){
            if(typeParam === null){
                return 'none';
            }
            return obj.getAttribute(param, x, y);
        } else if(func == 'getBorderType'){
            if(typeParam === null){
                return 'none';
            }
            return obj.getBorderType(param, x, y);
        } else if(func == 'updateArea'){
            if(typeParam === null){
                return;
            }
            //in: param1: Updated tile area: [x, y, width, height]
            //side effect: Updates subtiles.
            var params = param1;
            var scene = Agtk.scenes.getById(Agtk.ui.editSceneId);
            var horzTileCount = Math.ceil(scene.horzScreenCount * Agtk.settings.screenWidth / Agtk.settings.tileWidth);
            var vertTileCount = Math.ceil(scene.vertScreenCount * Agtk.settings.screenHeight / Agtk.settings.tileHeight);
            var tilesetId = obj.getParamValue(param, 'tilesetId');
            var editLayerIndex = Agtk.ui.editLayerIndex;
            var layers = scene.layers;
            var layerCount = layers.getCount();
            var layer = layers.getById(layers.getIdByIndex(editLayerIndex));
            if(layer === null){
                return;
            }
            var frontTileList = typeParam.frontTileList;
            var UpLeft = 0 + 0 * 3;
            var Up = 1 + 0 * 3;
            var UpRight = 2 + 0 * 3;
            var Left = 0 + 1 * 3;
            var Center = 1 + 1 * 3;
            var Right = 2 + 1 * 3;
            var DownLeft = 0 + 2 * 3;
            var Down = 1 + 2 * 3;
            var DownRight = 2 + 2 * 3;
            for(var j = 0; j < params[3]; j++){
                var y = params[1] + j;
                if(y < 0 || y >= vertTileCount) continue;
                for(var i = 0; i < params[2]; i++){
                    var x = params[0] + i;
                    if(x < 0 || x >= horzTileCount) continue;
                    var frontIndexMatrix = [];
                    var attributeMatrix = [];
                    var borderTypeMatrix = [];
                    for(var l = -1; l <= 1; l++){
                        var y2 = y + l;
                        for(var k = -1; k <= 1; k++){
                            var x2 = x + k;
                            if(x2 < 0 || x2 >= horzTileCount
                            || y2 < 0 || y2 >= vertTileCount){
                                frontIndexMatrix.push(-1);
                                attributeMatrix.push('any');
                                borderTypeMatrix.push('any');
                                continue;
                            }
                            var tile = layer.getTileInfo(x2, y2);
                            var attribute = 'any';
                            var frontIndex = -1;
                            var borderType = -1;
                            if(tile.tilesetId == tilesetId){
                                frontIndex = obj.getFrontIndex(typeParam, tile.tileX, tile.tileY);
                                attribute = obj.getAttributeLocal(typeParam, frontIndex);
                                borderType = obj.getBorderTypeLocal(typeParam, frontIndex);
                            } else {
                                attribute = obj.callExternal(tile.tilesetId, 'getAttribute', tile.tileX, tile.tileY);
                                borderType = obj.callExternal(tile.tilesetId, 'getBorderType', tile.tileX, tile.tileY);
                            }
                            frontIndexMatrix.push(frontIndex);
                            attributeMatrix.push(attribute);
                            borderTypeMatrix.push(borderType);
                        }
                    }
                    var centerAttribute = attributeMatrix[Center];
                    if(frontIndexMatrix[Center] == -1){
                        // do nothing if the center is using a tileset assinged this plugin.
                        continue;
                    }
                    var frontTile = frontTileList[frontIndexMatrix[Center]];
                    if(centerAttribute == 'any'){
                        // a subtile of 'any' repeats 2x1 tiles.
                        var start = ((x + y) & 1);
                        for(var sy = 0; sy < 2; sy++){
                            for(var sx = 0; sx < 2; sx++){
                                layer.setSubtileInfo(x * 2 + sx, y * 2 + sy, (frontTile[0] + start) * 2 + sx, frontTile[1] * 2 + sy);
                            }
                        }
                    } else {
                        if (type == 1 || type == 2 || obj.getWallType(type, centerAttribute) == 'Top') {
                            // Up-left subtile.
                            if(attributeMatrix[Up] == 'any' || attributeMatrix[Up] == centerAttribute){
                                if(attributeMatrix[Left] == 'any' || attributeMatrix[Left] == centerAttribute){
                                    if(attributeMatrix[UpLeft] == 'any' || attributeMatrix[UpLeft] == centerAttribute){
                                        // fills up-left.
                                        layer.setSubtileInfo(x * 2 + 0, y * 2 + 0, frontTile[0] * 2 + 1, frontTile[1] * 2 + 3);
                                    } else {
                                        // Up-left is a soil, so fills top and bottom.
                                        layer.setSubtileInfo(x * 2 + 0, y * 2 + 0, frontTile[0] * 2 + 2, frontTile[1] * 2 + 0);
                                    }
                                } else {
                                    // Left is a soil, then right is a filling and goes to top.
                                    layer.setSubtileInfo(x * 2 + 0, y * 2 + 0, frontTile[0] * 2 + 0, frontTile[1] * 2 + 4);
                                }
                            } else {
                                if(attributeMatrix[Left] == 'any' || attributeMatrix[Left] == centerAttribute){
                                    // Up is a soil, and bottom is a filling and goes to left.
                                    layer.setSubtileInfo(x * 2 + 0, y * 2 + 0, frontTile[0] * 2 + 2, frontTile[1] * 2 + 2);
                                } else {
                                    // Up, left, and up-left are soils, and right-down is a filling.
                                    layer.setSubtileInfo(x * 2 + 0, y * 2 + 0, frontTile[0] * 2 + 0, frontTile[1] * 2 + 2);
                                }
                            }
                            // Up-right subtile.
                            if(attributeMatrix[Up] == 'any' || attributeMatrix[Up] == centerAttribute){
                                if(attributeMatrix[Right] == 'any' || attributeMatrix[Right] == centerAttribute){
                                    if(attributeMatrix[UpRight] == 'any' || attributeMatrix[UpRight] == centerAttribute){
                                        // Up-right is a filling.
                                        layer.setSubtileInfo(x * 2 + 1, y * 2 + 0, frontTile[0] * 2 + 2, frontTile[1] * 2 + 3);
                                    } else {
                                        // Up-right is a soil, and fills top and bottom.
                                        layer.setSubtileInfo(x * 2 + 1, y * 2 + 0, frontTile[0] * 2 + 3, frontTile[1] * 2 + 0);
                                    }
                                } else {
                                    // Right is a soil, and left is a filling and goes to top.
                                    layer.setSubtileInfo(x * 2 + 1, y * 2 + 0, frontTile[0] * 2 + 3, frontTile[1] * 2 + 4);
                                }
                            } else {
                                if(attributeMatrix[Right] == 'any' || attributeMatrix[Right] == centerAttribute){
                                    // Up is a soil, and down is a filling and goes to right.
                                    layer.setSubtileInfo(x * 2 + 1, y * 2 + 0, frontTile[0] * 2 + 1, frontTile[1] * 2 + 2);
                                } else {
                                    // Up-right: up-right is a soil and Down-left is a filling.
                                    layer.setSubtileInfo(x * 2 + 1, y * 2 + 0, frontTile[0] * 2 + 3, frontTile[1] * 2 + 2);
                                }
                            }
                            // Down-left subtile.
                            if(attributeMatrix[Down] == 'any' || attributeMatrix[Down] == centerAttribute){
                                if(attributeMatrix[Left] == 'any' || attributeMatrix[Left] == centerAttribute){
                                    if(attributeMatrix[DownLeft] == 'any' || attributeMatrix[DownLeft] == centerAttribute){
                                        // fills down-left.
                                        layer.setSubtileInfo(x * 2 + 0, y * 2 + 1, frontTile[0] * 2 + 1, frontTile[1] * 2 + 4);
                                    } else {
                                        // Down-left is a soil, and fills up and down.
                                        layer.setSubtileInfo(x * 2 + 0, y * 2 + 1, frontTile[0] * 2 + 2, frontTile[1] * 2 + 1);
                                    }
                                } else {
                                    // Left is a soil, and right is a filling and goes to down.
                                    layer.setSubtileInfo(x * 2 + 0, y * 2 + 1, frontTile[0] * 2 + 0, frontTile[1] * 2 + 3);
                                }
                            } else {
                                if(attributeMatrix[Left] == 'any' || attributeMatrix[Left] == centerAttribute){
                                    // Down is a soil, and up is a filling andn goes to left.
                                    layer.setSubtileInfo(x * 2 + 0, y * 2 + 1, frontTile[0] * 2 + 2, frontTile[1] * 2 + 5);
                                } else {
                                    // Down-left: downleft is a soil, and up-right is a filling.
                                    layer.setSubtileInfo(x * 2 + 0, y * 2 + 1, frontTile[0] * 2 + 0, frontTile[1] * 2 + 5);
                                }
                            }
                            // Down-right subtile.
                            if(attributeMatrix[Down] == 'any' || attributeMatrix[Down] == centerAttribute){
                                if(attributeMatrix[Right] == 'any' || attributeMatrix[Right] == centerAttribute){
                                    if(attributeMatrix[DownRight] == 'any' || attributeMatrix[DownRight] == centerAttribute){
                                        // fills down-right.
                                        layer.setSubtileInfo(x * 2 + 1, y * 2 + 1, frontTile[0] * 2 + 2, frontTile[1] * 2 + 4);
                                    } else {
                                        // Down-right is a soil, and fills top and bottom.
                                        layer.setSubtileInfo(x * 2 + 1, y * 2 + 1, frontTile[0] * 2 + 3, frontTile[1] * 2 + 1);
                                    }
                                } else {
                                    // Right is a soil, and left is a filling and goes to down.
                                    layer.setSubtileInfo(x * 2 + 1, y * 2 + 1, frontTile[0] * 2 + 3, frontTile[1] * 2 + 3);
                                }
                            } else {
                                if(attributeMatrix[Right] == 'any' || attributeMatrix[Right] == centerAttribute){
                                    // Down is a soil, and up is a filling and goes to right.
                                    layer.setSubtileInfo(x * 2 + 1, y * 2 + 1, frontTile[0] * 2 + 1, frontTile[1] * 2 + 5);
                                } else {
                                    // Down-right: down-right is a soil, and up-left is a filling.
                                    layer.setSubtileInfo(x * 2 + 1, y * 2 + 1, frontTile[0] * 2 + 3, frontTile[1] * 2 + 5);
                                }
                            }
                        } else if (obj.getWallType(type, centerAttribute) == 'Side') {
                            var tableIndex = 0;
                            
                            var yUp = y;
                            while (yUp >= 0 && yUp < vertTileCount) {
                                if (!obj.isSameWallTile(typeParam, layer, x, yUp - 1, tilesetId, centerAttribute)) {
                                    break;
                                }
                                yUp--;
                            }
                            
                            var yDown = y;
                            while (yDown >= 0 && yDown < vertTileCount) {
                                if (!obj.isSameWallTile(typeParam, layer, x, yDown + 1, tilesetId, centerAttribute)) {
                                    break;
                                }
                                yDown++;
                            }
                            
                            var leftConnected = obj.isSameWallTile(typeParam, layer, x - 1, y, tilesetId, centerAttribute) &&
                                obj.isSameWallTile(typeParam, layer, x - 1, yDown, tilesetId, centerAttribute) &&
                                !obj.isSameWallTile(typeParam, layer, x - 1, yDown + 1, tilesetId, centerAttribute) &&
                                obj.isSameWallTile(typeParam, layer, x - 1, yUp, tilesetId, centerAttribute) &&
                                !obj.isSameWallTile(typeParam, layer, x - 1, yUp - 1, tilesetId, centerAttribute) ||
                                obj.isWallTile(layer, x - 1, y, tilesetId) &&
                                obj.isWallTile(layer, x - 1, yDown, tilesetId) &&
                                obj.isWallTile(layer, x - 1, yDown + 1, tilesetId) &&
                                obj.isWallTile(layer, x - 1, yUp, tilesetId) &&
                                obj.isWallTile(layer, x - 1, yUp - 1, tilesetId);

                            var rightConnected = obj.isSameWallTile(typeParam, layer, x + 1, y, tilesetId, centerAttribute) &&
                                obj.isSameWallTile(typeParam, layer, x + 1, yDown, tilesetId, centerAttribute) &&
                                !obj.isSameWallTile(typeParam, layer, x + 1, yDown + 1, tilesetId, centerAttribute) &&
                                obj.isSameWallTile(typeParam, layer, x + 1, yUp, tilesetId, centerAttribute) &&
                                !obj.isSameWallTile(typeParam, layer, x + 1, yUp - 1, tilesetId, centerAttribute) ||
                                obj.isWallTile(layer, x + 1, y, tilesetId) &&
                                obj.isWallTile(layer, x + 1, yDown, tilesetId) &&
                                obj.isWallTile(layer, x + 1, yDown + 1, tilesetId) &&
                                obj.isWallTile(layer, x + 1, yUp, tilesetId) &&
                                obj.isWallTile(layer, x + 1, yUp - 1, tilesetId);

                            var tableIndex = 0;
                            if (!leftConnected) {
                                tableIndex += 0x01;
                            }
                            if (!rightConnected) {
                                tableIndex += 0x04;
                            }
                            if (attributeMatrix[Up] != centerAttribute) {
                                tableIndex += 0x02;
                            }
                            if (attributeMatrix[Down] != centerAttribute) {
                                tableIndex += 0x08;
                            }

                            var wallAutoTileTable = [
                                [[2,2],[1,2],[2,1],[1,1]],[[0,2],[1,2],[0,1],[1,1]],
                                [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
                                [[2,2],[3,2],[2,1],[3,1]],[[0,2],[3,2],[0,1],[3,1]],
                                [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]],
                                [[2,2],[1,2],[2,3],[1,3]],[[0,2],[1,2],[0,3],[1,3]],
                                [[2,0],[1,0],[2,3],[1,3]],[[0,0],[1,0],[0,3],[1,3]],
                                [[2,2],[3,2],[2,3],[3,3]],[[0,2],[3,2],[0,3],[3,3]],
                                [[2,0],[3,0],[2,3],[3,3]],[[0,0],[3,0],[0,3],[3,3]]
                            ];
                            layer.setSubtileInfo(x * 2 + 0, y * 2 + 0, frontTile[0][0] + wallAutoTileTable[tableIndex][0][0], frontTile[0][1] + wallAutoTileTable[tableIndex][0][1]);
                            layer.setSubtileInfo(x * 2 + 1, y * 2 + 0, frontTile[0][0] + wallAutoTileTable[tableIndex][1][0], frontTile[0][1] + wallAutoTileTable[tableIndex][1][1]);
                            layer.setSubtileInfo(x * 2 + 0, y * 2 + 1, frontTile[0][0] + wallAutoTileTable[tableIndex][2][0], frontTile[0][1] + wallAutoTileTable[tableIndex][2][1]);
                            layer.setSubtileInfo(x * 2 + 1, y * 2 + 1, frontTile[0][0] + wallAutoTileTable[tableIndex][3][0], frontTile[0][1] + wallAutoTileTable[tableIndex][3][1]);
                        }
                    }
                }
            }
            return;
        } else if(func == 'onParamChanged'){
            var lastParam = param1;
            if(typeParam === null){
                return;
            }
            var type = obj.getParamValue(param, 1);
            var lastType = obj.getParamValue(lastParam, 1);
            if(type === lastType){
                // no change.
                return;
            }
            // Register animations.
            var tilesetId = obj.getParamValue(param, 'tilesetId');
            var tileset = Agtk.tilesets.getById(tilesetId);
            if(tileset === null) return null;
            var animInfoList = typeParam.animInfoList;
            for(var i = 0; i < animInfoList.length; i++){
                var animInfo = animInfoList[i];
                tileset.clearAnimation(animInfo[0], animInfo[1], animInfo[2], animInfo[3]);
                tileset.appendAnimation(animInfo[0], animInfo[1], animInfo[2], animInfo[3], animInfo[0], animInfo[1], 0.5 * 300);
                var keyList = animInfo[4];
                for(var j = 0; j < keyList.length; j++){
                    var key = keyList[j];
                    tileset.appendAnimation(animInfo[0], animInfo[1], animInfo[2], animInfo[3], key[0], key[1], 0.5 * 300);
                }
            }
        }
        return null;
    };
    return obj;
}())
