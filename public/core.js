(function() {
  function load_symbols(term) {
    var locale = $("#locale").val();
    var list = core[locale];
    if(term !== true) {
      list = [term];
    }
    $("#results").empty();
    var lookups = [];
    list.forEach(function(word) {
      var $term = $("<div/>", {class: 'term'});
      var $word = $("<span/>", {class: 'word'});
      $word.text(word);
      var $list = $("<span/>", {class: 'list'});
      $term.append($word);
      $term.append($list);
      $("#results").append($term);
      var search = function(done_callback) {
        $list.text("Loading...");
        session.ajax({
          type: 'GET',
          url: "/api/v1/symbols/search?q=" + word,
          success: function(data) {
            $list.empty();
            data.slice(0, 10).forEach(function(symbol) {
              var $img = $("<img/>", {id: "s" + symbol.id, src: symbol.image_url});
              $list.append($img);
              $img.click(function(event) {
                event.preventDefault();
                $list.empty();
                session.ajax({
                  url: '/api/v2/symbols/' + symbol.repo_key + '/' + symbol.symbol_key + '/boost',
                  data: {
                    value: 10,
                    locale: locale,
                    keyword: word
                  },
                  type: 'POST',
                  success: function(data) {
                    search(function() { });
                  },
                  error: function() {
                    alert('boost failed');
                  }
                });
              });
            });
            done_callback();
          }, error: function(xhr, status) {
            $list.text("Error loading");
            done_callback();
          },
          dataType: "json"
        });
      }
      lookups.push(search);
    });
    var next_batch = function() {
      var dones = 0;
      var batch_size = 5;
      for(var idx = 0; idx < batch_size && lookups.length > 0; idx++) {
        (lookups.shift())(function() {
          dones++;
          if(dones >= batch_size) {
            setTimeout(next_batch, 500);
          }
        });
      }
    };
    next_batch();
  };
  $("#clear_base_search").click(function(event) {
    event.preventDefault();
    $("#symbols").empty();
    load_symbols.next_url = null;
    load_symbols(true);
  });
  $("#base_search_text").keydown(function(event) {
    if(event.keyCode == 13) {
      $("#base_search").click();
    }
  })
  $("#base_search").click(function(event) {
    event.preventDefault();
    var term = $("#base_search_text").val();
    if(term && term.length > 0) {
      load_symbols(term);
    }
  });
})();