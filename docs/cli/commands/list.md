

## list

Usage: `yeoman list`

Lists all of the packages that have been installed using `yeoman install` (Bower) in your current project.

Example:

```shell
# If you have previously called
yeoman install backbone

# and then run
yeoman list

# the output will be

/myapp/
├─┬ backbone#0.9.2
│ ├── jquery#1.7.2
│ └── underscore#1.3.3
├── jquery#1.7.2
└── underscore#1.3.3
```

As you can see, this also includes the version information for each package and its dependencies.