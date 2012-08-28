

## lookup

Usage: `yeoman lookup <packageName>`

Performs a lookup in the Bower registry for a package of a specific name. One would use this to confirm
that a package exists under a specific name (e.g `jquery`), othewise `search` should be used for broader queries.

Example:

```shell
yeoman lookup jquery

# outputs

jquery git://github.com/maccman/package-jquery.git
```