// when the extension is first installed


// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(id, info, tab){


    if (tab.url.toLowerCase().indexOf("stackoverflow.com") > -1){
        chrome.pageAction.show(tab.id);

        chrome.storage.sync.get("Konaila_mode", function(data){
            if (data["Konaila_mode"] && tab.url.toLowerCase().indexOf("stackoverflow.com/search") !== -1){
                chrome.tabs.update(tab.id, {url: "http://www.facebook.com/?no-buzzfeed-for-you!"});
            }
        });
    }

});
