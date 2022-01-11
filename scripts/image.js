function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

preloadImages(["/images/back.gif", "/images/bean.jpeg", "/images/bitlife.png" "/images/cookie.jpeg", "/images/drift.jpg", "/images/fnaf1.jpeg", "/images/fnaf2.png", "fnaf3.jpeg", "fnaf4.jpeg", "/images/fnf.jpg", "/images/pandemic.jpeg", "/images/pico.png", "/images/slope.jpeg", "/images/space.png", "/images/discord.jpg", "/images/reddit.jpeg"]);