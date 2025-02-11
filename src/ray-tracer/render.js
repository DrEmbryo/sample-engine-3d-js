import { Vector3 } from "three.js";

import { clamp, inRange } from "./math";

import { Canvas } from "./canvas";
import { Camera } from "./camera";

import { AmbientLight, PointLight } from "./light";

export class Render {
  #backgroundColor = new Vector3(0, 0, 0);

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

    const { x: r, y: g, z: b } = color;
    this.canvas.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    this.canvas.ctx.fillRect(Sx, Sy, 1, 1);
  }

  traceRay(O, D, t_min, t_max) {
    const { closest_shape, closest_t } = this.closestItersection(
      O,
      D,
      t_min,
      t_max
    );

    if (!closest_shape) {
      return this.#backgroundColor;
    }

    const { x: Ox, y: Oy, z: Oz } = O;
    const P = new Vector3(Ox, Oy, Oz).addScalar(closest_t).multiply(D); // ray intersection

    const { x: Px, y: Py, z: Pz } = P;
    let N = new Vector3(Px, Py, Pz).sub(closest_shape.center); // sphere normal at intersection

    const { x: Nx, y: Ny, z: Nz } = N;
    N = new Vector3(Nx, Ny, Nz).divideScalar(N.length());

    const { x: Dx, y: Dy, z: Dz } = D;
    const negativeD = new Vector3(Dx, Dy, Dz).multiplyScalar(-1);

    const computedLight = this.computeLighting(
      P,
      N,
      negativeD,
      closest_shape.specular
    );
    const { x: CSCx, y: CSCy, z: CSCz } = closest_shape.color;
    return new Vector3(CSCx, CSCy, CSCz).multiplyScalar(computedLight);
  }

  closestItersection(O, D, t_min, t_max) {
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
    return { closest_shape, closest_t };
  }

  intersectRayShape(O, D, sphere) {
    const r = sphere.radius;

    const { x: Ox, y: Oy, z: Oz } = O;
    const CO = new Vector3(Ox, Oy, Oz).sub(sphere.center);

    const { x: Dx, y: Dy, z: Dz } = D;
    const a = new Vector3(Dx, Dy, Dz).dot(D);

    const { x: COx, y: COy, z: COz } = CO;
    const b = new Vector3(COx, COy, COz).dot(D) * 2;
    const c = new Vector3(COx, COy, COz).dot(CO) - Math.pow(r, 2);

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return { t1: Infinity, t2: Infinity };
    }

    return {
      t1: (-b + Math.sqrt(discriminant)) / (2 * a),
      t2: (-b - Math.sqrt(discriminant)) / (2 * a),
    };
  }

  computeLighting(P, N, V, s) {
    let i = 0;

    for (const light of this.scene.lights) {
      let t_max = 0;
      if (light instanceof AmbientLight) {
        i += light.intensity;
      } else {
        let L = null;

        if (light instanceof PointLight) {
          const { x: LPx, LPy, LPz } = light.position;
          L = new Vector3(LPx, LPy, LPz).sub(P);
          t_max = 1;
        } else {
          const { x: LDx, y: LDy, z: LDz } = light.direction;
          L = new Vector3(LDx, LDy, LDz);
          t_max = Infinity;
        }

        //shadow
        const { closest_shape } = this.closestItersection(P, L, 0.001, t_max);

        if (closest_shape != null) {
          continue;
        }

        // diffuse
        const { x: Nx, y: Ny, z: Nz } = N;
        const { x: Lx, y: Ly, z: Lz } = L;
        const n_dot_l = new Vector3(Nx, Ny, Nz).dot(L);

        if (n_dot_l > 0) {
          i +=
            (light.intensity * n_dot_l) /
            (new Vector3(Nx, Ny, Nz).length() *
              new Vector3(Lx, Ly, Lz).length());
        }

        // specular
        if (s != -1) {
          const { x: Nx, y: Ny, z: Nz } = N;
          const n_dot_l = new Vector3(Nx, Ny, Nz).dot(L);

          const R = new Vector3(Nx, Ny, Nz)
            .multiplyScalar(2)
            .multiplyScalar(n_dot_l)
            .sub(L);

          const { x: Rx, y: Ry, z: Rz } = R;
          const r_dot_v = new Vector3(Rx, Ry, Rz).dot(V);

          if (r_dot_v > 0) {
            i +=
              light.intensity *
              Math.pow(r_dot_v / (R.length() * V.length()), s);
          }
        }
      }
    }
    return i;
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
