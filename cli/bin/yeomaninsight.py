#!/usr/bin/env python

"""This module defines the Yeoman Insight metrics reporter tool."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'


import os
import random
import shutil
import sys
import time
import urllib
import urllib2

NO_STATS = 'NO_STATS'
CLI_NAME = 'yeoman'

# TODO(ericbidelman): Verify expanduser('~') works on other platforms.
# ~/.yeoman/insight
INSIGHT_DIR = os.path.join(os.path.expanduser('~'), '.' + CLI_NAME, 'insight')
LOG_FILE = os.path.join(INSIGHT_DIR, '.log') # ~/.yeoman/insight/.log

NUM_SUB_CMDS = 2 # Subcommand depth. TODO: This assumes only "cmd subcmd" format.
NUM_SECONDS_TO_STASH_DATA = 0 # Send data as it happens.


class Analytics(object):

  TRACKING_CODE = 'UA-31537568-1'
  BASE_URL = 'http://www.google-analytics.com/collect/__utm.gif'

  def __init__(self, tracking_code):
    if not tracking_code:
      raise Exception('No tracking code is given')

    self.tracking_code = tracking_code
    self.do_stats = True

    # Create ~/.yeoman/insight if it doesn't exist.
    # install.sh should have taken care of it though.
    if not os.path.exists(INSIGHT_DIR):
      os.makedirs(INSIGHT_DIR)

    f = open(LOG_FILE, 'a+') # Open file for reading and appending.

    # If we're creating a new file, create a new client ID, setup the file, and
    # record the download action. Otherwise, read the existing client ID saved
    # on the first line of the file.
    if os.path.getsize(LOG_FILE) == 0:
      # Record the initial "download/install". Then have users opt-in.
      self.client_id = '%s%s' % (time.time(), random.random())
      self.__reset_file(f, self.client_id)
      self.record('downloaded')

      self._send_all()

    else:
      f.seek(0)
      self.client_id = f.readline()[:-1] # Assumes the line ends with "\n".

      try:
        first_entry_timestamp = float(f.readline().split(' ')[0])
        time_delta = time.time() - first_entry_timestamp

        # If we have data that's too old, send it to Analytics.
        if time_delta >= NUM_SECONDS_TO_STASH_DATA:
          self._send_all()
      except ValueError:
        # Error means we tried to parse a non timestamp or one wasn't present.
        # That means no stats.
        self.do_stats = False

    # Insure we're at the EOF to start appending.
    f.seek(os.SEEK_END)

    f.close()

  def __reset_file(self, f, client_id=None):
    """Setups up the log file for writing entries to.

    Args:
      f: A file object, assumed to be open when passed to this method.
      client_id: The client ID to use for this file.
    """
    f.write(client_id+ '\n')
    f.flush()

  def _send(self, path='/', recorded_at=None):
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
    Returns:
      True if message was sent, otherwise false.
    """
    recorded_at = recorded_at or time.time()

    params = {
      'v': '1', # GA API tracking version.
      'tid': self.tracking_code, # Tracking code ID.
      't': 'pageview', # Event type
      'cid': self.client_id, # Client ID
      'aip': '1', # Anonymize IP
      'qt': int((time.time() - recorded_at) * 1e3), # Queue Time. Delta (milliseconds) between now and when hit was recorded.
      'dp': path,
      'an': 'Yeoman Insight', #settings.APP['title'], # Application Name.
      'av': '0.0.1', #settings.APP['version'], # Application Version.
      'z': time.time() # Cache bust. Probably don't need, but be safe. Should be last param.
    }

    encoded_params = urllib.urlencode(params)

    url = '%s?%s' % (self.BASE_URL, encoded_params)

    # Noop if we're offline. Just keep stashing entries.
    try:
      response = urllib2.urlopen(url)
      #print url
      #if response.code == 200:
      #  return True
      return True
    except urllib2.URLError:
      return False

  def _send_all(self):
    """Sends all report data stored in the log file to Analytics."""

    sent = True
    with open(LOG_FILE) as f:
      # This assumes every line in the log file ends with "\n".
      lines = [line[:-1] for line in f.readlines()]
      for l in lines[1:]: # ClientID is always on the first line, so start on 2nd.
        parts = l.split(' ')

        # If one message fails to send, assume we're offline and bomb out.
        sent = self._send(parts[1], recorded_at=float(parts[0]))
        if not sent:
          break

    # Proceed with resetting file if everything went well.
    if sent:
      # Reset the file by clearing it and adding in the client id.
      f = open(LOG_FILE, 'w+')
      self.__reset_file(f, self.client_id)
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

    # yeomaninsight.py record NO_STATS is sent from bin/yeoman on first run.
    if self.do_stats and cmd_str != NO_STATS:
      f = open(LOG_FILE, 'a')
      s = '%s /%s' % (time.time(), path)
      f.write(s + '\n')
      f.close()


def main(args):

  if len(sys.argv) < 2:
    print 'Yo! invalid number of arguments.'
    sys.exit(1)

  method = sys.argv[1]
  args = ' '.join(sys.argv[2:])

  ga = Analytics(Analytics.TRACKING_CODE)

  #if callable(getattr(ga, method)):
  #  getattr(ga, method)()
  if method == 'record':
    ga.record(args)
  #elif method == 'send_all':
  #  ga.send_all()


if __name__ == '__main__':
  main(sys.argv)
