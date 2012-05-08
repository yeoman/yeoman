#!/usr/bin/env python

"""This module defines the db models for the project."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'


#from google.appengine.api import memcache
from google.appengine.ext import db


class Command(db.Model):
  """Model for commands."""

  class Type(object):
    INSTALL = 1
    SCAFFOLD = 2
    MODEL = 3

  type = db.IntegerProperty(required=True)
  fetch_date = db.DateTimeProperty(auto_now=True, auto_now_add=True)


# class Resource(db.Model):
#   """Model for content resources."""

#   class Type(object):
#     IMG = 1
#     VIDEO = 2
#     ARTICLE = 3

#   type = db.IntegerProperty(required=True)
#   title = db.StringProperty()
#   text = db.TextProperty(required=True)
#   sharers = db.ReferenceProperty(Sharer)
#   publication_date = db.DateTimeProperty()
#   fetch_date = db.DateTimeProperty(auto_now=True, auto_now_add=True)
#   url = db.LinkProperty(required=True)
