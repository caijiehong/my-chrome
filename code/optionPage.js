// Generated by CoffeeScript 1.6.3
(function() {
  window.addEventListener('load', function() {
    return chrome.runtime.getBackgroundPage(function(bgPage) {
      var ar, html, i, url;
      ar = bgPage.urlToBlock.get();
      html = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = ar.length; _i < _len; i = ++_i) {
          url = ar[i];
          _results.push("<tr><td>1</td><td style='tex-align:center'><a href='#'>[Delete]</a></td><td class='tdUrl'>" + url + "</td></tr>");
        }
        return _results;
      })();
      document.getElementById('tbody1').innerHTML = html.join('');
      return $('a').click(function() {
        var td;
        td = $(this).parents('tr').find('.tdUrl')[0];
        $(td).parents('tr').remove();
        return bgPage.urlToBlock.remove(td.innerHTML);
      });
    });
  });

}).call(this);