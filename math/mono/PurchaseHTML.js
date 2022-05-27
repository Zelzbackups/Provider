    // this script can reference html asset as an attribute
// and will live update dom and reattach events to it on html changes
// so that launcher don't need to be refreshed during development

pc.script.attribute('html', 'asset', [ ], { type: 'html' });

pc.script.create('PurchaseHTML', function (app) {
    var PurchaseHTML = function (entity) {
        this.entity = entity;
    };

    var UI;
    
    PurchaseHTML.prototype = {
        initialize: function () {
            // create DIV element
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
            
            UI = app.root.findByName ('MainEntity').script.UIHandler;
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
            // example
            // 
            // get button element by class
            
            var purchaseElement = this.element.querySelector('#purchaseButton');
            
            if (purchaseElement) {
                // add event listener on `click`
                purchaseElement.addEventListener('click', function() {
                    UI.purchaseClick();
                }, false);
            }
            
            var cancelPurchaseElement = this.element.querySelector('#cancelPurchaseButton');
            
            if (cancelPurchaseElement) {
                // add event listener on `click`
                cancelPurchaseElement.addEventListener('click', function() {
                    UI.cancelPurchaseClick();
                }, false);
            }
        },

        update: function (dt) {
            // check for swapped asset
            // if so, then start asset loading and templating
            if (this.assetId !== this.html[0])
                this.attachAsset(this.html[0], this.template);
        }
        
    };

    return PurchaseHTML;
});