pc.script.attribute('amount', 'number', 0.00195, {
    decimalPrecision: 10
});

pc.extend(pc.posteffect, function () {
    function Blur(graphicsDevice) {
        this.device = graphicsDevice;
        
        var cameraScript;
        
        // Shaders
        var attributes = {
            aPosition: pc.gfx.SEMANTIC_POSITION
        };

        var passThroughVert = [
            "attribute vec2 aPosition;",
            "",
            "varying vec2 vUv0;",
            "",
            "void main(void)",
            "{",
            "    gl_Position = vec4(aPosition, 0.0, 1.0);",
            "    vUv0 = (aPosition + 1.0) * 0.5;",
            "}"
        ].join("\n");

        // Pixel shader applies a one dimensional gaussian blur filter.
        // This is used twice by the bloom postprocess, first to
        // blur horizontally, and then again to blur vertically.
        var blurXFrag = [
            "precision " + graphicsDevice.precision + " float;",
            "varying vec2 vUv0;",
            "uniform float uBlur;",
            "uniform sampler2D uColorBuffer;",
            "",
            "void main(void) {",
            "   vec4 sum = vec4(0.0);",
            "",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x - 4.0 * uBlur, vUv0.y)) * 0.05;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x - 3.0 * uBlur, vUv0.y)) * 0.09;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x - 2.0 * uBlur, vUv0.y)) * 0.12;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x - uBlur, vUv0.y)) * 0.15;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y)) * 0.16;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x + uBlur, vUv0.y)) * 0.15;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x + 2.0 * uBlur, vUv0.y)) * 0.12;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x + 3.0 * uBlur, vUv0.y)) * 0.09;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x + 4.0 * uBlur, vUv0.y)) * 0.05;",
            "",
            "   gl_FragColor = sum;",
            "}"
        ].join("\n");

        var blurYFrag = [
            "precision " + graphicsDevice.precision + " float;",
            "varying vec2 vUv0;",
            "uniform float uBlur;",
            "uniform sampler2D uColorBuffer;",
            "",
            "void main(void) {",
            "   vec4 sum = vec4(0.0);",
            "",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y - 4.0 * uBlur)) * 0.05;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y - 3.0 * uBlur)) * 0.09;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y - 2.0 * uBlur)) * 0.12;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y - uBlur)) * 0.15;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y)) * 0.16;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y + uBlur)) * 0.15;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y + 2.0 * uBlur)) * 0.12;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y + 3.0 * uBlur)) * 0.09;",
            "   sum += texture2D(uColorBuffer, vec2(vUv0.x, vUv0.y + 4.0 * uBlur)) * 0.05;",
            "",
            "   gl_FragColor = sum;",
            "}"
        ].join("\n");

        this.blurXShader = new pc.gfx.Shader(graphicsDevice, {
            attributes: attributes,
            vshader: passThroughVert,
            fshader: blurXFrag
        });
        this.blurYShader = new pc.gfx.Shader(graphicsDevice, {
            attributes: attributes,
            vshader: passThroughVert,
            fshader: blurYFrag
        });

        this.vertexBuffer = pc.posteffect.createFullscreenQuad(graphicsDevice);

        // Render targets
        var width = graphicsDevice.width;
        var height = graphicsDevice.height;
        this.targets = [];
        for (var i = 0; i < 1; i++) {
            var colorBuffer = new pc.gfx.Texture(graphicsDevice, {
                format: pc.gfx.PIXELFORMAT_R8_G8_B8,
                width: width,
                height: height
            });
            colorBuffer.minFilter = pc.gfx.FILTER_LINEAR;
            colorBuffer.magFilter = pc.gfx.FILTER_LINEAR;
            colorBuffer.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
            colorBuffer.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
            var target = new pc.gfx.RenderTarget(graphicsDevice, colorBuffer, { depth: false });

            this.targets.push(target);
        }

        // Effect defaults
        this.blurAmount = 1/512;
    }

    Blur.prototype = {
        render: function (inputTarget, outputTarget) {
            var device = this.device;
            var scope = device.scope;

            // Pass 1: draw from rendertarget 1 into rendertarget 2,
            // using a shader to apply a horizontal gaussian blur filter.
            scope.resolve("uBlur").setValue(this.blurAmount);
            scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);
            pc.posteffect.drawFullscreenQuad(device, this.targets[0], this.vertexBuffer, this.blurXShader);

            // Pass 3: draw from rendertarget 2 back into rendertarget 1,
            // using a shader to apply a vertical gaussian blur filter.
            scope.resolve("uColorBuffer").setValue(this.targets[0].colorBuffer);
            pc.posteffect.drawFullscreenQuad(device, outputTarget, this.vertexBuffer, this.blurYShader);
        }
    };

    return {
        Blur: Blur
    }; 
}());

pc.script.create('Blur', function (context) {
    // Creates a new Blur instance
    var Blur = function (entity) {
        this.entity = entity;
    };

    Blur.prototype = {
        createOffscreenTarget: function () {
            var w = context.graphicsDevice.canvas.width;
            var h = context.graphicsDevice.canvas.height;
            
            // Create an offscreen render target the same resolution as the back buffer
            var colorBuffer = new pc.gfx.Texture(context.graphicsDevice, {
                format: pc.gfx.PIXELFORMAT_R8_G8_B8_A8,
                width: w,
                height: h
            });
            colorBuffer.minFilter = pc.gfx.FILTER_NEAREST;
            colorBuffer.magFilter = pc.gfx.FILTER_NEAREST;
            colorBuffer.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
            colorBuffer.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
            var renderTarget = new pc.gfx.RenderTarget(context.graphicsDevice, colorBuffer, { depth: true });
            return renderTarget;
        },
        
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            cameraScript = this.entity.script.CameraControl;
            this.target = this.createOffscreenTarget();
            this.entity.camera.renderTarget = this.target;
            this.blurEffect = new pc.posteffect.Blur(context.graphicsDevice);
            var blurEffect = this.blurEffect;
            var target = this.target;
            var entity = this.entity;

            var command = new pc.scene.Command(pc.scene.LAYER_FX, pc.scene.BLEND_NONE, function () {
                blurEffect.render(target, null);
                entity.camera.renderTarget = target;
            });
            context.scene.drawCalls.push(command);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.blurEffect.blurAmount = this.amount;
        }
    };

    return Blur;
});