(function (){
	MapSceneTiles: function (instance){
	//pixel/dot as units
	//this function only finds tiles with a wall detection of 1, 3, or 5. It will also find ladder tiles.
	
	//instance is Agtk.sceneInstances
	//var sceneId = instance.getCurrent().sceneId;
	var scene = Agtk.scenes.getinstance.getCurrent().sceneId
	Agtk.log("scene: " + scene.name)
	
	var screenRes = Agtk.settings.screenWidth;
	var widthVar= scene.horzScreenCount;
	var heightVar = scene.vertScreenCount;
	var layer = scene.getLayerById(scene.getLayerIdByName("Layer 2"));//-----------------------------------------
	var self = Agtk.objectInstances.get(instanceId).variables;
	var tileX = self.get(self.XId).getValue() / Agtk.settings.tileWidth;
	var tileY = self.get(self.YId).getValue() / Agtk.settings.tileHeight;
	Agtk.log(tileX + ", " + tileY);
	//getTileInfo coord are based on tiles so (0,0) is a different tile than (1, 0)
	var tileset = layer.getTileInfo(tileX, tileY);
	Agtk.log("Unit Location Tile Wall Detection: " + Agtk.tilesets.get(tileset.tilesetId).getWallBits(tileset.x, tileset.y));

	Agtk.log ("top: " + Agtk.constants.tile.WallTopBit + "; left: " + Agtk.constants.tile.WallLeftBit + "; right: " + 	Agtk.constants.tile.WallRightBit  + "; bottom: " + Agtk.constants.tile.WallBottomBit);
	return widthVar * screenRes;
	}

})()