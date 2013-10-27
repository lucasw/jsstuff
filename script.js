// create a random map
var map = new Array();

for (var i = 0; i < 16; i++) {
  map[i] = new Array();
  for (var j = 0; j < 16; j++) {
    //map[i][j] = (i%2 === 0);
    map[i][j] = Math.random() > 0.8;
  }
}

var drawTrapezoid = function(
    i, j, 
    x, y, 
    width, height, 
    trap_height, depth, 
    color, the_canvas) {
  // draw inner part
  var new_id = 'pix_trap_' + i + '_' + j;
  var new_div = '<div class="trapezoid_vert" id=' + new_id + '></div>';
  the_canvas.append(new_div);
  $('#' + new_id).css('border-right', width + 'px solid ' + color);
  $('#' + new_id).css('border-top', trap_height + 'px solid transparent');
  $('#' + new_id).css('border-bottom', trap_height + 'px solid transparent');
  $('#' + new_id).css('left', x + 'px');
  $('#' + new_id).css('top',  y + 'px');
  $('#' + new_id).css('height',  height - trap_height*2 + 'px');
  $('#' + new_id).css('z-index', depth);
}

var drawMap = function(the_canvas, i, j, color) {
  var new_id = 'map' + i + '_' + j;
  var new_div = '<div class="block" id=' + new_id + '></div>';
  the_canvas.append(new_div);
  $('#' + new_id).css('left', (i * 20) + 'px');
  $('#' + new_id).css('top',  (j * 20) + 'px');

  $('#' + new_id).css('background-color', color);
}

var drawFlatWall = function(the_canvas, i, j, color, x_dist, y_dist, sz, 
    x_center, y_center) {
  var new_id = 'map_3d_' + i + '_' + j;
  var new_div = '<div class="block" id=' + new_id + '></div>';
  the_canvas.append(new_div);

  $('#' + new_id).css('height', sz + 'px');
  $('#' + new_id).css('width',  sz + 'px');
  $('#' + new_id).css('background-color', color); 
  $('#' + new_id).css('z-index', -y_dist*2);

  if (true) {
    // (x_center + sz/2 > x_offset_3d) && 
    // (x_center - sz/2 < x_offset_3d + sz_3d)) 
    $('#' + new_id).css('left', 
        (x_center) + 'px');
    $('#' + new_id).css('top',  
        (y_center) + 'px');
  }
}

var drawPerspectiveWall = function(the_canvas, i, j, x_dist, y_dist, sz, sz_3d, 
    x_offset_3d,
    x_center, y_center) {
  // draw perspective walls
  var color_trap = 'rgb(' 
    + (255 - i * 16 - 50) + ',' + 
    + (255 - j * 8 - 50)  + ',' + 
    + ((i + j) * 4) + 
    ')';

  // draw right hand walls
  if ((x_dist > 0) && ((i === 0) || !(map[i-1][j]))) {
    var sz2 = sz_3d / Math.pow(2, y_dist + 1);
    var x_center2 = (x_dist * sz2) - sz2/2 + sz_3d/2;
    var y_center2 = x_offset_3d + sz_3d/2 - sz2/2;

    var trap_width = x_center - x_center2;

    drawTrapezoid(
      i, j, 
      x_center - trap_width, y_center, // ul xy  
      trap_width, sz, // width, height
      sz/4,   // trap_height
      -y_dist*2 - 1, // z-index
      color_trap, the_canvas);
  } // x_dist is > 0
}

var drawScreen = function(x_pos, y_pos, the_canvas) {
  $(".top").empty();
  // draw the xy coordinates to the screen
  the_canvas.append('<p>' + x_pos + ' ' + y_pos + '</p>');
  
  var x_offset_3d = map.length * 20;
  var sz_3d = 512;

  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      if (map[i][j]) {
        var color = 'rgb(' 
            + (255 - i * 16) + ',' + 
            + (255 - j * 8)  + ',' + 
            + ((i + j) * 4) + 
        ')';

        // 2d map view
        drawMap(the_canvas, i, j, color);

        // 3d view
        var x_dist = i - x_pos;
        var y_dist = y_pos - j;

        if ((y_dist >= 0) && (y_dist < 9)) {
          var sz = sz_3d / Math.pow(2, y_dist);
          var x_center = (x_dist * sz) - sz/2 + sz_3d/2;
          var y_center = x_offset_3d + sz_3d/2 - sz/2;
          if ((y_dist > 0)) {
            // draw the straight on walls
            drawFlatWall(the_canvas, i, j, color, x_dist, y_dist, sz, 
                x_center, y_center);
            
            drawPerspectiveWall(the_canvas, i, j, x_dist, y_dist, sz, sz_3d,
                x_offset_3d,
                x_center, y_center);
          } // y_dist
        } // y_dist

      } // is wall
    } // map for loop y
  } // map for loop x

  // draw the player position
  // TBD make this into drawBlock function
  var i = x_pos;
  var j = y_pos;
  var new_id = 'map' + i + '_' + j;
  var new_div = '<div class="block" id=' + new_id + '></div>';
  the_canvas.append(new_div);
  $('#' + new_id).css('left', (i * 20) + 'px');
  $('#' + new_id).css('top',  (j * 20) + 'px');
  $('#' + new_id).css('background-color', "#001100"); 
}

$(document).ready( function() {
  var the_canvas = $("body");
  var x_pos = map.length/2;
  var y_pos = map.length;
  
  // TODO separate init of the screen from updating?
  // should I have to append the new_div every update or not?
  drawScreen(x_pos, y_pos, the_canvas);
  
  $(document).keydown( function(key) {
    switch(parseInt(key.which,10)) {
      case 65:
        x_pos -= 1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;
      case 83:
        y_pos += 1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;
      case 87:
        y_pos -= 1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;
      case 68:
        x_pos += 1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;  
      default:
        break;
  
    }
  });

});
