
window.addEventListener('load', function () {
    document.getElementById('btnSave').addEventListener('click', function () {
        var url = document.getElementById('txtIn').value;
        chrome.extension.sendMessage({ addADBlock: url });
        window.close();
    });

})

