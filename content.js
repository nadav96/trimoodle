chrome.storage.sync.get(['filter'], function(result) {
	console.log('Value currently is ' + result["filter"]);
	var value = result["filter"];
	courses = value.split(",");
	map = {};
	for (var i=0; i<courses.length; i++) {
		map[courses[i]] = true;
	}

	$("li.type_course > p").each(function(i) {
		var key = $(this).attr("data-node-key");
		if (key in map) {
			$(this).remove();
		}
	})
});
