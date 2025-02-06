export const LightTypes = {
  ambient: 0,
  point: 1,
  directional: 2,
};

class Light {
  constructor(type, intensity) {
    this.type = type;
    this.intensity = intensity;
  }
}

export class AmbientLight extends Light {
  constructor(intensity) {
    super(LightTypes.ambient, intensity);
  }
}

export class PointLight extends Light {
  constructor(intensity, position) {
    super(LightTypes.point, intensity);
    this.position = position;
  }
}

export class DirectionalLight extends Light {
  constructor(intensity, direction) {
    super(LightTypes.directional, intensity);
    this.direction = direction;
  }
}
