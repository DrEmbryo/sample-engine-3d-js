import { Vector3 } from "three";
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
  verticies = [];
  triangles = [];

  constructor(verticies, edges) {
    this.verticies = verticies;
    this.triangles = edges.map(
      ({ p0, p1, p2, color }) =>
        new Triangle(verticies[p0], verticies[p1], verticies[p2], color)
    );
  }
}
