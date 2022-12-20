# Ziua 4. Culoarea cadourilor

Similar cu ziua 2, avem nevoie astăzi de o lista de materiale cu care sa colorăm cadourile venite pe banda de producție, înainte de a fi trimise mai departe.
Pentru astăzi nu avem nevoie de texturi, dar avem nevoie de anumite materiale specifice, și anume:

- Un material PBR standard verde, fara stralucire(rough), non-metalic
- Un material PBR verde care *emite* culoare verde.
- Un material PBR rosu, 100% smooth, metalic
- Un material basic, de culoare roz
- Un material toon, albastru, cu transparență 50%

![](https://d3tycb976jpudc.cloudfront.net/public/images/christmas-advent-2022/c4-cerinta.png)

---

# Culori. Materiale. Texturi.

Culoarea fiecărui obiect este dată de modul în care acesta reacționează la interacțiunea cu lumina. Acest comportament este definit prin programe care comunica direct cu placa grafică, numite Shadere, care sunt atașate obiectelor prin ceea ce numim [Materiale](https://threejs.org/docs/#api/en/materials/Material)


## Materiale

>       <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
>           <sphereGeometry args={[1, 16, 16]} />
>           <meshStandardMaterial color="hotpink" />  <------
>       </mesh>

Materialul este una din cele 2 componente atașate la un mesh. 
Principalele materiale sunt:

- [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) - un material "flat", care nu reacționează la lumină ci returnează exact culoarea pe care o are acesta.
- [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) - bazat principiile "physically based rendering" (PBR). Acesta încearcă să fie cât mai corect fizic. Are proprietăți precum `color`, `opacity`, `roughness` - care decide cât de rugos/lucios este un material, `metalic` etc.
- [MeshToonMaterial](https://threejs.org/docs/#api/en/materials/MeshToonMaterial) - pentru randare stilizată este nevoie de materiale care, deși nu sunt corecte fizic vorbind, arată în stilul animației pe care ne-o dorim. ThreeJS oferă un astfel de material. Vă puteți juca cu el [aici](https://threejs.org/docs/#api/en/materials/MeshToonMaterial).

## Texturi
Plain color materials are boring 🔴🟠🟡🟢🔵🟣.
De asta de multe ori ne folosim de texturi, adică poze. Deși cel mai intuitiv este să le folosim pentru culoare, acestea pot fi folosite și pentru alte câmpuri, precum opacity, roughness, metalic, normals etc. În majoritatea cazurilor este suficient să folosim texturi alb-negru.

[învață mai multe aici](https://www.a23d.co/blog/different-maps-in-pbr-textures/)
![](https://cloud.a23d.co/files/2021/11/A23D-PBR-Maps-scaled.jpg)

## Importul de texturi
În cazul nostru, texturile au fost importate odată cu modelele 3D, din fișierul GLB, în `src/3d/factory.tsx`.

>       const { nodes, materials } = useGLTF(PUBLIC_URL + '/gltf/scene.glb') as GLTFResult;

Alternativ, putem încărca texturile separat, după cum se zice și în [documentație](https://docs.pmnd.rs/react-three-fiber/tutorials/loading-textures).

>       const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')
>       ....
>       <meshStandardMaterial map={colorMap}>

Sau mai complet...

>       const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
>         'PavingStones092_1K_Color.jpg',
>         'PavingStones092_1K_Displacement.jpg',
>         'PavingStones092_1K_Normal.jpg',
>         'PavingStones092_1K_Roughness.jpg',
>         'PavingStones092_1K_AmbientOcclusion.jpg',
>       ])

Folosite astfel

>       <meshStandardMaterial
>         map={colorMap}
>         displacementMap={displacementMap}
>         normalMap={normalMap}
>         roughnessMap={roughnessMap}
>         aoMap={aoMap}
>       />
---

## Ar trebui sa așteptăm să se încarce Loaders?

De ce mai multe ori da. Nu este chiar ok sa încărcăm scena deși în spate sunetele, texturile, modelele 3D încă sunt pe drum. Pentru a aștepta există componenta `<Suspense/>`, folosită ca wrapper astfel:


>       export default function App() {
>         return (
>           <Canvas>
>             <Suspense fallback={null}>
>               <Scene />
>             </Suspense>
>           </Canvas>
>         )

# Lumini

Luminile sunt esențiale pentru o scenă care sa arate bine. 

Luminile sunt de mai multe tipuri, printre care:
- [Ambient Lights](https://threejs.org/docs/#api/en/lights/AmbientLight) - lumini uniforme peste întreaga scenă.
- [Directional Lights](https://threejs.org/docs/#api/en/lights/DirectionalLight) - similar cu soarele, lumini considerate ca raze paralele, venite de la o sursă îndepărtată, uniforme.
- [Point Lights](https://threejs.org/docs/#api/en/lights/PointLight)- similare cu becurile obișnuite. O sursa centrală care emană lumină sferic în jurul ei, și care se estompează după o anumită distanță.
- [Spot Lights](https://threejs.org/docs/#api/en/lights/SpotLight) - point lights, dar care emană lumină conic, similar cu o lampă.

Însă, luminile real-time sunt destul de heavy. Add with care. Alternativ există conceptul de light bakes, pentru obiectele statice, a căror iluminare este mereu aceiași. Cum poți genera light bakes în Blender [aici](https://youtu.be/Ip-OYM1u6Eg).

Există și conceptul de [Helpers](https://threejs.org/docs/#api/en/helpers/DirectionalLightHelper) care ne ajută să vizualizăm luminile în browser mai bine.

În cazul nostru avem un **Directional Light**, un **Ambient Light** și un `<Environment/>` - o sursă de iluminare specială provenită dintr-o imagine 360, prin intermediul bibliotecii drei - [learn more here](https://github.com/pmndrs/drei#environment), lucru de altfel [posibil și în vanilla ThreeJS](https://threejs.org/examples/?q=hdr#webgl_materials_envmaps_hdr).
