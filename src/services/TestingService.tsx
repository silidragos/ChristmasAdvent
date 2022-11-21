import { Vector3, Mesh, Quaternion, Euler } from "three";

let test1Passed = false;

export function Test1(leftBattery : Mesh, rightBattery: Mesh){
    const leftBatteryWorldPos = new Vector3();
    leftBattery.getWorldPosition(leftBatteryWorldPos);
    const leftBatteryDistance = leftBatteryWorldPos.distanceTo(new Vector3(-0.75, 2.1, 0.8));

    const leftBatteryRotation = GetWorldRotation(leftBattery);
    const isLeftBatteryInCorrectRotation = Math.abs(leftBatteryRotation.x - Math.PI / 2.0) < 0.1 &&
        Math.abs(leftBatteryRotation.y) < 0.1 &&
        Math.abs(leftBatteryRotation.z) < 0.1;

    const rightBatteryWorldPos = new Vector3();
    rightBattery.getWorldPosition(rightBatteryWorldPos);
    const rightBatteryDistance = rightBatteryWorldPos.distanceTo(new Vector3(-0.75, 2.1, -.65));

    const rightBatteryRotation = GetWorldRotation(rightBattery);
    const isRightBatteryInCorrectRotation = Math.abs(rightBatteryRotation.x - Math.PI/2) < 0.1 &&
        Math.abs(rightBatteryRotation.y) < 0.1 &&
        Math.abs(rightBatteryRotation.z) < 0.1;

    //@ts-ignore
    test1Passed = leftBatteryDistance < 0.1 && rightBatteryDistance < 0.1 && isLeftBatteryInCorrectRotation && isRightBatteryInCorrectRotation;

}
export function Test1Passed() : boolean{
    return test1Passed;
}

function GetWorldRotation(mesh: Mesh): Euler {
    const quatRot = new Quaternion();
    mesh.getWorldQuaternion(quatRot);
    let eulerRot = new Euler().setFromQuaternion(quatRot);
    return eulerRot;
    //leftBatteryRotationInEuler = 180  / Math.PI * leftBatteryRotationInEuler.x;
}