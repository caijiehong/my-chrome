// Generated by CoffeeScript 1.6.3
(function() {
  window.addEventListener('load', function() {
    return document.getElementById('btnSave').addEventListener('click', function() {
      return chrome.runtime.getBackgroundPage(function(bgPage) {
        var url;
        url = document.getElementById('txtIn').value.trim();
        if (url) {
          bgPage.urlToBlock.add(url);
        }
        window.close();
        return true;
      });
    });
  });

}).call(this);