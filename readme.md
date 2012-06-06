# Welcome, Friend!

## Installing

```shell
    ./install.sh
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

## Browser Support

Yeoman supports:

* Modern browsers (latest versions of Chrome, Safari, Firefox, Opera and IE10)
* Chrome on Android
* Mobile Safari

## Docs

The current documentation exists [here](https://github.com/yeoman/yeoman/blob/master/cli/docs/docs.md).