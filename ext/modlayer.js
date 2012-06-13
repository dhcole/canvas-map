function modLayer(provider, transform) {
    this.parent = document.createElement('div');
    this.parent.style.cssText = 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; margin: 0; padding: 0; z-index: 0';
    this.levels = {};
    this.requestManager = new MM.RequestManager();
    this.requestManager.addCallback('requestcomplete', this.getTileComplete());
    this.requestManager.addCallback('requesterror', this.getTileError());
    this.transform = transform;

    if (provider) this.setProvider(provider);
}

modLayer.prototype.getTileComplete = function() {
    if (!this._tileComplete) {
        var theLayer = this;
        this._tileComplete = function(manager, tile) {

            var c = document.createElement('canvas');
            c.width = 256;
            c.height = 256;
            var ctx = c.getContext('2d');
            
            if(!IE) {
                ctx.drawImage(tile, 0, 0, 256, 256);
                try {
                  var imagedata = ctx.getImageData(0, 0, 256, 256);
                  var data = imagedata.data;
                  data = theLayer.transform(data);
                  ctx.putImageData(imagedata, 0, 0);
                  c.coord = tile.coord;
                  c.id = tile.id;
                  tile = c;
                } catch(e) {
                  console.log(e);
                }
    
                theLayer.tiles[tile.id] = tile;
                theLayer.positionTile(tile);
            } else {
                c.onload = function(tile) {
                    if (tile.src.indexOf(tile.src) > -1) {
                        ctx.drawImage(tile, 0, 0, 256, 256);
                    }
                }
                c.loadImages(tile.src);
                
                ctx.invoke('getImageData', 0, 0, 256, 256, function(buf) {
                    var imagedata = theLayer.transform(data);
                });
                
                c.coord = tile.coord;
                c.id = tile.id;
                tile = c;
                theLayer.tiles[tile.id] = tile;
                theLayer.positionTile(tile);
            }
        };
    }
    return this._tileComplete;
};

modLayer.prototype.positionTile = function(tile) {
    // position this tile (avoids a full draw() call):
    var theCoord = this.map.coordinate.zoomTo(tile.coord.zoom);

    // Start tile positioning and prevent drag for modern browsers
    tile.style.cssText = 'position:absolute;-webkit-user-select:none;' +
        '-webkit-user-drag:none;-moz-user-drag:none;-webkit-transform-origin:0 0;' +
        '-moz-transform-origin:0 0;-o-transform-origin:0 0;-ms-transform-origin:0 0;';

    // Prevent drag for IE
    tile.ondragstart = function() { return false; };

    var tx = tile.coord.column *
        this.map.tileSize.x;
    var ty = tile.coord.row *
        this.map.tileSize.y;

    // TODO: pass only scale or only w/h
    MM.moveElement(tile, {
        x: Math.round(tx),
        y: Math.round(ty),
        width: this.map.tileSize.x,
        height: this.map.tileSize.y
    });

    // add tile to its level
    var theLevel = this.levels[tile.coord.zoom];
    theLevel.appendChild(tile);

    // Support style transition if available.
    tile.className = 'map-tile-loaded';

    // ensure the level is visible if it's still the current level
    if (Math.round(this.map.coordinate.zoom) == tile.coord.zoom) {
        theLevel.style.display = 'block';
    }


    // request a lazy redraw of all levels
    // this will remove tiles that were only visible
    // to cover this tile while it loaded:
    this.requestRedraw();
};

MM.extend(modLayer, MM.Layer);