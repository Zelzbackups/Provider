pc.script.create('modernizr', function (app) {
    // Creates a new Modernizr instance
    var Modernizr = function (entity) {
        this.entity = entity;
    };

    Modernizr.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Modernizr;
});