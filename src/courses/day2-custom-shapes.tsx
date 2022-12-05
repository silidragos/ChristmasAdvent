
/*
Concepts:
    - What are primitives. Each one has custom primitives, We use args[] for constructors.
    - Use documentation and play with the parameters in the upper right
    - Besides primitives, ThreeJS materials, but we'll cover them soon.
Bonus:
    - Sometimes we use Dat.GUI or something similar to play with the data. We don't cover that here, but we recommend: https://www.npmjs.com/package/react-dat-gui
Tasks:
    - Link to documentation: https://threejs.org/docs/#api/en/geometries/BoxGeometry
    - We have letters from children, here's the shapes we'd need:
        - a box of .4x.4x.4 meters
        - a ball, sized 20 cms in diametere. Make sure it's looking smooth enough 
        - a hat, in the shape of a cone, 20cms in radius, 50cm in height
        - a 4-sized dice (triangle faces), 10 cm in radius
        - an 8 sized dice, 10cm in radius
        - an oversized 12-sized dice,  10cm in radius
        - a..torus knot? I wonder what that is. Radius of 50cm, p=5, q=1...Lots of nonsense, but, whatever...
 */
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
