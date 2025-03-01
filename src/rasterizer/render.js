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

    if (Math.abs(p1.x - p0.x) > Math.abs(p1.y - p0.y)) {
      if (p0.x > p1.x) {
        const [np0, np1] = this.swap(p0, p1);
        p0 = np0;
        p1 = np1;
      }

      const ys = this.interpolate({ x: p0.x, y: p0.y }, { x: p1.x, y: p1.y });
      for (let x = p0.x; x < p1.x; x++) {
        this.putPixel(x, ys[x - p0.x], color);
      }
    } else {
      if (p0.y > p1.y) {
        const [np0, np1] = this.swap(p0, p1);
        p0 = np0;
        p1 = np1;
      }

      const xs = this.interpolate({ x: p0.y, y: p0.x }, { x: p1.y, y: p1.x });

      for (let y = p0.y; y < p1.y; y++) {
        this.putPixel(xs[y - p0.y], y, color);
      }
    }
  }

  drawFrameTri({ p0, p1, p2 }, color) {
    this.drawLine(p0, p1, color);
    this.drawLine(p1, p2, color);
    this.drawLine(p2, p0, color);
  }

  drawFillTri({ p0: P0, p1: P1, p2: P2 }, color) {
    let p0 = P0;
    let p1 = P1;
    let p2 = P2;

    if (p1.y < p0.y) {
      const [np0, np1] = this.swap(p1, p0);
      p0 = np0;
      p1 = np1;
    }

    if (p2.y < p0.y) {
      const [np0, np1] = this.swap(p2, p0);
      p0 = np0;
      p2 = np1;
    }

    if (p2.y < p1.y) {
      const [np0, np1] = this.swap(p2, p1);
      p2 = np0;
      p1 = np1;
    }

    const x01 = this.interpolate({ x: p0.y, y: p0.x }, { x: p1.y, y: p1.x });
    const x12 = this.interpolate({ x: p1.y, y: p1.x }, { x: p2.y, y: p2.x });
    const x02 = this.interpolate({ x: p0.y, y: p0.x }, { x: p2.y, y: p2.x });

    x01.pop();
    const x012 = [...x01, ...x12];

    let x_left = null;
    let x_right = null;

    const mid = Math.floor(x012.length / 2);
    if (x02[mid] < x012[mid]) {
      x_left = x02;
      x_right = x012;
    } else {
      x_left = x012;
      x_right = x02;
    }
    for (let y = p0.y; y < p2.y; y++) {
      for (let x = x_left[y - p0.y]; x < x_right[y - p0.y]; x++) {
        this.putPixel(x, y, color);
      }
    }
  }

  swap(p0, p1) {
    let tmp = null;
    tmp = p0;
    p0 = p1;
    p1 = tmp;
    return [p0, p1];
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
