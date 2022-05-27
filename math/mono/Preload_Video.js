var VIDEO_URL = "playcanvas-web-small.mp4";

// Based on this code
// http://blog.pearce.org.nz/2014/02/how-to-prefetch-videoaudio-files-for.html
var prefetch_file = function(url, fetched_callback, progress_callback, error_callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";

  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      var URL = window.URL || window.webkitURL;
      var blob_url = URL.createObjectURL(xhr.response);
      fetched_callback(blob_url);
    } else {
      error_callback();
    }
  }, false);

  var prev_pc = 0;
  xhr.addEventListener("progress", function(event) {
    if (event.lengthComputable) {
      var pc = Math.round((event.loaded / event.total) * 100);
      if (pc != prev_pc) {
        prev_pc = pc;
        progress_callback(pc);
      }
    }
  });
  xhr.send();
};

pc.script.create('Preload_Video', function (app) {
    // Creates a new Preload_video instance
    var Preload_video = function (entity) {
        this.entity = entity;
    };

    Preload_video.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            prefetch_file(VIDEO_URL, this.loaded.bind(this), this.progress, this.error);
        },
        
        loaded: function (url) {
            // Create video element
            this.video = document.createElement("video");
            this.video.src = url;
            this.video.crossOrigin = 'anonymous';
            this.video.loop = true;
            this.video.play();

            this.material = this.entity.model.material;
            
            this.texture = new pc.Texture({
                format: pc.gfx.PIXELFORMAT_R5_G6_B5,
                autoMipmap: false
            });

            this.texture.minFilter = pc.gfx.FILTER_LINEAR;
            this.texture.magFilter = pc.gfx.FILTER_LINEAR;
            this.texture.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
            this.texture.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
            this.texture.setSource(this.video);
            
            this.material.emissiveMap = this.texture;
            this.material.update();            
        },
        
        progress: function (n) {
        },
        
        error: function (e) {
            console.error(e);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.texture) {
                this.texture.upload();
            }
        }
    };

    return Preload_video;
});