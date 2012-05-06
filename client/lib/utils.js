
define(function() {
	return {
		formatAsDateAndTime: function(dateTime) {
			return dateTime.toFormattedString("%Y-%m-%d %Hh%M");
		},

		formatAsDate: function(dateTime) {
			return dateTime.toFormattedString("%Y-%m-%d");
		},

		formatAsTime: function(dateTime) {
			return dateTime.toFormattedString("%Hh%M");
		}
	}
});

