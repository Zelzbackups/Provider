pc.script.create('PropertyLight', function (app) {
    // Creates a new PropertyLight instance
    var PropertyLight = function (entity) {
        this.entity = entity;
    };
    
    var lightFolder;
    var tiles;
    
    var tempVal;
    var decreasing = false;
    var currLight;

    PropertyLight.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            lightFolder = app.root.findByName ('Property Lights');
            
            tiles = lightFolder.getChildren ();
            
            for (i = 0; i < tiles.length; i++) {
                var meshes = tiles[i].model.model.meshInstances;
                meshes[0].setParameter("material_opacity", 0);
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (decreasing) {
                tempVal -= 0.05;
                currLight.setParameter("material_opacity", tempVal);
            }
        },
        
        turnOnLights: function (currentTile, endTile) {
            var meshes;
            
            if (currentTile > endTile) {
                var length = endTile + (40 - currentTile);
                
                for (i = 0; i < length + 1; i++) {
                    var nextTile = (currentTile + i) % 40;
                    meshes = tiles[nextTile].model.model.meshInstances;
                    meshes[0].setParameter("material_opacity", 1);
                }
            } else {
                for (i = currentTile + 1; i < endTile + 1; i++) {
                    meshes = tiles[i].model.model.meshInstances;
                    meshes[0].setParameter("material_opacity", 1);
                }
            }
            
            currLight = tiles[currentTile].model.model.meshInstances[0];
        },
        
        turnOffLights: function (position) {
            tempVal = 1;
            decreasing = true;
            
            var meshes = tiles[position].model.model.meshInstances;
            meshes[0].setParameter("material_opacity", tempVal);
            
            currLight = meshes[0];
        }
    };

    return PropertyLight;
});