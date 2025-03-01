import { clamp } from "../ray-tracer/math";

export class Point {
  constructor(x, y, intencity) {
    this.x = x;
    this.y = y;
    this.h = clamp(intencity, [0, 1]);
  }
}

export class Triangle {
  constructor(p0, p1, p2) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
  }
}
