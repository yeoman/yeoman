define(
    ["spine", "local", "manager"], function(spine,local,manager) {

    // when the spine scripts above execute, they stick a Spine onto the global namespace which
    // we don't want to use... so using a closure here to extract a private reference to that and
    // once we've got it we can delete the window.Spine reference and then force all of our code
    // to just require this module.


    var _innerSpine = null;
    var findSpine = function() {
        if(_innerSpine == null && window.Spine) {
            _innerSpine = window.Spine;
           delete window.Spine;
        }
        return _innerSpine;
    };

    return findSpine;
}());
