

## <a href="#update" name="update">update</a>

Usage: `yeoman update <packageName>`

Updates an already installed package `packageName` to the latest version available in the Bower registry.

Example:

```shell
yeoman update jquery

# outputs
bower checking out jquery#v1.7.2
```

The `update` command will also update any other packages in your project relying on this dependency to use this most recent version if any update is applied.
