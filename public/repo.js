(function() {
  var repo_key = $("#symbols").attr('data-repo_key');
  function load_symbols() {
    if(!load_symbols.next_url) {
      load_symbols.next_url = "/api/v1/repositories/" + repo_key + "/symbols";
    }
    $("#more_symbols").text("Loading More Symbols...").show();
    session.ajax({
      type: 'GET',
      url: load_symbols.next_url,
      success: function(data) {
        for(var idx = 0; idx < data.symbols.length; idx++) {
          var template = Handlebars.templates['symbol_result'](data.symbols[idx]);
          $("#symbols").append(template);
        }
        if(data.meta && data.meta.next_url) {
          load_symbols.next_url = data.meta.next_url;
          $("#more_symbols").text("More Symbols").show();
        } else {
          $("#more_symbols").hide();
        }
      }, error: function(xhr, status) {
        $("#more_symbols").text("Symbol Loading Failed").show();
      },
      dataType: "json"
    });
  };
  var repo = null;
  session.getJSON('/api/v2/repositories/' + repo_key, function(data) {
    repo = data.repository;
  })

  var word_idx = -1;
  $("#set_defaults").click(function(event) {
    event.preventDefault();
    word_idx = -1;
    $("#symbol_results").hide();
    $("#symbol_defaults").show();
    $("#defaults_review").hide();
    $("#default_locale").val('en');
    $("#next_word:visible").click();
  });
  $("#list").click(function(event) {
    event.preventDefault();
    $("#symbol_results").show();
    $("#symbol_defaults").hide();
    $("#defaults_review").hide();
  });

  var known_defaults = {};
  $("#next_word,#previous_word").click(function(event) {
    event.preventDefault();
    var locale = $("#default_locale").val() || 'en';
    var total = 0;
    if(repo && repo.missing_core_words && repo.missing_core_words[locale]) {
      for(var key in repo.missing_core_words[locale]) {
        if(!known_defaults[repo.missing_core_words[locale][key]]) {
          total++;
        }
      }
      var list = repo.missing_core_words[locale];
      var num = event.target.id == 'next_word' ? 1 : -1;
      word_idx = Math.min(Math.max(word_idx + num, 0), list.length - 1);
      var word = list[word_idx];
      if(word) {
        $("#default_word").val(word || "???");
      }
    }
    $("#total_missing").text(total);
    $("#select").click();
  });
  $("#select").click(function(event) {
    event.preventDefault();
    var word = $("#default_word").val();
    if(!word) { 
      $("#symbol_default").hide();
      return; 
    } else {
      $("#symbol_default").show();
    }
    if(known_defaults[word]) {
      var symbol = known_defaults[word];
      if(symbol.image_url && symbol.image_url.match(/^\//)) {
        symbol.image_url = "https://s3.amazonaws.com/" + S3Bucket + symbol.image_url;
      }
      var template = Handlebars.templates['symbol_result'](symbol);
      $("#search_results").empty();
      $("#search_results").append(template);
      $("#search_results .result").css({float: 'none', display: 'inline-block'});
    } else {
      $("#word").text(word);
      $("#search_term").val(word);
      $("#search").click();  
    }
  });
  var search = function(term) {
    var search_success = function() { };
    var search_error = function() { };
    var done = false;
    var prom = {
      then: function(success, error) {
        if(done) {
          if(done == 'error') {
            error()
          } else {
            success(done);
          }
        } else {
          if(success) { search_success = success; }
          if(error) { search_error = error; }
        }
      }
    };
    session.getJSON("/api/v1/symbols/search?q=" + term, function(data) {
      done = data;
      search_success(data);
    }).fail(function() {
      search_error();
    });
    return prom;
  };
  $("#base_search_text").keydown(function(event) {
    if(event.keyCode == 13) {
      $("#base_search").click();
    }
  })
  $("#base_search").click(function(event) {
    event.preventDefault();
    var term = $("#base_search_text").val();
    if(term && term.length > 0) {
      term = term + " repo:" + repo_key;
      $("#symbols").empty().text("Loading results...");
      search(term).then(function(data) {
        $("#symbols").empty()
        for(var idx in data) {
          var symbol = data[idx];
          var template = Handlebars.templates['symbol_result'](symbol);
          $("#symbols").append(template);
        }
        if(data.length == 0) {
          $("#symbols").text("No results found");
        }
      }, function(err) {
        $("#symbols").text("Error retrieving results");
      })
    }
  });
  $("#clear_base_search").click(function(event) {
    event.preventDefault();
    $("#symbols").empty();
    load_symbols.next_url = null;
    load_symbols();
  });
  var results = [];
  $("#search_term").keydown(function(event) {
    if(event.keyCode == 13) {
      $("#search").click();
    }
  })
  $("#search").click(function(event) {
    event.preventDefault();
    var term = $("#search_term").val();
    if(term) {
      term = term + " repo:" + repo_key;
      $("#search_results").empty();
      search(term).then(function(data) {
        results = data;
        for(var idx in data) {
          var symbol = data[idx];
          if(symbol.image_url && symbol.image_url.match(/^\//)) {
            data[index].image_url = "https://s3.amazonaws.com/" + S3Bucket + symbol.image_url;
          }
          var template = Handlebars.templates['symbol_result'](symbol);
          $("#search_results").append(template);
        }
      }, function(err) {
        $("#search_results").text("Error retrieving results");
      })
    }
  });

  $("#search_results").on('click', '.result', function(event) {
    event.preventDefault();
    var id = $(event.target).closest('.result')[0].getAttribute('data-id');
    var key = $(event.target).closest('.result')[0].getAttribute('data-symbol_key');
    var result = results.find(function(r) { return r.id == id || r.symbol_key == key; });
    session.ajax({
      url: '/api/v2/symbols/' + result.repo_key + '/' + (result.symbol_key || result.id) + '/default',
      data: {keyword: $("#default_word").val(), locale: $("#default_locale").val()},
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        known_defaults[$("#default_word").val()] = data.symbol;
        $("#search_results").empty();
        var template = Handlebars.templates['symbol_result'](result);
        $("#search_results").append(template);
        $("#search_results .result").css({float: 'none', display: 'inline-block'});
      },
      error: function(xhr) {
        alert('Error selecting a favorite!');
      }
    });
  });

  $("#review_defaults").click(function(event) {
    event.preventDefault();
    $("#symbol_results").hide();
    $("#symbol_defaults").hide();
    $("#defaults_review").show();
    $("#review_locale").val('en');
    $("#review").click();
  });

  $("#review").click(function(event) {
    var locale = $("#review_locale").val();
    var localized = (repo && repo.default_core_words && repo.default_core_words[locale]) || {};
    if(localized && Object.keys(localized).length > 0) {
      $("#defaults").text("Loading...");
      session.ajax({
        url: '/api/v2/repositories/' + repo.repo_key + '/images',
        data: {
          keywords: Object.keys(localized),
          locale: locale
        },
        type: 'POST',
        success: function(data) {
          $("#defaults").empty();
          if(!data || data.length == 0) {
            $("#defaults").text("No Default Symbols found");
          } else {
            data.forEach(function(word) {
              if(word.image_url && word.image_url.match(/^\//)) {
                word.image_url = "https://s3.amazonaws.com/" + S3Bucket + word.image_url;
              }
              if(localized[word.keyword]) {
                var $word = $("<div/>", {class: 'default_word'});
                var $name = $("<span/>", {class: 'keyword'}).text(word.keyword);
                $name.click(function(event) {
                  location.href = "/symbols/" + repo.repo_key + "/" + word.symbol_key;
                });
                var $image = $("<img/>", {src: word.image_url});
                var $a = $("<a/>", {href: '#'}).text('×');
                $a.click(function(event) {
                  event.preventDefault();
                  session.ajax({
                    url: '/api/v2/symbols/' + repo.repo_key + '/' + word.symbol_key + '/default',
                    data: {
                      locale: locale,
                      keyword: "del:" + word.keyword
                    },
                    type: 'POST',
                    success: function(data) {
                      $word.detach();
                      delete known_defaults[word.keyword];
                      session.getJSON('/api/v2/repositories/' + repo_key, function(data) {
                        repo = data.repository;
                      })
                    },
                    error: function() {
                      alert('setting default failed');
                    }
                  });
                })
                $word.append($name);
                $word.append($image);
                $word.append($a);
                $("#defaults").append($word);
                // word.symbol_key
                // word.image_url
                // add the result, including an option to remove it
              }
            });
          }
        },
        error: function() {
          $("#defaults").text("Error loading images");
        }
      })
      for(var keyword in localized) {

      }
    } else {
      $("#defaults").text("No defaults set");
    }
  });
  
  $("#more_symbols").click(function(event) {
    event.preventDefault();
    load_symbols();
  });
  load_symbols();
})();