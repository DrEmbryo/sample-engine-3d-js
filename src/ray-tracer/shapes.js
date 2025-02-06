export class Sphere {
  constructor(center, radius, color) {
    this.center = center;
    this.radius = radius;
    this.color = `rgb(${color.join(",")})`;
  }
}
