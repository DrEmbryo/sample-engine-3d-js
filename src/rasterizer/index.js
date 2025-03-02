import { Vector3 } from "three";

import { Render } from "./render";
import { Camera } from "./camera";

const render = new Render({
  elementId: "screen",
  screenWidth: 540,
  screenHeight: 540,
});

const camera = new Camera({ screenWidth: 540, screenHeight: 540 });

let vAf = new Vector3(-2, -0.5, 5);
let vBf = new Vector3(-2, 0.5, 5);
let vCf = new Vector3(-1, 0.5, 5);
let vDf = new Vector3(-1, -0.5, 5);
let vAb = new Vector3(-2, -0.5, 6);
let vBb = new Vector3(-2, 0.5, 6);
let vCb = new Vector3(-1, 0.5, 6);
let vDb = new Vector3(-1, -0.5, 6);

console.log(
  camera.projectVertex(vAf),
  camera.projectVertex(vBf),
  new Vector3(255, 0, 0)
);

// The front face
render.drawLine(
  camera.projectVertex(vAf),
  camera.projectVertex(vBf),
  new Vector3(255, 0, 0)
);
render.drawLine(
  camera.projectVertex(vBf),
  camera.projectVertex(vCf),
  new Vector3(255, 0, 0)
);
render.drawLine(
  camera.projectVertex(vCf),
  camera.projectVertex(vDf),
  new Vector3(255, 0, 0)
);
render.drawLine(
  camera.projectVertex(vDf),
  camera.projectVertex(vAf),
  new Vector3(255, 0, 0)
);

// The back face
render.drawLine(
  camera.projectVertex(vAb),
  camera.projectVertex(vBb),
  new Vector3(255, 255, 0)
);
render.drawLine(
  camera.projectVertex(vBb),
  camera.projectVertex(vCb),
  new Vector3(255, 255, 0)
);
render.drawLine(
  camera.projectVertex(vCb),
  camera.projectVertex(vDb),
  new Vector3(255, 255, 0)
);
render.drawLine(
  camera.projectVertex(vDb),
  camera.projectVertex(vAb),
  new Vector3(255, 255, 0)
);

// The front-to-back edges
render.drawLine(
  camera.projectVertex(vAf),
  camera.projectVertex(vAb),
  new Vector3(255, 0, 255)
);
render.drawLine(
  camera.projectVertex(vBf),
  camera.projectVertex(vBb),
  new Vector3(255, 0, 255)
);
render.drawLine(
  camera.projectVertex(vCf),
  camera.projectVertex(vCb),
  new Vector3(255, 0, 255)
);
render.drawLine(
  camera.projectVertex(vDf),
  camera.projectVertex(vDb),
  new Vector3(255, 0, 255)
);
