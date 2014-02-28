Agile
======
#### Css3 Engine ####
Agile is a engine Using javascript generated pure CSS3.Its simple, fast and easy to use.
Check out examples at

## Features
- Agile uses javascript to generate pure CSS3. No canvas no webGL no svg.
- In mobile devices Agile's performance is perfect ,It really can cross platform.
- Agile’s API has high similar characteristic with actionscript3.0, you can learn it in 10 minites.

## Usage
Download the [minified library](https://github.com/a-jie/Agile/build/agile.min.js) and include it in your html.

```html
<script src="js/agile.min.js"></script>
```
This code will create a circle and make it moving.
```javascript
//init Agile
Agile.mode = '3d';
var container = new Agile.Container('container');
container.select = false;
container.perspective = 1000;

//create a displayobject
var circle = new Agile.Circle(80, '#ff0000');
circle.x = 100;
circle.y = 120;
container.addChild(circle);

//add a keyframes
var keyframes = new Agile.Keyframes(100, {
	scaleX : .5,
	scaleY : .5
});
circle.addFrame(1, keyframes, {
	yoyo : true,
	loop : -1
}); 
```

## Building Agile
Node is a dependency, use terminal to install it with with:<br>
`git clone git://github.com/a-jie/Agile.git`<br>
Then navigate to the build directory by running:<br>
`cd ./build`<br>
Finally run the build command:<br>
`node build.js`

## License
LicenseFinder is released under the MIT License. http://www.opensource.org/licenses/mit-license
