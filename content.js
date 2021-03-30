console.log("hello!!!!!!", $("body"));
$("#page-site-index").css("background-color", "yellow");
$("li.type_course > p").each(function(i) {
	var key = $(this).attr("data-node-key");
	if (key == "80517") {
		$(this).remove();
	}
})

chrome.storage.sync.get(['key'], function(result) {
	console.log('Value currently is ' + result.key);
	var value = result.key;
	if (isNaN(value)) {
		value = 0;
	}
	chrome.storage.sync.set({"key": value+1}, function() {
		console.log('Value is set to ' + (value + 1));
	  });
});
