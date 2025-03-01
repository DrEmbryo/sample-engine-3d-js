import { Vector3 } from "three";

import { Render } from "./render";
import { Point, Triangle } from "./shapes";

const render = new Render({
  elementId: "screen",
  screenWidth: 540,
  screenHeight: 540,
});

render.drawShadedTri(
  new Triangle(
    new Point(-200, -250, 0),
    new Point(200, 50, 0),
    new Point(20, 250, 1)
  ),
  new Vector3(255, 0, 0)
);
