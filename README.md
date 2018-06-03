Agile - The Css3 Creation Engine
======

[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](./LICENSE)
[![Release Version](https://img.shields.io/badge/release-2.1.0-red.svg)](https://github.com/a-jie/Agile/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/a-jie/Agile/pulls)
[![npm](https://img.shields.io/badge/npm-2.1.0-brightgreen.svg)](https://www.npmjs.com/)

![Agile banner](https://github.com/a-jie/Agile/blob/master/image/banner.png?raw=true)

## Using javascript generated pure CSS3
Agile is a simple, fast and easy to use engine which uses javascript generated pure CSS3.
Check out examples at [http://a-jie.github.io/Agile/](http://a-jie.github.io/Agile/)

## Features
- Agile uses javascript to generate pure CSS3, without canvas, webGL or SVG.
- Performant on mobile devices, being truly cross platform.
- Agile’s API has high similar characteristic with actionscript 3.0, you can learn it in 10 minutes.

## Usage
#### Download the [minified library](https://github.com/a-jie/Agile/blob/master/build/agile.min.js) and include it in your html document.  

```html
<script src="js/agile.min.js"></script>
```


#### Or install using npm 
[![anix](https://nodei.co/npm/agilejs.png)](https://npmjs.org/package/agilejs)

``` 
npm install agilejs --save
... 

import Agile from 'agilejs';
```

#### Create and move a circle:

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
Node is a dependency, use terminal to install it with with:  

```javascript
git clone git://github.com/a-jie/Proton.git
...
npm install
npm run build
``` 

and run examples 

```javascript
npm start
//vist http://localhost:3001/examples/
```

es6 lint

```javascript
npm run lint
```

## License
LicenseFinder is released under the MIT License. http://www.opensource.org/licenses/mit-license
