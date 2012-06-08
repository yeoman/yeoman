// Filename: main.js

require({
	hm: 'hm',
    paths: {
    	jquery: 'libs/jquery/jquery-min',
    	underscore: 'libs/underscore/underscore',
    	backbone: 'libs/backbone/backbone',
    	text: 'libs/require/text'
  	},
});

require(['views/app', 'hm!alpha', 'jquery'], function(AppView, alpha){
  var app_view = new AppView;

  // Harmony testing

	console.log(alpha);

	var html = "";

	$('.gamma').append(alpha.gammaName);
	$('.beta').append(alpha.betaName);
	$('.beta2').append(alpha.betaFunc());
	$('.epsilon').append(JSON.stringify(alpha.epsilon));
	$('.alpha').append(JSON.stringify(alpha));

	// Shared state testing
	alpha.shared.increment();
	alpha.shared.increment();
	$('.sharedState').append(alpha.shared.current());

	// Parameterization
	var safeDOM = alpha.SafeDOM;
	var instance = alpha.DOMMunger.make(safeDOM);
	instance.munge();

});

