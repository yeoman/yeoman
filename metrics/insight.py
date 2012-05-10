#!/usr/bin/env python

"""This module defines the stat reporter tool."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'


import os
import random
import time
import urllib
import urllib2

import settings


TRACKING_CODE = 'UA-31537568-1'
LOG_FILE = os.path.join(os.path.dirname(__file__), '.yeomaninsight')
CLI_NAME = 'yeoman'
NUM_SUB_CMDS = 2 # Subcommand depth. TODO: This assumes only cmd subcmd format.


class Analytics(object):

  BASE_URL = 'http://www.google-analytics.com/collect/__utm.gif'

  def __init__(self, tracking_code):
    self.tracking_code = tracking_code
    f = open(LOG_FILE, 'a+') # Open file for reading and appending.

    # If we're creating a new file, create a new client ID. Otherwise, read the
    # one already saved on the first line of the file.
    if os.path.getsize(LOG_FILE) == 0:
      self.client_id = '%s%s' % (time.time(), random.random())
      f.write(self.client_id + '\n')
    else:
      f.seek(0)
      self.client_id = f.readline()[:-1]
      f.seek(os.SEEK_END)

    f.close()

  def record(self, cmd_str):
    """Saves the command that was run to a log file.

    Args:
      cmd_str: A string representing the full command that was run.
          For example, when running "yeoman add model MyModel", this method
          would save "add model" with a timestamp attached.
    """
    cmd_str = filter(lambda x: x, cmd_str.split(CLI_NAME))[0].strip()
    path = '/'.join(cmd_str.split(' ')[:NUM_SUB_CMDS])

    f = open(LOG_FILE, 'a')
    s = '%s /%s' % (time.time(), path)
    f.write(s + '\n')
    f.close()

  def send(self, path='/', recorded_at=None):
    """Sends one pageview entry to Google Analytics.

    This method constructs the appropriate URL and makes a GET request to the
    tracking API.

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
      'cid': self.client_id, # Client ID
      'aip': '1', # Anonymize IP
      'qt': int((time.time() - recorded_at) * 1e3), # Queue Time. Delta (milliseconds) between now and when hit was recorded.
      #'dt': , # Document title.
      'p': path, #urllib.quote_plus(path)
      'an': settings.APP['title'], # Application Name.
      'av': settings.APP['version'], # Application Version.
      'z': time.time() # Cache bust. Probably don't need, but be safe. Should be last param.
      #'sc': ??,
      #'cm*': ??,
      #'cd*': ??,
    }

    encoded_params = urllib.urlencode(params)

    url = '%s?%s' % (self.BASE_URL, encoded_params)
    print url
    #response = urllib2.urlopen(url)
    #print response.code
    #print response.read()

  def send_all(self):
    """Sends all report data stored in the log file to Analytics."""

    with open(LOG_FILE) as f:
      # This assumes ever line in the log file ends with "\n".
      lines = [line[:-1] for line in f.readlines()]
      for l in lines[1:]: # Client ID is on first line, so start on second.
        parts = l.split(' ')
        self.send(parts[1], recorded_at=float(parts[0]))


def main():
  ga = Analytics(TRACKING_CODE)
 
  #ga.record(CLI_NAME + ' add model MyModel')
  #ga.record('add model MyModel')

  #ga.send('/test/model') # Test his recorded now.
  #ga.send('/add/model', recorded_at=time.time() - 120) # Test hit recorded 2 minutes ago.

  ga.send_all()


if __name__ == '__main__':
  main()
