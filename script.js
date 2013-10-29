// create a random map
var map = new Array();
var map_sz = 16;
for (var i = 0; i < map_sz; i++) {
  map[i] = new Array();
  for (var j = 0; j < map_sz*3; j++) {
    //map[i][j] = (i % 2 === 0);
    map[i][j] = Math.random() > 0.8;
  }
}
var x_pos = map_sz/2;
var y_pos = map_sz;
var last_x_move = 0;
var last_y_move = 0;
var player_sz = 0.5;


var drawTrapezoid = function(
    i, j, id,
    draw_right,
    x, y, 
    width, height, 
    trap_height, depth, 
    color, the_canvas) {
  // draw inner part
  var new_id = 'pix_trap_' + i + '_' + j + '_' + id;
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

var drawTrapezoidOutline = function(
    i, j,
    draw_right,
    x, y, 
    width, height, 
    trap_height, depth, 
    color, color_outline,
    thickness,
    the_canvas) {

  if (true) {
  drawTrapezoid(
    i, j, 'outline',
    draw_right,
    x, y, 
    width, height, 
    trap_height, depth, 
    color_outline,
    the_canvas);
  }

  if ((width > thickness * 2) && (height > thickness * 2) &&
    (trap_height > thickness)) {
  //if (false) {
    drawTrapezoid(
      i, j, 'inner',
      draw_right,
      x + thickness, y + thickness, 
      width - thickness * 1.5, height - thickness * 2, 
      trap_height - thickness/2, depth, 
      color,
      the_canvas);
  }
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
  
  // isn't occluded directly
  var not_occluded = (j === map.length - 1) || (!map[i][j+1]); 

  if (not_occluded && (x_center + sz > 0) && (x_center < x_max)) {
  var new_id = 'map_3d_' + i + '_' + j;
  var new_div = '<div class="block" id=' + new_id + '></div>';
  the_canvas.append(new_div);

  var z_index = -Math.round(y_dist * map.length);
  $('#' + new_id).css('height', (sz-6) + 'px');
  $('#' + new_id).css('width',  (sz-2) + 'px');
  $('#' + new_id).css('background-color', color); 
  $('#' + new_id).css('z-index', z_index);

  $('#' + new_id).css('left', 
        (x_center - 2) + 'px');
  $('#' + new_id).css('top',  
        (y_center ) + 'px');
  }
}

var drawPerspectiveWall = function(the_canvas, i, j, color,
    x_dist, y_dist, sz, sz_3d, 
    y_offset_3d, x_3d_view_center,
    x_center, y_center,
    x_max) {
  // draw perspective walls

  var draw_right = ((x_dist > 0.5) && ((i === 0) || !(map[i-1][j])));
  var draw_left = ((x_dist < -0.5) && ((i === map.length-1) || !(map[i+1][j])));
  // draw right hand walls
  if (draw_right || draw_left) {
    var y_pow = Math.pow(2, y_dist + 1);
    //if (y_dist < 0) {
      //console.log(" " + y_dist + " " + y_pow);
    //}
    var sz2 = sz_3d / y_pow;
    var x_off = - sz2/2;
    var y_off = - sz2/2;
    var y_center2 = y_offset_3d + sz_3d/2 + y_off;
    var z_index = - Math.round(y_dist * map.length + Math.abs(x_dist)); 
    
    if (draw_right) {
      var x_center2 = (x_dist * sz2) + x_3d_view_center + x_off;
      var trap_width = Math.abs(x_center - x_center2);
      var x = x_center - trap_width;
      if ((x + trap_width > 0) && (x < x_max)) {
        drawTrapezoidOutline(
            i, j,
            draw_right,
            x, y_center, // ul xy  
            trap_width + 1.0, sz, // width + fudge, height
            sz/4,   // trap_height
            z_index,
            color, 
            '#000000',
            6,
            the_canvas);
      } 
    } else { // draw left
      var x_center2 = ((x_dist - 1) * sz2) + x_3d_view_center + x_off;
      var trap_width = Math.abs(x_center - x_center2);
      var x = x_center + sz;
      if ((x + trap_width > 0) && (x < x_max)) {
        drawTrapezoidOutline(
            i, j, 
            draw_right,
            x - 2.0, y_center, // ul xy  
            trap_width + 1.0, sz, // width + fudge, height
            sz/4,   // trap_height
            z_index,
            color,
            '#000000',
            6,
            the_canvas);
      }
    } // draw left or right
  } // draw trapezoids
} // walls

var drawScreen = function(x_pos, y_pos, the_canvas) {
  $(".top").empty();
  the_canvas.css('background-color', '#000000');
  // draw the xy coordinates to the screen
  var x_max = the_canvas.innerWidth();
  var y_max = $(window).height(); //$('body').innerHeight();
  if (false) {
  the_canvas.append('<p>' + x_max + ' ' + y_max + ' ' + 
      screen.width + ' ' + screen.height + ' ' + 
      x_pos + ' ' + y_pos + '</p>');
  }

  var x_3d_view_center = x_max/2;
  var sz_3d = Math.min(x_max, y_max);
  var y_offset_3d = y_max/2 - sz_3d/2; // map.length * 20;


  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      if (map[i][j]) {

        // 3d view
        var x_dist = i - x_pos;
        var y_dist = y_pos - j;

        dist = y_dist * y_dist + x_dist * x_dist;
        if (dist > 36) continue;
        dist_sc = 1.0 - dist / 36.0;

        var color = 'rgb(' 
            + Math.round((255 - i * 12) * dist_sc) + ',' + 
            + Math.round((255 - j * 6) * dist_sc) + ',' + 
            + Math.round(((i + j) * 4) * dist_sc) + 
        ')';

        // 2d map view
        drawMap(the_canvas, i, j, color);

        if ((Math.abs(x_dist) < 28) && 
            (y_dist >= -1) && (y_dist < 7)) {
          var sz = sz_3d / Math.pow(2, y_dist);
          var x_off = -sz/2;
          var y_off = -sz/2;
          var x_center = (x_dist * sz) + x_3d_view_center + x_off;
          var y_center = y_offset_3d + sz_3d/2 + y_off;
          // draw the straight on walls
          drawFlatWall(the_canvas, i, j, color, x_dist, y_dist, sz, 
                x_center, y_center, x_max);
          
          
          drawPerspectiveWall(the_canvas, i, j, color, x_dist, y_dist, sz, sz_3d,
                y_offset_3d, x_3d_view_center,
                x_center, y_center,
                x_max);
        } // y_dist

      } // is wall
    } // map for loop y
  } // map for loop x

  // draw the player position
  if (true) {
    // TBD make this into drawBlock function
    var i = x_pos;
    var j = y_pos;
    var x = (i) * 20;
    var y = (j) * 20;
    if (x < screen.width) {
      var new_id = 'map_player' + Math.round(i) + '_' + Math.round(j);
      var new_div = '<div class="block" id=' + new_id + '></div>';
      the_canvas.append(new_div);
      $('#' + new_id).css('left', Math.round(x) + 'px');
      $('#' + new_id).css('top',  Math.round(y) + 'px');
      $('#' + new_id).css('background-color', "#ffff00"); 
    }
  }
}


