#!/usr/bin/env python

"""This module defines the stat reporter tool."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'


import random
import time
import urllib
import urllib2

import settings


TRACKING_CODE = 'UA-31537568-1'


class Analytics(object):

  BASE_URL = 'http://www.google-analytics.com/collect/__utm.gif'

  def __init__(self, tracking_code):
    self.tracking_code = tracking_code

  def send(self, path='/', recorded_at=None):
    """Sends data to Google Analytics.

    Args:
      path: A string representing the url path of the pageview to record.
          URL query parameters may be included. The format should map to the
          the command that was issued:
            yeoman init -> /init
            yeoman add model -> /add/model
      recorded_at: When the hit was recorded in seconds since the epoch.
          If absent, now is used.
    """
    recorded_at = recorded_at or time.time()

    params = {
      'v': '1', # GA API tracking version.
      'tid': self.tracking_code, # Tracking code ID.
      't': 'pageview', # Event type
      'cid': '%s%s' % (time.time(), random.random()), # Client ID
      'aip': '1', # Anonymize IP
      'qt': int((time.time() - recorded_at) * 1e3), # Queue Time. Delta (milliseconds) between now and when hit was recorded.
      #'dt': ,
      'p': path, #urllib.quote_plus(path)
      'an': settings.APP['title'], # Application Name.
      'av': settings.APP['version'], # Application Version.
      'z': time.time() # Cache bust. Probably don't need, but be safe. Should be last param.
      #'sc': ??,
      #'cm*': ??,
      #'cd*': ??,
    }

    #time.ctime(seconds) -> 'Tue May  8 20:37:35 2012'

    encoded_params = urllib.urlencode(params)

    url = '%s?%s' % (self.BASE_URL, encoded_params)
    print url
    #response = urllib2.urlopen(url)
    #print response.code
    #print response.read()


def main():
  ga = Analytics(TRACKING_CODE)
  ga.send('/test/model') # Test his recorded now.
  #ga.send('/add/model', recorded_at=time.time() - 120) # Test hit recorded 2 minutes ago.


if __name__ == '__main__':
  main()
