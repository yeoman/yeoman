
Most of the code here is borrowed to https://github.com/emberjs/ember-rails

---

yeoman-ember allows you to include a set of [Ember.JS](http://emberjs.com/)
generators into your yeoman application.


Available generators:

    ember:view
    ember:model
    ember:controller
    ember:bootstrap

## Architecture

Ember does not require an organized file structure. However, yeoman-ember
allows you to use `yeman g ember:bootstrap` to create the following directory
structure under `app/js`:

    controllers/
    helpers/
    models/
    states/
    templates/
    views/

*Example:*

    $ yeoman g ember:bootstrap
    .. Invoke ember:bootstrap ..
    Creating app/js/models directory...OK
    Creating app/js/controllers directory...OK
    Creating app/js/views directory...OK
    Creating app/js/routes directory...OK
    Creating app/js/helpers directory...OK
    Creating app/js/templates directory...OK
    Writing app/js/testapp.js...OK
    Writing app/js/routes/app-router.js...OK
    Writing app/js/store.js...OK

    .. Invoke ember:view:bootstrap ..
    Writing app/js/views/application-view.js...OK
    Writing app/js/templates/application.handlebars...OK

**view**

    $ yeoman g ember:view stuff
    .. Invoke ember:view ..
    Writing app/js/views/stuff-view.js...OK
    Writing app/js/templates/stuff.handlebars...OK


**model**

    $ yeoman g ember:model person name:string age:number
    .. Invoke ember:model ..
    Writing app/js/models/person-model.js...OK

    $ cat app/js/models/person-model.js
    testapp.Person = DS.Model.extend({
      name: DS.attr('string'),

      age: DS.attr('number')
    });


**controller**

    $ yeoman g ember:controller Thing
    .. Invoke ember:controller ..
    Writing app/js/controllers/Thing-controller.js...OK


#### TBD

Additionally, it would be nice to necessary code to wire up the ember app into `app/js/application.js` or something.
