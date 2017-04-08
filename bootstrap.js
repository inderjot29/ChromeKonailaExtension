console.log("alert from bootstrap.js");

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.local.set({'Konaila_mode': true});
});

chrome.tabs.onUpdated.addListener(function(id, info, tab){
		
			
	if (tab.url.toLowerCase().indexOf("http://stackoverflow.com/search") > -1)
	{
		chrome.pageAction.show(tab.id);
		chrome.storage.local.get('Konaila_mode', function(data)
			{
				if (data['Konaila_mode'])
				{
						chrome.tabs.executeScript(tab.id, {file: "jquery-2.2.0.min.js"});
						chrome.tabs.executeScript(tab.id,{file: "contentscript.js"}, function() { console.log("content loaded");});
				}
			});
	}
});

/*chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
	chrome.tabs.executeScript(tabId, {file: "jquery-2.2.0.min.js"});
    chrome.tabs.executeScript(null,{file:"contentscript.js"},function() { console.log("content loaded");});
});*/

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get('Konaila_mode', function(data)
	{
            if (data['Konaila_mode'])
			{
				chrome.storage.local.set({'Konaila_mode': false});
				
			}
		else{
		chrome.storage.local.set({'Konaila_mode': true});
	
			}
	});
});


