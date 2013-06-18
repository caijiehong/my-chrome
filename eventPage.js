chrome.webNavigation.onCompleted.addListener(onTabsUpdated, {
    url: [{ urlSuffix: 'js' }]
});

function onTabsUpdated(details) {
    console.log('onTabsUpdated:')
    console.log(details.url);
    chrome.tabs.executeScript(details.tabId, { file: 'jsFileInsert.js' }, function () {
        console.log('executeScript done');
    });
}

function Uri(url) {
    this.protocol = url.match('.+://')[0];
    this.query = {};
    var i = url.indexOf('/', this.protocol.length);
    if (i < 0) {
        this.host = url.substring(this.protocol.length);
        this.pathname = '/';
    } else {
        this.host = url.substring(this.protocol.length, i);
        if (i + 1 == url.length) {
            this.pathname = '/';
        } else {
            var temp = url.substring(i).split('?');
            this.pathname = temp[0];
            if (temp.length > 1) {
                var ar = temp[1].split('&');
                for (var j = 0; j < ar.length; j++) {
                    var item = ar[j].split('=');
                    this.query[item[0]] = item[1];
                }
            }
        }
    }

    return this;
}


function urlBlock(details) {
    console.log('urlBlock', details);
    return { cancel: true };
}

chrome.extension.onMessage.addListener(function (message, sender) {
    if (message.addADBlock) {
        var url = message.addADBlock;
        chrome.storage.local.get([storageBlockUrlKey], function (storage) {
            var storageBlockUrl = storage[storageBlockUrlKey];
            if (storageBlockUrl && storageBlockUrl.length > 0) {
                for (var i = 0; i < storageBlockUrl.length; i++) {
                    if (storageBlockUrl[i] == url) return;
                }
            } else {
                storageBlockUrl = [];
            }
            storageBlockUrl.push(url);
            chrome.storage.local.set({ storageBlockUrlKey: storageBlockUrl });
            chrome.webRequest.onBeforeRequest.removeListener(urlBlock);
            registerBlock(storageBlockUrl);
        });
    } else if (message.removeADBlock) {

        var url = message.removeADBlock;

        chrome.storage.local.get([storageBlockUrlKey], function (storage) {
            var storageBlockUrl = storage[storageBlockUrlKey];
            var index = -1;
            if (storageBlockUrl && storageBlockUrl.length > 0) {
                for (var i = 0; i < storageBlockUrl.length; i++) {
                    if (storageBlockUrl[i] == url) {
                        index = i;
                        break;
                    }
                }
            }
            if (index > -1) {
                storageBlockUrl.splice(index, 1);
                chrome.storage.local.set({ storageBlockUrlKey: storageBlockUrl });
                chrome.webRequest.onBeforeRequest.removeListener(urlBlock);
                if (storageBlockUrl.length > 0) {
                    registerBlock(storageBlockUrl);
                }
            }
        });
    }
});

function registerBlock(urlArrayToBlock) {
    chrome.webRequest.onBeforeRequest.addListener(
          urlBlock,
          { urls: urlArrayToBlock },
          ["blocking"]);
}

var storageBlockUrlKey = 'storageBlockUrlKey';
chrome.storage.local.get([storageBlockUrlKey], function (storage) {
    var storageBlockUrl = storage[storageBlockUrlKey];
    if (storageBlockUrl && storageBlockUrl.length > 0) {
        registerBlock(storageBlockUrl);
    }
});

