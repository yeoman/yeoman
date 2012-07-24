# Copyright 2008 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

from google.appengine.api import memcache
from google.appengine.ext import db
import random

class GeneralCounterShardConfig(db.Model):
  """Tracks the number of shards for each named counter."""
  name = db.StringProperty(required=True)
  num_shards = db.IntegerProperty(required=True, default=20)


class GeneralCounterShard(db.Model):
  """Shards for each named counter"""
  name = db.StringProperty(required=True)
  count = db.IntegerProperty(required=True, default=0)


def get_count(name):
  """Retrieve the value for a given sharded counter.

  Parameters:
    name - The name of the counter
  """
  total = memcache.get(name)
  if total is None:
    total = 0
    for counter in GeneralCounterShard.all().filter('name = ', name):
      total += counter.count
    memcache.add(name, total, 60)
  return total


def increment(name):
  """Increment the value for a given sharded counter.

  Parameters:
    name - The name of the counter
  """
  config = GeneralCounterShardConfig.get_or_insert(name, name=name)
  def txn():
    index = random.randint(0, config.num_shards - 1)
    shard_name = name + str(index)
    counter = GeneralCounterShard.get_by_key_name(shard_name)
    if counter is None:
      counter = GeneralCounterShard(key_name=shard_name, name=name)
    counter.count += 1
    counter.put()
  db.run_in_transaction(txn)
  # does nothing if the key does not exist
  memcache.incr(name)


def increase_shards(name, num):
  """Increase the number of shards for a given sharded counter.
  Will never decrease the number of shards.

  Parameters:
    name - The name of the counter
    num - How many shards to use

  """
  config = GeneralCounterShardConfig.get_or_insert(name, name=name)
  def txn():
    if config.num_shards < num:
      config.num_shards = num
      config.put()
  db.run_in_transaction(txn)
