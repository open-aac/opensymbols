(function() {
  var state={}, context, canvas, img;
  var minZoom = 0.3;
  var maxZoom = 3.0;
  var result={};
  function wordReceived(word) {
    var $canvas = $("#canvas");
    canvas = $canvas[0];
    context = canvas.getContext('2d');
    state = {
      auto_zoom: true,
      zoom: 1,
      rotation: 0,
      color: state.color,
      mode: 'drag',
      color_mode: state.color_mode || 'border',
      border: state.border,
      fill: state.fill
    };
    state.word = word;
    $("#word").val(word);
//     if(img.width > img.height) {
//       state.scaleY = img.height / img.width;
//       state.posY = (canvas.height / 2) * (1 - state.scaleY);
//     } else if(img.height > img.width) {
//       state.scaleX = img.width / img.height;
//       state.posX = (canvas.width / 2) * (1 - state.scaleX);
//     }
    var $img = $("#pic");
    result.width = $img.width();
    result.height = $img.height();
    $canvas.css('height', result.height);
    $canvas.css('width', result.width);
    result.factorX = (canvas.width / result.width);
    result.factorY = (canvas.height / result.height);
    zoom('out');
  }
  $("#word").on('change keyup', function(event) {
    state.word = $("#word").val();
    state.auto_zoom = true;
    state.zoom = 1.0;
    redraw();
  });
  if(location.href.match(/demo/)) {
    wordReceived('demo');
  } else {
    if(window.parent && window.parent != window) {
      window.parent.postMessage("wordStateRequest", '*');
      setTimeout(function() {
        if(!state.word) {
          wordReceived('test');
        }
      }, 500);
    } else {
      wordReceived('test');
    }
  }
  $(window).bind('message', function(event) {
    event = event.originalEvent;
    if(event.data.match(/^state:/)) {
      state = JSON.parse(event.data.replace(/^state:/, ''));
      if(state.word && state.word) {
        wordReceived(state.word);
      }
      redraw();
    } else if(event.data == 'imageDataRequest') {
      event.source.postMessage(canvas.toDataURL(), '*');
    } else if(event.data == 'imageStateRequest') {
      event.source.postMessage('state:' + JSON.stringify(state), '*');
    } else {
      console.log("unrecognized message:");
      console.log(event.data);
    }
  });
  
  function setFont(direction) {
    var fonts = ['Arial', 'Tahoma', 'Courier', 'Comic Sans', 'Times'];
    var font = state.font || 'Arial';
    var index = fonts.indexOf(font);
    if(direction == 'next') {
      font = fonts[index + 1] || fonts[0];
    } else {
      font = fonts[index - 1] || fonts[fonts.length - 1];
    }

    state.font = font;
    state.auto_zoom = true;
    state.zoom = 1.0;
    $("#shape").text(font);
    redraw();
  };
  
  $("ul").on('click', 'a', function(event) {
    event.preventDefault();
    var action = $(this).attr('href').substring(1);
    if(action == 'zoomin') {
      zoom('in', true);
    } else if(action == 'zoomout') {
      zoom('out', true);
    } else if(action == 'color') {
      var colors = $(this).attr('data-colors').split(",");
      var res = [];
      for(var idx = 0; idx < colors.length; idx++) {
        res.push(parseInt(colors[idx], 10));
      }
      colorize(res[0], res[1], res[2]);
    } else if(action == 'reset') {
      colorize(null);
      $("a.color.btn-primary").removeClass('btn-primary');
    } else if(action == 'next_shape') {
      setFont('next');
    } else if(action == 'previous_shape') {
      setFont('previous');
    } else if(action == 'search') {
      search($("#search").val());
    } else {
      alert(action + " not defined");
    }
//     if($(this).hasClass('color')) {
//       if($(this).hasClass('btn-primary')) {
//         colorize(null);
//         $("a.color.btn-primary").removeClass('btn-primary');
//       } else {
//         $("a.color.btn-primary").removeClass('btn-primary');
//         $(this).addClass('btn-primary');
//       }
//     }
  });
  
  function zoom(direction, force) {
    var zoomDelta = 0.25;
    if(direction == 'in') {
      state.zoom = Math.min(state.zoom * (1 + zoomDelta), maxZoom);
    } else {
      state.zoom = Math.max(state.zoom / (1 + zoomDelta), minZoom);
    }
    if(force) {
      state.auto_zoom = false;
    }
    redraw();
  }

  function colorize(r, g, b) {
    
    if(r != null) {
      state[state.color_mode] = {
        red: r,
        green: g,
        blue: b
      };
    } else {
      state[state.color_mode] = null;
    }
    redraw();
  }

  var zooming = null;
  function redraw() {
    // console.log(state);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.save()
    context.beginPath();
    var blank = 255;
    if(state.border && state.border.red == 255 && state.border.green == 255 && state.border.blue == 255) {
      context.fillStyle = "#000";
      blank = 0;
    } else {
      context.fillStyle = 'rgba(255, 255, 255, 0.0)';
    }

    context.rect(0, 0, canvas.width, canvas.height);

    context.fill();
    context.clip();
    var size = (state.zoom * 150);
    document.getElementById('zoom').innerText = Math.round(state.zoom * 100 / 92 * 100) + "%";
    var font = state.font || 'Arial';
    if(font == 'Courier') { font = 'Courier New'; }
    else if(font == 'Comic Sans') { font = 'Comic Sans MS'; }
    else if(font == 'Times') { font = 'Times New Roman'; }
    context.font = size + "px " + font;
    context.fillStyle = '#000';
    if(state.border) {
      context.fillStyle = "rgb(" + state.border.red + "," + state.border.green + "," + state.border.blue + ")";
    }
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(state.word, canvas.width / 2, canvas.height / 2);
//    context.drawImage(img, state.posX, state.posY, canvas.width * state.scaleX, canvas.height * state.scaleY);

    if(state.auto_zoom) {
      var imageData = context.getImageData(0, 0, Math.round(canvas.width / 20), canvas.height);
      var pixels = imageData.data;
      var outer_all_blank = true;
      for(var idx = 0; idx < pixels.length; idx = idx + 4) {
        if(pixels[idx + 3] != 0) {
          if(pixels[idx] != blank || pixels[idx + 1] != blank || pixels[idx + 2] != blank) { outer_all_blank = false; }
        }
      }
      var imageData = context.getImageData(Math.round(canvas.width / 10), 0, Math.round(canvas.width / 20), canvas.height);
      var pixels = imageData.data;
      var inner_all_blank = true;
      for(var idx = 0; idx < pixels.length; idx = idx + 4) {
        if(pixels[idx + 3] != 0) {
          if(pixels[idx] != blank || pixels[idx + 1] != blank || pixels[idx + 2] != blank) { inner_all_blank = false; }
        }
      }
      if(!outer_all_blank) {
        if(state.zoom > minZoom && zooming != 'in') {
          zooming = 'out';
          zoom('out');
          zooming = null;
          return;
        }
      } else if(inner_all_blank) {
        if(state.zoom < maxZoom && zooming != 'out') {
          zooming = 'in';
          zoom('in');
          zooming = null;
          return;
        }
      }
    }

    try {
      $("#pic").attr('src', canvas.toDataURL());
    } catch(e) {
      alert("Image failed to load correctly. Some browsers do not support editing all types of images (such as .svg files).");
      console.log(e);
    }
  }
})();