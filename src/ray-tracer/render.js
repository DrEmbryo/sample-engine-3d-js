import { Vector3 } from "three.js";

import { clamp, inRange } from "./math";

import { Canvas } from "./canvas";
import { Camera } from "./camera";

export class Render {
  #backgroundColor = "rgb(0,0,0)";

  constructor(config, scene) {
    this.config = config;
    this.canvas = new Canvas(config);
    this.canvas.clear();
    this.camera = new Camera(config);

    this.scene = scene;
  }

  putPixel(x, y, color) {
    const { screenHeight: Ch, screenWidth: Cw } = this.config;

    const Cx = clamp(x, [(-1 * Cw) / 2, Cw / 2]);
    const Cy = clamp(y, [(-1 * Ch) / 2, Ch / 2]);

    const Sx = Cw / 2 + Cx;
    const Sy = Ch / 2 - Cy;

    this.canvas.ctx.fillStyle = color;
    this.canvas.ctx.fillRect(Sx, Sy, 1, 1);
  }

  traceRay(O, D, t_min, t_max) {
    let closest_t = Infinity;
    let closest_shape = null;
    for (const shape of this.scene.shapes) {
      const { t1, t2 } = this.intersectRayShape(O, D, shape);
      if (inRange(t1, [t_min, t_max]) && t1 < closest_t) {
        closest_t = t1;
        closest_shape = shape;
      }
      if (inRange(t2, [t_min, t_max]) && t2 < closest_t) {
        closest_t = t2;
        closest_shape = shape;
      }
    }
    if (!closest_shape) {
      return this.#backgroundColor;
    }
    return closest_shape.color;
  }

  intersectRayShape(O, D, sphere) {
    const r = sphere.radius;
    const CO = new Vector3(O.x, O.y, O.z).sub(sphere.center);

    const a = new Vector3(D.x, D.y, D.z).dot(D);
    const b = new Vector3(CO.x, CO.y, CO.z).dot(D) * 2;
    const c = new Vector3(CO.x, CO.y, CO.z).dot(CO) - r * r;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return { t1: Infinity, t2: Infinity };
    }

    return {
      t1: (-b + Math.sqrt(discriminant)) / (2 * a),
      t2: (-b - Math.sqrt(discriminant)) / (2 * a),
    };
  }

  draw() {
    const { screenHeight: Ch, screenWidth: Cw } = this.config;
    for (let x = (-1 * Ch) / 2; x < Ch / 2; x++) {
      for (let y = (-1 * Cw) / 2; y < Ch / 2; y++) {
        const D = this.camera.castOnViewport(x, y);
        const color = this.traceRay(this.camera.O, D, 1, Infinity);
        this.putPixel(x, y, color);
      }
    }
  }
}
