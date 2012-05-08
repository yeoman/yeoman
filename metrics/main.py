#!/usr/bin/env python

"""This module defines the main server for Yeoman stats collection."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'

import os
import webapp2
import settings

from django.template.loader import render_to_string

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'


class MainHandler(webapp2.RequestHandler):

  def render(self, data={}, template_path=None, status=None, message=None,
             relpath=None):
    if status is not None and status != 200:
      self.response.set_status(status, message)

    # Add template data to every request.
    template_data = {
      'self_url': self.request.url,
      'host': '%s://%s' % (self.request.scheme, self.request.host),
      'prod': settings.PROD,
      'APP': settings.APP
    }
    template_data.update(data) # merge in other data.

    # Add CORS and Chrome Frame to all responses.
    self.response.headers.add_header('Access-Control-Allow-Origin', '*')
    self.response.headers.add_header('X-UA-Compatible', 'IE=Edge,chrome=1')
    self.response.out.write(render_to_string(template_path, template_data))

  def get(self):
    self.render(template_path=os.path.join('base.html'), data={})


def handle_404(request, response, exception):
  response.write('Oops! Not Found.')
  response.set_status(404)

def handle_500(request, response, exception):
  response.write('Oops! Internal Server Error.')
  response.set_status(500)


# Main URL routes.
routes = [
  ('/', MainHandler)
]

app = webapp2.WSGIApplication(routes, debug=settings.DEBUG)
app.error_handlers[404] = handle_404
app.error_handlers[500] = handle_500
