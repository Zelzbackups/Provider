pc.script.create('CameraControl', function (app) {
    // Creates a new CameraControl instance
    var CameraControl = function (entity) {
        this.entity = entity;
        
        this.reachedPos = false;
        
        this.picker = new pc.scene.Picker(app.graphicsDevice, 1024, 1024);
        
        this.state = 0;
    };
    
    var startTime = 0;
    var time = 0;
    
    var delayTime;
    var delayFunc;
    
    var welcome = 0;
    var board = 1;
    var dice = 2;
    var player = 3;
    var topdown = 4;
    
    var welcomeStartPos = new pc.Vec3(0, 45, 120);
    var welcomeStartAng = new pc.Vec3(-20, 0, 0);
    var welcomeRotateSpeed = 0.1;
    var orbitAngle = 1;
    var orbitSpeed = 4;
    
    var boardEntity;
    var boardPos = new pc.Vec3(0, 70, 120);
    var boardTarget = new pc.Vec3(0, 0, 20);
    
    var cameraSpeed = 7;
    var startPos = new pc.Vec3 ();
    var startAng = new pc.Vec3 ();
    var startAngQuat = new pc.Vec3 ();
    
    var propertyCardPos = new pc.Vec3 (0, 460, 82);
    var propertyCardAng = new pc.Vec3 (0, 0, 80.5);
    var reachedCards = false;
    
    var blurScript;
    var blurStep = 0.01;
    var blur = true;
    
    var backPlayerDistance = 24;
    var upPlayerDistance = 27;
    var reachedPlayer = false;
    
    var mainScript;
    
    var dice1;
    var dice2;
    
    var deltaTime;
    
    var rot;

    CameraControl.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            blurScript = this.entity.script.Blur;

            mainScript = app.root.findByName ('MainEntity').script.Main;
            
            dice1 = app.root.findByName ('Dice1');
            dice2 = app.root.findByName ('Dice2');
            
            this.setState(0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            time += dt;
            deltaTime = dt;
            
            switch (this.state) {
                case 0: // Welcome
                    this.rotate(dt);
                    break;
                    
                case 1: // Board
                    var newBoardPos = new pc.Vec3 ();
                    var newBoardTarget = new pc.Vec3 ();
                    
                    switch (mainScript.getCurrentPlayer ().idnumber) {
                        case 0:
                            this.entity.setPosition (this.moveTo (boardPos));
                            rot = this.getRotationFromEuler (boardTarget, boardPos);
                            this.entity.setRotation (this.moveToAng (rot));
                            break;
                            
                        case 1:
                            newBoardPos = new pc.Vec3 (-boardPos.x, boardPos.y, -boardPos.z);
                            newBoardTarget = new pc.Vec3 (-boardTarget.x, boardTarget.y, -boardTarget.z);
                            
                            this.entity.setPosition (this.moveTo (newBoardPos));
                            rot = this.getRotationFromEuler (newBoardTarget, newBoardPos);
                            this.entity.setRotation (this.moveToAng (rot));
                            break;
                            
                        case 2:
                            newBoardPos = new pc.Vec3 (-boardPos.z, boardPos.y, -boardPos.x);
                            newBoardTarget = new pc.Vec3 (-boardTarget.z, boardTarget.y, -boardTarget.x);
                            
                            this.entity.setPosition (this.moveTo (newBoardPos));
                            rot = this.getRotationFromEuler (newBoardTarget, newBoardPos);
                            this.entity.setRotation (this.moveToAng (rot));
                            break;
                            
                        case 3:
                            newBoardPos = new pc.Vec3 (boardPos.z, boardPos.y, boardPos.x);
                            newBoardTarget = new pc.Vec3 (boardTarget.z, boardTarget.y, boardTarget.x);
                            
                            this.entity.setPosition (this.moveTo (newBoardPos));
                            rot = this.getRotationFromEuler (newBoardTarget, newBoardPos);
                            this.entity.setRotation (this.moveToAng (rot));
                            break;
                    }
                    break;
                    
                case 2: // Dice
                    var tempVec = new pc.Vec3();
                    tempVec.lerp(dice1.getPosition(), dice2.getPosition(), 0.5);
                    
                    rot = this.getRotationFromEuler(tempVec, this.entity.getPosition ());
                    
                    this.entity.setRotation (this.moveToAng (rot));
                    break;
                    
                case 3: // Player
                    var playerPos = mainScript.getCurrentPlayer ().token.getPosition ();
                    var targetPos;
                    
                    switch (mainScript.getCurrentRow ()) {
                        case 1:
                            targetPos = new pc.Vec3(playerPos.x, playerPos.y + upPlayerDistance, playerPos.z + backPlayerDistance);
                            break;

                        case 2:
                            targetPos = new pc.Vec3(playerPos.x - backPlayerDistance, playerPos.y + upPlayerDistance, playerPos.z);
                            break;

                        case 3:
                            targetPos = new pc.Vec3(playerPos.x, playerPos.y + upPlayerDistance, playerPos.z - backPlayerDistance);
                            break;

                        case 4:
                            targetPos = new pc.Vec3(playerPos.x + backPlayerDistance, playerPos.y + upPlayerDistance, playerPos.z);
                            break;
                    }
                    
                    if (this.reachedPos === true) {
                        this.entity.setPosition (targetPos);
                    } else {
                        this.entity.setPosition (this.moveTo (targetPos));
                    }
                    
                    rot = this.getRotationFromEuler (playerPos, targetPos);
                    
                    this.entity.setRotation (this.moveToAng (rot));
                    
                    break;
                    
                case 4: // Top Down
                    break;
                    
                case 5: // Properties
                    
                    if (reachedCards === false) {
                        
                        var newTargetPos;

                        switch (mainScript.getCurrentPlayer ().idnumber) {
                            case 0:
                                newTargetPos = new pc.Vec3 (propertyCardPos.x, propertyCardPos.y / (app.graphicsDevice.height / 100), propertyCardPos.z);

                                this.entity.setPosition (this.moveTo (newTargetPos));
                                rot = this.getRotationFromEuler (propertyCardAng, newTargetPos);
                                this.entity.setRotation (this.moveToAng (rot));
                                break;

                            case 1:
                                newTargetPos = new pc.Vec3 (-propertyCardPos.x, propertyCardPos.y / (app.graphicsDevice.height / 100), -propertyCardPos.z);
                                newTargetAng = new pc.Vec3 (-propertyCardAng.x, propertyCardAng.y, -propertyCardAng.z);

                                this.entity.setPosition (this.moveTo (newTargetPos));
                                rot = this.getRotationFromEuler (newTargetAng, newTargetPos);
                                this.entity.setRotation (this.moveToAng (rot));
                                break;

                            case 2:
                                newTargetPos = new pc.Vec3 (-propertyCardPos.z, propertyCardPos.y / (app.graphicsDevice.height / 100), -propertyCardPos.x);
                                newTargetAng = new pc.Vec3 (-propertyCardAng.z, propertyCardAng.y, -propertyCardAng.x);

                                this.entity.setPosition (this.moveTo (newTargetPos));
                                rot = this.getRotationFromEuler (newTargetAng, newTargetPos);
                                this.entity.setRotation (this.moveToAng (rot));
                                break;

                            case 3:
                                newTargetPos = new pc.Vec3 (propertyCardPos.z, propertyCardPos.y / (app.graphicsDevice.height / 100), propertyCardPos.x);
                                newTargetAng = new pc.Vec3 (propertyCardAng.z, propertyCardAng.y, propertyCardAng.x);

                                this.entity.setPosition (this.moveTo (newTargetPos));
                                rot = this.getRotationFromEuler (newTargetAng, newTargetPos);
                                this.entity.setRotation (this.moveToAng (rot));
                                break;
                        }

                        var x = this.toDecimal (this.entity.getPosition ().x);
                        var y = this.toDecimal (this.entity.getPosition ().y);
                        var z = this.toDecimal (this.entity.getPosition ().z);

                        var roundedPos = new pc.Vec3 (x, y, z);

                        var nx = this.toDecimal (newTargetPos.x);
                        var ny = this.toDecimal (newTargetPos.y);
                        var nz = this.toDecimal (newTargetPos.z);

                        newTargetPos = new pc.Vec3 (nx, ny, nz);

                        if (roundedPos.x  === newTargetPos.x && roundedPos.y === newTargetPos.y && roundedPos.z === newTargetPos.z) {
                            reachedCards = true;
                        }
                    }
                    break;
            }
            
            if (blur === true && blurScript.amount < 0.004) {
                blurScript.amount += blurStep * dt;
                
                if (blurScript.amount > 0.004) {
                    blurScript.amount = 0.004;
                }
            }
            
            if (blur === false && blurScript.amount > 0) {
                blurScript.amount -= blurStep * dt;
                if (blurScript.amount < 0) {
                    blurScript.amount = 0;
                }
            }
            
            if (this.toDecimal(time) == this.toDecimal(delayTime)) {
                eval("this." + delayFunc + "();");
            }
        },
        
        getRotationFromEuler: function (target, position) {
            var entity = new pc.Entity ();
            app.root.addChild (entity);
            
            entity.setPosition (position);
            entity.lookAt (target);
            
            var rotation = entity.getRotation ();
            
            entity.destroy ();
            
            return rotation;
        },
        
        hideCards: function (entity) {
            var entityPosition;

            var currPlayer = mainScript.getCurrentId () + 1;
            var playerFolder = app.root.findByName ('Player ' + currPlayer + ' Properties');

            var colour;
            var properties = [];
            var propertiesNum = [];

            for (i = 0; i < mainScript.tiles.length; i++) {
                if (entity.name === mainScript.tiles[i].name + ' Entity') {
                    colour = mainScript.tiles[i].colour;
                    entityPosition = i;
                }
            }

            for (i = 0; i < mainScript.tiles.length; i++) {
                if (colour === mainScript.tiles[i].colour) {
                    properties[properties.length] = mainScript.tiles[i];
                    propertiesNum[propertiesNum.length] = i;
                }
            }

            for (i = 0; i < properties.length; i++) {
                if (propertiesNum[i] > entityPosition) {
//                     playerFolder.findByName (mainScript.tiles[propertiesNum[i]].name + ' Entity').enabled = false;
                    currCard = playerFolder.findByName (mainScript.tiles[propertiesNum[i].name + ' Entity']);
                }
            }
        },
        
        resetCards: function () {
            var currPlayer = mainScript.getCurrentId () + 1;
            var playerFolder = app.root.findByName ('Player ' + currPlayer + ' Properties');
            
            for (i = 0; i < mainScript.tiles.length; i++) {
                if (playerFolder.findByName (mainScript.tiles[i].name + ' Entity'))
                    playerFolder.findByName (mainScript.tiles[i].name + ' Entity').enabled = true;
            }
        },
        
        moveTo: function (end) {
            var percentage = pc.math.clamp ((((time - startTime) * cameraSpeed) * deltaTime), 0, 1);
            var result = new pc.Vec3 ();
            
            result.lerp (startPos, end, percentage);
            
            return result;
        },
        
        moveToAng: function (end) {
            var percentage = pc.math.clamp ((((time - startTime) * cameraSpeed) * deltaTime), 0, 1);
            var result = new pc.Quat ();
            
            result.slerp (startAng, end, percentage);
            
            return result;
        },

        setState: function (state) {
            switch (state) {
                case 0: // Welcome
                    this.entity.setPosition (welcomeStartPos);
                    this.entity.setEulerAngles (welcomeStartAng);
                    this.state = welcome;
                    break;
                    
                case 1: // Board
                    startTime = time;
                    startPos = this.entity.getPosition ();
                    startAng = this.entity.getRotation ();
                    this.state = board;
                    break;
                    
                case 2: // Dice
                    startTime = time;
                    startAng = this.entity.getRotation ();
                    this.state = dice;
                    break;
                    
                case 3: // Player
                    this.reachedPos = false;
                    startTime = time;
                    startPos = this.entity.getPosition ();
                    startAng = this.entity.getRotation ();
                    this.state = player;
                    var self = this;
                    setTimeout (function () {
                        self.reachedPos = true;
                    }, 2000);
                    break;
                    
                case 4: // Top Down
                    break;
                    
                case 5: // Properties
                    startTime = time;
                    startPos = this.entity.getPosition ();
                    startAng = this.entity.getRotation ();
                    reachedCards = false;
                    this.state = 5;
                    break;
            }
        },
        
        rotate: function (dt) {
            var height = 45;
            var distance = 120;
            
            this.entity.setLocalPosition(0, 0, 0);
            this.entity.setEulerAngles(0, orbitAngle / orbitSpeed, 0);
            this.entity.translateLocal(0, height, distance);
            this.entity.lookAt(0, 0, 0);
            
            orbitAngle ++;
        },
        
        enableBlur: function () {
            blur = true;
        },
        
        disableBlur: function () {
            blur = false;
        },
        
        toDecimal: function (number) {
            return Math.round(number * 10) / 10;
        },
        
        delay: function (length, func) {
            delayTime = time + length;
            delayFunc = func;
        },
        
        getWorldPoint: function () {
            var from = this.entity.getPosition ();
            
            var centerOfScreenX = Math.round (app.graphicsDevice.width / 2);
            var centerOfScreenY = Math.round (app.graphicsDevice.height / 2);
            var to = this.entity.camera.screenToWorld (centerOfScreenX, centerOfScreenY, this.entity.camera.farClip);
            
            var hitPoint;

            app.systems.rigidbody.raycastFirst(from, to, function (result) {
                hitPoint = result.point;
            });
            
            return hitPoint;
        },
        
        clip: function(number, min, max) {
          return Math.max(min, Math.min(number, max));
        }
    };

    return CameraControl;
});