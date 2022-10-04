import {Vector3} from "three";

export default class Curve{
    private points : Array<Vector3>;
    constructor(points: Array<any>){
        this.points = points;
        console.log(this.points);
    }

    public Sample(x : number){
        if(this.points.length === 0) return new Vector3(0, 0, 0);
        
        let ratio = 1.0 / (this.points.length - 1);
        
        let fromIdx = Math.floor(x / ratio);
        let toIdx = fromIdx + 1;
        
        let fromInfluence = (1 - (x - fromIdx * ratio) * (this.points.length - 1));
        let toInfluence = 1 - (toIdx * ratio - x) * (this.points.length - 1);
        
        let from = this.points[fromIdx].clone();
        let to = this.points[toIdx].clone();
        // console.log(x + ", " + fromIdx + ", " + toIdx + ", " + fromInfluence + ", " + toInfluence);
        let result =  from.multiplyScalar(fromInfluence).add
        (to.multiplyScalar(toInfluence));
        return result;
    }
}