import { Vector3 } from "three";

import { Render } from "./render";
import { Point, Triangle } from "./shapes";

const render = new Render({
  elementId: "screen",
  screenWidth: 540,
  screenHeight: 540,
});

render.drawFrameTri(
  new Triangle(new Point(-200, -250), new Point(200, 50), new Point(20, 250)),
  new Vector3(255, 255, 255)
);

render.drawFillTri(
  new Triangle(new Point(-200, -250), new Point(200, 50), new Point(20, 250)),
  new Vector3(255, 0, 0)
);
