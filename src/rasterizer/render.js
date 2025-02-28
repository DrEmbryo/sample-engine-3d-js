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
    let p0 = P0;
    let p1 = P1;

    const swap = () => {
      let tmp = null;
      tmp = p0;
      p0 = p1;
      p1 = tmp;
    };

    if (Math.abs(p1.x - p0.x) > Math.abs(p1.y - p0.y)) {
      if (p0.x > p1.x) {
        swap();
      }

      const ys = this.interpolate(p0, p1);

      for (let x = p0.x; x < p1.x; x++) {
        this.putPixel(x, ys[x - p0.x], color);
      }
    } else {
      if (p0.y > p1.y) {
        swap();
      }

      const xs = this.interpolate(p0, p1);

      for (let y = p0.y; y < p1.y; y++) {
        this.putPixel(xs[y - p0.y], y, color);
      }
    }
  }

  interpolate({ x: i0, y: d0 }, { x: i1, y: d1 }) {
    if (i0 == i1) {
      return [d0];
    }
    const values = [];

    const a = (d1 - d0) / (i1 - i0);
    let d = d0;

    for (let i = i0; i < i1; i++) {
      values.push(d);
      d = d + a;
    }

    return values;
  }
}
