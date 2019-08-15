# icoX.js

![Screenshot](https://raw.githubusercontent.com/ThomasPokorny/icoX/master/screenshots/screenshot.png)

Simple retro style pixel identicons, generated form a sha256 hash.

#### Basic Usage
The identicon gets created and added to the surrounding dom-element.
```html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <title>icoX.js</title>
	<script type="text/javascript" src='icox.js'> </script>
    </head>
    <body>
	<span>
		<script>icoX('Han Solo');</script>
	</span>
    </body>
</html>
```

It is also possible to specify the id of the element to wich you want to append the image.

```html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <title>icoX.js</title>
	<script type="text/javascript" src='icox.js'> </script>
    </head>
    <body>
	<span id='6'>
	</span>
	<script>icoX('Jar Jar Binks', '6');</script>
    </body>
</html>
```
Or directly pass a sha256 hash.

```html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <title>icoX.js</title>
		<script type="text/javascript" src='icox.js'> </script>
    </head>
    <body>
	<script>
		icoX('5247709ea3ed87ce0dce47e92ad6f280880dee86970cd82669d5a5fe8128e4c2',undefined, true);
	</script>
    </body>
</html>
```
