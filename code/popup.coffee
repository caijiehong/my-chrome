window.addEventListener 'load',  () ->

  document.getElementById('btnSave').addEventListener 'click',  () ->
    chrome.runtime.getBackgroundPage (bgPage)->
      url = document.getElementById('txtIn').value.trim()
      bgPage.urlToBlock.add url if url

      window.close()

      return true
