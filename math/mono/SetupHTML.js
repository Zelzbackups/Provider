// this script can reference html asset as an attribute
// and will live update dom and reattach events to it on html changes
// so that launcher don't need to be refreshed during development

pc.script.attribute('html', 'asset', [ ], { type: 'html' });

pc.script.create('SetupHTML', function (app) {
    var SetupHTML = function (entity) {
        this.entity = entity;
    };
    
    function playerData (name, colour, token) {
        this.name = name;
        this.colour = colour;
        this.token = token;
    }
    
    var mainScript;
    
    var playerNum = 1;
    var playerTotal = 0;
    
    var textInput;

    SetupHTML.prototype = {
        initialize: function () {
            this.numPlayers = 0;
            
            // create DIV element
            mainScript = app.root.findByName('MainEntity').script.Main;
            
            this.players = [];
            this.players[this.players.length] = new playerData();
            this.players[this.players.length] = new playerData();
            this.players[this.players.length] = new playerData();
            this.players[this.players.length] = new playerData();
            
            this.element = document.createElement('div');
            this.element.classList.add('container');
            
            // append to body
            // can be appended somewhere else
            // it is recommended to have some container element
            // to prevent iOS problems of overfloating elements off the screen
            document.body.appendChild(this.element);
            
            // asset
            this.asset = null;
            this.assetId = 0;
            
            this.counter = 0;
            
        },
        
        attachAsset: function(assetId, fn) {
            // remember current assetId
            this.assetId = assetId;
            
            // might be no asset provided
            if (! this.assetId)
                return fn.call(this);
            
            // get asset from registry
            var asset = app.assets.get(this.assetId);
            
            // store callback of an asset load event
            var self = this;
            asset._onLoad = function(asset) {
                fn.call(self, asset, asset.resource);
            };
            
            // subscribe to changes on resource
            asset.on('load', asset._onLoad);
            // callback
            fn.call(this, asset, asset.resource);
            // load asset if not loaded
            app.assets.load(asset);
        },
        
        template: function(asset, html) {
            // unsubscribe from old asset load event if required
            if (this.asset && this.asset !== asset)
                this.asset.off('load', this.asset._onLoad);
            
            // remember current asset
            this.asset = asset;
            
            // template element
            // you can use templating languages with renderers here
            // such as hogan, mustache, handlebars or any other
            this.element.innerHTML = html || '';
            
            // bind some events to dom of an element
            // it has to be done on each retemplate
            if (html)
                this.bindEvents();
        },
        
        bindEvents: function() {
            var self = this;
            
            var tokens = document.querySelectorAll('.token');
            
            for (var i = 0; i < tokens.length; i++) {
                tokens[i].addEventListener('click', function (event) {
                    if ($(this).hasClass('selectable')) { 
                            $(this).addClass( 'selected' );
                            self.players[playerNum - 1].token = $(this).attr('id');
                            for (var i = 0; i < tokens.length; i++) {
                                if (tokens[i] !== this) {
                                    $(tokens[i]).removeClass( 'selected' );
                                }
                            }
                    }
                });
            }
            
            var colours = document.querySelectorAll('.colour');
            
            for (var j = 0; j < colours.length; j++) {
                colours[j].addEventListener('click', function (event) {
                    if ($(this).hasClass('selectable')) {
                            $(this).addClass( 'selected' );
                            self.players[playerNum - 1].colour = $(this).attr('id');
                            var colorCode;
                            switch (self.players[playerNum - 1].colour) {
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
                            $('#player' + playerNum + 'content').animate({
                                backgroundColor: colorCode
                            }, 300);
                            for (var j = 0; j < colours.length; j++) {
                                if (colours[j] !== this) {
                                    $(colours[j]).removeClass( 'selected' );
                                }
                            }
                        }
                });
            }
            
            var numbers = document.querySelectorAll('.number');
            
            for(var l = 0; l < numbers.length; l++) {
                numbers[l].addEventListener('click', function (event) {
                    playerTotal = parseInt($(this).attr('id'));
                    self.numPlayers = playerTotal;
                    $('#playerNumBox').fadeOut(400, function() {
                        $('#player1setup').fadeIn(400);
                    });
                });
            }
            
            var next = document.querySelectorAll('.next');
            
            for (var k = 0; k < next.length; k++) {
                next[k].addEventListener('click', function (event) {
                    if ($(this).hasClass('disabled')) {} else {
                        self.nextClick();
                    }
                });
            }
        },

        update: function (dt) {
            // check for swapped asset
            // if so, then start asset loading and templating
            if (this.assetId !== this.html[0]) {
                this.attachAsset(this.html[0], this.template); }
            
            name = $('#player' + playerNum + 'name').val();
            if (this.players[playerNum - 1]) {
                if (this.players[playerNum - 1].token !== undefined && this.players[playerNum - 1].colour !== undefined && jQuery.trim(name).length > 0) {
                    $('#player' + playerNum + 'finish').removeClass('disabled');
                } else {
                    $('#player' + playerNum + 'finish').addClass('disabled');
                }
            }

        },
        
        nextClick: function() {
            this.players[playerNum - 1].name = $('#player' + playerNum + 'name').val();
            this.minimizeSetup();
        },
        
        next: function() {
            if (playerNum < playerTotal + 1) {
                $('#player' + playerNum + 'setup').fadeIn(400);
            } else {
                mainScript.startGame();
            }
        },
        
        minimizeSetup: function() {
            var self = this;
            
            $('.' + this.players[playerNum - 1].colour).addClass('disabled').removeClass('selectable');
            $('.' + (this.players[playerNum - 1].token).toLowerCase()).addClass('disabled').removeClass('selectable');
            
            var playerTokens = document.querySelectorAll('.player' + playerNum + 't');
            for (var d = 0; d < playerTokens.length; d++) {
                if ($(playerTokens[d]).hasClass('selected')) {
                    $(playerTokens[d]).removeClass('disabled');
                }
            }
            
            $('.player' + playerNum + 't token ' + (this.players[playerNum - 1].token).toLowerCase()).removeClass('disabled');
            
            $('.player' + playerNum + 'c ' + this.players[playerNum - 1].colour).removeClass('disabled');
            
            var tokens = document.querySelectorAll('.player' + playerNum + 't');
            for (var i = 0; i < tokens.length; i++) {
                if ($(tokens[i]).attr('id') !== this.players[playerNum - 1].token && $(tokens[i]).attr('id') !== 'player' + playerNum + 'money') {
                    $(tokens[i]).fadeOut(0, function() {
                        $(tokens[i]).remove();
                    });
                } else {
                    $(tokens[i]).fadeOut(0);
                    $(tokens[i]).removeClass('selectable');
                    $(tokens[i]).removeClass('selected');
                }
            }
            
            $('#player' + playerNum + 'name').fadeOut(200).remove();
            $('.player' + playerNum + 'c').fadeOut(200).remove();
            $('#button').fadeOut(200).remove();
            $('#nameText').fadeOut(200).remove();
            $('#colourText').fadeOut(200).remove();
            $('#tokenText').fadeOut(200).remove();
            $('.break').fadeOut(200).remove();
            $('#player' + playerNum + 'title').html(name).css({
                "font-size": "1.3em"
            });
            
            $('.player' + playerNum).animate({
                width: '130px',
                height: '85px',
                margin: '0',
                position: 'absolute'
            });
            
            $('#player' + playerNum + 'data').animate({
                "padding-left": "11px",
                "padding-top": "8px"
            });
            
            $.when($.when($('#player' + playerNum + 'content').animate({
                height: "133px",
                width: "275px",
                marginTop: "200px"
            }, 1000)).done(function() {
                $('#player' + playerNum + 'money').css({
                    top: '50px',
                    left: '107px',
                    position: 'absolute',
                    fontSize: '1.8em',
                    fontWeight: '500'
                }).fadeIn(1000);
                for (var h = 0; h < tokens.length; h++) {
                if ($(tokens[h]).attr('id') == self.players[playerNum - 1].token) {
                    $(tokens[h]).fadeIn(200);
                }
            }
            })).done(function() {
                switch (playerNum) {
                case 1:
                    $('#player' + playerNum + 'setup').animate({
                        left: '0',
                        top: '0',
                        marginLeft: '-40px',
                        marginTop: '-187px'
                    }, 1200, function() {
                        playerNum += 1;
                        self.next();
                    });
                    break;
                case 2:
                    $('#player' + playerNum + 'setup').animate({
                        left: '100%',
                        top: '0',
                        marginLeft: '-335px',
                        marginTop: '-187px'
                    }, 1200, function() {
                        playerNum += 1;
                        self.next();
                    });
                    break;
                case 3:
                    $('#player' + playerNum + 'setup').animate({
                        left: '0',
                        top: '100%',
                        marginLeft: '-40px',
                        marginTop: '-344px'
                    }, 1200, function() {
                        playerNum += 1;
                        self.next();
                    });
                    break;
                case 4:
                    $('#player' + playerNum + 'setup').animate({
                        left: '100%',
                        top: '100%',
                        marginLeft: '-335px',
                        marginTop: '-344px'
                    }, 1200, function() {
                        playerNum += 1;
                        self.next();
                    });
                    break;
            }
            });
            
            
        }
        

    };

    return SetupHTML;
});