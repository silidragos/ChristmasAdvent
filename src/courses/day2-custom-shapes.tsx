
const Day2_CustomShapes = [
    <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} attach="geometry" />
    </mesh>,
    <mesh>
        <sphereGeometry args={[0.2, 8, 8]} attach="geometry" />
    </mesh>,
    <mesh>
        <torusGeometry args={[0.1, 0.05, 24, 6]} attach="geometry" />
    </mesh>
];

export default Day2_CustomShapes;
