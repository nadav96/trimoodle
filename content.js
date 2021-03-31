function updateCoursesSidebar() {
	chrome.storage.sync.get(['filter'], function(result) {
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
			else {
				// apply
				var parent = $(this).parent();
				parent.css("border-style", "solid")
								.css("border-width", "1px")
								.css("border-color", "#0A467E")
								.css("margin-top","5px");
				var button = $("<button class=\"fa fa-eye-slash\"></button>");
				button.click(function() {
					chrome.storage.sync.get(['filter'], function(result) {
						var value = result["filter"];
						value = `${value},${key}`;	
						
						chrome.storage.sync.set({"filter": value}, function() {
							parent.remove();
						});
					});
				});
				button.css("color", "red").css("float", isRtl ? "left" : "right")
										.css("border", "none")
										.css("text-decoration", "none")
										.css("background-color", "transparent")
										.css("font-size", "18px");
				$(this).before(button);
			}
		});
	});
}

var isRtl = $("html").attr("dir") == "rtl";

chrome.storage.sync.get(['filter'], function(result) {
	console.log('Value currently is ' + result["filter"]);

	// add the reset button
	var resetText = isRtl ? "הצג את כל הקורסים" : "unhide all courses";
	var resetButton = $(`<button>${resetText}</button>`);
	resetButton.click(function() {
		chrome.storage.sync.set({"filter": ""});
		location.reload();
	});
	resetButton.css(isRtl ? "margin-left" : "margin-right", "10px")
				.css("color", "#0A467E")
				.css("border", "none")
				.css("text-decoration", "none")
				.css("background-color", "transparent")
	$(".header-actions-container").append(resetButton)
	updateCoursesSidebar();
});
