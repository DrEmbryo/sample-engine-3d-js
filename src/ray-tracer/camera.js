import { Vector3 } from "three";

export class Camera {
  O = new Vector3(0, 0, 0);
  Vw = 1;
  Vh = 1;
  d = 1;

  constructor(config) {
    this.config = config;
  }

  castOnViewport(x, y) {
    const { screenHeight: Ch, screenWidth: Cw } = this.config;
    return new Vector3((x * this.Vw) / Cw, (y * this.Vh) / Ch, this.d);
  }
}
