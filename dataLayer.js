var dataLayer = {};


dataLayer.add = function () {
        layer = new MM.TemplatedLayer(dataLayer.settings.tiles);
        MM_map.addLayer(layer);
        MM_map.removeLayer(modl);
};


dataLayer.addData = function () {
        modl = new modLayer(new MM.Template(dataLayer.settings.tiles), electionsFilter);
        MM_map.addLayer(modl);
        MM_map.removeLayer(layer);
};

var colorToFips = function(r, g, b) {
    function rgbToHex(red, green, blue) {
        
        var rgb = blue | (green << 8) | (red << 16);
        return rgb.toString(16);
    };
    return parseInt(rgbToHex(r, g, b), 16);
};

var applyColor = function(fips) {
    if (!Elections[fips]) return false;
    var dem = Elections[fips].demPct,
        rep = Elections[fips].repPct,
        other = Elections[fips].otPct,
        color = [247, 247, 247];
        
    if (dem > rep && dem > other)   color = [ 33, 102, 172];
    if (rep > dem && rep > other)   color = [178,  24,  43];
    if (other > dem && other > rep) color = [ 27, 120,  55];    

    return color;
};


function electionsFilter(d) {

    for (x=0; x < 256; x++) {
        for (y=0; y < 256; y++) {

            // Identify pixel values
            var i = (x * 4) * 256 + (y * 4);
            var r = d[i];
            var g = d[i+1]; 
            var b = d[i+2]; 
            var a = d[i+3]; 

            // Process pixels
            var fips = colorToFips(r, g, b);
            var color = applyColor(fips);
            if (color) {
                // Save pixels
                d[i]   = color[0]; 
                d[i+1] = color[1]; 
                d[i+2] = color[2];
                d[i+3] = 255 * 0.5;
            } else {
                d[i+3] = 0; 
            }
        } 
    }
}

$('.switch').click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
        $('.switch').removeClass('active');
        $(this).addClass('active');
        dataLayer.addData();
    } else {
        $('.switch').removeClass('active');
        dataLayer.add();
    }
});
