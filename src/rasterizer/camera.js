import { Vector3 } from "threejs-math";

export class Camera {
  O = new Vector3(0, 0, 0);
  Vw = 100000;
  Vh = 100000;
  d = 2;

  constructor(config) {
    this.config = config;
  }

  castOnViewport(x, y) {
    const { screenHeight: Ch, screenWidth: Cw } = this.config;
    return { x: (x * this.Vw) / Cw, y: (y * this.Vh) / Ch };
  }

  projectVertex(v) {
    return this.castOnViewport((v.x * this.d) / v.z, (v.y * this.d) / v.z);
  }
}