var mapIsEmptyPoint = function(x, y) {
  var xi = Math.round(x);
  var yi = Math.round(y);
  var is_on_map = (xi >= 0) && (xi < map.length) && 
        (yi >= 0) && (yi < map.length);

  if (!is_on_map) return true;

  if (map[xi][yi]) return false;

  return true;
}

var mapIsEmpty = function(x, y, sz) {
  
  var off = 0.0;
  return (
  // mapIsEmptyPoint(x + off, y + off)
  //  &&  
    /*
    mapIsEmptyPoint(x - sz/2 + off, y + off) &&
    mapIsEmptyPoint(x + sz/2 + off, y + off) 
    && 
    mapIsEmptyPoint(x + off, y - sz/2 + off) &&
    mapIsEmptyPoint(x + off, y + sz/2 + off)
    */
    mapIsEmptyPoint(x - sz/2, y - sz/2) &&
    mapIsEmptyPoint(x - sz/2, y + sz/2) &&
    mapIsEmptyPoint(x + sz/2, y + sz/2) &&
    mapIsEmptyPoint(x + sz/2, y - sz/2)
    );
}
var move = function(the_canvas, dx, dy) {
  var did_move = false;
  if (dx !== 0) {
    if (mapIsEmpty(x_pos + dx, y_pos, player_sz)) {
      x_pos += dx;
      last_x_move = dx;
      did_move = true;
    } else if (mapIsEmpty(x_pos, y_pos + last_y_move/10.0, player_sz)) {
      // slide on wall
      y_pos += last_y_move/10.0;
      did_move = true;
    }
  }
  if (dy !== 0) {
    if (mapIsEmpty(x_pos, y_pos + dy, player_sz)) {
      y_pos += dy;
      last_y_move = dy;
      did_move = true;
    } else if (mapIsEmpty(x_pos + last_x_move/10.0, y_pos, player_sz)) {
      // slide on wall
      x_pos += last_x_move/10.0;
      did_move = true;
    }
  }
  
  if (did_move) {
    //console.log(x_pos + ' ' + y_pos);
    drawScreen(x_pos, y_pos, the_canvas);
  }
}

$(document).ready( function() {
  var the_canvas = $("body");
  var move_inc = 0.1;
  // TODO separate init of the screen from updating?
  // should I have to append the new_div every update or not?
  drawScreen(x_pos, y_pos, the_canvas);
 
  the_canvas.click(function() {
    move(the_canvas, 0, -move_inc);
  });

  $(document).keydown( function(key) {
    switch(parseInt(key.which,10)) {
      case 65:
        move(the_canvas,  -move_inc, 0);
        break;
      case 68:
        move(the_canvas, move_inc, 0);
        break;  
      case 83:
        move(the_canvas, 0,  move_inc);
        break;
      case 87:
        move(the_canvas, 0, -move_inc);
        break;
      default:
        break;
  
    }
  });

});
