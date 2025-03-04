import { Vector3 } from "threejs-math";
import { clamp } from "../ray-tracer/math";

export class Point {
  constructor(x, y, intencity) {
    this.x = x;
    this.y = y;
    this.h = clamp(intencity, [0, 1]);
  }
}

export class Triangle {
  color = new Vector3(255, 255, 255);

  constructor(p0, p1, p2, color) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.color = color;
  }
}

export class Shape {
  identifier = "";
  verticies = [];
  triangles = [];

  constructor(
    identifier,
    verticies,
    edges,
    translation = new Vector3(1, 1, 1)
  ) {
    this.identifier = identifier;
    this.verticies = verticies.map((v) =>
      new Vector3(v.x, v.y, v.z).add(translation)
    );

    this.triangles = edges.map(
      ({ p0, p1, p2, color }) =>
        new Triangle(
          this.verticies[p0],
          this.verticies[p1],
          this.verticies[p2],
          color
        )
    );
  }
}

export class ShapeInstance {
  constructor({ identifier, translation, scale, rotation }) {
    this.identifier = identifier || shapes.unknown;
    this.translation = translation || new Vector3(0, 0, 0);
    this.scale = scale || 0;
    this.rotation = rotation || new Vector3(0, 0, 0);
  }
}

export const shapes = {
  cube: "cube",
  unknown: "",
};
