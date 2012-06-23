# Welcome, Friend!

## What am I?

Yeoman is a robust and opinionated client-side stack, comprised of tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup.

Yeoman is fast, performant and is optimized to work best in modern browsers.

## Installing

```shell
    ./setup/install.sh
```

Oh. That's it.


## Running

Here's a small shell script that you can save as `server.sh` which opens and servers the current directory on the port specified:

```shell
    port=$1
    if [ $#  -ne  1 ]
    then
      port=8000
    fi

    if [ $(uname -s) == "Darwin" ]
    then
      open=open
    else
      open=xdg-open
    fi

    $open http://localhost:$port && python -m SimpleHTTPServer $port;
```

For example, run this guy as:

```shell
    ./server.sh 8000
```

## Documentation

The current documentation for Yeoman can be found [here](http://yeoman.github.com/docs).


## Browser Support

Yeoman supports:

* Modern browsers (latest versions of Chrome, Safari, Firefox, Opera and IE10)
* Chrome on Android
* Mobile Safari

