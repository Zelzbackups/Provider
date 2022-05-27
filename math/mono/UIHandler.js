pc.script.create('UIHandler', function (app) {
    // Creates a new UIHandler instance
    var UIHandler = function (entity) {
        this.entity = entity;
    };
    
    var self = this;
    
    var diceScript;
    var mainScript;
    var cameraScript;
    
    var chanceCard;
    var comChestCard;
    var propertyCard;
    var cardsScript;
    
    var colorCode;
    
    var roll = '#rollButton';
    var end = '#endButton';
    var properties = '#propertiesButton';
    var houses = '#housesButton';
    var trade = '#tradeButton';
    var propertiesDone = '#propertiesDoneButton';
    var chanceDone = '#chanceDoneButton';
    var comChestDone = '#comChestDoneButton';
    var leftArrow = '#leftArrowButton';
    var rightArrow = '#rightArrowButton';
    var housesDone = '#housesDoneButton';
    
    var buttons = [roll, end, properties, houses, trade, propertiesDone, chanceDone, comChestDone, leftArrow, rightArrow, housesDone];
    
    var currentButtons = buttons;
    var tempButtons;
    
    var deltaTime;

    UIHandler.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            diceScript = this.entity.script.Dice;
            mainScript = this.entity.script.Main;
            cardsScript = this.entity.script.Cards;
            cameraScript = app.root.findByName('Camera').script.CameraControl;
            
            chanceCard = app.root.findByName ('ChanceCard');
            comChestCard = app.root.findByName ('CommunityChestCard');
            propertyCard = app.root.findByName ('PropertyCard');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            deltaTime = dt;
        },
        
        updateButtons: function(buttonsToShow) {
            var self = this;
            
            for (i = 0; i < currentButtons.length; i++) {
                $(currentButtons[i]).fadeOut (400, function () {
                    $('.gameButtons').css ("display", "inherit");
                });
            }
            
            setTimeout (function () {
                
                for (i = 0; i < buttons.length; i++) {
                    $(buttons[i]).css("background-color", self.getColour ());
                }
                
                currentButtons = [];

                for (i = 0; i < buttonsToShow.length; i++) {
                    if (buttonsToShow[i]) {
                        currentButtons[currentButtons.length] = buttonsToShow[i];
                    }
                }
                
                for (i = 0; i < currentButtons.length; i++) {
                    $(currentButtons[i]).fadeIn (400);
                }
                
            }, 400);
        },
        
        updateMoney: function (player) {
            var playerNum = player.idnumber + 1;
            $('#player' + playerNum + 'money').html('$' + mainScript.players[player.idnumber].money);
        },
        
        showPurchaseWindow: function () {
            var tile = mainScript.getCurrentTile ();
            
            $('#purchaseWindow').css("background-color", this.getColour());
            $('#purchaseText').text ("Would you like to purchase " + tile.name + " for $" + tile.price + "?");
            
            $('#purchase').fadeIn(400);
        },
        
        hidePurchaseWindow: function () {
            $('#purchase').fadeOut(400);
            
            this.updateButtons([end, properties, houses, trade]);
        },
        
        showMessage: function(title, text, func) {
            $('#messageContent').css("background-color", this.getColour ());
            $('#messageTitle').html(title);
            $('#messageText').html(text);
            cameraScript.enableBlur();
            $('#message').fadeIn(400).delay(1000).fadeOut(400, function() {
                cameraScript.disableBlur();
            });
            
        },
        
        playerOpacity: function() {
            for (i = 0; i < (mainScript.numPlayers); i++) {
                if (i == mainScript.getCurrentId()) {
                    $('#player' + (i + 1) + 'setup').fadeTo(400, 1);
                } else {
                    $('#player' + (i + 1) + 'setup').fadeTo(400, 0.5);
                }
            }
        },
        
        getColour: function () {
            switch (mainScript.getCurrentPlayer ().colour) {
                case 'red':
                    colorCode = '#F44336';
                    break;
                case 'orange':
                    colorCode = '#EF6C00';
                    break;
                case 'yellow':
                    colorCode = '#FBC02D';
                    break;
                case 'green':
                    colorCode = '#43A047';
                    break;
                case 'lightblue':
                    colorCode = '#2196F3';
                    break;
                case 'blue':
                    colorCode = '#5C6BC0';
                    break;
                case 'purple':
                    colorCode = '#AB47BC';
                    break;
            }
            return colorCode;
        },
        
        leftArrowClick: function () {
            
        },
        
        rightArrowClick: function () {
            
        },
        
        housesDoneClick: function () {
//             this.updateButtons (tempButtons);
        },
        
        housesClick: function () {
//             tempButtons = currentButtons;
            
//             this.updateButtons ([leftArrow, housesDone, rightArrow]);
        },
        
        rollClick: function () {
            diceScript.roll ();
                    
            if (mainScript.getCurrentPlayer ().jailInt === 0) {
                this.updateButtons([]);
            }
        },
        
        endClick: function () {
            cameraScript.setState (1);
            
            if (mainScript.getCurrentPlayer ().jailInt === 0) {
                this.updateButtons([roll, properties, houses, trade]);
            }
            
            if (mainScript.doubleBool === false) {
                mainScript.changeTurn ();
            }
        },
        
        propertiesClick: function () {
            cameraScript.setState (5);
            tempButtons = currentButtons;
            
            this.updateButtons ([propertiesDone]);
        },
        
        propertiesDoneClick: function () {
            cameraScript.setState (1);
            this.updateButtons (tempButtons);
        },
        
        purchaseClick: function () {
            this.hidePurchaseWindow ();
            mainScript.buyProperty ();
        },
        
        cancelPurchaseClick: function () {
            this.hidePurchaseWindow ();
            propertyCard.script.CardAnimation.resetCard ();
        },
        
        chanceDoneClick: function () {
            chanceCard.script.CardAnimation.resetCard ();
            switch (cardsScript.getCurrentChance ()) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 6:
                case 9:
                case 10:
                case 12:
                case 14:
                    
                    this.updateButtons ([]);
                    
                    setTimeout (function () {
                        cameraScript.setState (3);
                    }, 500);
                    
                    setTimeout (function () {
                        cardsScript.chanceFunctions ();
                    }, 2500);
                    break;
                    
                default:
                    this.updateButtons([end, properties, houses, trade]);
                    
                    setTimeout (function () {
                        cardsScript.chanceFunctions ();
                    }, 500);
            }
        },
        
        comChestDoneClick: function () {
            comChestCard.script.CardAnimation.resetCard ();
            if (cardsScript.getCurrentCommunity () === 1) {
                    cameraScript.setState (3);
                    this.updateButtons ([]);
                    
                    setTimeout (function () {
                        cameraScript.setState (3);
                    }, 500);
                    
                    setTimeout (function () {
                        cardsScript.comChestFunctions ();
                    }, 2500);
            } else {
                this.updateButtons([end, properties, houses, trade]);
                
                setTimeout (function () {
                    cardsScript.comChestFunctions ();
                }, 500);
            }
        }
    };

    return UIHandler;
});