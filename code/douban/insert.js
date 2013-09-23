(function (window, chrome) {
    var document = window.document;
    var script = document.createElement('script');
    script.setAttribute('src', chrome.extension.getURL('./lib/require.js'));
    script.setAttribute('data-main', chrome.extension.getURL('./douban/app.js'))

    document.body.appendChild(script);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){

        if (xhr.readyState == 4) {
            var html = xhr.responseText;
            var reg = /href="\/title\/tt(\d+)\/"/g, r, top250 = [];
            while(r = reg.exec(html)){
                top250.push(r[1]);
            }
        }

    };
    xhr.open("GET", 'http://www.imdb.com/chart/top', true);
    xhr.send();

})(window, chrome);