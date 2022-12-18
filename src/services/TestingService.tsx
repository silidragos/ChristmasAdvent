import { useThree } from "@react-three/fiber";
import { Vector3, Mesh, Quaternion, Euler, Scene } from "three";
import Curve from "../3d/curve";
import { Day3_CalculateNewPosition } from "../3d/gifts";
import { WINDOW_EVENTS } from "./Constants";
import ElementsFactory from "./ElementsFactory";
import { emitWindowEvent, useWindowEvent, WindowMessage } from "./WindowEvents";

interface TestResult {
    valid: boolean;
    error?: {
        // Human readable description of what failed.
        description: string;

        // Optional Stack Trace in case the code/program
        // doesn't even run/compile.
        stackTrace?: string;

        // Optional suggestions for fixing the problem.
        // These are meant to be shown to the user,
        // and guide him towards the fix.
        suggestions?: string[];
    };
}

const GENERIC_ERROR_MESSAGE = 'Nu am putut să evaluăm soluția. Dacă problema persistă, dă-ne un email.';

// ---------- Test 1 -------------

let test1Passed = false;
const test1_leftBatteryPos = new Vector3(-0.75, 2.1, 0.8);
const test1_rightBatterPos = new Vector3(-0.75, 2.1, -.65);
const test1_expectedYRotLeft = Math.PI / 2.0;
const test1_expectedYRotRight = -Math.PI / 2.0;

export function Test1(scene: Scene, leftBatteryName: string, rightBatteryName: string): TestResult {
    try {
        const maybeLeftBatteryMesh = scene.getObjectByName(leftBatteryName);
        const maybeRightBatteryMesh = scene.getObjectByName(rightBatteryName);

        if (maybeLeftBatteryMesh === undefined || maybeRightBatteryMesh === undefined) {
            return {
                valid: false,
                error: {
                    description: 'Nu am putut găsi cele 2 baterii. Le-ai schimbat numele?'
                }
            }
        }

        const leftBattery = maybeLeftBatteryMesh as Mesh;
        const rightBattery = maybeRightBatteryMesh as Mesh;

        const leftBatteryWorldPos = new Vector3();
        leftBattery.getWorldPosition(leftBatteryWorldPos);
        const leftBatteryDistance = leftBatteryWorldPos.distanceTo(test1_leftBatteryPos);

        const leftBatteryRotation = GetWorldRotation(leftBattery);
        const isLeftBatteryInCorrectRotation = Math.abs(leftBatteryRotation.x - test1_expectedYRotLeft) < 0.1 &&
            Math.abs(leftBatteryRotation.y) < 0.1 &&
            Math.abs(leftBatteryRotation.z) < 0.1;

        const rightBatteryWorldPos = new Vector3();
        rightBattery.getWorldPosition(rightBatteryWorldPos);
        const rightBatteryDistance = rightBatteryWorldPos.distanceTo(test1_rightBatterPos);

        const rightBatteryRotation = GetWorldRotation(rightBattery);
        const isRightBatteryInCorrectRotation = Math.abs(rightBatteryRotation.x - test1_expectedYRotRight) < 0.1 &&
            Math.abs(rightBatteryRotation.y) < 0.1 &&
            Math.abs(rightBatteryRotation.z) < 0.1;

        //@ts-ignore
        test1Passed = leftBatteryDistance < 0.1 && rightBatteryDistance < 0.1 && isLeftBatteryInCorrectRotation && isRightBatteryInCorrectRotation;

        return {
            valid: test1Passed,
            error: test1Passed === true
                ? undefined
                : {
                    description: 'Bateriile nu sunt corect poziționate!',
                }
        };
    } catch (err) {
        console.error(GENERIC_ERROR_MESSAGE, err);
        return {
            valid: false,
            error: {
                description: GENERIC_ERROR_MESSAGE,
                stackTrace: err instanceof Error
                    ? err.stack
                    : undefined
            }
        };
    }
}

export function Test1Passed(): boolean {
    return test1Passed;
}

function GetWorldRotation(mesh: Mesh): Euler {
    const quatRot = new Quaternion();
    mesh.getWorldQuaternion(quatRot);
    let eulerRot = new Euler().setFromQuaternion(quatRot);
    return eulerRot;
    //leftBatteryRotationInEuler = 180  / Math.PI * leftBatteryRotationInEuler.x;
}

// ---------- Test 2 -------------

let test2Passed = false;
let test2_expectedTypes: {
    // This is the actual type we're checking to see if the
    // implementation is correct.
    type: string;

    // This is meant to be human-readable.
    // Usually displayed as an Error message.
    label: string;
}[] = [
    { type: 'boxGeometry', label: 'box' },
    { type: 'sphereGeometry', label: 'sphere' },
    { type: 'coneGeometry', label: 'torus' },
    { type: 'tetrahedronGeometry', label: 'torus' },
    { type: 'octahedronGeometry', label: 'torus' },
];

