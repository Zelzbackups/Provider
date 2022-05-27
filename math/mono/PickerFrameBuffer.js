pc.script.create('picker', function (app) {
    // Creates a new PickerFramebuffer instance
    var PickerFramebuffer = function (entity) {
        this.entity = entity;
        
        // Create a frame buffer picker with a resolution of 1024x1024
        this.picker = new pc.scene.Picker(app.graphicsDevice, 1024, 1024);
    };
    
    var cameraScript;
    var mainScript;
    
    var card;

    PickerFramebuffer.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
//             app.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onSelect, this);
            
            var cameraEntity = app.root.findByName('Camera');
            cameraScript = cameraEntity.script.CameraControl;
            
            var mainEntity = app.root.findByName ('MainEntity');
            mainScript = mainEntity.script.Main;
        },

        onSelect: function (event) {
            var canvas = app.graphicsDevice.canvas;
            var canvasWidth = parseInt(canvas.clientWidth, 10);
            var canvasHeight = parseInt(canvas.clientHeight, 10);

            var camera = this.entity.camera.camera;
            var scene = app.scene;
            var picker = this.picker;

            picker.prepare(camera, scene);

            // Map the mouse coordinates into picker coordinates and 
            // query the selection
            var selected = picker.getSelection({
                x: Math.floor(event.x * (picker.width / canvasWidth)), 
                y: picker.height - Math.floor(event.y * (picker.height / canvasHeight))
            });

            if (selected.length > 0) {
                // Get the graph node used by the selected mesh instance
                var entity = selected[0].node;

                // Bubble up the hierarchy until we find an actual Entity
                while (!(entity instanceof pc.Entity) && entity !== null) {
                    entity = entity.getParent();
                }

                card = false;

                if (entity) {
                    return entity;
                }
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return PickerFramebuffer;
});