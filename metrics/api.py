#!/usr/bin/env python

"""This module defines the API for Yeoman stats."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'

import logging
import os
import simplejson
import webapp2

import models
import settings


class APIHandler(webapp2.RequestHandler):

  def __add_headers(fn):
    def wrapped(self, *args, **kwargs):
      self.response.headers.add_header('Access-Control-Allow-Origin', '*')
      self.response.headers.add_header('X-UA-Compatible', 'IE=Edge,chrome=1')
      self.response.headers.add_header('Content-Type', 'application/json')
      return fn(self, *args, **kwargs)
    return wrapped

  # @__add_headers
  # def install(self, post_body=None):
  #   if post_body is not None:
  #     self.response.out.write(post_body)
  #   else:
  #     json = {
  #       'rpc': 'install'
  #     }

  # @__add_headers
  # def cmd(self, post_body=None):
  #   if post_body is not None:
  #     self.response.out.write(post_body)
  #   else:
  #     json = {
  #       'rpc': 'cmd'
  #     }

  @__add_headers
  def get(self, method):
    q = models.Report.all().filter('cmd', method)
    if method == 'install':
      results = q.order("-height").fetch(limit=settings.MAX_FETCH_LIMIT)
      #self.install()
    elif method == 'cmd':
      #self.cmd()

    self.response.out.write(simplejson.dumps(json))

  def post(self, method):
    # m = models.Message(
    #   cmd='init',
    #   version=1.0
    # )
    # m.put()

    #TOOO: figure out how to verify this post request came from the yeoman cli.
    if method == 'install':
      return self.install(self.request.body)
    elif method == 'cmd':
      return self.cmd(self.request.body)


routes = [
  ('/api/(.*)', APIHandler)
]

app = webapp2.WSGIApplication(routes, debug=settings.DEBUG)
