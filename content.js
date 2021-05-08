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
					
					chrome.storage.sync.set({"filter": value, "actionComplete": true}, function() {
						updateUnhideButtonStatus();
						parent.hide();
					});
				});
			});
			$(this).before(button);
		});
	});
}

function addRateDialog() {
	var isHomepage = $("ol.breadcrumb li").length <= 2;
	if (!isHomepage) {
		return;
	}

	chrome.storage.sync.get(['actionComplete', 'filter', 'rateDialogDismiss'], function(result) {
		if (result["rateDialogDismiss"] == true) {
			return;
		}
		if (result["actionComplete"] == true || result["filter"]) {
			chrome.storage.sync.get(["rateShownCount"], function(result) {
				var count = result["rateShownCount"]
				if (Number.isInteger(count)) {
					chrome.storage.sync.set({"rateShownCount": count+1});
				}
				else {
					chrome.storage.sync.set({"rateShownCount": 1});
				}
			});

			var container = $("<div></div>");
			container.css("background-color", "#F0FAFF")
					.css("margin-left", "13px")
					.css("margin-right", "13px")
					.css("border-style", "solid")
					.css("border-width", "1px");
		
			var title = $("<p>Enjoying Trimoodle so far?</p>")
			title.css("text-align", "center");
			title.css("font-size", "large");
			title.css("font-weight", "bold");
			title.css("padding-top", "15px");
		
			var info = $("<p>If so, please consider giving us a 5 star rating :)</p>")
			info.css("text-align", "center");
		
			var actions = $("<div></div>");
			actions.attr("align", "center");
			actions.css("padding-bottom", "15px");
			var ok = $("<button>Rate me!</button>");
			ok.css("margin-right", "10px");
			var dismiss = $("<button>No thank you</button>");
		
			ok.click(function() {
				window.open("https://chrome.google.com/webstore/detail/trimoodle/najiiglmdjablddfmgegpookgecbddej/reviews")
				container.remove();
				chrome.storage.sync.set({"rateDialogDismiss": true, "rateResult": 1});

			});
			dismiss.click(function() {
				container.remove();
				chrome.storage.sync.set({"rateDialogDismiss": true, "rateResult": 0});
			});
		
			container.append(title);
			container.append(info);
			actions.append(ok);
			actions.append(dismiss);
			container.append(actions);
		
			$("#region-main").prepend(container);
		}
	});
}

function addNotifyColorDialog() {
	var isHomepage = $("ol.breadcrumb li").length <= 2;
	if (!isHomepage) {
		return;
	}

	chrome.storage.sync.get(['actionComplete', 'color', 'colorDismiss', 'colorResult'], function(result) {
		if (result["colorDismiss"] == true) {
			return;
		}
		if (result["actionComplete"] == true || result["filter"]) {
			var container = $("<div></div>");
			container.css("background-color", "#F0FAFF")
					.css("margin-left", "13px")
					.css("margin-right", "13px")
					.css("border-style", "solid")
					.css("border-width", "1px");
		
			var title = $("<p>Noticed the green color is gone?</p>")
			title.css("text-align", "center");
			title.css("font-size", "large");
			title.css("font-weight", "bold");
			title.css("padding-top", "15px");
		
			var info = $("<p>Hi, it's Trimoodle again, we thought you will like to revert the moodle color back to it's original color, is it ok? :)</p>")
			info.css("padding", "10px");
		
			var actions = $("<div></div>");
			actions.attr("align", "center");
			actions.css("padding-bottom", "15px");
			var ok = $("<button>Save setting and dismiss</button>");
			ok.css("margin-right", "10px");
			var dismiss = $("<button>Toggle green color</button>");
			var isOn = result["colorResult"] != 0;

			if (result["colorResult"] != 0 && result["colorResult"] != 1) {
				chrome.storage.sync.set({"colorResult": 1});
				$(".card-body").css("background-color", "#eaf8fc");
			}

			ok.click(function() {
				container.remove();
				chrome.storage.sync.set({"colorDismiss": true});
				$(".card-body").css("background-color", "#eaf8fc");

			});
			dismiss.click(function() {
				if (isOn) {
					$(".card-body").css("background-color", "#EBFAEB");
					chrome.storage.sync.set({"colorResult": 0});
				}
				else {
					$(".card-body").css("background-color", "#eaf8fc");
					chrome.storage.sync.set({"colorResult": 1});
				}
				isOn = !isOn;
			});
		
			container.append(title);
			container.append(info);
			actions.append(ok);
			actions.append(dismiss);
			container.append(actions);
		
			$("#region-main").prepend(container);
		}
	});
}

function setMoodleColor() {
	chrome.storage.sync.get(['colorResult'], function(result) {
		if (result["colorResult"] == 1) {
			$(".card-body").css("background-color", "#eaf8fc");
		}
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
addRateDialog();
addNotifyColorDialog();
setMoodleColor();