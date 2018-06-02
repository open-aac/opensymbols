(function() {
  var defaultData = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDEyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgNTE0NDgpICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCIgWw0KCTwhRU5USVRZIG5zX3N2ZyAiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTwhRU5USVRZIG5zX3hsaW5rICJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4NCl0+DQo8c3ZnICB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iJm5zX3N2ZzsiIHhtbG5zOnhsaW5rPSImbnNfeGxpbms7IiB3aWR0aD0iODUwLjM5NCIgaGVpZ2h0PSI4NTAuMzk0Ig0KCSB2aWV3Qm94PSIwIDAgODUwLjM5NCA4NTAuMzk0IiBzdHlsZT0ib3ZlcmZsb3c6dmlzaWJsZTtlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDg1MC4zOTQgODUwLjM5NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IlhNTElEXzVfIj4NCgk8Zz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZBQTQxRjsiIGQ9Ik00NTEuMjcsNzU4LjM3bC02LjQ3OSwxOC4wMmgtMjQuODh2MC4wMTFoLTI0LjI3bC02LjUzLTE4LjE5YzkuMjUsMS4zOSwyOC4wNiwxLjUyMSwzMS40MiwxLjUzDQoJCQloMC41MkM0MjQuMjcsNzU5LjczLDQ0MS42OSw3NTkuNjEsNDUxLjI3LDc1OC4zN3oiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZBQTQxRjsiIGQ9Ik0zNjQuMTIsNjg1LjQ0bDExNC44Ny0xNC44MDFjLTEsOS4xNy0xLjg2LDE3LjkzMS0yLjU4LDI1Ljc5bC0xMTAuMDIsMTQuMTYNCgkJCUMzNjUuODEsNzAzLjQ5LDM2NS4wNiw2OTQuODgsMzY0LjEyLDY4NS40NHoiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZBQTQxRjsiIGQ9Ik0zNjYuMzksNzEwLjU5bDExMC4wMi0xNC4xNmMtMC41OSw2LjUtMS4wOSwxMi4zOC0xLjQ4LDE3LjM1MWMtMC4xNiwyLjA1LTAuMzUsNC4wMi0wLjU2OSw1Ljg5OQ0KCQkJbC0xMDQuODQsMTMuNWMtMS4yOC01LjM1OS0yLjI3LTExLjc3LTIuODctMTkuMzk5QzM2Ni41Nyw3MTIuNzUsMzY2LjQ4LDcxMS42OSwzNjYuMzksNzEwLjU5eiIvPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkFBNDFGOyIgZD0iTTQ4MS45OSw2NDUuNzljLTEuMTEsOC4zNy0yLjExLDE2Ljc3LTMsMjQuODVMMzY0LjEyLDY4NS40NGMtMC43NS03LjYyLTEuNjItMTUuNzktMi42LTI0LjE1DQoJCQlMNDgxLjk5LDY0NS43OXoiLz4NCgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZBQTQxRjsiIGQ9Ik00NTEuMjcsNzU4LjM3Yy05LjU3OSwxLjI0LTI3LDEuMzYtMzAuMjIsMS4zN2gtMC41MmMtMy4zNi0wLjAxLTIyLjE3LTAuMTQxLTMxLjQyLTEuNTNoLTAuMDENCgkJCWMtMC4zMy0wLjA1LTAuNjQtMC4xLTAuOTQtMC4xNWMtNy4zOS0xLjI5LTE0LjU0LTcuNzItMTguNjQtMjQuODhsMTA0Ljg0LTEzLjVjLTMuMTUsMjcuNDYtMTEuODYsMzYuODAxLTIwLjk0LDM4LjM3DQoJCQlDNDUyLjc2LDc1OC4xNyw0NTIuMDQsNzU4LjI3LDQ1MS4yNyw3NTguMzd6Ii8+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGQkVFMzQ7IiBkPSJNNTYzLjA2LDQwNC4yNGMwLDUyLjI5LTE2Ljg2OSw2NC41Mi0zNSwxMDEuMjFjMCwwLTIwLjg1OSwzNy42ODktMzMuMzE5LDc1LjA2DQoJCQljLTUuMTksMTUuNTYxLTkuNDUsNDAuMzItMTIuNzUsNjUuMjhsLTEyMC40NywxNS41Yy0zLjQ5LTI5Ljc2LTguNDItNjEuOTgtMTQuNjktODAuNzhjLTEyLjQ1LTM3LjM3LTMzLjMxLTc1LjA2LTMzLjMxLTc1LjA2DQoJCQljLTE4LjEzLTM2LjY5LTM1LjAxLTQ4LjkyLTM1LjAxLTEwMS4yMXMyNS43My05OS4xMSw1OS40Ny0xMjMuNTdjNDEuNDQtMzAuMDQsMTI0LjE4LTMwLjA0LDE2NS42MiwwDQoJCQlDNTM3LjM0LDMwNS4xMyw1NjMuMDYsMzUxLjk1LDU2My4wNiw0MDQuMjR6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIGQ9Ik0zODkuMSw3NTguMjFjLTAuMzMtMC4wNS0wLjY0LTAuMS0wLjk0LTAuMTUNCgkJCWMtNy4zOS0xLjI5LTE0LjU0LTcuNzItMTguNjQtMjQuODhjLTEuMjgtNS4zNTktMi4yNy0xMS43Ny0yLjg3LTE5LjM5OWMtMC4wOC0xLjAzLTAuMTctMi4wOS0wLjI2LTMuMTkNCgkJCWMtMC41OC03LjEtMS4zMy0xNS43MS0yLjI3LTI1LjE0OWMtMC43NS03LjYyLTEuNjItMTUuNzktMi42LTI0LjE1Yy0zLjQ5LTI5Ljc2LTguNDItNjEuOTgtMTQuNjktODAuNzgNCgkJCWMtMTIuNDUtMzcuMzctMzMuMzEtNzUuMDYtMzMuMzEtNzUuMDZjLTE4LjEzLTM2LjY5LTM1LjAxLTQ4LjkyLTM1LjAxLTEwMS4yMXMyNS43My05OS4xMSw1OS40Ny0xMjMuNTcNCgkJCWM0MS40NC0zMC4wNCwxMjQuMTgtMzAuMDQsMTY1LjYyLDBjMzMuNzQsMjQuNDYsNTkuNDYsNzEuMjgsNTkuNDYsMTIzLjU3cy0xNi44NjksNjQuNTItMzUsMTAxLjIxDQoJCQljMCwwLTIwLjg1OSwzNy42ODktMzMuMzE5LDc1LjA2Yy01LjE5LDE1LjU2MS05LjQ1LDQwLjMyLTEyLjc1LDY1LjI4Yy0xLjExLDguMzctMi4xMSwxNi43Ny0zLDI0Ljg1DQoJCQljLTEsOS4xNy0xLjg2LDE3LjkzMS0yLjU4LDI1Ljc5Yy0wLjU5LDYuNS0xLjA5LDEyLjM4LTEuNDgsMTcuMzUxYy0wLjE2LDIuMDUtMC4zNSw0LjAyLTAuNTY5LDUuODk5DQoJCQljLTMuMTUsMjcuNDYtMTEuODYsMzYuODAxLTIwLjk0LDM4LjM3Yy0wLjY2LDAuMTItMS4zOCwwLjIyLTIuMTUsMC4zMmMtOS41NzksMS4yNC0yNywxLjM2LTMwLjIyLDEuMzdoLTAuNTINCgkJCWMtMy4zNi0wLjAxLTIyLjE3LTAuMTQxLTMxLjQyLTEuNTMiLz4NCgkJPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDsiIHBvaW50cz0iMzU4LjExLDczNC42NSANCgkJCTM2OS41Miw3MzMuMTggNDc0LjM2LDcxOS42OCA0ODIuNTIsNzE4LjYzIAkJIi8+DQoJCTxwb2x5bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7IiBwb2ludHM9IjM1OC4xMSw3MTEuNjYgDQoJCQkzNjYuMzksNzEwLjU5IDQ3Ni40MSw2OTYuNDMgNDgyLjUyLDY5NS42NCAJCSIvPg0KCQk8cG9seWxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kOyIgcG9pbnRzPSIzNTUuMTYsNjg2LjU5IA0KCQkJMzY0LjEyLDY4NS40NCA0NzguOTksNjcwLjY0IDQ4Ny41OCw2NjkuNTMgCQkiLz4NCgkJPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDsiIHBvaW50cz0iMzU1LjE3LDY2Mi4xMSANCgkJCTM2MS41Miw2NjEuMjkgNDgxLjk5LDY0NS43OSA0ODcuNTgsNjQ1LjA3IAkJIi8+DQoJCTxwb2x5bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDoxNDsiIHBvaW50cz0iMzg4LjksNzU3LjY0IDM4OS4xLDc1OC4yMSAzODkuMTEsNzU4LjIxIDM5NS42NCw3NzYuNCANCgkJCTQxOS45MSw3NzYuNCA0MjAuNTMsNzc2LjQgCQkiLz4NCgkJPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgcG9pbnRzPSI0NTEuNTQsNzU3LjYzIDQ1MS4yNyw3NTguMzcgNDQ0Ljc5LDc3Ni4zOSA0MTkuOTEsNzc2LjM5IAkJDQoJCQkiLz4NCgkJPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiB4MT0iNDIyLjA5IiB5MT0iMjE5LjU0IiB4Mj0iNDIyLjA5IiB5Mj0iNjkuMDYiLz4NCgkJPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiB4MT0iMzEzLjQ4IiB5MT0iMjU0LjQiIHgyPSIyMjQuMDciIHkyPSIxOTkuNTUiLz4NCgkJPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiB4MT0iMzU3LjkyIiB5MT0iMjE3LjY1IiB4Mj0iMjg2LjA1IiB5Mj0iMTA0LjEiLz4NCgkJPGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzIzMUYyMDtzdHJva2Utd2lkdGg6MTQ7IiB4MT0iNTM4LjkzIiB5MT0iMjU2LjA1IiB4Mj0iNjI4LjM1IiB5Mj0iMjAxLjE5Ii8+DQoJCTxsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMyMzFGMjA7c3Ryb2tlLXdpZHRoOjE0OyIgeDE9IjQ5NC41IiB5MT0iMjE5LjMiIHgyPSI1NjYuMzYiIHkyPSIxMDUuNzUiLz4NCgk8L2c+DQo8L2c+DQo8cmVjdCBzdHlsZT0iZmlsbDpub25lOyIgd2lkdGg9Ijg1MC4zOTQiIGhlaWdodD0iODUwLjM5NCIvPg0KPC9zdmc+DQo=";
  var state={}, context, canvas, img;
  var result={};
  function imageReceived(src) {
    img = new Image();
    img.onload = function() {
      var $canvas = $("#canvas");
      canvas = $canvas[0];
      context = canvas.getContext('2d');
      state = {
        zoom: 1,
        scaleX: 1,
        scaleY: 1,
        posX: 0,
        posY: 0,
        rotation: 0,
        color: state.color,
        mode: 'drag',
        color_mode: state.color_mode || 'border',
        border: state.border,
        fill: state.fill,
        shape: state.shape
      };
      state.image = src;
      if(img.width > img.height) {
        state.scaleY = img.height / img.width;
        state.posY = (canvas.height / 2) * (1 - state.scaleY);
      } else if(img.height > img.width) {
        state.scaleX = img.width / img.height;
        state.posX = (canvas.width / 2) * (1 - state.scaleX);
      }
      state.baseScaleX = state.baseScaleX || state.scaleX;
      state.baseScaleY = state.baseScaleY || state.scaleY;
      state.basePosX = state.basePosX || state.posX;
      state.basePosY = state.basePosY || state.posY;
      var $img = $("#pic");
      result.width = $img.width();
      result.height = $img.height();
      $canvas.css('height', result.height);
      $canvas.css('width', result.width);
      result.factorX = (canvas.width / result.width);
      result.factorY = (canvas.height / result.height);
      checkMode();
      zoom('out');
    }
    img.onerror = function() {
      alert("Image failed to load!");
    }
    img.src = src;
  

  }
  if(location.href.match(/embed/)) {
    $("#hint").css('visibility', 'hidden');
  }
  if(location.href.match(/demo/)) {
    imageReceived(defaultData);
  } else {
    if(window.parent && window.parent != window) {
      window.parent.postMessage("imageURLRequest", '*');
      window.parent.postMessage("imageStateRequest", '*');
      setTimeout(function() {
        if(!state.shape) {
          imageReceived(defaultData);
        }
      }, 500);
    } else {
      imageReceived(defaultData);
    }
  }
  $(window).bind('message', function(event) {
    event = event.originalEvent;
    if(event.data.match(/^data:image/)) {
      state.image = event.data;
      imageReceived(event.data);
    } else if(event.data.match(/^http/)) {
      state.image = event.data;
      pickImage(event.data);
    } else if(event.data.match(/^state:/)) {
      state = JSON.parse(event.data.replace(/^state:/, ''));
      if(state.image && state.image.match(/^data:image/)) {
        imageReceived(state.image);
      } else if(state.image && state.image.match(/^http/)) {
        pickImage(event.data);
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
  
  function pickImage(url) {
    state.image = url;
    session.ajax({
      type: 'GET',
      url: "/api/v1/symbols/proxy?url=" + encodeURIComponent(url),
      success: function(data) {
        imageReceived(data.data);
      }, error: function(xhr, status) {
        console.error("image proxy failed");
      },
      dataType: "json"
    });
    search(null);
  }
  
  function setShape(direction) {
    var shapes = ['circle', 'hexagon', 'square', 'shield', 'crest'];
    var shape = state.shape || 'circle';
    var index = shapes.indexOf(shape);
    if(direction == 'next') {
      shape = shapes[index + 1] || shapes[0];
    } else {
      shape = shapes[index - 1] || shapes[shapes.length - 1];
    }

    state.shape = shape;
    $("#shape").text(shape);
    redraw();
  };
  
  function checkMode() {
    $("a[href='#drag']").toggleClass('btn-primary', state.mode == 'drag');
    $("a[href='#crop']").toggleClass('btn-primary', state.mode == 'crop');
    $("a[href='#border']").toggleClass('btn-primary', state.color_mode == 'border');
    $("a[href='#fill']").toggleClass('btn-primary', state.color_mode == 'fill');
    if(!state.searching) {
      $(".fill_colors").toggle(state.color_mode === 'fill');
      $(".border_colors").toggle(state.color_mode === 'border');
    }
    $("#cropper").hide();
  }
  
  function search(text) {
    if(!text) {
      $(".settings").show();
      $(".results").hide();
      state.searching = false;
      checkMode();
      return;
    }
    if(text.match(/^http/) || text.match(/^data:/)) {
      pickImage(text);
      return;
    }
    state.searching = true;
    $("#results").empty();
    session.ajax({
      type: 'GET',
      url: "api/v1/symbols/search?q=" + encodeURIComponent(text),
      success: function(data) {
        $(".settings").hide();
        $(".results").show();
        for(var idx = 0; idx < data.length; idx++) {
          var div = document.createElement('a');
          div.className = 'image';
          div.href = '#pick';
          var img = document.createElement('img');
          img.src = data[idx].image_url;
          div.appendChild(img);
          $("#results").append(div);
        }
        if(data.length == 0) {
          $("#results").text("no results");
        }
      }, error: function(xhr, status) {
        $("#results").text("error while searching");
        console.error("image search failed");
      },
      dataType: "json"
    });
  }

  $("#file").change(function(event) {
    if(event.target && event.target.files) {
      var file = event.target.files[0];
      if(file && file.type.match(/^image/)) {
        var reader = new FileReader();
        reader.addEventListener('load', function() {
          imageReceived(reader.result);
        });
        reader.readAsDataURL(file);
      }
    }
  });
  $("#search").on('keypress', function(event) {
    if(event.keyCode == 13) {
      search($("#search").val());
    }
  }).on('paste', function(event) {
    event = event.originalEvent || event;
    var data = event && event.clipboardData && event.clipboardData.items;
    var found_file = false;
    if(data) {
      for(var idx = 0; idx < data.length; idx++) {
        if(data[idx] && data[idx].kind == 'file') {
          found_file = true;
        }
      }
    }
    if(found_file) {
      event.preventDefault();
      event.stopPropagation();
      var reader = new FileReader();
      reader.addEventListener('load', function() {
        imageReceived(reader.result);
      });
      reader.readAsDataURL(found_file);
    }
  });
  $("ul").on('click', 'a', function(event) {
    event.preventDefault();
    var action = $(this).attr('href').substring(1);
    if(action == 'zoomin') {
      zoom('in');
    } else if(action == 'zoomout') {
      zoom('out');
    } else if(action == 'color') {
      var colors = $(this).attr('data-colors').split(",");
      var res = [];
      for(var idx = 0; idx < colors.length; idx++) {
        res.push(parseInt(colors[idx], 10));
      }
      colorize(res[0], res[1], res[2]);
    } else if(action == 'reset') {
      reverse(false);
      colorize(null);
      $("a.color.btn-primary").removeClass('btn-primary');
    } else if(action == 'border') {
      state.color_mode = 'border';
      checkMode();
    } else if(action == 'fill') {
      state.color_mode = 'fill';
      checkMode();
    } else if(action == 'next_shape') {
      setShape('next');
    } else if(action == 'previous_shape') {
      setShape('previous');
    } else if(action == 'search') {
      search($("#search").val());
    } else if(action == 'clear_search') {
      search(null);
    } else if(action == 'pick') {
      pickImage($(this).find("img").attr('src'));
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
  $("#pic").bind('mousedown touchdown', function(event) {
    if(event.button != null && event.button != 0) { return; }
    event.preventDefault();
    if(state.mode == 'drag') {
      state.dragging = {
        dragStartX: event.pageX,
        dragStartY: event.pageY,
        posStartX: state.posX,
        posStartY: state.posY
      };
    } else if(state.mode == 'crop') {
      state.cropping = {
        dragStartX: event.pageX,
        dragStartY: event.pageY,
        posStartX: state.posX,
        posStartY: state.posY
      }
    }
  });
  $(document).bind('mousemove touchmove', function(event) {
    if(state.dragging) {
      var diffX = event.pageX - state.dragging.dragStartX;
      var diffY = event.pageY - state.dragging.dragStartY;

      if(state.rotation == 0) {
        state.posX = state.dragging.posStartX + diffX;
        state.posY = state.dragging.posStartY + diffY;
      } else if(state.rotation == 90) {
        state.posX = state.dragging.posStartX + diffY;
        state.posY = state.dragging.posStartY - diffX;
      } else if(state.rotation == 180) {
        state.posX = state.dragging.posStartX - diffX;
        state.posY = state.dragging.posStartY - diffY;
      } else if(state.rotation == 270) {
        state.posX = state.dragging.posStartX - diffY;
        state.posY = state.dragging.posStartY + diffX;
      }
      enforcePositions();
      redraw();
    } else if(state.cropping) {
      $("#cropper").show()
      state.cropping.dragEndX = event.pageX;
      state.cropping.dragEndY = event.pageY;
      boundingBox(state.cropping);
    }
  }).bind('mouseup touchup', function(event) {
    stopDrag();
  }).bind('keydown', function(event) {
    if(event.keyCode == 27) {
      stopDrag(true);
    }
  });
  
  function stopDrag(cancel) {
    if(state.cropping && state.cropping.box && !cancel) {
      cropTo(state.cropping.box);
    }
    state.cropping = null;
    state.dragging = null;
    checkMode();
  }

  function boundingBox(cropping) {
    var offset = $("#pic").offset();
    var picMinX = Math.max(state.posX, 0) + offset.left;
    var picMinY = Math.max(state.posY, 0) + offset.top;
    var picWidth = (result.width * state.baseScaleX * state.zoom);
    var picHeight = (result.height * state.baseScaleY * state.zoom);
    var picMaxX = Math.min(state.posX + picWidth, result.width) + offset.left - 1;
    var picMaxY = Math.min(state.posY + picHeight, result.height) + offset.top - 1;
    var maxSize = Math.max(Math.abs(state.cropping.dragEndX - state.cropping.dragStartX), Math.abs(state.cropping.dragEndY - state.cropping.dragStartY));
    if(state.cropping.dragEndX < state.cropping.dragStartX) {
      if(state.cropping.dragEndY < state.cropping.dragStartY) {
        // top left
        maxSize = Math.min(maxSize, Math.abs(picMinY - state.cropping.dragStartY), Math.abs(picMinX - state.cropping.dragStartX));
      } else {
        // bottom left
        maxSize = Math.min(maxSize, Math.abs(picMaxY - state.cropping.dragStartY), Math.abs(picMinX - state.cropping.dragStartX));
      }
    } else {
      if(state.cropping.dragEndY < state.cropping.dragStartY) {
        // top right
        maxSize = Math.min(maxSize, Math.abs(picMinY - state.cropping.dragStartY), Math.abs(picMaxX - state.cropping.dragStartX));
      } else {
        // bottom right
        maxSize = Math.min(maxSize, Math.abs(picMaxY - state.cropping.dragStartY), Math.abs(picMaxX - state.cropping.dragStartX));
      }
    }
    var $cropper = $("#cropper");
    var x = state.cropping.dragStartX;
    var y = state.cropping.dragStartY;
    if(state.cropping.dragStartX > state.cropping.dragEndX) {
      x = state.cropping.dragStartX - maxSize;
    }
    if(state.cropping.dragStartY > state.cropping.dragEndY) {
      y = state.cropping.dragStartY - maxSize;
    }
    state.cropping.box = {
      x: (x - offset.left) * result.factorX,
      y: (y - offset.top) * result.factorY,
      size: maxSize
    }
    $cropper.css({
      'left': x,
      'top': y,
      'width': maxSize,
      'height': maxSize
    });
  }

  function cropTo(box) {
    var offset = $("#pic").offset();
    var pctOffsetX = (box.x - state.posX) / (result.width * state.baseScaleX * state.zoom);
    var pctOffsetY = (box.y - state.posY) / (result.height * state.baseScaleY * state.zoom);
    // Assumes a square canvas
    var pct = box.size / result.width;
    state.zoom = state.zoom / pct;
    state.scaleX = state.baseScaleX * state.zoom;
    state.scaleY = state.baseScaleY * state.zoom;
    var picWidth = (result.width * state.baseScaleX * state.zoom);
    var picHeight = (result.height * state.baseScaleY * state.zoom);
    state.posX = picWidth * pctOffsetX * -1;
    state.posY = picHeight * pctOffsetY * -1;
    redraw();
  }

  function enforcePositions() {
    var picWidth = (canvas.width * state.baseScaleX * state.zoom);
    var leftoverX = (canvas.width - picWidth) / 2;
    var minX = (picWidth > canvas.width ? 0 : leftoverX) + (canvas.width / 3);
    var maxX = (picWidth > canvas.width ? (canvas.width - picWidth) : leftoverX) - (canvas.width / 3);

    var picHeight = (canvas.height * state.baseScaleY * state.zoom);
    var leftoverY = (canvas.height - picHeight) / 2;
    var minY = (picHeight > canvas.height ? 0 : leftoverY) + (canvas.height / 3);
    var maxY = (picHeight > canvas.height ? (canvas.height - picHeight) : leftoverY) - (canvas.height / 3);
    state.posX = Math.max(Math.min(state.posX, minX), maxX);
    state.posY = Math.max(Math.min(state.posY, minY), maxY);
  }
  
  function rotate(action) {
    state.rotation = state.rotation || 0;
    state.rotation = (state.rotation + 90) % 360;
    if(action === false) { state.rotation = 0; }
    redraw();
  }

  function zoom(direction) {
    var zoomDelta = 0.5;
    var picWidth = (canvas.width * state.baseScaleX * state.zoom);
    var picHeight = (canvas.height * state.baseScaleY * state.zoom);
    var centerPctX = ((canvas.width / 2) - state.posX) / picWidth;
    var centerPctY = ((canvas.height / 2) - state.posY) / picHeight;
    if(direction == 'in') {
      state.zoom = state.zoom * (1 + zoomDelta);
      state.scaleX = state.baseScaleX * state.zoom;
      state.scaleY = state.baseScaleY * state.zoom;
      picWidth = (canvas.width * state.baseScaleX * state.zoom);
      picHeight = (canvas.height * state.baseScaleY * state.zoom);
      state.posX = (canvas.width / 2) - (picWidth * centerPctX);
      state.posY = (canvas.height / 2) - (picHeight * centerPctY);
    } else {
      state.zoom = Math.max(state.zoom / (1 + zoomDelta), 0.3);
      state.scaleX = state.baseScaleX * state.zoom, state.baseScaleX;
      state.scaleY = state.baseScaleY * state.zoom, state.baseScaleY;
      picWidth = (canvas.width * state.baseScaleX * state.zoom);
      picHeight = (canvas.height * state.baseScaleY * state.zoom);
      state.posX = (canvas.width / 2) - (picWidth * centerPctX);
      state.posY = (canvas.height / 2) - (picHeight * centerPctY);
    }
    enforcePositions();
    redraw();
  }

  function reverse(force) {
    state.reversed = (force === undefined) ? !state.reversed : force;
    $("a[href='#reverse']").toggleClass('btn-primary', !!state.reversed);
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

  function redraw() {
    // console.log(state);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.save()
    context.beginPath();
    if(state.fill) {
      context.fillStyle = "rgb(" + state.fill.red + "," + state.fill.green + "," + state.fill.blue + ")";
    } else {
      context.fillStyle = '#fff';
    }
    if(state.shape == 'crest') {
      // bouncy shield
      var left = canvas.width / 20;
      var right = canvas.width * 19 / 20;
      var top = canvas.height / 10;
      var tippy_top = canvas.height / 30;
      var middle = canvas.width / 2;
      var bottom = canvas.height * 19 / 20;
      var arc = canvas.width / 6;
      context.moveTo(left, top);
      context.quadraticCurveTo((left + middle) / 2, top + arc, middle, tippy_top);
      context.quadraticCurveTo((right + middle) / 2, top + arc, right, top);
      context.quadraticCurveTo(((right + middle) / 2) + arc, ((top + bottom) / 2) + arc, middle, bottom);
      context.quadraticCurveTo(((left + middle) / 2) - arc, ((top + bottom) / 2) + arc, left, top);
    } else if(state.shape == 'shield') {
      // simple shield
      var left = canvas.width / 20;
      var right = canvas.width * 19 / 20;
      var top = canvas.height / 7;
      var middle = canvas.width / 2;
      var bottom = canvas.height * 19 / 20;
      var arc = canvas.width / 6;
      context.moveTo(left, top);
      context.quadraticCurveTo(middle, top - arc, right, top);
      context.quadraticCurveTo(((right + middle) / 2) + arc, ((top + bottom) / 2) + arc, middle, bottom);
      context.quadraticCurveTo(((left + middle) / 2) - arc, ((top + bottom) / 2) + arc, left, top);
    } else if(state.shape == 'hexagon') {
      // hexagon
      var middle = canvas.width / 2;
      var left = canvas.width / 15;
      var right = canvas.width * 14 / 15;
      var top =  canvas.height / 50;
      var upper = canvas.height * 2.5 / 10;
      var lower = canvas.height * 7.5 / 10;
      var bottom = canvas.height * 49 / 50;
      var arc = canvas.width / 30;
      context.moveTo(middle, top);
      context.lineTo(right, upper);
      context.lineTo(right, lower);
      context.lineTo(middle, bottom);
      context.lineTo(left, lower);
      context.lineTo(left, upper);
      context.lineTo(middle, top);
    } else if(state.shape == 'square') {
      // rounded rectangle
      var left = canvas.width / 10;
      var right = canvas.width * 9 / 10;
      var top = canvas.height / 10;
      var bottom = canvas.height * 9 / 10;
      var arc = canvas.width / 30;
      context.moveTo(left + arc, top);
      context.lineTo(right - arc, top);
      context.arcTo(right, top, right, top + arc, arc);
      context.lineTo(right, bottom - arc);
      context.arcTo(right, bottom, right - arc, bottom, arc);
      context.lineTo(left + arc, bottom);
      context.arcTo(left, bottom, left, bottom - arc, arc);
      context.lineTo(left, top + arc);
      context.arcTo(left, top, left + arc, top, arc);
      context.stroke();
    } else {
      // circle
      context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2.2, 0, 2*Math.PI);
    }
    context.fill();
    context.clip();
    context.drawImage(img, state.posX, state.posY, canvas.width * state.scaleX, canvas.height * state.scaleY);

    context.lineWidth = canvas.width / 8.5;
    if(state.border) {
      context.strokeStyle = "rgb(" + state.border.red + "," + state.border.green + "," + state.border.blue + ")";
    } else {
      context.strokeStyle = '#000';
    }
    context.stroke();
    if(state.border) {
      context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    } else {
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    }
    context.stroke()
    
    context.lineWidth = canvas.width / 10;
    if(state.border) {
      context.strokeStyle = "rgb(" + state.border.red + "," + state.border.green + "," + state.border.blue + ")";
    } else {
      context.strokeStyle = '#000';
    }
    context.stroke();
    
    context.lineWidth = canvas.width / 50;
    if(state.border) {
      context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    } else {
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    }
    context.stroke()
    context.restore();

    try {
      $("#pic").attr('src', canvas.toDataURL());
    } catch(e) {
      alert("Image failed to load correctly. Some browsers do not support editing all types of images (such as .svg files).");
      console.log(e);
    }
  }
})();