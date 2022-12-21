import { Materials, Nodes } from "../3d/3d.types"

export const MESH_NAMES = {
  LEFT_BATTERY: "left-battery-mesh",
  RIGHT_BATTERY: "right-battery-mesh"
};

export default function Day1_HierarchyAndAttributes({ nodes, materials }: { nodes: Nodes, materials: Materials }) {
  return (
    <>
      <group position={[-2.5, 1, 0]} rotation={[0, 0, 0]}>
        <mesh name={MESH_NAMES.LEFT_BATTERY} geometry={nodes.Battery.geometry} material={materials.Battery} />
      </group>

      <group position={[-2.5, 1, -.5]} rotation={[-Math.PI / 6, Math.PI / 6.0, 0]}>
        <mesh name={MESH_NAMES.RIGHT_BATTERY} geometry={nodes.Battery.geometry} material={materials.Battery} />
      </group>
    </>
  )
}
