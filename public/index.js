(function() {
  function loadExamples() {
    $("#examples").text("Loading...");
    session.getJSON("/api/v1/symbols/random", function(data) {
      $("#examples").empty();
      for(var idx in data) {
        var symbol = data[idx];
        $("#examples").append(Handlebars.templates['symbol_result'](symbol));
      }
    }).fail(function() {
      $("examples").text("Loading failed :-(");
    });
  }
  loadExamples();
  $("#more_examples").click(function(event) {
    event.preventDefault();
    loadExamples();
  });
  $("#clear").click(function() {
    if(history && history.pushState) {
      history.pushState({query: ""}, "Home", "/");  
    }
    clearSearch();
  });
  $("#add_symbol").click(function(event) {
    event.preventDefault();
    $("#add_symbol_holder").hide();
    $("#request_symbol_form").show();
    $("#symbol_name").val($("#query").val());
    $("#request_symbol_form").find(".btn-primary").text("Request Symbol");
  });
  $("#cancel_symbol_request").click(function(event) {
    event.preventDefault();
    $("#add_symbol_holder").show();
    $("#request_symbol_form").hide();
  });
  $("#request_symbol_form").submit(function(event) {
    event.preventDefault();
    var params = $(this).serializeArray();
    params.push({'name': 'rand', 'value': Math.random().toString()});
    $(this).find(".btn-primary").text("Requesting Symbol...");
    session.ajax({
      url: $(this).attr('action'),
      data: params,
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        alert("Symbol request submitted! Thank you!");
        $("#request_symbol_form").find(".btn-primary").text("Request Symbol");
        $("#cancel_symbol_request").click();
      },
      error: function(xhr) {
        $("#request_symbol_form").find(".btn-primary").text("Request Failed");
      }
    });
  });
  $(document).ready(function() {
    loadFromState(parseArgsToState());
  });
  function parseArgsToState() {
    var query = location.search.split(/\?/)[1] || "";
    var args = query.split(/&/);
    var hash = {};
    for(var idx in args) {
      var pieces = args[idx].split(/=/);
      if(pieces.length == 2) {
        hash[decodeURIComponent(pieces[0])] = decodeURIComponent(pieces[1]);
      }
    }
    return {query: hash.q};
  }
  $(window).bind('popstate', function(event) {
    var state = event.state || parseArgsToState();
    if(state) {
      loadFromState(state);
    }
  });
  function loadFromState(state) {
    if(state.query) {
      search(state.query);
    } else {
      clearSearch();
    }
  };

  function clearSearch() {
    search.lastQuery = "";
    $("#query").val("");
    $("#examples_holder").show();
    $("#search_holder").removeClass('span12').addClass('span6');
    $("#message").show();
    $("#results").hide();
    $("#request_symbol").hide();
    search.query = null;
  }
  function search(query, force) {
    if(query == search.lastQuery && !force) { return; }
    search.lastQuery = query;
    $("#query").val(query);
    $("#results").text("Searching...");
    $("#message").hide();
    $("#results").show();
    var queryCode = query + Math.random();
    search.loadedQuery = "";
    var extraResults = null;
    function appendResults(queryCode, results, pre) {
      if(queryCode == 'error') {
        search.loadedQuery = error;
        $("#results").text("Search failed :-(");
      }
      if(search.loadedQuery == 'error') {
        return;
      } else if(search.loadedQuery != queryCode) {
        search.loadedQuery = queryCode;
        $("#search_holder").removeClass('span6').addClass('span12');
        $("#examples_holder").hide();
        $("#results").empty();
        $("#google_image_search").attr('href', 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(query) + "&tbs=sur:fc&imgdii=_");
        $("#flickr_search").attr('href', 'http://www.flickr.com/search/?l=cc&ct=0&mt=all&adv=1&q=' + encodeURIComponent(query));
        $("#add_symbol_holder").show();
        $("#request_symbol").show();
        $("#request_symbol_form").hide();
      }
      var $first = $("#results .result:first");
      for(var idx in results) {
        var symbol = results[idx];
        var template = Handlebars.templates['symbol_result'](symbol);
        if(pre && $first.length) {
          $first.before(template)
        } else {
          $("#results").append(template);
        }
      }
    }
    search.query = query;
    session.getJSON("/api/v1/symbols/search?q=" + query, function(data) {
      for(var idx in data) {
        var symbol = data[idx];
        if(symbol.image_url && symbol.image_url.match(/^\//)) {
          data[index].image_url = "https://s3.amazonaws.com/" + S3Bucket + symbol.image_url;
        }
      }
      appendResults(queryCode, data, true);
    }).fail(function() {
      appendResults("error");
    });
  }
  $("#search").submit(function(event) {
    event.preventDefault();
    var query = $("#query").val()
    if(history && history.pushState) {
      history.pushState({query: query}, "Search", "/search?q=" + encodeURIComponent(query));
    }
    search(query, true);
  });
})();