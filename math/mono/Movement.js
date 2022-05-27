pc.script.create('Movement', function (app) {
    // Creates a new Movement instance
    var Movement = function (entity) {
        this.entity = entity;
        
        this.doubleRoll = 0;
        this.doubleBool = false;
    };
    
    var deltaTime;
    
    var mainScript;
    var moneyScript;
    var lightScript;
    var UI;
    
    var distance = 0;
    var moving = false;
    var targetTile = null;
    var endTile = null;
    var playerSpeed = 7;

    Movement.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            mainScript = this.entity.script.Main;
            moneyScript = this.entity.script.Money;
            lightScript = this.entity.script.PropertyLight;
            UI = this.entity.script.UIHandler;
        },
        
        fixedUpdate: function (dt) {
            deltaTime = dt;
            this.moveToken(dt);
        },
        
        goToTile: function (tile) {
            var pos = mainScript.getCurrentPlayer ().position;
            var amountOfSpaces;
            
            if (tile > pos) {
                amountOfSpaces = (tile - pos) % mainScript.numSpaces;
            } else {
                amountOfSpaces = ((mainScript.numSpaces - pos) + tile) % mainScript.numSpaces;
            }
            
            this.startMoving (amountOfSpaces);
        },
        
        startMoving: function (amountOfSpaces, double) {
            targetTile = (mainScript.getCurrentPlayer ().position + 1) % mainScript.numSpaces;
            endTile = (mainScript.getCurrentPlayer ().position + amountOfSpaces) % mainScript.numSpaces;
            
            if (double) {
                mainScript.doubleRoll += 1;
                mainScript.doubleBool = true;
            } else {
                mainScript.doubleBool = false;
            }
            
            lightScript.turnOnLights (mainScript.getCurrentPlayer ().position, endTile);
            
            setTimeout (function () {
                moving = true;
            }, 2000);
        },
        
        moveToken: function (dt) {
            if (moving === true) {
                var targetPos;
                
                switch (mainScript.getCurrentRow ()) {
                    case 1:
                        targetPos = new pc.Vec3 (mainScript.tiles[targetTile].xLocation, 0, mainScript.tiles[targetTile].zLocation + mainScript.getCurrentPlayer().offset);
                        break;
                        
                    case 2:
                        targetPos = new pc.Vec3 (mainScript.tiles[targetTile].xLocation - mainScript.getCurrentPlayer ().offset, 0, mainScript.tiles[targetTile].zLocation);
                        break;
                        
                    case 3:
                        targetPos = new pc.Vec3 (mainScript.tiles[targetTile].xLocation, 0, mainScript.tiles[targetTile].zLocation - mainScript.getCurrentPlayer().offset);
                        break;
                        
                    case 4:
                        targetPos = new pc.Vec3 (mainScript.tiles[targetTile].xLocation + mainScript.getCurrentPlayer ().offset, 0, mainScript.tiles[targetTile].zLocation);
                        break;
                }
                
                var currentPos = mainScript.getCurrentPlayer ().token.getPosition ();

                var distance = (this.getDistance (currentPos, targetPos)) * playerSpeed * deltaTime;

                mainScript.getCurrentPlayer ().token.lookAt (targetPos);
                mainScript.getCurrentPlayer ().token.rotate(0, 180, 0);
                mainScript.getCurrentPlayer ().token.translate (mainScript.getCurrentPlayer ().token.forward.scale(-distance));
                
                var roundedPos = new pc.Vec3 (this.toDecimal (currentPos.x), this.toDecimal (currentPos.y), this.toDecimal (currentPos.z));
                var roundedTarget = new pc.Vec3 (this.toDecimal (targetPos.x), this.toDecimal (targetPos.y), this.toDecimal (targetPos.z));
                
                if (roundedPos.x == roundedTarget.x && roundedPos.z == roundedTarget.z) {
                    mainScript.getCurrentPlayer ().position = (mainScript.getCurrentPlayer ().position + 1) % mainScript.numSpaces;
                    
                    lightScript.turnOffLights (mainScript.getCurrentPlayer ().position);
                    
                    if (mainScript.getCurrentPlayer ().position === 0) {
                        moneyScript.deposit (mainScript.getCurrentPlayer (), 200);
                        UI.showMessage ('Alert', mainScript.getCurrentPlayer ().name + ' receives $200 for passing GO.');
                    }                        
                    
                    if (targetTile == endTile) {
                        moving = false;
                        mainScript.checkTileType ();
                    } else {
                        targetTile = (targetTile + 1) % mainScript.numSpaces;
                    }
                }
            }
        },
        
        getDistance: function (pos1, pos2) {
            var x = pos1.x - pos2.x;
            var y = pos1.y - pos2.y;
            var z = pos1.z - pos2.z;
            
            var temp = new pc.Vec3 (x, y, z);
            return temp.length ();
        },
        
        toDecimal: function (number) {
            return Math.round (number * 10) / 10;
        }
    };

    return Movement;
});