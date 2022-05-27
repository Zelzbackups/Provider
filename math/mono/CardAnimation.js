pc.script.create('CardAnimation', function (app) {
    // Creates a new CardAnimation instance
    var CardAnimation = function (entity) {
        this.entity = entity;
    };
    
    var mainScript;

    CardAnimation.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            mainScript = app.root.findByName ('MainEntity').script.Main;
            
            this.speed = 0;
    
            this.deltaTime = 0;
            this.time = 0;

            this.startPos = 0;
            this.startAng = 0;
            this.startScale = 0;
            
            this.endPos = 0;
            this.endAng = 0;
            this.endScale = 0;
            
            this.moving = false;
            this.returning = false;
            
            this.initialScale = new pc.Vec3 (9.805, 0.1, 16.607);
            
            if (this.entity.name == 'ChanceCard') {
                this.initialPos = new pc.Vec3 (22.5, 2, 22.5);
                this.initialAng = new pc.Vec3 (0, 45, 0);
                
            } else if (this.entity.name == 'CommunityChestCard') {
                this.initialPos = new pc.Vec3 (-22.5, 2, -22.5);
                this.initialAng = new pc.Vec3 (180, -45, 180);
                
            } else {
                this.initialPos = new pc.Vec3 (24, 1.86, -23.77);
                this.initialAng = new pc.Vec3 (0, 45, 0);
            }
            
            this.startPos = this.entity.getPosition ();
            this.startAng = this.entity.getLocalEulerAngles ();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.deltaTime = dt;
            this.time += dt;
            
            if (this.moving === true) {
                this.entity.setPosition (this.moveTo (this.endPos));
                this.entity.setLocalEulerAngles (this.moveAngTo (this.endAng));
            }
            
            if (this.returning === true) {
                this.entity.setLocalScale (this.scale (this.endScale));
            }
        },
        
        moveTo: function (end) {
            
            var percentage = pc.math.clamp ((((this.time - this.startTime) * this.speed)), 0, 1);
            var result = new pc.Vec3 ();
            
            result.lerp (this.startPos, end, percentage);
            
            return result;
        },
        
        moveAngTo: function (end) {
            
            var percentage = pc.math.clamp ((((this.time - this.startTime) * this.speed)), 0, 1);
            var result = new pc.Vec3 ();
            
            result.lerp (this.startAng, end, percentage);
            
            return result;
        },
        
        scale: function (end) {
            
            var percentage = pc.math.clamp ((((this.time - this.startTime) * this.speed)), 0, 1);
            var result = new pc.Vec3 ();
            
            result.lerp (this.startScale, end, percentage);
            
            return result;
        },
        
        animateCard: function () {
            this.startTime = this.time;
            
            this.startPos = this.entity.getPosition ();
            this.startAng = this.entity.getLocalEulerAngles ();
            
            this.speed = 75 * this.deltaTime;
            
            if (this.entity.name == 'PropertyCard') {
                switch (app.root.findByName ('MainEntity').script.Main.getCurrentId ()) {
                    case 0:
                        this.endPos = new pc.Vec3 (-4.883, 56.011, 100);
                        this.endAng = new pc.Vec3 (55, 0, 0);
                        break;
                    case 1:
                        this.endPos = new pc.Vec3 (4.883, 56.011, -100);
                        this.endAng = new pc.Vec3 (55, 180, 0);
                        break;
                    case 2:
                        this.endPos = new pc.Vec3 (-100, 56.011, -4.883);
                        this.endAng = new pc.Vec3 (55, -90, 0);
                        break;
                    case 3:
                        this.endPos = new pc.Vec3 (100, 56.011, 4.883);
                        this.endAng = new pc.Vec3 (55, 90, 0);
                        break;
                }
                
            } else {
                switch (app.root.findByName ('MainEntity').script.Main.getCurrentId ()) {
                    case 0:
                        this.endPos = new pc.Vec3 (0, 57, 100);
                        this.endAng = new pc.Vec3 (596, 0, 0);
                        break;
                    case 1:
                        this.endPos = new pc.Vec3 (0, 57, -100);
                        this.endAng = new pc.Vec3 (-304, 0, 180);
                        break;
                    case 2:
                        this.endPos = new pc.Vec3 (-100, 57, 0);
                        this.endAng = new pc.Vec3 (540, -90, 56);
                        break;
                    case 3:
                        this.endPos = new pc.Vec3 (100, 57, 0);
                        this.endAng = new pc.Vec3 (540, 90, -56);
                        break;
                }
            }
            
            var material;
            
            material = app.assets.find (mainScript.getCurrentTile ().name + ' Mat');

            var cardFaceArr = this.entity.getChildren ();
            var cardFace = cardFaceArr[0];
            
            cardFaceArr[0].model.materialAsset = material;
            
            this.moving = true;
        },
        
        updatePropertyPile: function () {
            var propertyPile = app.root.findByName ('PropertyPile');
            
            propertyPile.translateLocal (0, -0.065, 0);
            
            this.initialPos.y -= 0.065;
            
        },
        
        resetCard: function () {
            this.startTime = this.time;
            
            this.startPos = this.endPos;
            this.startAng = this.endAng;
            
            this.endPos = this.initialPos;
            this.endAng = this.initialAng;
            
            setTimeout (function () {
                this.moving = false;
            }, 300);
        },
        
        purchaseCard: function () {
            this.speed = 75 * this.deltaTime;
            
            this.startTime = this.time;
            
            this.startPos = this.endPos;
            this.startAng = this.endAng;
            this.startScale = this.entity.getLocalScale ();
            
            var currPlayer = mainScript.getCurrentId () + 1;
            var propertyFolder = app.root.findByName ('Player ' + currPlayer + ' Properties');
            
            var tile = mainScript.getCurrentTile ().name;
            var tileEntity = propertyFolder.findByName (tile + ' Entity');
            
            this.endPos = tileEntity.getPosition ();
            this.endPos.y -= 1;
            
            this.endAng = tileEntity.getEulerAngles ();
            this.endScale = tileEntity.getLocalScale ();
            this.endScale.y = 0.1;
            
            this.returning = true;
            
            var self = this;
            
            setTimeout (function () {
                self.moving = false;
                self.returning = false;
                
                var properties = [];
                var material;
                
                for (i = 0; i < mainScript.tiles.length; i++) {
                    if (mainScript.tiles[i].type === 0 || mainScript.tiles[i] === 1 || mainScript.tiles[i] === 7) {
                        properties[properties.length] = mainScript.tiles[i];
                    }
                }
                
                for (i = 0; i < properties.length; i++) {
                    if (properties[i].ownedBy === null) {
                        material = app.assets.find (properties[i].name + ' Mat');
                        i = properties.length;
                    }
                }
                
                var cardFaceArr = self.entity.getChildren ();
                cardFaceArr[0].model.materialAsset = material;
                self.entity.setPosition (self.initialPos);
                self.entity.setEulerAngles (self.initialAng);
                self.entity.setLocalScale (self.initialScale);
                
                tileEntity.rotateLocal (0, self.getRandomFloat (-2, 2), 0);
                tileEntity.translate (self.getRandomFloat (-0.075, 0.075), 0, self.getRandomFloat (-0.075, 0.075));
                tileEntity.enabled = true;
            }, 750);
        },
        
        getRandomFloat: function (min, max) {
            return (Math.floor (Math.random () * ((max * 100) - (min * 100) + 1)) + (min * 100)) / 100;
        }
    };

    return CardAnimation;
});