pc.script.create('Cards', function (app) {
    // Creates a new ChanceCommunity instance
    var Cards = function (entity) {
        this.entity = entity;
    };
    
    var deltaTime;
    
    var chance = 0;
    var communityChest = 1;
    var property = 2;
    
    var cameraScript;
    var mainScript;
    var movementScript;
    var moneyScript;
    var UI;
    
    var chanceCard;
    var comChestCard;
    var propertyCard;
    
    var currChanceNum = 0;
    var currComChestNum = 0;
    
    var roll = '#rollButton';
    var end = '#endButton';
    var properties = '#propertiesButton';
    var houses = '#housesButton';
    var trade = '#tradeButton';
    var propertiesDone = '#propertiesDoneButton';
    var chanceDone = '#chanceDoneButton';
    var comChestDone = '#comChestDoneButton';

    Cards.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.initializeChance ();
            this.initializeCommunityChest ();
            
            chanceCard = app.root.findByName ('ChanceCard');
            comChestCard = app.root.findByName ('CommunityChestCard');
            propertyCard = app.root.findByName ('PropertyCard');
            
            cameraScript = app.root.findByName ('Camera').script.CameraControl;
            mainScript = this.entity.script.Main;
            moneyScript = this.entity.script.Money;
            movementScript = this.entity.script.Movement;
            UI = this.entity.script.UIHandler;
        },
        
        update: function (dt) {
            deltaTime = dt;
        },
        
        initializeChance: function () {
            currChanceNum = this.getRandomInt(0, 16);
        },
        
        initializeCommunityChest: function () {
            currComChestNum = this.getRandomInt(0, 16);
        },
        
        showCard: function (card) {
            cameraScript.setState (1);
            
            var children;
            var child;
            var cardToShow;
            var material;
            
            if (card == chance) {
                children = chanceCard.getChildren ();
                child = children[0];
                
                cardToShow = currChanceNum + 1;
                material = app.assets.find ('Chance Card ' + cardToShow);

                UI.updateButtons ([chanceDone]);
                setTimeout (this.spawnCard, 2000, chance);
                
            } else if (card == communityChest) {
                children = comChestCard.getChildren ();
                child = children[0];

                cardToShow = currComChestNum + 1;
                material = app.assets.find ('Community Chest ' + cardToShow);

                UI.updateButtons ([comChestDone]);
                setTimeout (this.spawnCard, 2000, communityChest);
            } else if (card == property) {
                cardToShow = mainScript.getCurrentTile ().name;
                material = app.assets.find (cardToShow + ' Mat');
                
                setTimeout (this.spawnCard, 2000, property);
                setTimeout (function () {
                    UI.showPurchaseWindow ();
                }, 2500);
                
                var propertyPile = app.root.findByName ('PropertyPile');
                children = propertyPile.getChildren ();
                child = children[0];
                
                var properties = [];
                
                for (i = 0; i < mainScript.tiles.length; i++) {
                    if (mainScript.tiles[i].type === 0 || mainScript.tiles[i] === 1 || mainScript.tiles[i] === 7) {
                        properties[properties.length] = mainScript.tiles[i];
                    }
                }
                
                for (i = 0; i < properties.length; i++) {
                    if (properties[i].ownedBy === null && properties[i] !== mainScript.getCurrentTile ()) {
                        material = app.assets.find (properties[i].name + ' Mat');
                        i = properties.length;
                    }
                }
            }
            
            child.model.materialAsset = material;
        },
        
        spawnCard: function (card) {
            if (card === chance) {
                chanceCard.setPosition (22.5, 2, 22.5);
                chanceCard.script.CardAnimation.animateCard ();
                
            } else if (card === communityChest) {
                comChestCard.setPosition (-22.5, 2, -22.5);
                comChestCard.script.CardAnimation.animateCard ();
                
            } else if (card === property) {
                propertyCard.setPosition (24.113, 1.819, -23.77);
                propertyCard.script.CardAnimation.animateCard ();
            }
        },
        
        chanceFunctions: function () {
            var pos = mainScript.getCurrentPlayer ().position;
            
            switch (currChanceNum) {
                case 0:
                    break;
                    
                case 1:
                case 3:
                    switch (pos) {
                        case 7:
                            movementScript.goToTile (15);
                            break;
                            
                        case 22:
                            movementScript.goToTile (25);
                            break;
                            
                        case 36:
                            movementScript.goToTile (5);
                            break;
                    }
                    break;
                    
                case 2:
                    break;
                    
                case 4:
                    movementScript.goToTile (39);
                    break;
                    
                case 5:
                    movementScript.goToTile (5);
                    break;
                    
                case 6:
                    movementScript.goToTile (0);
                    break;
                    
                case 7:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 50);
                    break;
                    
                case 8:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 150);
                    break;
                    
                case 9:
                    movementScript.goToTile (24);
                    break;
                    
                case 10:
                    switch (pos) {
                        case 7:
                            movementScript.goToTile (12);
                            break;
                            
                        case 22:
                            movementScript.goToTile (28);
                            break;
                            
                        case 36:
                            movementScript.goToTile (12);
                            break;
                    }
                    break;
                    
                case 11:
                    var ownedProperties = [];
                    
                    for (i = 0; i < mainScript.tiles.length; i++) {
                        if (mainScript.tiles[i].ownedBy === mainScript.getCurrentId ())
                            ownedProperties[ownedProperties.length] = mainScript.tiles[i];
                    }
                    
                    for (i = 0; i < ownedProperties.length; i++) {
                        if (ownedProperties[i].houses < 5 && ownedProperties[i].houses !== 0)
                            moneyScript.withdraw (mainScript.getCurrentPlayer (), 25 * ownedProperties[i]);
                        
                        if (ownedProperties[i].houses === 5)
                            moneyScript.withdraw (mainScript.getCurrentPlayer (), 100);
                    }
                    break;
                    
                case 12:
                    movementScript.goToTile (11);
                    break;
                    
                case 13:
                    for (i = 0; i < mainScript.numPlayers; i++) {
                        moneyScript.deposit (mainScript.players[i], 50);
                    }
                    
                    moneyScript.withdraw (mainScript.getCurrentPlayer (), (50 * mainScript.numPlayers));
                    break;
                    
                case 14:
                    
                    movementScript.goToTile (mainScript.getCurrentPlayer ().position - 3);
                    break;
                    
                case 15:
                    moneyScript.withdraw (mainScript.getCurrentPlayer (), 15);
                    break;
            }
            
            currChanceNum += 1;
            
            if (currChanceNum >= 16)
                currChanceNum = 0;
        },
        
        comChestFunctions: function () {
            var pos = mainScript.getCurrentPlayer ().position;
            
            switch (currComChestNum) {
                case 0:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 200);
                    break;
                    
                case 1:
                    movementScript.goToTile (0);
                    break;
                    
                case 2:
                    var ownedProperties = [];
                    
                    for (i = 0; i < mainScript.tiles.length; i++) {
                        if (mainScript.tiles[i].ownedBy === mainScript.getCurrentId ())
                            ownedProperties[ownedProperties.length] = mainScript.tiles[i];
                    }
                    
                    for (i = 0; i < ownedProperties.length; i++) {
                        if (ownedProperties[i].houses < 5 && ownedProperties[i].houses !== 0)
                            moneyScript.withdraw (mainScript.getCurrentPlayer (), 40 * ownedProperties[i]);
                        
                        if (ownedProperties[i].houses === 5)
                            moneyScript.withdraw (mainScript.getCurrentPlayer (), 115);
                    }
                    break;
                    
                case 3:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 10);
                    break;
                    
                case 4:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 50);
                    break;
                    
                case 5:
                    for (i = 0; i < mainScript.numPlayers; i++) {
                        moneyScript.withdraw (mainScript.players[i], 10);
                    }
                    
                    moneyScript.withdraw (mainScript.getCurrentPlayer (), (10 * mainScript.numPlayers));
                    break;
                    
                case 6:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 25);
                    break;
                    
                case 7:
                    break;
                    
                case 8:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 100);
                    break;
                    
                case 9:
                    moneyScript.withdraw (mainScript.getCurrentPlayer (), 50);
                    break;
                    
                case 10:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 100);
                    break;
                    
                case 11:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 20);
                    break;
                    
                case 12:
                    moneyScript.deposit (mainScript.getCurrentPlayer (), 100);
                    break;
                    
                case 13:
                    moneyScript.withdraw (mainScript.getCurrentPlayer (), 100);
                    break;
                    
                case 14:
                    moneyScript.withdraw (mainScript.getCurrentPlayer (), 50);
                    break;
                    
                case 15:
                    break;
            }
            currComChestNum += 1;
            
            if (currComChestNum >= 16)
                currComChestNum = 0;
        },
        
        getRandomInt: function (min, max) {
            return Math.floor(Math.random () * (max - min + 1)) + min;
        },
        
        getComChestCard: function () {
            return comChestCard;
        },
        
        getChanceCard: function () {
            return chanceCard;
        },
        
        getCurrentChance: function () {
            return currChanceNum;
        },
        
        getCurrentCommunity: function () {
            return currComChestNum;
        }
    };

    return Cards;
});