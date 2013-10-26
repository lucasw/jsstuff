// create a random map
var map = new Array();

for (var i = 0; i < 16; i++) {
  map[i] = new Array();
  for (var j = 0; j < 16; j++) {
    map[i][j] = Math.random() > 0.8;
  }
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
        // 2d map view
        var new_id = 'map' + i + '_' + j;
        var new_div = '<div class="block" id=' + new_id + '></div>';
        the_canvas.append(new_div);
        $('#' + new_id).css('left', (i * 20) + 'px');
        $('#' + new_id).css('top',  (j * 20) + 'px');
        var color = 'rgb(' 
            + (255 - i * 16) + ',' + 
            + (255 - j * 8)  + ',' + 
            + ((i + j) * 4) + 
        ')';

        $('#' + new_id).css('background-color', color); 
       

        // 3d view
        var x_dist = i - x_pos;
        var y_dist = y_pos - j;

        if ((y_dist > 0) && (y_dist < 10)) {
          var new_id = 'map_3d_' + i + '_' + j;
          var new_div = '<div class="block" id=' + new_id + '></div>';
          the_canvas.append(new_div);

          var sz = sz_3d / Math.pow(2, y_dist);
          $('#' + new_id).css('height', sz + 'px');
          $('#' + new_id).css('width',  sz + 'px');
          $('#' + new_id).css('background-color', color); 
          $('#' + new_id).css('z-index', -y_dist);

          var x_center = (x_dist * sz) - sz/2 + sz_3d/2;
          if (true) {
            // (x_center + sz/2 > x_offset_3d) && 
            // (x_center - sz/2 < x_offset_3d + sz_3d)) {
            $('#' + new_id).css('left', 
                (x_center) + 'px');
            $('#' + new_id).css('top',  
                (x_offset_3d + sz_3d/2 - sz/2) + 'px');
          }

        } // 3d view

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
 

  // draw trapezoid
  if (false) {
    for (var j = 0; j < 4; j++) {
      the_canvas.append('<div class="row">');
      for (var i = 0; i < 4; i++) {
        // draw black outline part
        var new_id = 'pix' + i + '_' + j;
        var new_div = '<div class="trapezoid_vert" id=' + new_id + '></div>';
        the_canvas.append(new_div);
        $('#' + new_id).css('border-right', '50px solid #000000');
        $('#' + new_id).css('left', (i * 60) + 'px');
        $('#' + new_id).css('top',  (i * 20) + 'px');
        console.log(new_div);

        // draw inner part
        new_id = 'pixi' + i + '_' + j;
        new_div = '<div class="trapezoid_vert_inner" id=' + new_id + '></div>';
        the_canvas.append(new_div);
        $('#' + new_id).css('border-top', '45px solid transparent');
        $('#' + new_id).css('border-bottom', '45px solid transparent');
        $('#' + new_id).css('left', (i * 60 + 3) + 'px');
        $('#' + new_id).css('top',  (i * 20 + 6) + 'px');

      }
      the_canvas.append('</div>');
    }
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