(() => {
	'use strict';
	chrome.storage.sync.get(['filter'], function(result) {
		$("#current-filter").text("current:" + result["filter"]);
		$("#new-filter").val(result["filter"]);
		$("#update-filter").click(function() {
			var value = $("#new-filter").val().replace(" ", "");
			chrome.storage.sync.set({"filter": value}, function() {
				$("#current-filter").text("current:" + value);
			});
		});
	});
})();

