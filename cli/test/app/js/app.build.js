({
    appDir: "../",
    baseUrl: "js",
    dir: "../build",
    paths: {
    	jquery: 'libs/jquery/jquery-min',
    	underscore: 'libs/underscore/underscore',
    	backbone: 'libs/backbone/backbone',
    	text: 'libs/require/text'
  	},
    modules: [
        {
            name: "main"
        }
    ]
})