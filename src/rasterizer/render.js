import { Vector3 } from "threejs-math";
import { Canvas } from "../ray-tracer/canvas";
import { clamp } from "../ray-tracer/math";
import { Camera } from "./camera";
import { Triangle } from "./shapes";
import { Scene } from "./scene";

export class Render {
  constructor(config) {
    this.config = config;
    this.canvas = new Canvas(config);
    this.canvas.clear();
    this.camera = new Camera(config);
    this.scene = new Scene(config);
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

  drawFrameTri({ p0, p1, p2, color }) {
    this.drawLine(p0, p1, color);
    this.drawLine(p1, p2, color);
    this.drawLine(p2, p0, color);
  }

  drawShadedTri({ p0: P0, p1: P1, p2: P2 }, color) {
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
    const h01 = this.interpolate({ x: p0.y, y: p0.h }, { x: p1.y, y: p1.h });

    const x12 = this.interpolate({ x: p1.y, y: p1.x }, { x: p2.y, y: p2.x });
    const h12 = this.interpolate({ x: p1.y, y: p1.h }, { x: p2.y, y: p2.h });

    const x02 = this.interpolate({ x: p0.y, y: p0.x }, { x: p2.y, y: p2.x });
    const h02 = this.interpolate({ x: p0.y, y: p0.h }, { x: p2.y, y: p2.h });

    x01.pop();
    h01.pop();

    const x012 = [...x01, ...x12];
    const h012 = [...h01, ...h12];

    let x_left = null;
    let h_left = null;
    let x_right = null;
    let h_right = null;

    const mid = Math.floor(x012.length / 2);
    if (x02[mid] < x012[mid]) {
      x_left = x02;
      h_left = h02;

      x_right = x012;
      h_right = h012;
    } else {
      x_left = x012;
      h_left = h012;

      x_right = x02;
      h_right = h02;
    }

    for (let y = p0.y; y < p2.y; y++) {
      const x_l = x_left[y - p0.y];
      const x_r = x_right[y - p0.y];

      const h_segment = this.interpolate(
        { x: x_l, y: h_left[y - p0.y] },
        { x: x_r, y: h_right[y - p0.y] }
      );

      for (let x = x_l; x < x_r; x++) {
        const { x: r, y: g, z: b } = color;
        const shadedColor = new Vector3(r, g, b).multiplyScalar(
          h_segment[x - x_l]
        );

        this.putPixel(x, y, shadedColor);
      }
    }
  }

  renderShape(shape, translation = new Vector3(0, 0, 0)) {
    const projected = {};

    for (const V of shape.verticies) {
      const { x, y, z } = V;
      const Vt = new Vector3(x, y, z).add(translation);
      projected[`${x}${y}${z}`] = this.camera.projectVertex(Vt);
    }

    for (const T of shape.triangles) {
      this.renderTriangel(T, projected);
    }
  }

  renderTriangel(triangle, projected) {
    const { p0, p1, p2, color } = triangle;
    this.drawFrameTri(
      new Triangle(
        projected[`${p0.x}${p0.y}${p0.z}`],
        projected[`${p1.x}${p1.y}${p1.z}`],
        projected[`${p2.x}${p1.y}${p2.z}`],
        color
      )
    );
  }

  renderScene() {
    for (const shapeInstance of this.scene.objects) {
      this.renderInstance(shapeInstance);
    }
  }

  renderInstance(instance) {
    this.renderShape(this.scene.shapes[instance.identifier], instance.position);
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
