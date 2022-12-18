import { useThree } from "@react-three/fiber";
import { Vector3, Mesh, Quaternion, Euler, Scene } from "three";
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
let test2_expectedTypes = [
    "boxGeometry",
    "sphereGeometry",
    "torusGeometry"
]

export function Test2(gifts: any[]) {
    let types = gifts.map(gift => gift.props.children.type);
    for (let expectedType of test2_expectedTypes) {
        if (!types.includes(expectedType)) {
            test2Passed = false;
            console.warn(`No ${expectedType} found!`)
            return;
        }
    }

    console.log(`All types were found!`)
    test2Passed = true;
}

export function Test2Passed() {
    return test2Passed;
}

// ---------- Test 3 -------------

// ---------- Test 4 -------------
let test4Passed = false;

let test4_materialsInfo = [
    { type: "meshPhongMaterial", color: "green" },
    { type: "meshPhongMaterial", color: "red" },
    { type: "meshPhongMaterial", color: "yellow" }
]
export function Test4(materials: any[]) {
    for (let i = 0; i < materials.length; i++) {
        if (materials[i].type !== test4_materialsInfo[i].type ||
            materials[i].props.attach !== "material" ||
            materials[i].props.color !== test4_materialsInfo[i].color) {
            test4Passed = false;
            console.log(`Material ${i} failed.`);
            return;
        }
    }

    test4Passed = true;
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
    const onMessage = (message: WindowMessage) => {
        const didTest2Pass = Test2Passed();
        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_2_RESULT,
            payload: {
                status: didTest2Pass,
                reason: 'Test failed. Reason TBD'
            }
        });

        console.log(didTest2Pass);
    }

    useWindowEvent(WINDOW_EVENTS.TEST_2_RUN, onMessage);
    return null;
}

const Test4Component = () => {
    const onMessage = () => {
        const didTest4Pass = Test4Passed();
        emitWindowEvent({
            type: WINDOW_EVENTS.TEST_4_RESULT,
            payload: {
                status: didTest4Pass,
                reason: 'Test failed. Reason TBD'
            }
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
