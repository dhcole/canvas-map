function blockFilter(data) {
  var skip = 4;
  var val;
  for (var x = 0; x < 256; x += skip) {
    for (var y = 0; y < 256; y += skip) {
      if (data[4 * ((y * 256) + x) + 0] == 181 &&
        data[4 * ((y * 256) + x) + 1] == 208 &&
        data[4 * ((y * 256) + x) + 2] == 208) {
        val = [
          data[4 * ((y * 256) + x) + 0],
          data[4 * ((y * 256) + x) + 1],
          data[4 * ((y * 256) + x) + 2]];
      } else {
        val = [
          data[4 * ((y * 256) + x) + 1],
          data[4 * ((y * 256) + x) + 1],
          data[4 * ((y * 256) + x) + 1]];
      }
      for (var s = 0; s < skip; s++) {
        for (var s0 = 0; s0 < skip; s0++) {
          var r = (Math.random() * 50);
          var n = data[4 * (((y + s0) * 256) + x + s) + 0];
          data[4 * (((y + s0) * 256) + x + s) + 0] = (val[0]) * 1 + r;
          data[4 * (((y + s0) * 256) + x + s) + 1] = (val[1]) * 1 + r;
          data[4 * (((y + s0) * 256) + x + s) + 2] = (val[2]) * 1 + r;
        }
      }
    }
  }
}

function greenFilter(data) {
  var skip = 1;
  var val;
  for (var x = 0; x < 256; x += skip) {
    for (var y = 0; y < 256; y += skip) {
      if (data[4 * ((y * 256) + x) + 0] == 181 &&
        data[4 * ((y * 256) + x) + 1] == 208 &&
        data[4 * ((y * 256) + x) + 2] == 208) {
        val = [255, 255, 255];
      } else {
        if (true) val = [
          Math.pow(data[4 * ((y * 256) + x) + 1] / 255, 0.5) * 255,
          Math.pow(data[4 * ((y * 256) + x) + 1] / 255, 0.5) * 255,
          Math.pow(data[4 * ((y * 256) + x) + 1] / 255, 0.5) * 255];
        if (false) val = [
          data[4 * ((y * 256) + x) + 1] - 100 + 140,
          data[4 * ((y * 256) + x) + 1] - 100 + 35,
          data[4 * ((y * 256) + x) + 1] - 100 + 85];

      }
      for (var s = 0; s < skip; s++) {
        for (var s0 = 0; s0 < skip; s0++) {
          var r = (Math.random() > 2) ? (Math.random() * 20) : 0;
          var n = data[4 * (((y + s0) * 256) + x + s) + 0];
          data[4 * (((y + s0) * 256) + x + s) + 0] = (val[0]) + r;
          data[4 * (((y + s0) * 256) + x + s) + 1] = (val[1]) + r;
          data[4 * (((y + s0) * 256) + x + s) + 2] = (val[2]) + r;
        }
      }
    }
  }
}



