A backbone generator based on backbone-rails.

Usage:
`yeoman init backbone`

Available generators:

backbone:model
backbone:view
backbone:collection
backbone:router
backbone:all

Typical output:

addyo-macbookpro:nyan addyo$ yeoman init backbone:all
.. Invoke backbone:all ..
Creating app/scripts/models directory...OK
Creating app/scripts/collections directory...OK
Creating app/scripts/views directory...OK
Creating app/scripts/routes directory...OK
Creating app/scripts/helpers directory...OK
Creating app/scripts/templates directory...OK
Writing app/scripts/nyan.js...OK

.. Invoke backbone:view:bootstrap ..
Writing app/scripts/views/application-view.js...OK
Writing app/scripts/templates/application.ejs...OK

.. Invoke backbone:model:bootstrap ..
Writing app/scripts/models/application-model.js...OK

.. Invoke backbone:collection:bootstrap ..
Writing app/scripts/collections/application-collection.js...OK

.. Invoke backbone:router:bootstrap ..
Writing app/scripts/routes/app-router.js...OK
