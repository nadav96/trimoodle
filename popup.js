(() => {
	'use strict';
	chrome.storage.sync.get(['filter'], function(result) {
		console.log("hello!!!!");
		if (isNaN(result)) {
			$("#current-filter").text("Helo");
		}
		else {
			$("#current-filter").text(result.key);
		}
		$("#update-filter").click(function() {
			//$("#update-filter").text("!!!");
			var value = $("#new-filter").val();
			var obj = {
				"filter": value
			}
			chrome.storage.sync.set(obj, function() {
				$("#current-filter").text(value);
				console.log('Value is set to ' + (value));
			});
		});
	});
})();

