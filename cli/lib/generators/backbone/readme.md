A backbone generator based on backbone-rails.

Available generators:

backbone:model
backbone:view
backbone:collection
backbone:router

Typical output:

addyo-macbookpro:nyan addyo$ yeoman g backbone:bootstrap
.. Invoke backbone:bootstrap ..
Creating app/js/models directory...OK
Creating app/js/collections directory...OK
Creating app/js/views directory...OK
Creating app/js/routes directory...OK
Creating app/js/helpers directory...OK
Creating app/js/templates directory...OK
Writing app/js/nyan.js...OK

.. Invoke backbone:view:bootstrap ..
Writing app/js/views/application-view.js...OK
Writing app/js/templates/application.ejs...OK

.. Invoke backbone:model:bootstrap ..
Writing app/js/models/application-model.js...OK

.. Invoke backbone:collection:bootstrap ..
Writing app/js/collections/application-collection.js...OK

.. Invoke backbone:router:bootstrap ..
Writing app/js/routes/app-router.js...OK
