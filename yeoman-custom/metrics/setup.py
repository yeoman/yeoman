#!/usr/bin/env python

"""Install script for Yeoman Insight."""

__author__ = 'ebidel@gmail.com (Eric Bidelman)'


from distutils.core import setup

setup(name='Yeoman Insight',
      version='0.0.1',
      description='Metrics reporting tool for Yeoman',
      author='Eric Bidelman',
      author_email='ebidel@gmail.com',
      url='http://yeoman.io',
      scripts=['./yeomaninsight.py']
     )
