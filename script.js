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
    draw_right,
    x, y, 
    width, height, 
    trap_height, depth, 
    color, the_canvas) {
  // draw inner part
  var new_id = 'pix_trap_' + i + '_' + j;
  var new_div = '<div class="trapezoid_vert" id=' + new_id + '></div>';
  the_canvas.append(new_div);
  if (draw_right) {
  $('#' + new_id).css('border-left', 0 + 'px solid ' + color);
  $('#' + new_id).css('border-right', width + 'px solid ' + color);
  } else {
  $('#' + new_id).css('border-left', width + 'px solid ' + color);
  $('#' + new_id).css('border-right', 0 + 'px solid ' + color);
  }
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
    x_center, y_center,
    x_max) {
  
  if (x_center < x_max) {
  var new_id = 'map_3d_' + i + '_' + j;
  var new_div = '<div class="block" id=' + new_id + '></div>';
  the_canvas.append(new_div);

  $('#' + new_id).css('height', sz + 'px');
  $('#' + new_id).css('width',  sz + 'px');
  $('#' + new_id).css('background-color', color); 
  $('#' + new_id).css('z-index', -Math.round(y_dist * map.length));

  $('#' + new_id).css('left', 
        (x_center) + 'px');
  $('#' + new_id).css('top',  
        (y_center) + 'px');
  }
}

var drawPerspectiveWall = function(the_canvas, i, j, 
    x_dist, y_dist, sz, sz_3d, 
    x_offset_3d, x_3d_view_center,
    x_center, y_center,
    x_max) {
  // draw perspective walls
  var color_trap = 'rgb(' 
    + (255 - i * 16 - 50) + ',' + 
    + (255 - j * 8 - 50)  + ',' + 
    + ((i + j) * 4) + 
    ')';

  var draw_right = ((x_dist > 0.5) && ((i === 0) || !(map[i-1][j])));
  var draw_left = ((x_dist < -0.5) && ((i === map.length-1) || !(map[i+1][j])));
  // draw right hand walls
  if (draw_right || draw_left) {
    var sz2 = sz_3d / Math.pow(2, y_dist + 1);
    var y_center2 = x_offset_3d + sz_3d/2 - sz2/2;
    
    if (draw_right) {
      var x_center2 = (x_dist * sz2) - sz2/2 + x_3d_view_center;
      var trap_width = Math.abs(x_center - x_center2);
      var x = x_center - trap_width;
      if ((x + trap_width > 0) && (x < x_max)) {
        drawTrapezoid(
            i, j,
            draw_right,
            x, y_center, // ul xy  
            trap_width + 1.0, sz, // width + fudge, height
            sz/4,   // trap_height
            - Math.round(y_dist * map.length + Math.abs(x_dist)), // z-index
            color_trap, the_canvas);
      } 
    } else { // draw left
      var x_center2 = ((x_dist - 1) * sz2) - sz2/2 + x_3d_view_center;
      var trap_width = Math.abs(x_center - x_center2);
      var x = x_center + sz;
      if ((x + trap_width > 0) && (x < x_max)) {
        drawTrapezoid(
            i, j,
            draw_right,
            x, y_center, // ul xy  
            trap_width + 1.0, sz, // width + fudge, height
            sz/4,   // trap_height
            - Math.round(y_dist * map.length + Math.abs(x_dist)), // z-index
            color_trap, the_canvas);
      }
    } // draw left or right
  } // draw trapezoids
} // walls

var drawScreen = function(x_pos, y_pos, the_canvas) {
  $(".top").empty();
  // draw the xy coordinates to the screen
  var x_max = $('body').innerWidth();
  the_canvas.append('<p>' + x_max + ' ' + 
      screen.width + ' ' + screen.height + ' ' + 
      x_pos + ' ' + y_pos + '</p>');
  
  var x_offset_3d = map.length * 20;
  var x_3d_view_center = 720;
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

        if ((y_dist >= 0) && (y_dist < 8)) {
          var sz = sz_3d / Math.pow(2, y_dist);
          var x_center = (x_dist * sz) - sz/2 + x_3d_view_center;
          var y_center = x_offset_3d + sz_3d/2 - sz/2;
          if ((y_dist > 0)) {
            // draw the straight on walls
            drawFlatWall(the_canvas, i, j, color, x_dist, y_dist, sz, 
                x_center, y_center, x_max);
            
            drawPerspectiveWall(the_canvas, i, j, x_dist, y_dist, sz, sz_3d,
                x_offset_3d, x_3d_view_center,
                x_center, y_center,
                x_max);
          } // y_dist
        } // y_dist

      } // is wall
    } // map for loop y
  } // map for loop x

  // draw the player position
  // TBD make this into drawBlock function
  var i = x_pos;
  var j = y_pos;
  var x = i * 20;
  var y = j * 20;
  if (x < screen.width) {
  var new_id = 'map_player' + Math.round(i) + '_' + Math.round(j);
  var new_div = '<div class="block" id=' + new_id + '></div>';
  the_canvas.append(new_div);
  $('#' + new_id).css('left', Math.round(x) + 'px');
  $('#' + new_id).css('top',  Math.round(y) + 'px');
  $('#' + new_id).css('background-color', "#001100"); 
  }
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
        x_pos -= 0.1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;
      case 68:
        x_pos += 0.1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;  
      case 83:
        y_pos += 0.1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;
      case 87:
        y_pos -= 0.1;
        drawScreen(x_pos, y_pos, the_canvas);
        break;
      default:
        break;
  
    }
  });

});
