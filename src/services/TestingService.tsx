import { useThree } from "@react-three/fiber";
import { PublicApi } from "@react-three/cannon";
import { Vector3, Mesh, Quaternion, Euler, Scene } from "three";

import Curve from "../3d/Curve";
import ElementsFactory from "./ElementsFactory";
import { Day3_CalculateNewPosition } from "../3d/gifts";
import { emitWindowEvent, useWindowEvent } from "./WindowEvents";
import { Day6_GetSpringAPIParameters } from "../courses/day6-spring";

// Custom Testing Events
export const WINDOW_EVENTS = {
  TEST_LOAD: 'TEST_LOAD',
  TEST_LOAD_RESULT: 'TEST_LOAD_RESULT',

  // Individual tests
  TEST_1_RUN: 'TEST_1_RUN',
  TEST_1_RESULT: 'TEST_1_RESULT',

  TEST_2_RUN: 'TEST_2_RUN',
  TEST_2_RESULT: 'TEST_2_RESULT',

  TEST_3_RUN: 'TEST_3_RUN',
  TEST_3_RESULT: 'TEST_3_RESULT',

  TEST_4_RUN: 'TEST_4_RUN',
  TEST_4_RESULT: 'TEST_4_RESULT',

  TEST_5_RUN: 'TEST_5_RUN',
  TEST_5_RESULT: 'TEST_5_RESULT',

  TEST_6_RUN: 'TEST_6_RUN',
  TEST_6_RESULT: 'TEST_6_RESULT',
};

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
const TEST_1_CORRECT_BATTERY_LEFT_POS = new Vector3(-0.75, 2.1, 0.8);
const TEST_1_CORRECT_BATTERY_RIGHT_POS = new Vector3(-0.75, 2.1, -.65);
const TEST_1_CORRECT_BATTERY_LEFT_ROTATION = Math.PI / 2.0;
const TEST_1_CORRECT_BATTERY_RIGHT_ROTATION = -Math.PI / 2.0;

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
    const leftBatteryDistance = leftBatteryWorldPos.distanceTo(TEST_1_CORRECT_BATTERY_LEFT_POS);

    const leftBatteryRotation = GetWorldRotation(leftBattery);
    const isLeftBatteryInCorrectRotation = Math.abs(leftBatteryRotation.x - TEST_1_CORRECT_BATTERY_LEFT_ROTATION) < 0.1 &&
      Math.abs(leftBatteryRotation.y) < 0.1 &&
      Math.abs(leftBatteryRotation.z) < 0.1;

    const rightBatteryWorldPos = new Vector3();
    rightBattery.getWorldPosition(rightBatteryWorldPos);
    const rightBatteryDistance = rightBatteryWorldPos.distanceTo(TEST_1_CORRECT_BATTERY_RIGHT_POS);

    const rightBatteryRotation = GetWorldRotation(rightBattery);
    const isRightBatteryInCorrectRotation = Math.abs(rightBatteryRotation.x - TEST_1_CORRECT_BATTERY_RIGHT_ROTATION) < 0.1 &&
      Math.abs(rightBatteryRotation.y) < 0.1 &&
      Math.abs(rightBatteryRotation.z) < 0.1;

    const valid = leftBatteryDistance < 0.1 && rightBatteryDistance < 0.1 && isLeftBatteryInCorrectRotation && isRightBatteryInCorrectRotation;

    return {
      valid,
      error: valid === true
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

function GetWorldRotation(mesh: Mesh): Euler {
  const quatRot = new Quaternion();
  mesh.getWorldQuaternion(quatRot);
  let eulerRot = new Euler().setFromQuaternion(quatRot);
  return eulerRot;
  //leftBatteryRotationInEuler = 180  / Math.PI * leftBatteryRotationInEuler.x;
}

// ---------- Test 2 -------------
let TEST_2_EXPECTED_TYPES: {
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
  const SPAN = `[Test2, gifts.length=${gifts.length}]`;
  const giftTypes = gifts.map(gift => gift.props.children.type);

  for (let { type, label } of TEST_2_EXPECTED_TYPES) {
    if (!giftTypes.includes(type)) {
      console.warn(`${SPAN} No ${type} found!`)
      return {
        valid: false,
        error: {
          description: `Nu am putut găsi o geometrie de tipul "${label}".`
        }
      }
    }
  }

  console.log(`${SPAN} All types were found!`)

  return {
    valid: true,
  }
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

// ---------- Test 3 -------------
export function Test3({
  idx,
  curve,
  initialOffset,
  giftSpeedPerSecond,
  positions
}: {
  idx: number;
  curve: Curve;
  initialOffset: number;
  giftSpeedPerSecond: number;
  positions: THREE.Vector3[];
}): TestResult {
  if (positions[idx] === undefined) {
    return {
      valid: false
    }
  }

  let newOffset = (initialOffset + Date.now() / 1000.0 * giftSpeedPerSecond) % 1;
  let expectedPos = Day3_CalculateNewPosition(curve, newOffset, () => { });

  const dist = expectedPos.distanceTo(positions[idx]);
  const isValid = dist < 0.1;

  return {
    valid: isValid,
  }
}

const Test3Component = ({
  giftCount,
  curve,
  giftSpeedPerSecond,
  getPositions
}: {
  giftCount: number;
  curve: Curve;
  giftSpeedPerSecond: number;
  getPositions: () => THREE.Vector3[];
}) => {
  const onMessage = () => {
    const positions = getPositions();
    const testResults = new Array(giftCount).fill('').map((_, index) => {
      return Test3({
        idx: index,
        curve,
        positions,
        giftSpeedPerSecond,
        initialOffset: index * (1.0 / giftCount)
      })
    });

    const didTestPass = testResults.every(result => result.valid === true);
    emitWindowEvent({
      type: WINDOW_EVENTS.TEST_3_RESULT,
      payload: didTestPass === true
        ? { valid: true }
        : {
          valid: false,
          error: {
            description: 'Cadourile nu sunt corect poziționate pe bandă.'
          }
        },
    });
  }

  useWindowEvent(WINDOW_EVENTS.TEST_3_RUN, onMessage);
  return null;
}

// ---------- Test 4 -------------
let test4_materialsInfo: {
  type: string,
  color: string;
  // Romanian label used to correctly display the error
  // string (if any) to the user.
  colorLabel: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  transparent?: boolean;
  opacity?: number;
}[] = [
    { type: "meshStandardMaterial", color: "green", colorLabel: "verde", roughness: 1, metalness: 0 },
    { type: "meshStandardMaterial", color: "green", colorLabel: "verde", emissive: "green" },
    { type: "meshStandardMaterial", color: "red", colorLabel: "roșu", roughness: 0, metalness: 1 },
    { type: "meshBasicMaterial", color: "pink", colorLabel: "roz" },
    { type: "meshToonMaterial", color: "blue", colorLabel: "albastru", transparent: true, opacity: 0.5 },
  ]
export function Test4(materials: JSX.Element[]): TestResult {
  for (let i = 0; i < test4_materialsInfo.length; i++) {
    const expectedMaterial = test4_materialsInfo[i];

    // Check whether this material exists
    const match = materials.find((material) => {
      return (
        material.type === expectedMaterial.type &&
        material.props.attach === "material" &&
        material.props.color === expectedMaterial.color &&
        (expectedMaterial.roughness !== undefined || material.props.roughness === expectedMaterial.roughness) &&
        (expectedMaterial.metalness !== undefined || material.props.metalness === expectedMaterial.metalness) &&
        (expectedMaterial.emissive !== undefined || material.props.emissive === expectedMaterial.emissive) &&
        (expectedMaterial.transparent !== undefined || material.props.transparent === expectedMaterial.transparent) &&
        (expectedMaterial.opacity !== undefined || material.props.opacity === expectedMaterial.opacity)
      );
    });

    if (match === undefined) {
      console.log("ERROR!!", expectedMaterial);
    }

    if (match === undefined) {
      return {
        valid: false,
        error: {
          description: `Nu am găsit un material de tipul "${expectedMaterial.type}" și culoarea "${expectedMaterial.colorLabel}".`
        }
      }
    }
  }

  return {
    valid: true
  }
}

const Test4Component = ({ materials }: { materials: JSX.Element[] }) => {
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

// ---------- Test 5 -------------
async function Test5(physicsAPI: PublicApi): Promise<TestResult> {
  const SPAN = `[SubscribeForTest5]`;

  try {
    const result: TestResult = await new Promise((resolve) => {
      physicsAPI.mass.subscribe((massValue) => {
        const valid = massValue === 0;

        resolve({
          valid,
          error: valid === false
            ? {
              description: 'Soluția ta nu e corectă. Mai încearcă!'
            }
            : undefined
        });
      })
    })
    return result;
  } catch (err) {
    console.error(`${SPAN} Failed to evaluate solution`, err);
    return {
      valid: false,
      error: {
        description: GENERIC_ERROR_MESSAGE,
        stackTrace: err instanceof Error
          ? err.stack
          : undefined
      }
    }
  }
}

const Test5Component = ({ physicsAPI }: { physicsAPI: PublicApi }) => {
  const onMessage = async () => {
    let result: TestResult = await Test5(physicsAPI);
    emitWindowEvent({
      type: WINDOW_EVENTS.TEST_5_RESULT,
      payload: result
    });
  }

  useWindowEvent(WINDOW_EVENTS.TEST_5_RUN, onMessage);
  return null;
}


// ---------- Test 6 -------------
export function Test6(springApiParams: any): TestResult {
  const isPositionOddCorrect = CompareTwoArrays(springApiParams.position.odd, [0, 1, 0]);
  const isPositionEvenCorrect = CompareTwoArrays(springApiParams.position.even, [0, 0, 0]);

  const isRotationOddCorrect = CompareTwoArrays(springApiParams.rotation.odd, [0, 2 * Math.PI, 0]);
  const isRotationEvenCorrect = CompareTwoArrays(springApiParams.rotation.even, [0, 0, 0]);


  if (isPositionOddCorrect && isPositionEvenCorrect && isRotationOddCorrect && isRotationEvenCorrect) {
    return {
      valid: true,
    }
  } else {
    return {
      valid: false,
      error: {
        description: 'Animația nu e corect configurată!',
      }
    }
  }
}

const Test6Component = () => {
  const onMessage = async () => {
    const result: TestResult = Test6(Day6_GetSpringAPIParameters);
    emitWindowEvent({
      type: WINDOW_EVENTS.TEST_6_RESULT,
      payload: result
    });
  }

  useWindowEvent(WINDOW_EVENTS.TEST_6_RUN, onMessage);
  return null;
}

function CompareTwoArrays(arr1: Array<any>, arr2: Array<any>) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

export {
  Test1Component,
  Test2Component,
  Test3Component,
  Test4Component,
  Test5Component,
  Test6Component,
};
