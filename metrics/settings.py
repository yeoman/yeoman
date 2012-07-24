import json
import os

# Get version of Yeoman out of package file, otherwise use GAE app.yaml version
# for this app.
def get_app_data():
  version_str = []
  try:
    f = open(os.path.join(
        os.path.dirname(__file__), '..', 'cli', 'package.json'))
    data = json.load(f)
    f.close()
    return {'cli_name': data['name'], 'version': data['version']}
  except:
  	return os.environ['CURRENT_VERSION_ID'].split('.')[0]

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

APP_DATA = get_app_data()

APP = {
  'title': 'Yeoman Insight',
  'cli_name':  APP_DATA['cli_name'],
  'version': APP_DATA['version']
  }


#MAX_FETCH_LIMIT = 1000
