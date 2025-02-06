import { Vector3 } from "three.js";
import { Sphere } from "./shapes";
import { Render } from "./render";

const render = new Render(
  {
    elementId: "screen",
    screenWidth: 256,
    screenHeight: 256,
  },
  {
    shapes: [
      new Sphere(new Vector3(0, -1, 3), 1, [255, 0, 0]),
      new Sphere(new Vector3(2, 0, 4), 1, [0, 0, 255]),
      new Sphere(new Vector3(-2, 0, 4), 1, [0, 255, 0]),
    ],
    lights: [
      { type: "ambient", intencity: 0.2 },
      { type: "point", intensity: 0.6, position: new Vector3(2, 1, 0) },
    ],
  }
);

render.draw();
