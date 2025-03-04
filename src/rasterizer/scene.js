export class Scene {
  shapes = {};

  constructor({ shapes, objects }) {
    shapes.forEach((shape) => {
      this.shapes[shape.identifier] = shape;
    });

    this.objects = objects;
  }
}
