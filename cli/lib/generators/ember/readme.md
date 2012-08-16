
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
structure under `app/scripts`:

    controllers/
    helpers/
    models/
    states/
    templates/
    views/

*Example:*

    $ yeoman g ember:bootstrap
    .. Invoke ember:bootstrap ..
    Creating app/scripts/models directory...OK
    Creating app/scripts/controllers directory...OK
    Creating app/scripts/views directory...OK
    Creating app/scripts/routes directory...OK
    Creating app/scripts/helpers directory...OK
    Creating app/scripts/templates directory...OK
    Writing app/scripts/testapp.js...OK
    Writing app/scripts/routes/app-router.js...OK
    Writing app/scripts/store.js...OK

    .. Invoke ember:view:bootstrap ..
    Writing app/scripts/views/application-view.js...OK
    Writing app/scripts/templates/application.handlebars...OK

**view**

    $ yeoman g ember:view stuff
    .. Invoke ember:view ..
    Writing app/scripts/views/stuff-view.js...OK
    Writing app/scripts/templates/stuff.handlebars...OK


**model**

    $ yeoman g ember:model person name:string age:number
    .. Invoke ember:model ..
    Writing app/scripts/models/person-model.js...OK

    $ cat app/scripts/models/person-model.js
    testapp.Person = DS.Model.extend({
      name: DS.attr('string'),

      age: DS.attr('number')
    });


**controller**

    $ yeoman g ember:controller Thing
    .. Invoke ember:controller ..
    Writing app/scripts/controllers/Thing-controller.js...OK


#### TBD

Additionally, it would be nice to necessary code to wire up the ember app into `app/scripts/application.js` or something.
