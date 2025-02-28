import { Vector3 } from "three";

import { Canvas } from "../ray-tracer/canvas";
import { clamp } from "../ray-tracer/math";

export class Render {
  #backgroundColor = new Vector3(0, 0, 0);

  constructor(config, scene) {
    this.config = config;
    this.canvas = new Canvas(config);
    this.canvas.clear();

    this.scene = scene;
  }

  putPixel(x, y, color) {
    const { screenHeight: Ch, screenWidth: Cw } = this.config;

    const Cx = clamp(x, [(-1 * Cw) / 2, Cw / 2]);
    const Cy = clamp(y, [(-1 * Ch) / 2, Ch / 2]);

    const Sx = Cw / 2 + Cx;
    const Sy = Ch / 2 - Cy;

    const { x: r, y: g, z: b } = color;
    this.canvas.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    this.canvas.ctx.fillRect(Sx, Sy, 1, 1);
  }

  drawLine(P0, P1, color) {
    let x0 = P0.x;
    let y0 = P0.y;
    let x1 = P1.x;
    let y1 = P1.y;
    if (P0.x > P1.x) {
      x0 = P1.x;
      y0 = P1.y;
      x1 = P0.x;
      y1 = P0.y;
    }
    const a = (y1 - y0) / (x1 - x0);
    let y = y0;
    for (let x = x0; x < x1; x++) {
      this.putPixel(x, y, color);
      y = y + a;
    }
  }
}
