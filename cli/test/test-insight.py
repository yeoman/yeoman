#!/usr/bin/env python

import sys
import unittest
import os

sys.path.append('../bin/')

from yeomaninsight import main, Analytics

class YeomanInsightTest(unittest.TestCase):

    TRACKING_CODE = 'UA-31537568-1'

    def test_init_should_error_when_no_tracking_code_is_passed(self):
      self.assertRaises(Exception, Analytics, tracking_code='')

    def test_main_should_error_when_arguments_are_less_than_2(self):
      # temporally disables print function, because it's used on main
      # just to keep the tests output clean
      sys.stdout = open(os.devnull, 'w')
      self.assertRaises(SystemExit, main, args='')
      # restores print function
      sys.stdout = sys.__stdout__

if __name__ == '__main__':
    unittest.main()