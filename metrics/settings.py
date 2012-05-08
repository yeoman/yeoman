import os

# Hack to get custom tags working django 1.3 + python27.
#INSTALLED_APPS = (
#  'nothing',
#)

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))

TEMPLATE_DIRS = (
  os.path.join(ROOT_DIR, 'templates'),
)
################################################################################

if (os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine') or
    os.getenv('SETTINGS_MODE') == 'prod'):
  PROD = True
else:
  PROD = False

DEBUG = not PROD
TEMPLATE_DEBUG = DEBUG

APP = {
  'title': 'Yeoman Stats',
  'version': os.environ['CURRENT_VERSION_ID'].split('.')[0]
  }
