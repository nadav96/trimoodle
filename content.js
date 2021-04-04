var unhideButtonId = "unhide-button"
var unhideButtonColor = "#D98901";

function updateUnhideButtonStatus() {
	var button = $("#" + unhideButtonId);
	chrome.storage.sync.get(['filter'], function(result) {
		if (result["filter"]) {
			button.attr('disabled' , false);
			button.css("color", unhideButtonColor);
		}
		else {
			button.attr('disabled' , true);
			button.css("color", "")
		}
	});
}


function updateCoursesSidebar() {
	chrome.storage.sync.get(['filter'], function(result) {
		var value = result["filter"];
		if (!value) {
			value = "";
			chrome.storage.sync.set({"filter": value});
		}
		courses = value.split(",");
		map = {};
		for (var i=0; i<courses.length; i++) {
			map[courses[i]] = true;
		}
	
		$("li.type_course > p").each(function(i) {
			var parent = $(this).parent();

			var key = $(this).attr("data-node-key");
			if (key in map) {
				parent.hide();
			}

			// apply
			parent.css("border-style", "solid")
							.css("border-width", "1px")
							.css("border-color", "#0A467E")
							.css("margin-top","5px");

			var button = $("<button class=\"fa fa-eye-slash\"></button>");
			button.css("color", "#0A467E").css("float", isRtl ? "left" : "right")
			.css("border", "none")
			.css("text-decoration", "none")
			.css("background-color", "transparent")
			.css("font-size", "18px");
			button.click(function() {
				chrome.storage.sync.get(['filter'], function(result) {
					var oldValue = result["filter"];
					Snackbar.show({
						pos: 'bottom-center', 
						text: isRtl ? `קורס ${key} הוסתר` : `Hide course ${key}`, 
						actionText: isRtl ? "בטל" : 'Undo',
						onActionClick: function(element) {							
							chrome.storage.sync.set({"filter": oldValue}, function() {
								updateUnhideButtonStatus();
							});
							parent.show();
							$(element).css('opacity', 0);
						}});
					var value = `${oldValue},${key}`;	
					
					chrome.storage.sync.set({"filter": value}, function() {
						updateUnhideButtonStatus();
						parent.hide();
					});
				});
			});
			$(this).before(button);
		});
	});
}

var isRtl = $("html").attr("dir") == "rtl";

var root = $("li.type_system > p").first();
root.click(false);
var button = $("<button class=\"fa fa-eye\"></button>");
button.attr("id", unhideButtonId);
button
	.css("float", isRtl ? "left" : "right")
	.css("border", "none")
	.css("text-decoration", "none")
	.css("background-color", "transparent")
	.css("font-size", "18px");
button.click(function() {
	chrome.storage.sync.set({"filter": ""}, function() {
		updateUnhideButtonStatus();
	});
	$("li.type_course").each(function(i) {
		$(this).show();
	})
});
root.append(button);

updateUnhideButtonStatus();
updateCoursesSidebar();