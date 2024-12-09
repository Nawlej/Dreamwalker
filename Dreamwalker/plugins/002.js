(function(){
    var obj = {};
    obj.locale = null;

    obj.getInfo = function(category){
        if(category == 'name'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return '文章の表示';
            } else {
                return 'Show Message';
            }
        } else if(category == 'description'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return '文章の表示を行います。';
            } else {
                return 'Show message on the screen';
            }
        } else if(category == 'author'){
            return 'Keiji Agusa';
        } else if(category == 'help'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return "簡易的な文章の表示を行います。";
            } else {
                return "This plugin displays a message on the screen.";
            }
        } else if(category == 'parameter'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: '背景画像', type: 'ImageId', defaultValue: -1},
                ];
            } else {
                return [
                    {id: 1, name: 'BG Image', type: 'ImageId', defaultValue: -1},
                ];
            }
        } else if(category == 'internal'){
            return null;
        } else if(category == 'actionCommand'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: '文章の表示', description: '文章の表示を行います。', parameter: [
                        {id: 1, name: '顔', type: 'ImageId', defaultValue: -1},
                        {id: 100, name: '', type: 'Embedded', sourceId: 1, width: 144, height: 144},
                        {id: 2, name: '文章', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 101, name: '', type: 'EmbeddedEditable', sourceId: 2, reference: 'text', width: 256, height: 96},
                        {id: 102, name: '    フォント', type: 'EmbeddedEditable', sourceId: 2, reference: 'fontId'},
                        {id: 3, name: '表示速度', type: 'CustomId', customParam: [{id: 1, name: "瞬間"}, {id: 2, name: "速い"}, {id: 3, name: "普通"}, {id: 4, name: "遅い"}], defaultValue: 3},
                        {id: 4, name: '背景', type: 'CustomId', customParam: [{id: 1, name: "白枠"}, {id: 2, name: "黒"}, {id: 3, name: "無し"}], defaultValue: 1},
                        {id: 5, name: '表示位置', type: 'CustomId', customParam: [{id: 1, name: "上段"}, {id: 2, name: "中段"}, {id: 3, name: "下段"}], defaultValue: 3}
                    ]}
                ];
            } else {
                return [
                    {id: 1, name: 'Show Message', description: 'Show message on the screen', parameter: [
                        {id: 1, name: 'Face', type: 'ImageId', defaultValue: -1},
                        {id: 100, name: '', type: 'Embedded', sourceId: 1, width: 144, height: 144},
                        {id: 2, name: 'Text', type: 'TextId', defaultValue: -1, withNewButton: true},
                        {id: 101, name: '', type: 'EmbeddedEditable', sourceId: 2, reference: 'text', width: 256, height: 96},
                        {id: 102, name: '    Font', type: 'EmbeddedEditable', sourceId: 2, reference: 'fontId'},
                        {id: 3, name: 'Speed', type: 'CustomId', customParam: [{id: 1, name: "Instant"}, {id: 2, name: "Fast"}, {id: 3, name: "Normal"}, {id: 4, name: "Slow"}], defaultValue: 3},
                        {id: 4, name: 'Background', type: 'CustomId', customParam: [{id: 1, name: "White frame"}, {id: 2, name: "Black"}, {id: 3, name: "None"}], defaultValue: 1},
                        {id: 5, name: 'Position', type: 'CustomId', customParam: [{id: 1, name: "Top"}, {id: 2, name: "Center"}, {id: 3, name: "Bottom"}], defaultValue: 3}
                    ]}
                ];
            }
        } else if(category == 'linkCondition'){
            if(obj.locale.substr(0, 2) == 'ja'){
                return [
                    {id: 1, name: '文章の表示が終わっているか', description: '文章の表示が終わっているかを判定します。', parameter: [
                    ]}
                ];
            } else {
                return [
                    {id: 1, name: 'Message has ended', description: 'It judges whether the message display has ended.', parameter: [
                    ]}
                ];
            }
        }
        return null;
    };
    obj.initialize = function(settings){
        obj.showing = false;
        obj.commandActive = false;
        obj.instanceId = -1;
        obj.actionId = -1;
        obj.commandId = -1;
        obj.paramValue = [];
        obj.keyAPressed = true;
        obj.closingMessageInfo = null;
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
        var winSize = cc.director.getWinSize();
        obj.screenWidth = winSize.width;
        obj.screenHeight = winSize.height;

        obj.commandActive = true;
        valueJson = obj.completeValueJson(index, valueJson);
        var layerTag = (obj.id << 16);
        if(!obj.showing){
            var MessageLayer = cc.Layer.extend({
                sprite:null,
                kModeOpening: 0,
                kModeLetterPutting: 1,
                kModeWaitingForKey: 2,
                kModeEndChecking: 3,
                kModeClosing: 4,
                kModeEnd: 5,
                kSpeedInstant: 1,
                kSpeedFast: 2,
                kSpeedNormal: 3,
                kSpeedSlow: 4,
                kBackgroundWhiteFrame: 1,
                kBackgroundBlack: 2,
                kBackgroundNone: 3,
                kPositionTop: 1,
                kPositionCenter: 2,
                kPositionBottom: 3,
                ctor:function (instanceId, actionId, commandId, valueJson) {
                    this._super();
             
                    this.stack = [];

                    if(!this.setup(instanceId, actionId, commandId, valueJson, false)){
                        return false;
                    }
                    this.indicatorSprite = cc.Sprite.create(this.bgImageTex, cc.rect(0, 48, 16, 16));
                    this.indicatorSprite.setAnchorPoint(0, 0);
                    this.indicatorSprite.x = this.winWidth / 2 - this.indicatorSprite.width / 2;
                    this.indicatorSprite.y = 8 - 1;
                    this.indicatorSprite.opacity = 0;
                    this.indicatorSprite.visible = false;
                    this.indicatorSprite.runAction(cc.sequence(cc.fadeIn(0.5), cc.repeat(cc.sequence(cc.moveBy(0.5, 0, -4), cc.moveBy(0.5, 0, 4)), Math.pow(2,30))));
                    this.addChild(this.indicatorSprite, 1);
             
                    return true;
                },
                onExit: function(){
                    this._super();
                    obj.messageLayer = null;
                    obj.showing = false;
                },
                setup: function(instanceId, actionId, commandId, valueJson, takeover){
                    obj.instanceId = instanceId;
                    obj.actionId = actionId;
                    obj.commandId = commandId;
                    obj.keyAPressed = this.isKeyOkPressed();
                    var bgImageId = -1;
                    var imageId = -1;
                    var textId = -1;
                    this.speed = this.kSpeedNormal;
                    this.bgType = this.kBackgroundWhiteFrame;
                    this.vertAlign = this.kPositionBottom;
                    for(var i = 0; i < valueJson.length; i++){
                        var vo = valueJson[i];
                        if(vo.id == 1){
                            imageId = vo.value;
                        } else if(vo.id == 2){
                            textId = vo.value;
                        } else if(vo.id == 3){
                            this.speed = vo.value;
                        } else if(vo.id == 4){
                            this.bgType = vo.value;
                        } else if(vo.id == 5){
                            this.vertAlign = vo.value;
                        }
                    }
                    this.valueJson = valueJson;
                    var textData = Agtk.texts.get(textId);
                    if(textData == null){
                        this.mode = this.kModeEnd;
                        return false;
                    }
                    this.message = textData.getText(obj.locale);
                    if(this.message == null){
                        this.mode = this.kModeEnd;
                        return false;
                    }
                    var fontId = textData.fontId;
                    this.letterSpacing = textData.letterSpacing;
                    this.lineSpacing = textData.lineSpacing;
                    var fontData = Agtk.fonts.get(fontId);
                    if(fontData == null){
                        this.mode = this.kModeEnd;
                        return false;
                    }
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
                            this.mode = this.kModeEnd;
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

                    var size = cc.winSize;
             
                    this.letterX = 0;
                    this.letterY = 0;

                    obj.winX = 0;
                    this.winWidth = obj.screenWidth;
                    this.winHeight = this.calcWindowHeight();
                    obj.winY = (this.vertAlign == 1 ? obj.screenHeight - this.winHeight : this.vertAlign == 2 ? obj.screenHeight / 2 - this.winHeight / 2 : 0);
                    this.x = obj.winX;
                    this.y = obj.winY;
                    obj.winX = 0;
                    obj.winY = 0;
                    var bgImageId = -1;
                    if(obj.paramValue.length > 0){
                        bgImageId = obj.paramValue[0].value;
                    }
                    if(bgImageId < 0){
                        this.mode = this.kModeEnd;
                        return false;
                    }
                    var bgImageData = Agtk.images.get(bgImageId);
                    if(bgImageData == null){
                        this.mode = this.kModeEnd;
                        return false;
                    }
                    this.bgImageTex = cc.TextureCache.getInstance().addImage(bgImageData.filename);
                    this.bgImageTex.setAliasTexParameters();
                    if(this.imageSprite){
                        this.removeChild(this.imageSprite);
                    }
                    this.imageSprite = null;
                    if(this.imageTex){
                        this.imageTex = null;
                    }
                    this.imageWidth = 144;
                    this.imageHeight = 144;
                    if(imageId >= 0){
                        var imageData = Agtk.images.get(imageId);
                        if(imageData == null){
                            this.mode = this.kModeEnd;
                            return false;
                        }
                        this.imageTex = cc.TextureCache.getInstance().addImage(imageData.filename);
                        if(this.imageTex == null){
                            this.mode = this.kModeEnd;
                            return false;
                        }
                        this.imageTex.setAliasTexParameters();
                        this.imageSprite = cc.Sprite.create(this.imageTex);
                        this.imageSprite.setAnchorPoint(0, 0);
                        this.imageSprite.visible = false;
                        this.addChild(this.imageSprite, 1);
                        this.updateImageSize();
                    }
                    if(this.frameLayer){
                        this.frameLayer.removeAllChildren();
                    } else {
                        this.frameLayer = new cc.Layer();
                        this.frameLayer.x = 0;
                        this.frameLayer.y = 0;
                        this.addChild(this.frameLayer);
                    }
                    if(this.letterLayer){
                        this.letterLayer.removeAllChildren();
                    } else {
                        this.letterLayer = new cc.Layer();
                        this.letterLayer.setAnchorPoint(0, 0);
                        this.addChild(this.letterLayer, 1);
                    }
                    this.letterLayer.x = 8 + (imageId >= 0 ? this.imageWidth + 8 : 0);
                    this.letterLayer.y = 16;
                    if(this.mode != this.kModeOpening){
                        this.createWindow(0, 0, this.winWidth, this.winHeight);
                    }
                    if(this.bgType == this.kBackgroundNone || takeover){
                        this.mode = this.kModeLetterPutting;
                        if(this.imageSprite != null){
                            this.imageSprite.visible = true;
                        }
                    } else {
                        this.mode = this.kModeOpening;
                    }
                    this.modeCounter = 0;

                    if(this.bgType == this.kBackgroundBlack){
                        this.createWindow(0, 0, this.winWidth, this.winHeight);
                        this.setChildrenOpacity(this.frameLayer, takeover ? 255 : 0);
                    }
                    return true;
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
                applyTagData: function(dat)
                {
                    if(dat.tagName == 'S'){
                        this.message = this.message.substr(dat.head);
                        this.currentSize = dat.param;
                    } else if(dat.tagName == 'C'){
                        this.message = this.message.substr(dat.head);
                        this.currentColor = dat.param;
                    }
                },
                updateImageSize: function()
                {
                    if(this.winHeight - 16 * 2 < this.imageHeight){
                        this.imageWidth = this.imageHeight = this.winHeight - 16 * 2;
                    }
                    var scaledWidth = this.imageWidth;
                    var scaledHeight = this.imageHeight;
                    if(this.imageTex.width >= this.imageTex.height){
                        scaledHeight = this.imageTex.height / this.imageTex.width * this.imageWidth;
                    } else {
                        scaledWidth = this.imageTex.width / this.imageTex.width * this.imageHeight;
                    }
                    this.imageSprite.x = 8 + (this.imageWidth - scaledWidth) / 2;
                    this.imageSprite.y = 16 + (this.imageHeight - scaledHeight) / 2;
                    this.imageSprite.width = scaledWidth;
                    this.imageSprite.height = scaledHeight;
                },
                calcWindowHeight: function()
                {
                    var head = 0;
                    var height = 16 * 2;
                    var size = this.currentSize;
                    for(var i = 0; i < 4; i++){
                        if(i > 0){
                            height += this.lineSpacing;
                        }
                        var maxLineHeight = size;
                        while(head < this.message.length){
                            var letter = this.message[head];
                            if(letter == '\n'){
                                head++;
                                break;
                            }
                            if(this.message.substr(head, 2) == '\\\\'){
                                head += 2;
                                continue;
                            }
                            var dat = this.parseTag(this.message, head, size);
                            if(dat.tagName == 'S'){
                                head = dat.head;
                                size = dat.param;
                                if(size > maxLineHeight){
                                    maxLineHeight = size;
                                }
                            } else if(dat.tagName == 'C'){
                                head = dat.head;
                            } else {
                                head++;
                            }
                        }
                        height += maxLineHeight;
                    }
                    return height;
                },
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
                    sprite.height = winHeight - 8 * 2;
                    this.frameLayer.addChild(sprite);
                    sprite = cc.Sprite.create(this.bgImageTex, cc.rect(8, oy + 8, 8, 8));
                    sprite.setAnchorPoint(0, 0);
                    sprite.x = winX + 8;
                    sprite.y = winY + 8;
                    sprite.width = winWidth - 16;
                    sprite.height = winHeight - 8 * 2;
                    this.frameLayer.addChild(sprite);
                    sprite = cc.Sprite.create(this.bgImageTex, cc.rect(16, oy + 8, 8, 8));
                    sprite.setAnchorPoint(0, 0);
                    sprite.x = winX + winWidth - 8;
                    sprite.y = winY + 8;
                    sprite.height = winHeight - 8 * 2;
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
                            sprite.y = this.winHeight - 16 * 2 - this.currentSize - this.letterY;
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
                        label.y = this.winHeight - 16 * 2 - this.currentSize - this.letterY - this.currentSize / 8;
                        this.letterLayer.addChild(label);
                        this.letterX += label.width + this.letterSpacing;
                    }
                    if(this.currentSize > this.currentLineMaxHeight){
                        this.currentLineMaxHeight = this.currentSize;
                    }
                },
                updateMessage: function(close){
                    if(obj.showing){
                        while(this.stack.length > 0){
                            var item = this.stack[0];
                            if(item.command == 'changeMode'){
                                this.mode = item.mode;
                                this.modeCounter = 0;
                                this.stack.shift();
                            } else if(item.command == 'waitForEnd'){
                                if(this.mode == this.kModeEnd){
                                    this.stack.shift();
                                    continue;   //go next
                                }
                                break;
                            } else if(item.command == 'setup'){
                                var laterNext = false;
                                if(item.instanceId != obj.instanceId || item.actionId != obj.actionId){
                                    laterNext = true;
                                }
                                this.setup(item.instanceId, item.actionId, item.commandId, item.valueJson, item.takeover);
                                this.stack.shift();
                                if(laterNext){
                                    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
                                }
                            }
                        }
                        if(this.mode == this.kModeOpening){
                            if(this.bgType == this.kBackgroundBlack){
                                var alpha = (this.modeCounter * 255 / 30);
                                if(alpha >= 255){
                                    alpha = 255;
                                    this.mode = this.kModeLetterPutting;
                                    this.modeCounter = 0;
                                    if(this.imageSprite != null){
                                        this.imageSprite.visible = true;
                                    }
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
                                    this.mode = this.kModeLetterPutting;
                                    this.modeCounter = 0;
                                    if(this.imageSprite != null){
                                        this.imageSprite.visible = true;
                                    }
                                } else {
                                    this.modeCounter++;
                                }
                            }
                            return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                        }
                        if(this.mode == this.kModeLetterPutting){
                            if(this.speed == this.kSpeedInstant || this.isKeyOkJustPressed()){
                                while(this.message.length > 0){
                                    if(this.message.substr(0, 2) == '\\\\'){
                                        this.message = this.message.substr(2);
                                        this.putLetter('\\');
                                        continue;
                                    }
                                    var dat = this.parseTag(this.message, 0, this.currentSize);
                                    if(dat.tagName != null){
                                        this.applyTagData(dat);
                                        continue;
                                    }
                                    var letter = this.message[0];
                                    this.message = this.message.substr(1);
                                    if(letter == '\n'){
                                        this.newline();
                                        if(this.isTextOver()){
                                            break;
                                        }
                                        continue;
                                    }
                                    this.putLetter(letter);
                                }
                            }
                            if(this.isTextOver()){
                            } else
                            if(this.message.length > 0){
                                var n = 0;
                                if(this.speed == this.kSpeedFast){
                                    n = 2;
                                } else if(this.speed == this.kSpeedNormal){
                                    n = 1;
                                } else if(this.speed == this.kSpeedSlow){
                                    if((this.modeCounter % 3) == 0){
                                        n = 1;
                                    }
                                }
                                while(n > 0 && this.message.length > 0){
                                    if(this.message.substr(0, 2) == '\\\\'){
                                        this.message = this.message.substr(2);
                                        this.putLetter('\\');
                                        n--;
                                        continue;
                                    }
                                    var dat = this.parseTag(this.message, 0, this.currentSize);
                                    if(dat.tagName != null){
                                        this.applyTagData(dat);
                                        continue;
                                    }
                                    var letter = this.message[0];
                                    this.message = this.message.substr(1);
                                    if(letter == '\n'){
                                        this.newline();
                                        if(this.isTextOver()){
                                            break;
                                        }
                                        continue;
                                    }
                                    this.putLetter(letter);
                                    n--;
                                }
                                if(!this.isTextOver()){
                                    this.modeCounter++;
                                    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                                }
                            }
                            this.mode = this.kModeWaitingForKey;
                            this.modeCounter = 0;
                        }
                        if(this.mode == this.kModeWaitingForKey){
                            if(this.modeCounter == 0){
                                this.indicatorSprite.visible = true;
                            }
                            if(this.modeCounter >= 30){
                                if(this.isKeyOkJustPressed()){
                                    this.indicatorSprite.visible = false;
                                    this.letterLayer.removeAllChildren();
                                    if(this.message.length > 0){
                                        this.mode = this.kModeLetterPutting;
                                        this.modeCounter = 0;
                                        this.letterX = 0;
                                        this.letterY = 0;
                                        var newWinHeight = this.calcWindowHeight();
                                        if(newWinHeight != this.winHeight){
                                            this.winHeight = newWinHeight;
                                            this.frameLayer.removeAllChildren();
                                            this.createWindow(0, 0, this.winWidth, this.winHeight);
                                            this.updateImageSize();
                                        }
                                        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                                    } else {
                                        if(this.imageSprite != null){
                                            this.imageSprite.visible = false;
                                        }
                                        this.mode = this.kModeEndChecking;
                                        this.modeCounter = 0;
                                        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
                                    }
                                }
                            }
                            this.modeCounter++;
                            return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                        }
                        if(this.mode == this.kModeEndChecking){
                            if(close === true){
                                this.mode = this.kModeClosing;
                                this.modeCounter = 0;
                                return;
                            } else {
                                this.mode = this.kModeLetterPutting;
                                this.modeCounter = 0;
                                return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
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
                            if(this.stack.length > 0 && this.stack[0].command == 'waitForEnd'){
                                /*
                                if(this.stack.length >= 2 && this.stack[1].command == 'setup'){
                                    var item = this.stack[1];
                                    if(item.instanceId != obj.instanceId || item.actionId != obj.actionId || item.commandId != obj.commandId){
                                        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
                                    }
                                }*/
                                return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
                            }
                            obj.messageLayer.removeFromParent();
                            obj.messageLayer = null;
                            obj.showing = false;
                            return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
                        }
                    }
                    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
                },
                newline: function(){
                    this.letterX = 0;
                    if(this.currentLineMaxHeight < 0){
                        this.currentLineMaxHeight = this.currentSize;
                    }
                    this.letterY += this.currentLineMaxHeight + this.lineSpacing;
                    this.currentLineMaxHeight = -1;
                },
                isTextOver: function(){
                    return (this.letterY >= this.winHeight - 16 * 2);
                },
                setChildrenOpacity: function(node, alpha){
                    var children = node.children;
                    for(var i = 0; i < children.length; i++){
                        children[i].opacity = alpha;
                    }
                },
                isKeyOkPressed: function(){
                    for(var i = 0; i <= Agtk.controllers.MaxControllerId; i++){
                        if(Agtk.controllers.getOperationKeyPressed(i, Agtk.constants.controllers.OperationKeyOk)){
                            return true;
                        }
                    }
                    if(Agtk.controllers.getKeyValue(0, Agtk.constants.controllers.ReservedKeyCodePc_LeftClick) != 0){
                        var x = Agtk.variables.get(Agtk.variables.MouseXId).getValue();
                        var y = obj.screenHeight - 1 - Agtk.variables.get(Agtk.variables.MouseYId).getValue();
                        if(x >= this.x && x < this.x + this.winWidth
                        && y >= this.y && y < this.y + this.winHeight){
                            return true;
                        }
                    }
                    return false;
                },
                isKeyOkJustPressed: function(){
                    var pressed = this.isKeyOkPressed();
                    if(!obj.keyAPressed && pressed){
                        obj.keyAPressed = true;
                        return true;
                    }
                    obj.keyAPressed = pressed;
                    return false;
                }

            });

            var agtkLayer = Agtk.sceneInstances.getCurrent().getMenuLayerById(Agtk.constants.systemLayers.HudLayerId);
            if(agtkLayer == null){
                return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
            }
            obj.messageLayer = new MessageLayer(instanceId, actionId, commandId, valueJson);
            //agtkLayer.y = 0;
            agtkLayer.addChild(obj.messageLayer, 0, layerTag);
            obj.showing = true;
            var result = obj.messageLayer.updateMessage();
            return result;
        }
        if(obj.messageLayer != null){
            var lInstanceId = obj.instanceId;
            var lActionId = obj.actionId;
            var lCommandId = obj.commandId;
            if(instanceId != lInstanceId || actionId != lActionId || commandId != lCommandId){
                for(var i = obj.messageLayer.stack.length - 1; i >= 0; i--){
                    var item = obj.messageLayer.stack[i];
                    if(item.command == 'setup'){
                        lInstanceId = item.instanceId;
                        lActionId = item.actionId;
                        lCommandId = item.commandId;
                        break;
                    }
                }
            }
            if(instanceId != lInstanceId || actionId != lActionId || commandId != lCommandId){
                var same = false;
                for(var i = obj.messageLayer.stack.length - 1; i >= 0; i--){
                    var item = obj.messageLayer.stack[i];
                    if(item.command == 'setup'){
                        if(instanceId == item.instanceId && actionId == item.actionId && commandId == item.commandId && JSON.stringify(valueJson) == JSON.stringify(item.valueJson)){
                            same = true;
                        }
                        break;
                    }
                }
                if(!same){
                    if(obj.getValue(valueJson, 4) == obj.getValue(obj.messageLayer.valueJson, 4)
                    && obj.getValue(valueJson, 5) == obj.getValue(obj.messageLayer.valueJson, 5)){
                        same = true;
                    }
                }
                if(same){
                    obj.messageLayer.stack.push({command: 'setup',
                        instanceId: instanceId,
                        actionId: actionId,
                        commandId: commandId,
                        valueJson: JSON.parse(JSON.stringify(valueJson)),
                        takeover: true
                    });
                } else {
                    obj.messageLayer.stack.push({command: 'changeMode', mode: obj.messageLayer.kModeClosing});
                    obj.messageLayer.stack.push({command: 'waitForEnd'});
                    obj.messageLayer.stack.push({command: 'setup',
                        instanceId: instanceId,
                        actionId: actionId,
                        commandId: commandId,
                        valueJson: JSON.parse(JSON.stringify(valueJson)),
                        takeover: false
                    });
                }
                return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
            }
            return obj.messageLayer.updateMessage();
        }
        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
    };

    obj.execLinkCondition = function(index, valueJson, objectId, instanceId, actionLinkId){
        if(!obj.showing){
            return true;
        }
        var onStack = false;
        for(var i = obj.messageLayer.stack.length - 1; i >= 0; i--){
            var item = obj.messageLayer.stack[i];
            if(item.command == 'setup'){
                if(item.instanceId == instanceId){
                    onStack = true;
                    break;
                }
            }
        }
        if(instanceId != obj.instanceId && !onStack){
            return true;
        }
        return false;
    };

    obj.update = function(dt){
        if(obj.commandActive){
            obj.commandActive = false;
        } else {
            if(obj.messageLayer != null){
                obj.messageLayer.updateMessage(true);
            }
        }
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

    return obj;
}())
