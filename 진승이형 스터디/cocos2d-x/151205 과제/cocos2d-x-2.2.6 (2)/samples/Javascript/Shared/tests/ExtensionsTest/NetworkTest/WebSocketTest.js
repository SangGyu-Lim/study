/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013 James Chen

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket; 

var WebSocketTestLayer = cc.Layer.extend({

    _wsiSendText: null,
    _wsiSendBinary: null,
    _wsiError: null,
    
    _sendTextStatus: null,
    _sendBinaryStatus: null,
    _errorStatus: null,
    
    _sendTextTimes: 0,
    _sendBinaryTimes: 0,

    init: function () {

        var winSize = cc.Director.getInstance().getWinSize();
        
        var MARGIN = 40;
        var SPACE = 35;
        
        var label = cc.LabelTTF.create("WebSocket Test", "Arial", 28);
        label.setPosition(winSize.width / 2, winSize.height - MARGIN);
        this.addChild(label, 0);
        
        var menuRequest = cc.Menu.create();
        menuRequest.setPosition(0, 0);
        this.addChild(menuRequest);
        
        // Send Text
        var labelSendText = cc.LabelTTF.create("Send Text", "Arial", 22);
        var itemSendText = cc.MenuItemLabel.create(labelSendText, this.onMenuSendTextClicked, this);
        itemSendText.setPosition(winSize.width / 2, winSize.height - MARGIN - SPACE);
        menuRequest.addChild(itemSendText);
        
        // Send Binary
        var labelSendBinary = cc.LabelTTF.create("Send Binary", "Arial", 22);
        var itemSendBinary = cc.MenuItemLabel.create(labelSendBinary, this.onMenuSendBinaryClicked, this);
        itemSendBinary.setPosition(winSize.width / 2, winSize.height - MARGIN - 2 * SPACE);
        menuRequest.addChild(itemSendBinary);
        

        // Send Text Status Label
        this._sendTextStatus = cc.LabelTTF.create("Send Text WS is waiting...", "Arial", 14, cc.size(160, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._sendTextStatus.setAnchorPoint(0, 0);
        this._sendTextStatus.setPosition(0, 25);
        this.addChild(this._sendTextStatus);
        
        // Send Binary Status Label
        this._sendBinaryStatus = cc.LabelTTF.create("Send Binary WS is waiting...", "Arial", 14, cc.size(160, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._sendBinaryStatus.setAnchorPoint(0, 0);
        this._sendBinaryStatus.setPosition(160, 25);
        this.addChild(this._sendBinaryStatus);
        
        // Error Label
        this._errorStatus = cc.LabelTTF.create("Error WS is waiting...", "Arial", 14, cc.size(160, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._errorStatus.setAnchorPoint(0, 0);
        this._errorStatus.setPosition(320, 25);
        this.addChild(this._errorStatus);
        
        // Back Menu
        var itemBack = cc.MenuItemFont.create("Back", this.toExtensionsMainLayer, this);
        itemBack.setPosition(winSize.width - 50, 25);
        var menuBack = cc.Menu.create(itemBack);
        menuBack.setPosition(0, 0);
        this.addChild(menuBack);

        var self = this;

        this._wsiSendText = new WebSocket("ws://echo.websocket.org");
        this._wsiSendText.onopen = function(evt) {
            self._sendTextStatus.setString("Send Text WS was opened.");
        };

        this._wsiSendText.onmessage = function(evt) {
            self._sendTextTimes++;
            var textStr = "response text msg: "+evt.data+", "+self._sendTextTimes;
            cc.log(textStr);
            
            self._sendTextStatus.setString(textStr);
        };

        this._wsiSendText.onerror = function(evt) {
            cc.log("sendText Error was fired");
        };

        this._wsiSendText.onclose = function(evt) {
            cc.log("_wsiSendText websocket instance closed.");
            self._wsiSendText = null;
        };


        this._wsiSendBinary = new WebSocket("ws://echo.websocket.org");
        this._wsiSendBinary.binaryType = "arraybuffer";
        this._wsiSendBinary.onopen = function(evt) {
            self._sendBinaryStatus.setString("Send Binary WS was opened.");
        };

        this._wsiSendBinary.onmessage = function(evt) {
            self._sendBinaryTimes++;
            var binary = new Uint16Array(evt.data);
            var binaryStr = "response bin msg: ";

            var str = "";
            for (var i = 0; i < binary.length; i++) {
                if (binary[i] == 0)
                {
                    str += "\'\\0\'";
                }
                else
                {
                    var hexChar = "0x" + binary[i].toString("16").toUpperCase();
                    str += String.fromCharCode(hexChar);
                }
            }

            binaryStr += str + ", " + self._sendBinaryTimes;
            cc.log(binaryStr);
            self._sendBinaryStatus.setString(binaryStr);
        };

        this._wsiSendBinary.onerror = function(evt) {
            cc.log("sendBinary Error was fired");
        };

        this._wsiSendBinary.onclose = function(evt) {
            cc.log("_wsiSendBinary websocket instance closed.");
            self._wsiSendBinary = null;
        };

        this._wsiError = new WebSocket("ws://invalid.url.com");
        this._wsiError.onopen = function(evt) {};
        this._wsiError.onmessage = function(evt) {};
        this._wsiError.onerror = function(evt) {
            cc.log("Error was fired");
            self._errorStatus.setString("an error was fired");
        };
        this._wsiError.onclose = function(evt) {
            cc.log("_wsiError websocket instance closed.");
            self._wsiError = null;
        };

        return true;
    },

    onExit: function() {
        if (this._wsiSendText)
            this._wsiSendText.close();

        if (this._wsiSendBinary)
            this._wsiSendBinary.close();

        if (this._wsiError)
            this._wsiError.close();
        this._super();
    },

    // Menu Callbacks
    onMenuSendTextClicked: function(sender) {

        if (this._wsiSendText.readyState == WebSocket.OPEN)
        {
            this._sendTextStatus.setString("Send Text WS is waiting...");
            this._wsiSendText.send("Hello WebSocket??????, I'm a text message.");
        }
        else
        {
            var warningStr = "send text websocket instance wasn't ready...";
            cc.log(warningStr);
            this._sendTextStatus.setString(warningStr);
        }
    },

    _stringConvertToArray:function (strData) {
        if (!strData)
            return null;

        var arrData = new Uint16Array(strData.length);
        for (var i = 0; i < strData.length; i++) {
            arrData[i] = strData.charCodeAt(i);
        }
        return arrData;
    },

    onMenuSendBinaryClicked: function(sender)
    {

        if (this._wsiSendBinary.readyState == WebSocket.OPEN)
        {
            this._sendBinaryStatus.setString("Send Binary WS is waiting...");
            var buf = "Hello WebSocket??????,\0 I'm\0 a\0 binary\0 message\0.";
            var binary = this._stringConvertToArray(buf);
            
            this._wsiSendBinary.send(binary.buffer);
        }
        else
        {
            var warningStr = "send binary websocket instance wasn't ready...";
            cc.log(warningStr);
            this._sendBinaryStatus.setString(warningStr);
        }
    },

    toExtensionsMainLayer: function (sender) {
        var scene = new ExtensionsTestScene();
        scene.runThisTest();
    }
});

WebSocketTestLayer.create = function () {
    var retObj = new WebSocketTestLayer();
    if (retObj && retObj.init()) {
        return retObj;
    }
    return null;
};


var runWebSocketTest = function () {
    var pScene = cc.Scene.create();
    var pLayer = WebSocketTestLayer.create();
    pScene.addChild(pLayer);
    cc.Director.getInstance().replaceScene(pScene);
};