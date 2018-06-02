(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['symbol_result'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span class=\"result\" data-symbol_key=\""
    + alias4(((helper = (helper = helpers.symbol_key || (depth0 != null ? depth0.symbol_key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"symbol_key","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <span class=\"img_holder\">\n    <a href=\""
    + alias4(((helper = (helper = helpers.details_url || (depth0 != null ? depth0.details_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"details_url","hash":{},"data":data}) : helper)))
    + "\"><img src=\""
    + alias4(((helper = (helper = helpers.image_url || (depth0 != null ? depth0.image_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class='fit_image'/></a>\n  </span>\n  <a href=\""
    + alias4(((helper = (helper = helpers.details_url || (depth0 != null ? depth0.details_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"details_url","hash":{},"data":data}) : helper)))
    + "\" class=\"name\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a> \n  <span class=\"meta\">"
    + alias4(((helper = (helper = helpers.repo_key || (depth0 != null ? depth0.repo_key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"repo_key","hash":{},"data":data}) : helper)))
    + ", "
    + alias4(((helper = (helper = helpers.license || (depth0 != null ? depth0.license : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"license","hash":{},"data":data}) : helper)))
    + "</span>\n</span>";
},"useData":true});
})();