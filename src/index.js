import Agile from "./core/Agile";
import Css from "./core/Css";

import DisplayObject from "./display/DisplayObject";
import Circle from "./display/Circle";
import Container from "./display/Container";
import Dom from "./display/Dom";
import Ellipse from "./display/Ellipse";
import Image from "./display/Image";
import Line from "./display/Line";
import MovieClip from "./display/MovieClip";
import Rect from "./display/Rect";
import SpriteSheet from "./display/SpriteSheet";
import Text from "./display/Text";
import Triangle from "./display/Triangle";

import ScrollingBg from "./extras/ScrollingBg";
import Semicircle from "./extras/Semicircle";

import Filter from "./filter/Filter";

import Color from "./utils/Color";
import Utils from "./utils/Utils";
import LoadManager from "./utils/LoadManager";

import ease from "./animate/ease";
import Keyframes from "./animate/Keyframes";
import MovieClipLabel from "./animate/MovieClipLabel";
import Timeline from "./animate/Timeline";
import Tween from "./animate/Tween";

Agile.Css = Css;

Agile.DisplayObject = DisplayObject;
Agile.Container = Container;
Agile.Circle = Circle;
Agile.Dom = Dom;
Agile.Ellipse = Ellipse;
Agile.Image = Image;
Agile.Line = Line;
Agile.MovieClip = MovieClip;
Agile.Rect = Rect;
Agile.SpriteSheet = SpriteSheet;
Agile.Text = Text;
Agile.Triangle = Triangle;
Agile.ScrollingBg = ScrollingBg;
Agile.Semicircle = Semicircle;

Agile.Color = Color;
Agile.Filter = Filter;
Agile.Utils = Utils;
Agile.LoadManager = LoadManager;

Agile.MovieClipLabel = MovieClipLabel;
Agile.Keyframes = Keyframes;
Agile.Timeline = Timeline;
Agile.Tween = Tween;
Agile.ease = ease;

Agile.gradient = Color.gradient.bind(Color);

Object.assign(Agile, ease);

// export
// export {
//   Css,
//   DisplayObject,
//   Container,
//   Circle,
//   Dom,
//   Ellipse,
//   Image as AgileImage,
//   Line,
//   MovieClip,
//   Rect,
//   SpriteSheet,
//   Text,
//   Triangle,
//   ScrollingBg,
//   Semicircle,
//   Color,
//   Filter,
//   Utils,
//   LoadManager,
//   MovieClipLabel,
//   Keyframes,
//   Timeline,
//   Tween,
//   ease
// };
export default Agile;
