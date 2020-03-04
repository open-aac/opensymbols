(function() {
  document.getElementById('token').value = token;
  $(".submit").click(function(event) {
    var $base = $(this).closest('.api_holder');
    event.preventDefault();
    $base.find(".results_holder").show();
    $base.find(".results").text("Loading Response...");
    var url = $base.find(".submit").attr('rel');
    var method = $base.find(".submit").hasClass('post') ? 'POST' : 'GET';
    var data = {};
    if(method == 'POST') {
      $base.find("input").each(function() {
        if($(this).val() != '') {
          data[$(this).attr('name')] = $(this).val();
        }
      }); 
    } else {
      var opts = [];
      $base.find("input").each(function() {
        if($(this).val() != '') {
          opts.push(encodeURIComponent($(this).attr('name')) + "=" + encodeURIComponent($(this).val()));
        }
      }); 
      if(opts.length > 0) {
        url = url + "?" + opts.join('&');
      }
    }
    session.ajax({
      url: url,
      data: data,
      type: method,
      dataType: 'json',
      success: function(data) {
        var str = "HTTP 200\n";
        if(url == "/api/v2/token" && data.access_token) {
          $(".access_token").each(function() {
            $(this).val(data.access_token);
          })
        }
        str = str + JSON.stringify(data, true, 2);
        $base.find(".results_holder").show();
        $base.find(".results").text(str);
      },
      error: function(xhr) {
        var str = "HTTP " + xhr.status + "\n";
        var json = null;
        try {
          json = JSON.parse(xhr.responseText);
        } catch(e) { }
        if(json) {
          str = str + JSON.stringify(json, true, 2);
        } else {
          str = str + xhr.responseText;
        }
        $base.find(".results_holder").show();
        $base.find(".results").text(str);
      }
    });

  });
})();