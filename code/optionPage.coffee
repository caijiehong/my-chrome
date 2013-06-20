window.addEventListener 'load', () ->
  chrome.runtime.getBackgroundPage (bgPage)->

    ar = bgPage.urlToBlock.get()

    html = (
      for url, i in ar
        "<tr><td>1</td><td style='tex-align:center'><a href='#'>[Delete]</a></td><td class='tdUrl'>#{url}</td></tr>"
    )

    document.getElementById('tbody1').innerHTML = html.join('')

    $('a').click () ->
      td = $(this).parents('tr').find('.tdUrl')[0];
      $(td).parents('tr').remove()
      bgPage.urlToBlock.remove td.innerHTML
