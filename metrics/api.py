#!/usr/bin/env python

"""This module defines the API for Yeoman stats."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'

import logging
import os
import simplejson
import webapp2

import settings


class APIHandler(webapp2.RequestHandler):

  def __add_headers(fn):
    def wrapped(self, *args, **kwargs):
      self.response.headers.add_header('Access-Control-Allow-Origin', '*')
      self.response.headers.add_header('X-UA-Compatible', 'IE=Edge,chrome=1')
      self.response.headers.add_header('Content-Type', 'application/json')
      return fn(self, *args, **kwargs)
    return wrapped

  @__add_headers
  def install(self, post_body=None):
    if post_body is not None:
      self.response.out.write(post_body)
    else:
      json = {
        'rpc': 'install'
      }
      self.response.out.write(simplejson.dumps(json))

  @__add_headers
  def cmd(self, post_body=None):
    if post_body is not None:
      self.response.out.write(post_body)
    else:
      json = {
        'rpc': 'cmd'
      }
      self.response.out.write(simplejson.dumps(json))

  def get(self, method):
    if method == 'install':
      return self.install()
    elif method == 'cmd':
      return self.cmd()

  def post(self, method):
    #TOOO: figure out how to verify this post request came from the yeoman cli.
    if method == 'install':
      return self.install(self.request.body)
    elif method == 'cmd':
      return self.cmd(self.request.body)


routes = [
  ('/api/(.*)', APIHandler)
]

app = webapp2.WSGIApplication(routes, debug=settings.DEBUG)
