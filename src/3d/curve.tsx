import { Vector3 } from "three";

class Curve {
  private points: Array<Vector3>;

  constructor(points: Array<any>) {
    this.points = points;
  }

  public Sample(x: number): Vector3 {
    if (this.points.length === 0) {
      console.error('Expected to receive an Array of Vector3 points when constructing the Curve.');
      return new Vector3(0, 0, 0);
    }

    const ratio = 1.0 / (this.points.length - 1);

    const fromIdx = Math.floor(x / ratio);
    const toIdx = fromIdx + 1;

    const fromInfluence = (1 - (x - fromIdx * ratio) * (this.points.length - 1));
    const toInfluence = 1 - (toIdx * ratio - x) * (this.points.length - 1);

    const from = this.points[fromIdx].clone();
    const to = this.points[toIdx].clone();
    const result = from.multiplyScalar(fromInfluence).add
      (to.multiplyScalar(toInfluence));
    return result;
  }
}

export default Curve;
