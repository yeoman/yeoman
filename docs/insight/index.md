#Yeoman Insight
*Eric Bidelman - updated 8/23/2012*

##Overview

Yeoman Insight is the metrics reporting tool used by the Yeoman CLI to record and report aggregated usage of the project. From day one (ground zero), we aim to be metrics driven. Having insight into what people are doing with our tool will help measure success of the project and steer its future direction.

##Things to measure

There are a number of useful questions we can answer with good metrics:

1. # downloads
  - Users install Yeoman from the command line (`$ curl -L get.yeoman.io | sh`). We record a "download" page view when the CLI is run for the first time. This is essentially equivalent to the # of installs. Users are unlikely to run the install command and never execute a yeoman task.
  - *Note: Github does not provide a way to track # of .zip/.tar.gz downloads from the project page.*
- 7, 14, 30-day actives
- How many people created a project in the last 30 days?
- What commands/actions are most useful? Which are least popular?
- What locales are using the tool?
- How long does it take for developers to upgrade to a new version?
- What JS frameworks are people using?
  - *Note: the V1 scope does not include an app stack.*
- We just launched Yeoman v2.0 @ AwesomeConf JS 2013. Of course it was picked up by Hacker News! Pssht. But...how many new installs did we drive?

Turns out, [Google Analytics](http://www.google.com/analytics/) is excellent at handling all of these cases.

##Collection Workflow

###Backend

Google Analytics suits most of our needs. It was designed to allow any type of app (mobile, non-web page properties, installed apps, etc.) to send data to Analytics for processing. It works similar to the existing API, with the exception that cookies are no longer required.

There are a many benefits to using Analytics instead of rolling our own collecting server on App Engine. Perhaps the biggest: not having to process data ourselves.

###yeomaninsight.py

`yeomaninsight.py` is the brains behind the operation, located in the `/cli/bin` folder:

    ├── bin
    │   └── yeomaninsight.py
    │   └── …

> *Note: /metrics was originally setup as an App Engine Python app before Analytics was chosen as backend. At this time, we don't need a separate server but the code is intact if/when we decide to build a dashboard for Yeoman.*

This script is installed globally as an alias `_yeomaninsight` to prevent users from a.) seeing the script via auto completing "yeoman*" and b.) mitigating running the script directly.  The script is responsible for collecting, stashing, and sending usage data to Google Analytics.

`_yeomaninsight` is invoked by `/cli/lib/plugins/insight.py`, which creates a folder in the home directory (`~/.yeoman/insight/`) when the cli is run for the first time. and prompts the user to opt-in to sending anonymous metrics.

###Recording actions

When users run Yeoman CLI commands, the CLI captures the [sub]commands that were issued by calling `yeomaninsight.py`'s record API. yeomaninsight.py then writes the task to an offline logfile named .log (created on first-run of `yeomaninsight.py`).  The format of the file is:

    CLIENTID
    TIMESTAMP command
    TIMESTAMP command subcommand
    …

This file is created and saved to the user's home directory (`~/.yeoman/insight/.log`).

####Example run:

    $ yeoman init
        -> calls "_yeomaninsight record init"

This creates .log, logs the download on first run, and appends the command:

<table>
<tr><td>Directory structure</td><td>.log</td></tr>
<tr><td><pre>
├── ~/.yeoman/insight/
│   └── .log
</pre></td><td>
<pre>
1336617026.860.421519437366
1336617031.37 /downloaded
1336617031.37 /init
</pre>
</td></tr>
</table>

Running a more complicated command also works:

    $ yeoman add model MyModel
        -> calls "_yeomaninsight.py record add model myModel"

    .log contains:
    1336617026.860.421519437366
    1336630501.37 /add/model

Notice that

1. Space separated commands are joined by "/"s to form a fake URL path. This simulates a pageview to record in Analytics.
- Personalized information like the name of the model being created  ("myModel") is not recorded or sent.

####Why a log file?

The alternative to stashing actions in .log would be to send live requests to Analytics as commands were issued. The main drawback with that approach is that the tool cannot be used offline. I want to use Yeoman on a plane, bro!

###Sending data

`yeomaninsight.py` is also responsible for sending the log data to Analytics. We attempt to send data on every command that is run. If a connection is not present, the data is logged to .log and continues to stash until a successful request to Analytics is made. This potentially means that someone could run the CLI once and not use it again for a few hours. That's ok. The timestamp in the log file is sent with the request to Analytics, allowing it to correctly process older results.

> *Note: Analytics has a maximum of 24hrs that you can send past data. If a user has data and runs yeoman after this period is up, we'll lose those actions. There's nothing that can be done about this. It's a limitation of the Analytic backend.*

After a entries are processed, they're immediately removed from the log file.

####Analytics request format

A command is recorded as a "pageview" in Analytics. yeomaninsight.py makes GET requests to the Analytics endpoint, with the relevant parameters included.

####Example

Eric fires up Yeoman for the first time in 4hrs and runs a few commands:

    $ yeoman install jquery
        -> calls "_yeomaninsight.py record install jquery"
    $ yeoman install angular
        -> calls "_yeomaninsight.py record install angular"

The CLI logs each of these entries and sends them to Analytics. This kicks off a call to `_send_all()`, which uploads everything in the log file. If the user is offline ((the first request to Analytics fails) when the upload is triggered, existing log data is kept intact until the next run of the CLI when they're online.

Once all data is sent, `.log` is scrubbed clean of past data, although the Client ID is preserved:

    1336617026.860.421519437366

###Privacy

Our implementation uses Google Analytics. See their [TOS/Privacy Policy](http://www.google.com/analytics/learn/privacy.html) (e.g. Google's Privacy Policy) for more information. There are a few points worth calling out:

- Recording stats are opt-out. This is determined on first-run of the CLI.
- We eventually plan to open up the collected data to the public. Everyone will benefit!! We plan to have a metrics dashboard where folks can see the data, as collected by the tool.
- The Client ID is generated as combination of timestamp + random_number and is in no way tied to personal data like IP address, name, location, or other personally identifiable information. Google Analytics uses this data (in aggregate) in order to differentiate users of an app. It allows us to answer the question: "# of 7 day active users".
- Data is sent to Analytics, an aggregate collection service. There will be no way for us to see information on any one person.
- We are not recording names of things that were created (e.g. someone's model name, file naming conventions, etc.)