export function Test2(gifts: JSX.Element[]): TestResult {
    const giftTypes = gifts.map(gift => gift.props.children.type);

    for (let { type, label } of test2_expectedTypes) {
        if (!giftTypes.includes(type)) {
            test2Passed = false;
            console.warn(`No ${type} found!`)
            return {
                valid: false,
                error: {
                    description: `Nu am putut găsi o geometrie de tipul "${label}".`
                }
            }
        }
    }

    console.log(`All types were found!`)
    test2Passed = true;

    return {
        valid: true,
    }
}

export function Test2Passed() {
    return test2Passed;
}

// ---------- Test 3 -------------

let test3Passed = false;

let isCorrect:Array<boolean> = [];

for(let i=0; i< 10; i++){
    isCorrect.push(false);
}

export function Test3({ idx, curve, initialOffset, giftSpeedPerSecond, giftPosReferences}: { idx:number, curve: Curve, initialOffset: number, giftSpeedPerSecond: number, giftPosReferences: any}): TestResult {
    let newOffset = (initialOffset + Date.now()/1000.0 * giftSpeedPerSecond) % 1;
    let expectedPos = Day3_CalculateNewPosition(curve, newOffset, ()=>{});
    
    const dist = expectedPos.distanceTo(giftPosReferences[idx].position); 
    isCorrect[idx] = dist < 0.1;

    test3Passed = true;
    return {
        valid: isCorrect[idx],
    }
}

export function Test3Passed() {
    return isCorrect.findIndex(val => val === false) === -1;
}
// ---------- Test 4 -------------
let test4Passed = false;

let test4_materialsInfo: {
    type: string,
    color: string;
    // Romanian label used to correctly display the error
    // string (if any) to the user.
    colorLabel: string;
}[] = [
    { type: "meshStandardMaterial", color: "green", colorLabel: "verde" },
    { type: "meshStandardMaterial", color: "green", colorLabel: "verde" },
    { type: "meshStandardMaterial", color: "red", colorLabel: "roșu" },
    { type: "meshBasicMaterial", color: "pink", colorLabel: "roz" },
    { type: "meshToonMaterial", color: "blue", colorLabel: "albastru" },
]
export function Test4(materials: JSX.Element[]): TestResult {
    for(let i = 0; i< test4_materialsInfo.length; i++) {
        const expectedMaterial = test4_materialsInfo[i];

        // Check whether this material exists
        const match = materials.find((material) =>  {
            return (
                material.type === expectedMaterial.type &&
                material.props.attach === "material" &&
                material.props.color === expectedMaterial.color
            );
        });

        if (match === undefined) {
            return {
                valid: false,
                error: {
                    description: `Nu am găsit un material de tipul "${expectedMaterial.type}" și culoarea "${expectedMaterial.colorLabel}".`
                }
            }
        }
    }

    test4Passed = true;
    return {
        valid: true
    }
}

export function Test4Passed() {
    return test4Passed;
}


// ---------- Test 5 -------------

let test5Passed = true;

export function Test5(totalTime: number, value: number) {
    if (!test5Passed) return false;
    if (value - Math.sin(totalTime * 2.1) < 0.01) {
        test5Passed = true;
    } else {
        test5Passed = false;
    }
}
export function Test5Passed() {
    return test5Passed;
}


/**
 * ***** REACT COMPONENTS
 * These are mounted in the page and listen to Window Events
 */

const Test1Component = ({ leftBatteryName, rightBatteryName }: { leftBatteryName: string, rightBatteryName: string }) => {
    const { scene } = useThree();

    const onMessage = () => {
        let result: TestResult = Test1(scene, leftBatteryName, rightBatteryName);

        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_1_RESULT,
            payload: result
        });
    }

    useWindowEvent(WINDOW_EVENTS.TEST_1_RUN, onMessage, [leftBatteryName, rightBatteryName]);
    return null;
}

const Test2Component = ({ giftFactory }: { giftFactory: ElementsFactory }) => {
    const onMessage = () => {
        let result: TestResult = Test2(giftFactory.getAll());
        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_2_RESULT,
            payload: result,
        });
    }

    useWindowEvent(WINDOW_EVENTS.TEST_2_RUN, onMessage);
    return null;
}

const Test4Component = ({ materials }: {materials: JSX.Element[] }) => {
    const onMessage = () => {
        let result: TestResult = Test4(materials);
        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_4_RESULT,
            payload: result
        });
    }

    useWindowEvent(WINDOW_EVENTS.TEST_4_RUN, onMessage);
    return null;
}

export {
    Test1Component,
    Test2Component,
    Test4Component
};
