(function () {
    var Uri, onTabsUpdated;

    onTabsUpdated = function (details) {
        console.log('onTabsUpdated:');
        console.log(details.url);
        return chrome.tabs.executeScript(details.tabId, {
            file: 'jsFileInsert.js'
        }, function () {
            return console.log('executeScript done');
        });
    };

    chrome.webNavigation.onCompleted.addListener(onTabsUpdated, {
        url: [
            {
                urlSuffix: 'js'
            }
        ]
    });


    chrome.webNavigation.onCompleted.addListener(function (details) {
        chrome.tabs.executeScript(details.tabId, {
            file: './douban/insert.js'
        }, function () {

        });
    }, {
//        url: [{urlMatches: /http:\/\/movie\.douban\.com\/doulist\/\d+\//}]
        url: [
            {pathPrefix: '/doulist/'}
        ]
    });

    Uri = function (url) {
        var ar, i, item, temp, _i, _len, _ref;
        this.protocol = url.match('.+://')[0];
        this.query = {};
        i = url.indexOf('/', this.protocol.length);
        if (i < 0) {
            this.host = url.substring(this.protocol.length);
            this.pathname = '/';
        } else {
            this.host = url.substring(this.protocol.length, i);
        }
        if (i + 1 === url.length) {
            this.pathname = '/';
        } else {
            temp = url.substring(i).split('?');
            this.pathname = temp[0];
        }
        if (temp.length) {
            ar = temp[1].split('&');
            _ref = temp[1].split('&');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                temp = item.split('=');
                this.query[temp[0]] = temp[1];
            }
        }
        return this;
    };

    this.urlToBlock = new (function () {
        var registerBlock, storageBlockUrlKey, syncValue, urlBlock, urlInStorage;
        storageBlockUrlKey = 'storageBlockUrlKey';
        urlInStorage = {};
        chrome.storage.sync.get([storageBlockUrlKey], function (data) {
            urlInStorage = data[storageBlockUrlKey] || {};
            return registerBlock();
        });
        chrome.storage.onChanged.addListener(function (changes) {
            var changed, key, storageChange;
            if (storageChange = changes[storageBlockUrlKey]) {
                console.log('storageChange', storageChange);
                changed = 0;
                for (key in urlInStorage) {
                    if (!(!storageChange.newValue[key])) {
                        continue;
                    }
                    changed = 1;
                    delete urlInStorage[key];
                }
                for (key in storageChange.newValue) {
                    if (!(!urlInStorage[key])) {
                        continue;
                    }
                    changed = 1;
                    urlInStorage[key] = 1;
                }
                if (changed) {
                    return syncValue(function () {
                        return console.log('sync', 'changed');
                    });
                }
            }
        });
        syncValue = function (callback) {
            return chrome.storage.sync.set({
                storageBlockUrlKey: urlInStorage
            }, callback);
        };
        this.add = function (url) {
            if (urlInStorage[url]) {
                return true;
            }
            urlInStorage[url] = 1;
            syncValue(function () {
                return console.log('add', "" + url);
            });
            return registerBlock();
        };
        this.remove = function (url) {
            if (!urlInStorage[url]) {
                return false;
            }
            delete urlInStorage[url];
            syncValue(function () {
                return function () {
                    return console.log('remove', "" + url);
                };
            });
            return registerBlock();
        };
        this.get = function () {
            var key;
            return (function () {
                var _results;
                _results = [];
                for (key in urlInStorage) {
                    _results.push(key);
                }
                return _results;
            })();
        };
        urlBlock = function (details) {
            return {
                cancel: true
            };
        };
        this.registerBlock = registerBlock = function () {
            var ar, key;
            chrome.webRequest.onBeforeRequest.removeListener(urlBlock);
            ar = (function () {
                var _results;
                _results = [];
                for (key in urlInStorage) {
                    _results.push(key);
                }
                return _results;
            })();
            if (ar && ar.length) {
                console.log('blocking', ar);
                return chrome.webRequest.onBeforeRequest.addListener(urlBlock, {
                    urls: ar
                }, ["blocking"]);
            } else {
                return chrome.webRequest.onBeforeRequest.removeListener(urlBlock);
            }
        };
        return this;
    })();

}).call(this);

/*
 //@ sourceMappingURL=even.map
 */
