var session;
(function() {
  session = {
    pends: [],
    init: function() {
      var token = localStorage.auth_token;
      if(token) {
        $.getJSON('/api/v1/token_check?token=' + encodeURIComponent(token), function(data) {
          if(data.valid) {
            $(".authenticated").show();
            $(".not_authenticated").hide();
            $(".user_name").text(data.user_name);
            if(data.refresh_token) {
              localStorage.auth_token = data.refresh_token;
            }
            document.cookie = "auth=" + localStorage.auth_token;
            session.ready = true;
            session.pends.forEach(function(p) { $.ajax(p); });
          } else {
            session.invalidate();
          }
        });
      } else {
        session.ready = true;
        session.pends.forEach(function(p) { $.ajax(p); });
      }
    },
    authorize: function(token) {
      localStorage.auth_token = token;
      document.cookie = "auth=" + localStorage.auth_token;
      location.href = '/';
    },
    invalidate: function() {
      localStorage.removeItem('auth_token');
      document.cookie = "auth=";
      location.href = "/";
    },
    getJSON: function(url, callback) {
      return session.ajax({
        dataType: 'json',
        url: url,
        success: callback
      })
    },
    ajax: function(opts) {
      opts.dataType = opts.dataType || 'json';
      if(localStorage.auth_token) {
        opts.headers = opts.headers || {};
        opts.headers['Authorization'] = localStorage.auth_token;
      }
      if(!session.ready) {
        session.pends.push(opts);
        return {
          fail: function(callback) {
            opts.error = callback;
          },
          success: function(callback) {
            opts.success = callback;
          }
        };
      } else {
        return $.ajax(opts);
      }
    }
  };
  $(".authenticated").hide();
  $(".not_authenticated").show();
  $(".logout").click(function(event) {
    event.preventDefault();
    session.invalidate();
  });
  session.init();
})();