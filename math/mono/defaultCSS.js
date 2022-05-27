// this script can reference html asset as an attribute
// and will live update dom and reattach events to it on html changes
// so that launcher don't need to be refreshed during development

pc.script.attribute('css', 'asset', [ ], { type: 'css' });

pc.script.create('defaultCSS', function (app) {
    var DefaultCSS = function (entity) {
        this.entity = entity;
    };

    DefaultCSS.prototype = {
        initialize: function () {
            // create STYLE element
            this.element = document.createElement('style');
            
            // append to head
            document.head.appendChild(this.element);
            
            // asset
            this.asset = null;
            this.assetId = 0;
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
        
        template: function(asset, css) {
            // unsubscribe from old asset load event if required
            if (this.asset && this.asset !== asset)
                this.asset.off('load', this.asset._onLoad);
            
            // remember current asset
            this.asset = asset;
            
            // template element
            // you can use templating languages with renderers here
            // such as hogan, mustache, handlebars or any other
            this.element.innerHTML = css || '';
        },

        update: function (dt) {
            // check for swapped asset
            // if so, then start asset loading and templating
            if (this.assetId !== this.css[0])
                this.attachAsset(this.css[0], this.template);
        }
    };

    return DefaultCSS;
});