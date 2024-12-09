(function(){
    var obj = {};
    obj.locale = null;
    obj.internal = {counter: 0};

    obj.getInfo = function(category){
        obj.internal.counter++;
        if(category == 'name'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return '選択肢の表示';
            } else {
                return 'Show Choices';
            }
        } else if(category == 'description'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return '画面に選択肢を表示します。';
            } else {
                return 'Show choices on the screen';
            }
        } else if(category == 'author'){
            return 'Keiji Agusa';
        } else if(category == 'help'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return "簡易的な選択肢の表示を行います。";
            } else {
                return "This plugin shows choies on the screen.";
            }
        } else if(category == 'parameter'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: '画像素材', type: 'ImageId', defaultValue: -1},
                ];
            } else {
                return [
                    {id: 1, name: 'Image', type: 'ImageId', defaultValue: -1},
                ];
            }
        } else if(category == 'internal'){
            return obj.internal;
        } else if(category == 'actionCommand'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: '選択肢の表示', description: '選択肢をを表示します。', parameter: [
                        {id: 1, name: '選択肢1:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 101, name: '', type: 'EmbeddedEditable', sourceId: 1, reference: 'text', width: 256, height: 48},
                        {id: 2, name: '選択肢2:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 102, name: '', type: 'EmbeddedEditable', sourceId: 2, reference: 'text', width: 256, height: 48},
                        {id: 3, name: '選択肢3:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 103, name: '', type: 'EmbeddedEditable', sourceId: 3, reference: 'text', width: 256, height: 48},
                        {id: 4, name: '選択肢4:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 104, name: '', type: 'EmbeddedEditable', sourceId: 4, reference: 'text', width: 256, height: 48},
                        {id: 5, name: '選択肢5:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 105, name: '', type: 'EmbeddedEditable', sourceId: 5, reference: 'text', width: 256, height: 48},
                        {id: 6, name: '選択肢6:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 106, name: '', type: 'EmbeddedEditable', sourceId: 6, reference: 'text', width: 256, height: 48},

                        {id: 7, name: 'フォント:', type: 'FontId', defaultValue: -1},
                        {id: 8, name: '背景:', type: 'CustomId', customParam: [{id: 1, name: "白枠"}, {id: 2, name: "黒"}, {id: 3, name: "無し"}], defaultValue: 1},
                        {id: 9, name: '表示位置:', type: 'CustomId', customParam: [{id: 1, name: "左側"}, {id: 2, name: "真ん中"}, {id: 3, name: "右側"}], defaultValue: 2},
                        {id: 10, name: '選択結果を代入する変数:', type: 'VariableId', defaultValue: -1, withNewButton: true},
                        {id: 11, name: 'キャンセル:', type: 'CustomId', customParam: [{id: 1, name: "許可"}, {id: 2, name: "不可"}], defaultValue: 2}
                    ]},
                ];
            } else {
                return [
                    {id: 1, name: 'Show choices', description: 'Show choices on the screen', parameter: [
                        {id: 1, name: 'Choice1:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 101, name: '', type: 'EmbeddedEditable', sourceId: 1, reference: 'text', width: 256, height: 48},
                        {id: 2, name: 'Choice2:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 102, name: '', type: 'EmbeddedEditable', sourceId: 2, reference: 'text', width: 256, height: 48},
                        {id: 3, name: 'Choice3:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 103, name: '', type: 'EmbeddedEditable', sourceId: 3, reference: 'text', width: 256, height: 48},
                        {id: 4, name: 'Choice4:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 104, name: '', type: 'EmbeddedEditable', sourceId: 4, reference: 'text', width: 256, height: 48},
                        {id: 5, name: 'Choice5:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 105, name: '', type: 'EmbeddedEditable', sourceId: 5, reference: 'text', width: 256, height: 48},
                        {id: 6, name: 'Choice6:', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 106, name: '', type: 'EmbeddedEditable', sourceId: 6, reference: 'text', width: 256, height: 48},

                        {id: 7, name: 'Font:', type: 'FontId', defaultValue: -1},
                        {id: 8, name: 'Background:', type: 'CustomId', customParam: [{id: 1, name: "White frame"}, {id: 2, name: "Black"}, {id: 3, name: "None"}], defaultValue: 1},
                        {id: 9, name: 'Position:', type: 'CustomId', customParam: [{id: 1, name: "Left"}, {id: 2, name: "Center"}, {id: 3, name: "Right"}], defaultValue: 2},
                        {id: 10, name: 'Variable:', type: 'VariableId', defaultValue: -1, withNewButton: true},
                        {id: 11, name: 'Cancel:', type: 'CustomId', customParam: [{id: 1, name: "Enabled"}, {id: 2, name: "Diabled"}], defaultValue: 2}
                    ]},
                ];
            }
        } else if(category == 'linkCondition'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: '選択肢で判定', description: '直前のアクションで選ばれた選択肢を判定できます。\n選択肢がキャンセルされた場合も判定できます。', parameter: [
                        {id: 1, name: '判定条件:', type: 'CustomId', customParam: [{id: 1, name: "選択肢1"}, {id: 2, name: "選択肢2"}, {id: 3, name: "選択肢3"}, {id: 4, name: "選択肢4"}, {id: 5, name: "選択肢5"}, {id: 6, name: "選択肢6"}, {id: 7, name: "選択肢をキャンセル"}], defaultValue: 1}
					]}
                ];
            } else {
                return [
                    {id: 1, name: 'Choice selected', description: 'You can judge the choice you chose in the last action.\nYou can also judge when the choice is canceled.', parameter: [
                        {id: 1, name: 'Condition:', type: 'CustomId', customParam: [{id: 1, name: "Choice1"}, {id: 2, name: "Choice2"}, {id: 3, name: "Choice3"}, {id: 4, name: "Choice4"}, {id: 5, name: "Choice5"}, {id: 6, name: "Choice6"}, {id: 7, name: "Cancel"}], defaultValue: 1}
					]}
                ];
            }
        }
        return null;
    };
    obj.initialize = function(settings){
        obj.showing = false;
        obj.paramValue = [];
        obj.selectedInfo = {};
        if(settings === null) return;
    };
    obj.finalize = function(){
    };

    obj.setLocale = function(_locale){
        obj.locale = _locale;
    };

    obj.setInternal = function(settings){
        if(typeof settings === 'object'){
        }
    };
    obj.call = function(name, param1, param2){
    };

    obj.setParamValue = function(param){
        obj.paramValue = param;
    }

    obj.execActionCommand = function(index, valueJson, objectId, instanceId, actionId, commandId){
        obj.commandActive = true;
        if(index == 0){
            return obj.execShowChoices(index, valueJson, objectId, instanceId, actionId, commandId);
        }
    };
    obj.execShowChoices = function(index, valueJson, objectId, instanceId, actionId, commandId)
    {
        if(obj.showing){
            if(obj.choicesLayer.objectId != objectId || obj.choicesLayer.instanceId != instanceId){
                //Show Choices is requested by another instance.
                //Cancel the current choices.
                var result = obj.choicesLayer.currentIndex;
                if(obj.choicesLayer.cancellable){
                    result = -1;
                }
                obj.setSelectedInfo(obj.choicesLayer.objectId, obj.choicesLayer.instanceId, result, obj.choicesLayer.variableId);
                obj.destroyChoices();
            }
        }
        if(obj.showing){
            return obj.choicesLayer.update();
        } else {
            valueJson = obj.completeValueJson(index, valueJson);
            return obj.createChoices(valueJson, objectId, instanceId);
        }
    };
    obj.createChoices = function(valueJson, objectId, instanceId)
    {
        var winSize = cc.director.getWinSize();
        obj.screenWidth = winSize.width;
        obj.screenHeight = winSize.height;

        var layerTag = (obj.id << 16);
        var ChoicesLayer = cc.Layer.extend({
            kModeOpening: 0,
            kModeWaitingForKey: 1,
            kModeClosing: 2,
            kModeEnd: 3,
            kBackgroundWhiteFrame: 1,
            kBackgroundBlack: 2,
            kBackgroundNone: 3,
            kPositionLeft: 1,
            kPositionCenter: 2,
            kPositionRight: 3,
            ctor:function (valueJson, objectId, instanceId) {
                this._super();
         
                this.valueJson = valueJson;
                this.objectId = objectId;
                this.instanceId = instanceId;
                this.bgType = obj.getValue(valueJson, 8);
                this.currentIndex = 0;
                this.pressedKey = ~0;
                this.mousePressedKey = ~0;
                this.cancellable = (obj.getValue(valueJson, 11) === 1);
                this.variableId = obj.getValue(valueJson, 10);
                this.mode = this.kModeEnd;

                var bgImageId = obj.getValue(obj.paramValue, 1);
                if(bgImageId === null){
                    return false;
                }
                var bgImageData = Agtk.images.get(bgImageId);
                if(bgImageData == null){
                    return false;
                }
                this.bgImageTex = cc.TextureCache.getInstance().addImage(bgImageData.filename);
                this.bgImageTex.setAliasTexParameters();

                var fontId = obj.getValue(valueJson, 7);
                if(fontId === null){
                    return false;
                }
                var fontData = Agtk.fonts.get(fontId);

                this.frameLayer = new cc.Layer();
                this.addChild(this.frameLayer);
                this.highlightLayer = new cc.Layer();
                this.highlightLayer.x = 8;
                this.highlightLayer.y = 8;
                this.addChild(this.highlightLayer);
                this.textLayer = new cc.Layer();
                this.textLayer.x = 8;
                this.textLayer.y = 8;
                this.addChild(this.textLayer);

                this.choiceCount = 0;
                this.choiceHeightList = [];
                var textWidth = 0;
                var textHeight = 0;
                for(var i = 0; i < 6; i++){
                    var textId = obj.getValue(valueJson, 1 + i);
                    var textData = Agtk.texts.get(textId);
                    if(textData == null){
                        break;
                    }
                    var fdata = fontData;
                    if(fdata === null){
                        if(textData.fontId >= 0){
                            fdata = Agtk.fonts.get(textData.fontId);
                        }
                    }
                    if(fdata === null){
                        break;
                    }
                    var text = textData.getText(obj.locale);
                    if(text == null || text.length == 0){
                        break;
                    }
                    var fontDraw = new obj.FontDraw(this.textLayer, 1, fdata, textData.letterSpacing);
                    for(var j = 0; j < text.length; j++){
                        if(text[j] == '\n') break;
                        if(text.substr(j, 2) == '\\\\'){
                            j += 2 - 1;
                            fontDraw.putLetter('\\');
                            continue;
                        }
                        var dat = fontDraw.parseTag(text, j, fontDraw.currentSize);
                        if(dat.tagName != null){
                            j = fontDraw.applyTagData(text, j, dat) - 1;
                            continue;
                        }
                        fontDraw.putLetter(text[j]);
                    }
					if(fontDraw.currentLineMaxHeight < 0){
						fontDraw.currentLineMaxHeight = fontDraw.currentSize;
					}
                    fontDraw.letterLayer.x = 0;
                    fontDraw.letterLayer.y = -textHeight;
                    if(fontDraw.letterX > textWidth){
                        textWidth = fontDraw.letterX;
                    }
                    textHeight += fontDraw.currentLineMaxHeight + 8;
                    this.choiceCount++;
                    this.choiceHeightList.push(fontDraw.currentLineMaxHeight);
                }
                if(this.choiceCount == 0){
                    return false;
                }
                textHeight -= 8;
                this.textLayer.x = 8;
                this.textLayer.y = textHeight + 8;
                this.textLayer.visible = false;

                this.winWidth = textWidth + 16;
                this.winHeight = textHeight + 16;
                if(this.bgType == this.kBackgroundBlack){
                    this.createWindow(0, 0, this.winWidth, this.winHeight);
                    this.setChildrenOpacity(this.frameLayer, 0);
                }
                this.mode = this.kModeOpening;
                this.modeCounter = 0;

                this.highlight = null;
                //this.updateHighlight();

                var position = obj.getValue(valueJson, 9);
                if(position == this.kPositionLeft){
                    this.x = 0;
                } else if(position == this.kPositionCenter){
                    this.x = (obj.screenWidth - this.winWidth) / 2;
                } else if(position == this.kPositionRight){
                    this.x = (obj.screenWidth - this.winWidth);
                }
                this.y = (obj.screenHeight - this.winHeight) / 2;

                return true;
            },
            update: function(){
                if(obj.showing){
                    if(this.mode == this.kModeOpening){
                        if(this.bgType == this.kBackgroundBlack){
                            var alpha = (this.modeCounter * 255 / 30);
                            if(alpha >= 255){
                                alpha = 255;
                                this.mode = this.kModeWaitingForKey;
                                this.modeCounter = 0;
                                this.textLayer.visible = true;
                                this.updateHighlight();
                            } else {
                                this.modeCounter++;
                            }
                            this.setChildrenOpacity(this.frameLayer, alpha);
                        } else {
                            this.frameLayer.removeAllChildren();
                            var winHeight = (this.modeCounter + 1) * 16;
                            if(winHeight >= this.winHeight){
                                winHeight = this.winHeight;
                            }
                            var winY = (this.winHeight - winHeight) / 2;
                            this.createWindow(0, winY, this.winWidth, winHeight, this.windowFilename);
                            if(winHeight >= this.winHeight){
                                this.mode = this.kModeWaitingForKey;
                                this.modeCounter = 0;
                                this.textLayer.visible = true;
                                this.updateHighlight();
                            } else {
                                this.modeCounter++;
                            }
                        }
                        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                    }
                    if(this.mode == this.kModeWaitingForKey){
                        if(this.isKeyUpJustPressed()){
                            if(this.currentIndex > 0){
                                this.currentIndex--;
                                this.updateHighlight();
                            }
                        } else if(this.isKeyDownJustPressed()){
                            if(this.currentIndex < this.choiceCount - 1){
                                this.currentIndex++;
                                this.updateHighlight();
                            }
                        } else if(this.isKeyOkJustPressed()){
                            this.mode = this.kModeClosing;
                            this.modeCounter = 0;
                            this.textLayer.visible = false;
                            this.highlightLayer.visible = false;
                        } else if(this.isMouseLeftClickJustPressed()){
                            var index = this.getClickedIndex();
                            if(index >= 0){
                                if(index == this.currentIndex){
                                    this.mode = this.kModeClosing;
                                    this.modeCounter = 0;
                                    this.textLayer.visible = false;
                                    this.highlightLayer.visible = false;
                                } else {
                                    this.currentIndex = index;
                                    this.updateHighlight();
                                }
                            }
                        } else if(this.cancellable && (this.isKeyCancelJustPressed() || this.isMouseRightClickJustPressed())){
                            this.mode = this.kModeClosing;
                            this.modeCounter = 0;
                            this.currentIndex = -1;
                            this.textLayer.visible = false;
                            this.highlightLayer.visible = false;
                        }
                    }
                    if(this.mode == this.kModeClosing){
                        if(this.bgType == this.kBackgroundNone){
                            this.mode = this.kModeEnd;
                            this.modeCounter = 0;
                        } else if(this.bgType == this.kBackgroundBlack){
                            var alpha = 255 - (this.modeCounter * 255 / 30);
                            if(alpha <= 0){
                                alpha = 0;
                                this.mode = this.kModeEnd;
                                this.modeCounter = 0;
                            } else {
                                this.modeCounter++;
                            }
                            this.setChildrenOpacity(this.frameLayer, alpha);
                        } else {
                            this.frameLayer.removeAllChildren();
                            var winHeight = this.winHeight - (this.modeCounter + 1) * 16;
                            if(winHeight < 16){
                                winHeight = 0;
                                this.mode = this.kModeEnd;
                                this.modeCounter = 0;
                            } else {
                                var winY = (this.winHeight - winHeight) / 2;
                                this.createWindow(0, winY, this.winWidth, winHeight, this.windowFilename);
                                this.modeCounter++;
                            }
                        }
                        if(this.mode != this.kModeEnd){
                            return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                        }
                    }
                    if(this.mode == this.kModeEnd){
                        obj.setSelectedInfo(this.objectId, this.instanceId, this.currentIndex, this.variableId);
                        obj.choicesLayer.removeFromParent();
                        obj.choicesLayer = null;
                        obj.showing = false;
                        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
                    }
                    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                }
                return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
            },
            getClickedIndex: function(){
                var x = Agtk.variables.get(Agtk.variables.MouseXId).getValue();
                var y = obj.screenHeight - 1 - Agtk.variables.get(Agtk.variables.MouseYId).getValue();
                if(x < this.x + 4 || x >= this.x + this.winWidth - 4){
                    return -1;
                }
                var iy = this.y + 8;
                for(var i = this.choiceHeightList.length - 1; i >= 0; i--){
                    if(y >= iy - 4 && y < iy + this.choiceHeightList[i] + 4){
                        return i;
                    }
                    iy += 8 + this.choiceHeightList[i];
                }
                return -1;
            },
            onExit: function(){
                this._super();
                obj.choicesLayer = null;
                obj.showing = false;
            }
            ,
            createWindow: function(winX, winY, winWidth, winHeight)
            {
                var oy = 0;
                if(this.bgType == this.kBackgroundWhiteFrame){
                    oy = 0;
                } else if(this.bgType == this.kBackgroundBlack){
                    oy = 24;
                } else if(this.bgType == this.kBackgroundNone){
                    return;
                }
                var sprite = cc.Sprite.create(this.bgImageTex, cc.rect(0, oy, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX;
                sprite.y = winY + winHeight - 8;
                this.frameLayer.addChild(sprite);
                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(8, oy, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX + 8;
                sprite.y = winY + winHeight - 8;
                sprite.width = winWidth - 16;
                this.frameLayer.addChild(sprite);
                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(16, oy, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX + winWidth - 8;
                sprite.y = winY + winHeight - 8;
                this.frameLayer.addChild(sprite);

                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(0, oy + 8, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX;
                sprite.y = winY + 8;
                sprite.height = winHeight - 16;
                this.frameLayer.addChild(sprite);
                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(8, oy + 8, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX + 8;
                sprite.y = winY + 8;
                sprite.width = winWidth - 16;
                sprite.height = winHeight - 16;
                this.frameLayer.addChild(sprite);
                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(16, oy + 8, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX + winWidth - 8;
                sprite.y = winY + 8;
                sprite.height = winHeight - 16;
                this.frameLayer.addChild(sprite);

                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(0, oy + 16, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX;
                sprite.y = winY;
                this.frameLayer.addChild(sprite);
                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(8, oy + 16, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX + 8;
                sprite.y = winY;
                sprite.width = winWidth - 16;
                this.frameLayer.addChild(sprite);
                sprite = cc.Sprite.create(this.bgImageTex, cc.rect(16, oy + 16, 8, 8));
                sprite.setAnchorPoint(0, 0);
                sprite.x = winX + winWidth - 8;
                sprite.y = winY;
                this.frameLayer.addChild(sprite);
            },
            updateHighlight: function(){
                if(this.highlight !== null){
                    this.highlight.removeFromParent();
                }
                var y = 0;
                for(var i = this.choiceHeightList.length - 1; i > this.currentIndex; i--){
                    y += 8 + this.choiceHeightList[i];
                }
                this.highlight = cc.DrawNode.create();
                this.highlight.drawRect(cc.p(-4, y - 4), cc.p(this.winWidth - 16 + 4, y + this.choiceHeightList[this.currentIndex] + 4), cc.color(0, 255, 255, 128), 0, cc.color(0, 0, 0, 0));
                this.highlightLayer.addChild(this.highlight);
                this.highlight.runAction(cc.sequence(cc.fadeIn(0.0), cc.repeat(cc.sequence(cc.fadeTo(0.5, 255), cc.fadeTo(0.5, 128)), Math.pow(2,30))));
            },
            isKeyOkJustPressed: function(){
                return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyOk);
            },
            isKeyCancelJustPressed: function(){
                return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyCancel);
            },
            isKeyUpJustPressed: function(){
                return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyUp);
            },
            isKeyDownJustPressed: function(){
                return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyDown);
            },
            isMouseLeftClickJustPressed: function(){
                return this.isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_LeftClick);
            },
            isMouseRightClickJustPressed: function(){
                return this.isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_RightClick);
            },
            isKeyPressed: function(keyId){
                for(var i = 0; i <= Agtk.controllers.MaxControllerId; i++){
                    if(Agtk.controllers.getOperationKeyPressed(i, keyId)){
                        return true;
                    }
                }
                return false;
            },
            isKeyJustPressed: function(keyId){
                var pressed = this.isKeyPressed(keyId);
                if(!(this.pressedKey & (1 << keyId)) && pressed){
                    this.pressedKey = (this.pressedKey & ~(1 << keyId)) | (pressed ? (1 << keyId) : 0);
                    return true;
                }
                this.pressedKey = (this.pressedKey & ~(1 << keyId)) | (pressed ? (1 << keyId) : 0);
                return false;
            },
            isMousePressed: function(keyCode){
                if(Agtk.controllers.getKeyValue(0, keyCode) != 0){
                    return true;
                }
                return false;
            },
            isMouseJustPressed: function(keyCode){
                var pressed = this.isMousePressed(keyCode);
                if(!(this.mousePressedKey & (1 << keyCode)) && pressed){
                    this.mousePressedKey = (this.mousePressedKey & ~(1 << keyCode)) | (pressed ? (1 << keyCode) : 0);
                    return true;
                }
                this.mousePressedKey = (this.mousePressedKey & ~(1 << keyCode)) | (pressed ? (1 << keyCode) : 0);
                return false;
            },
            setChildrenOpacity: function(node, alpha){
                var children = node.children;
                for(var i = 0; i < children.length; i++){
                    children[i].opacity = alpha;
                }
            }
        });

        var agtkLayer = Agtk.sceneInstances.getCurrent().getMenuLayerById(Agtk.constants.systemLayers.HudLayerId);
        if(agtkLayer == null){
            return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
        }
        obj.choicesLayer = new ChoicesLayer(valueJson, objectId, instanceId);
        agtkLayer.addChild(obj.choicesLayer, 0, layerTag);
        obj.showing = true;
        obj.setSelectedInfo(obj.choicesLayer.objectId, obj.choicesLayer.instanceId, -2, obj.choicesLayer.variableId);
        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
    }

    obj.destroyChoices = function()
    {
        if(!obj.showing){
            return;
        }
        obj.choicesLayer.removeFromParent();
        obj.choicesLayer = null;
        obj.showing = false;
    }

    obj.setSelectedInfo = function(objectId, instanceId, index, variableId)
    {
        obj.selectedInfo[objectId + '-' + instanceId] = index;
        if(variableId >= 0){
            var instance = Agtk.objectInstances.get(instanceId);
            if(instance !== null){
                var variable = instance.variables.get(variableId);
                if(variable !== null){
                    variable.setValue(index + 1);
                }
            }
        }
    };

    obj.execLinkCondition = function(index, valueJson, objectId, instanceId, actionLinkId){
        var info = -2;
        var key = objectId + '-' + instanceId;
        if(key in obj.selectedInfo){
            info = obj.selectedInfo[key];
        }
        var vj = obj.getInfo('linkCondition')[index];
		var target = vj.parameter[0].defaultValue;
		if(valueJson.length > 0){
			target = valueJson[0].value;
		}
        if(target >= 1 && target <= 6){
            if(info === target - 1){
                return true;
            }
            return false;
        } else if(target == 7){
            if(info === -1){
                return true;
            }
            return false;
        }
        return false;
    };

    obj.update = function(dt){
    };

    obj.completeValueJson = function(index, valueJson){
        var vj = obj.getInfo('actionCommand')[index];
        var parameter = vj.parameter;
        if(!!parameter){
            for(var i = 0; i < parameter.length; i++){
                var id = parameter[i].id;
                var found = false;
                for(var j = 0; j < valueJson.length; j++){
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
    obj.getValue = function(valueJson, id){
        for(var i = 0; i < valueJson.length; i++){
            if(valueJson[i].id == id){
                return valueJson[i].value;
            }
        }
        return null;
    };

    obj.FontDraw = function(layer, zIndex, fontData, letterSpacing){
        this.letterX = 0;
        this.letterY = 0;
        this.letterSpacing = letterSpacing;
        this.lineSpacing = 0;
        this.fontData = fontData;
        this.imageFontFlag = fontData.imageFontFlag;
        if(this.imageFontFlag){
            var fontImageId = fontData.imageId;
            this.fixedWidth = fontData.fixedWidth;
            this.hankakuWidth = fontData.hankakuWidth;
            this.zenkakuWidth = fontData.zenkakuWidth;
            this.letterLayout = fontData.letterLayout;
            var fontImageData = Agtk.images.get(fontImageId);
            if(fontImageData == null){
                this.mode = this.kModeEnd;
                return false;
            }
            this.fontImageTex = cc.TextureCache.getInstance().addImage(fontImageData.filename);
            if(this.fontImageTex == null){
                return false;
            }
            this.fontImageTex.setAliasTexParameters();
            this.layoutLineList = this.letterLayout.split("\n");
            this.layoutLines = this.layoutLineList.length;
            var maxLetters = 0;
            for(var i = 0; i < this.layoutLineList.length; i++){
                maxLetters = Math.max(maxLetters, this.layoutLineList[i].length);
            }
            this.layoutLineLetters = maxLetters;
            this.letterWidth = Math.floor(this.fontImageTex.width / this.layoutLineLetters);
            this.letterHeight = Math.floor(this.fontImageTex.height / this.layoutLines);
        } else {
            this.fontSize = fontData.fontSize;
            this.letterHeight = fontData.fontSize;
            this.ttfFilename = "fonts/" + fontData.fontName + ".ttf";
            this.aliasThreshold = fontData.antialiasDisabled ? fontData.aliasThreshold : -1;
        }
        this.currentSize = this.letterHeight;
        this.currentLineMaxHeight = -1;
        this.currentColor = [255, 255, 255];
        this.letterLayer = new cc.Layer();
        this.letterLayer.setAnchorPoint(0, 0);
        layer.addChild(this.letterLayer, zIndex);

        this.winHeight = this.letterHeight;
    };
    obj.FontDraw.prototype = {
        clearLetters: function(){
            this.letterLayer.removeAllChildren();
        },
        getInt: function(numStr, defValue)
        {
            var num = parseInt(numStr, 10);
            if(isNaN(num)){
                return defValue;
            }
            return num;
        },
        parseTag: function(message, head, size)
        {
            //ret: {head: <next head position>, tagName: <'S', 'C', or null>, param: <if 'S' then <size: int>. if 'C' then [<R: int>, <G: int>, <B: int>]. > }
            var tag = message.substr(head, 3);
            if(tag == "\\S["){
                var index = message.indexOf(']', head + 3);
                if(index >= 0){
                    var word = message.substr(head + 3, index - (head + 3));
                    if(word.length == 0){
                        size = this.letterHeight;
                    } else if(word[0] == '+'){
                        size = Math.max(0, size + this.getInt(word.substr(1), 0));
                    } else if(word[0] == '-'){
                        size = Math.max(0, size - this.getInt(word.substr(1), 0));
                    } else {
                        size = Math.max(0, this.getInt(word, this.letterHeight));
                    }
                    head = index + 1;
                    return {head: head, tagName: 'S', param: size};
                }
            } else if(tag == "\\C["){
                var index = message.indexOf(']', head + 3);
                if(index >= 0){
                    var word = message.substr(head + 3, index - (head + 3));
                    var rgb;
                    if(word.length == 0){
                        rgb = [255, 255, 255];
                    } else if(word[0] == '#'){
                        if(word.length == 3 + 1){
                            var v = parseInt(word.substr(1), 16);
                            rgb = [
                                ((v >> 8) & 0x0f) * 0x11,
                                ((v >> 4) & 0x0f) * 0x11,
                                ((v >> 0) & 0x0f) * 0x11];
                        } else if(word.length == 6 + 1){
                            var v = parseInt(word.substr(1), 16);
                            rgb = [
                                (v >> 16) & 0xff,
                                (v >> 8) & 0xff,
                                (v >> 0) & 0xff];
                        } else {
                            rgb = [255, 255, 255];
                        }
                    } else {
                        var list = word.split(',');
                        if(list.length < 3){
                            rgb = [255, 255, 255];
                        } else {
                            rgb = [
                                Math.max(0, Math.min(255, this.getInt(list[0], 255))),
                                Math.max(0, Math.min(255, this.getInt(list[1], 255))),
                                Math.max(0, Math.min(255, this.getInt(list[2], 255)))
                            ];
                        }
                    }
                    head = index + 1;
                    return {head: head, tagName: 'C', param: rgb};
                }
            }
            return {head: head, tagName: null};
        },
        applyTagData: function(text, head, dat)
        {
            if(dat.tagName == 'S'){
                head = dat.head;
                this.currentSize = dat.param;
            } else if(dat.tagName == 'C'){
                head = dat.head;
                this.currentColor = dat.param;
            }
            return head;
        },
        putLetter: function(letter){
            if(this.imageFontFlag){
                var isHankaku = (!letter.match(/[^\x01-\x7E]/) || !letter.match(/[^\uFF65-\uFF9F]/));
                var cx = -1;
                var cy = -1;
                for(var i = 0; i < this.layoutLineList.length; i++){
                    var index = this.layoutLineList[i].indexOf(letter);
                    if(index >= 0){
                        cx = index;
                        cy = i;
                        break;
                    }
                }
                if(cx >= 0 && cy >= 0){
                    var sprite = cc.Sprite.create(this.fontImageTex, cc.rect(cx * this.letterWidth, cy * this.letterHeight, this.letterWidth, this.letterHeight));
                    sprite.setAnchorPoint(0, 0);
                    sprite.x = this.letterX;
                    sprite.y = this.winHeight - this.letterHeight * 2 - (this.currentSize - this.letterHeight) - this.letterY;
                    sprite.width = this.letterWidth * this.currentSize / this.letterHeight;
                    sprite.height = this.letterHeight * this.currentSize / this.letterHeight;
                    sprite.color = cc.color(this.currentColor[0], this.currentColor[1], this.currentColor[2]);
                    this.letterLayer.addChild(sprite);
                    this.letterX += (this.fixedWidth ? this.letterWidth : isHankaku ? this.hankakuWidth : this.zenkakuWidth) * this.currentSize / this.letterHeight + this.letterSpacing;
                }
            } else {
                var label = new cc.LabelTTF(letter, this.ttfFilename, this.fontSize * this.currentSize / this.letterHeight, undefined, undefined, undefined, this.aliasThreshold);
                label.color = cc.color(this.currentColor[0], this.currentColor[1], this.currentColor[2]);
                label.setAnchorPoint(0, 0);
                label.x = this.letterX;
                //label.y = this.winHeight - this.fontSize * 2 - this.letterY;
                label.y = this.winHeight - this.letterHeight * 2 - (this.currentSize - this.letterHeight) - this.letterY - this.currentSize / 8;
                this.letterLayer.addChild(label);
                this.letterX += label.width + this.letterSpacing;
            }
			if(this.currentSize > this.currentLineMaxHeight){
				this.currentLineMaxHeight = this.currentSize;
			}
        }
    };

    return obj;
}())
