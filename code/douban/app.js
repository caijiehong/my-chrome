require.config({
    paths: {
        jquery: '../lib/jquery-2.0.3.min'
    }
});
require(['jquery'], function () {
    console.clear();
    var douList = function () {
        var r = /\/doulist\/(\d+)/
        var listId = r.exec(window.location.href)[1];
        var that = {};
        var addMovie = that.addMovie = function (movieId) {
            $.post('/j/doulist/' + listId + '/additem', {sid: movieId, ck: 'SamK'});
        }

        var deleteMovie = that.deleteMovie = function (movieId) {
            $.get('/doulist/' + listId + '/?delete=' + movieId + '&ck=SamK');
        }

        var movieList = that.movieList = [];
        var regMovieUrl = /movie\.douban\.com\/subject\/(\d+)\//;
        var regMovieItem = /id="sb(\d+)"\s*class="ul"/g;
        var douSize = 25;

        that.loadFullList = function (start) {
            var def = $.Deferred()
            start = start || 0;
            $.get('/doulist/' + listId + '/?start=' + start).done(function (html) {
                var r, l = 0;
                while (r = regMovieItem.exec(html)) {
                    movieList.push(r[1]);
                    l++;
                }
                if (l === douSize) {
                    that.loadFullList(start + douSize);
                } else {
                    def.resolve();
                }
            });

            return def.promise();
        }

        return that;
    }

    window.douList = douList();
});