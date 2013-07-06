onTabsUpdated = (details) ->
  console.log('onTabsUpdated:')
  console.log(details.url)
  chrome.tabs.executeScript details.tabId, { file: 'jsFileInsert.js' },  () -> console.log('executeScript done')

chrome.webNavigation.onCompleted.addListener onTabsUpdated, {url: [{ urlSuffix: 'js' }]}

Uri = (url) ->
  @.protocol = url.match('.+://')[0]
  @.query = {}
  i = url.indexOf('/', @.protocol.length)
  if (i < 0)
    @.host = url.substring(@.protocol.length)
    @.pathname = '/'
  else
    @.host = url.substring(@.protocol.length, i)
  if (i + 1 == url.length)
    @.pathname = '/'
  else
    temp = url.substring(i).split('?')
    @.pathname = temp[0];
  if temp.length
    ar = temp[1].split('&')
    for item in temp[1].split('&')
      temp =  item.split('=')
      @.query[temp[0]] = temp[1]

  return @

@.urlToBlock = new (()->
  storageBlockUrlKey = 'storageBlockUrlKey'

  urlInStorage = {}

  chrome.storage.sync.get [storageBlockUrlKey], (data) ->
    urlInStorage = data[storageBlockUrlKey] || {}
    registerBlock()

  chrome.storage.onChanged.addListener (changes) ->

    if storageChange = changes[storageBlockUrlKey]
      console.log 'storageChange', storageChange
      changed = 0
      for key of urlInStorage when !storageChange.newValue[key]
        changed = 1
        delete urlInStorage[key]

      for key of storageChange.newValue when !urlInStorage[key]
        changed = 1
        urlInStorage[key] = 1

      if changed
        syncValue () -> console.log 'sync', 'changed'

  syncValue = (callback) ->
    chrome.storage.sync.set {storageBlockUrlKey: urlInStorage}, callback

  @.add = (url) ->
    return true if urlInStorage[url]

    urlInStorage[url] = 1

    syncValue ()-> console.log 'add', "#{url}"

    registerBlock()

  @.remove = (url) ->
    return false if !urlInStorage[url]

    delete urlInStorage[url]

    syncValue ()-> ()-> console.log 'remove', "#{url}"

    registerBlock()

  @.get = () ->
    return (key for key of urlInStorage)

  urlBlock = (details) ->
    return { cancel: true }

  @.registerBlock = registerBlock = () ->
    chrome.webRequest.onBeforeRequest.removeListener urlBlock
    ar = (key for key of urlInStorage)
    if ar and ar.length
      console.log 'blocking', ar
      chrome.webRequest.onBeforeRequest.addListener urlBlock, { urls: ar }, ["blocking"]
    else
      chrome.webRequest.onBeforeRequest.removeListener urlBlock

  @
)()



