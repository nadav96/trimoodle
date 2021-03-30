chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {
	  if (tab.url.indexOf("moodle2.cs.huji.ac.il") != -1) {
		//injectScripts();
		console.log("hello world", $("body"));
		$("#page-site-index").css("background-color", "yellow");
		//var btn = document.createElement("BUTTON")
		//var t = document.createTextNode("CLICK ME");
		//btn.appendChild(t);
		////Appending to DOM 
		//document.body.appendChild(btn);
		//console.log("hello world2");

	  }
  
	}
  });