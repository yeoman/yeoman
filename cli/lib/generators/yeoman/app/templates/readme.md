Welcome to Yeoman
================

Yeoman is a robust and opinionated client-side stack, comprised of tools and
frameworks that can help developers quickly build beautiful web applications.

...

Getting Started
---------------

...

Description of Contents
-----------------------

The default directory structure of a generated yeoman application:

      .
      ├── Gruntfile.js
      ├── (other project root files)
      │
      ├── intermediate (/..) (probably temp/, tmp/, or hidden folder)
      ├── publish      (/..) (probably deploy/)
      │
      ├── app
      │   ├── index.html
      │   ├── browser_modules (probably in app/js instead)
      │   │   ├── jquery
      │   │   │   ├── browser.json
      │   │   │   └── jquery.js
      │   │   └── jquery-ui
      │   │       ├── browser.json
      │   │       └── jquery-ui.js
      │   ├── js
      │   │   ├── controllers
      │   │   │   ├── people_controller.js
      │   │   │   └── person_controller.js
      │   │   ├── main.js
      │   │   ├── models
      │   │   │   └── person.js
      │   │   ├── vendor
      │   │   │   ├── ember-data.js
      │   │   │   ├── ember.js
      │   │   │   └── jquery.js
      │   │   └── views
      │   │       ├── people
      │   │       │   ├── edit_view.js
      │   │       │   ├── index_view.js
      │   │       │   └── list_view.js
      │   │       └── shared
      │   │           ├── frame_view.js
      │   │           └── split_view.js
      │   ├── css
      │   │   └── main.css
      │   │   └── sass
      │   │      └── main.scss
      │   └── templates
      │       └── people
      │           ├── edit.handlebars
      │           ├── index.handlebars
      │           └── list.handlebars
      ├── spec
      │   ├── controllers
      │   │   ├── people_controller_spec.js
      │   │   └── person_controller_spec.js
      │   └── views
      │       └── shared
      │           ├── frame_view_spec.js
      │           └── split_view_spec.js
      └── test
          ├── index.html
          ├── lib
          │   ├── chai.js
          │   ├── expect.js
          │   └── mocha-1.2.2
          |       ├── mocha.css
          |       └── mocha.js
          └── runner
              └── mocha.js
