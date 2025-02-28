import { Vector3 } from "three";

import { Render } from "./render";

const render = new Render({
  elementId: "screen",
  screenWidth: 256,
  screenHeight: 256,
});

render.drawLine(
  { x: -200, y: -100 },
  { x: 240, y: 120 },
  new Vector3(255, 255, 255)
);

render.drawLine(
  { x: -50, y: -20 },
  { x: -20, y: -40 },
  new Vector3(255, 255, 255)
);
