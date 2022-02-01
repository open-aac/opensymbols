(function() {
  var lastImageData = null;
  var lastImageURL = null;
  function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
  if(!isCanvasSupported()) {
    $("#edit").hide();
  }
  
  session.getJSON('/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key, function(data) {
    symbol = data.symbol;
    if(localStorage.last_locale) {
      $("#symbol_locale").val(localStorage.last_locale);
    }
    $("#symbol_reload").click();
  });

  $("#symbol_reload").click(function(event) {
    event.preventDefault();
    var locale = $("#symbol_locale").val()
    localStorage.last_locale = locale;
    var localized = (symbol && symbol.locales && symbol.locales[locale]) || {};
    $("#symbol_name").val(symbol.locales[locale].name || symbol.name);
    $("#symbol_description").val(symbol.locales[locale].description || symbol.description);
    $("#boosts").empty();
    $("#defaults").empty();
    $("#uses").empty();
    if(localized.boosts) {
      for(var keyword in localized.boosts) {
        if(keyword && localized.boosts[keyword]) {
          var $div = $("<div/>", {class: 'keyword'});
          var $name = $("<span/>");
          $name.text(keyword + " (" + localized.boosts[keyword] + ")");
          var $a = $("<a/>", {href: '#'});
          $a.text("×");
          $a.click(function(event) {
            event.preventDefault();
            boost_keyword("del:" + keyword);
          });
          $div.append($name);
          $div.append($a);
          $("#boosts").append($div);
        }
      }
    }
    if(localized.defaults) {
      localized.defaults.forEach(function(def) {
        var $div = $("<div/>", {class: 'keyword'});
        var $name = $("<span/>");
        $name.text(def);
        var $a = $("<a/>", {href: '#'});
        $a.text("×");
        $a.click(function(event) {
          event.preventDefault();
          default_keyword("del:" + def)
        });
        $div.append($name);
        $div.append($a);
        $("#defaults").append($div);
      });
    }
  });
  $("#symbol_locale").change(function() {
    $("#symbol_reload").click();
  })

  $("#update_symbol").click(function(event) {
    event.preventDefault();
    session.ajax({
      url: '/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key,
      data: {
        locale: $("#symbol_locale").val(),
        name: $("#symbol_name").val(),
        description: $("#symbol_description").val()
      },
      type: 'PUT',
      success: function(data) {
        symbol = data.symbol;
        $("#symbol_reload").click();
      },
      error: function() {
        alert('update failed');
      }
    })
  });

  var boost_keyword = function(keyword) {
    session.ajax({
      url: '/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key + '/boost',
      data: {
        locale: $("#symbol_locale").val(),
        keyword: keyword
      },
      type: 'POST',
      success: function(data) {
        symbol = data.symbol;
        $("#symbol_reload").click();
      },
      error: function() {
        alert('boost failed');
      }
    });
  };
  $("#boost").click(function(event) {
    event.preventDefault();
    boost_keyword($("#boost_keyword").val());
  });

  var default_keyword = function(keyword) {
    session.ajax({
      url: '/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key + '/default',
      data: {
        locale: $("#symbol_locale").val(),
        keyword: keyword
      },
      type: 'POST',
      success: function(data) {
        symbol = data.symbol;
        $("#symbol_reload").click();
      },
      error: function() {
        alert('setting default failed');
      }
    });
  };
  $("#default").click(function(event) {
    event.preventDefault();
    default_keyword($("#default_keyword").val());
  });

  $("#search").click(function(event) {
    event.preventDefault();
    var term = $("#search_term").val();
    if(term) {
      $("#search_results").empty();
      session.getJSON("/api/v1/symbols/search?q=" + term, function(data) {
        results = data;
        for(var idx in data) {
          var symbol = data[idx];
          if(symbol.image_url && symbol.image_url.match(/^\//)) {
            data[index].image_url = "https://s3.amazonaws.com/" + S3Bucket + symbol.image_url;
          }
          var template = Handlebars.templates['symbol_result'](symbol);
          $("#search_results").append(template);
        }
      }).fail(function() {
        alert('search failed!');
      });
    }
  });
  $("#skin").change(function(event) {
    var has_skin = $("#skin")[0].checked;
    session.ajax({
      url: '/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key + '/skin',
      data: {has_skin: has_skin},
      type: 'POST',
      dataType: 'json',
      success: function(data) {
      },
      error: function(xhr) {
        alert('Error updating symbol settings');
      }
    });
  })
  $("#safe").change(function(event) {
    var safe = $("#safe")[0].checked;
    session.ajax({
      url: '/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key + '/safe',
      data: {safe: safe},
      type: 'POST',
      dataType: 'json',
      success: function(data) {
      },
      error: function(xhr) {
        alert('Error updating symbol settings');
      }
    });
  })

  $("#edit").click(function(event) {
    event.preventDefault();
    $(this).text("Loading Editor...");
    session.ajax({
      type: 'GET',
      url: "/api/v1/symbols/proxy?url=" + encodeURIComponent($("#symbol").attr('src')),
      success: function(data) {
        $("#edit").hide()
        $("#badge").hide();
        $("#editor").remove();
        var $editor = $("<iframe/>", {id: 'editor', src: '/editor', style: 'width: 400px; height: 225px;', frameborder: 0});
        $("#symbol").after($editor);
        $("#symbol").hide();
        lastImageData = data.data;
      }, error: function(xhr, status) {
        $("#edit").text("Editor Load Failed");
      },
      dataType: "json"
    });
  });
  
  $("#badge").click(function(event) {
    event.preventDefault();
    $(this).text("Loading Badge Maker...");
    $("#edit").hide()
    $("#badge").hide();
    $("#badge_maker").remove();
    var $editor = $("<iframe/>", {id: 'badge_maker', src: '/badge_maker', style: 'width: 465px; height: 280px;', frameborder: 0});
    $("#symbol").after($editor);
    $("#symbol").hide();
    lastImageURL = $("#symbol").attr('src');
  });

  $(window).bind('message', function(event) {
    event = event.originalEvent;
    if(event.data == 'imageDataRequest') {
      event.source.postMessage(lastImageData, '*');
    } else if(event.data == 'imageURLRequest') {
      event.source.postMessage(lastImageURL, '*');
    }
  });
})();