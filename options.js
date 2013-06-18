window.addEventListener('load', function () {

    var storageBlockUrlKey = 'storageBlockUrlKey';
    chrome.storage.local.get([storageBlockUrlKey], function (storage) {
        var storageBlockUrl = storage[storageBlockUrlKey];
        console.log('storageBlockUrl', storageBlockUrl);

        if (storageBlockUrl && storageBlockUrl.length) {
            var html = [];
            for (var i = 0; i < storageBlockUrl.length; i++) {
                html.push('<tr>');
                html.push('<td>' + (i + 1) + '</td>');
                html.push('<td style="tex-align:center"><a href="#">[Delete]</a></td>');
                html.push('<td class="tdUrl">' + storageBlockUrl[i] + '</td>');
                html.push('</tr>');
            }
            document.getElementById('tbody1').innerHTML = html.join('');

            $('a').click(function () {
                var td = $(this).parents('tr').find('.tdUrl')[0];
                $(td).parents('tr').remove();
                chrome.extension.sendMessage({ removeADBlock: td.innerHTML });

            });
        }
    });
});