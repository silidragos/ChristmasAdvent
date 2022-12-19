# Ziua 2. Generatorul de cadouri.

Ok. Avem curent. Acum trebuie sa generăm aleatoriu o serie de cadouri, de diferite forme. Nu îți face griji. Scopul zilei de astăzi este să ne familiarizăm cu primitivele 3D din ThreeJS.

Toate informațiile despre primitive sunt [!! AICI !!](https://threejs.org/docs/#api/en/geometries/BoxGeometry) însă va trebui să le adaptezi la R3F, fie să gasești exemple funcționale în [documentația oficială](https://docs.pmnd.rs/react-three-fiber/getting-started/examples).

Lista dorințe este destul de simplă. Ar trebui să fie suficiente primitivele pe care ni le oferă ThreeJS. Ce trebuie neapărat să fie în array-ul exportat este:

 - O cutie de 40cmx40cmx40cm
 - O minge cu diametrul de 20cm. Asigură-te ca este suficient de șlefuită.
 - O pălărie conica, cu raza bazei de 20cm și înălțimea de 50cm.
 - Un zar cu 4 fețe triunghiulare, cu raza de 10cm
 - Un zar cu 8 fețe, cu raza de 10 cm

Asigurați-vă ca toate formele sunt sub formă de elemente JSX, și fac parte din array-ul exportat by default din fișierul zilei de astăzi!

Formele nu sunt încă colorate, dar ne vom ocupa de asta peste 2 zile. 🦄

![Cerinta 2](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c2-cerinta.png)

---

# Geometry

## Basics

Dacă ne amintim de ieri, pentru a crea un obiect 3D avem nevoie să creăm un `<mesh/>` cu două *attachements*, unul pe geometry și unul pe zona de material. Azi ne interesează geometria.

În spate, orice geometrie este o serie de array-uri cu diferite proprietăți, printre care:
- position - poziția fiecărui punct, sau **VERTEX** al obiectelor noastre
- triangles - array de câte 3 indici de vertecși, fiecare reprezentând un triunghi. Mai multe triunghiuri formează orice formă 3D ne dorim
- normals - simplificat vorbind, direcția în care fiecare triunghi este orientat

## Primitive

ThreeJS ofera o serie de primitive 3D. Spre exemplu un simplu cub s-ar putea crea astfel:

>       <mesh>
>           <boxGeometry args={[1, 1, 1]}/>   <-----
>           <meshBasicMaterial color="red">
>       </mesh>

`<boxGeometry>` este obiectul care ne ajută să creăm o cutie. Argumentele din constructor (din documentația ThreeJS) sunt aici incluse într-un array în `args`, și reprezintă lungimea, lățimea și înălțimea unei cutii.

Despre celelalte primitive vei învăța în challenge-ul de astăzi.

## Obiecte 3D mai complexe

Nu este util pentru challenge-ul de astăzi dar foarte util real-life. De multe ori nu dorim să folosim doar primitive, ci să creăm și importăm modele mult mai complexe.

Obiectele mai complexe se pot crea în software-uri specializate, precum [Blender3D](https://www.blender.org/). Aici se poate face tot ce depinde de modelare, texturare și animație. Pe langă asta, multe modele se pot găsi (free inclusive) pe site-uri precum [Turbosquid](https://www.turbosquid.com/) sau [Sketchfab](https://sketchfab.com/feed).

In ThreeJS, obiectele se pot apoi importa în formatul GLTF. GLTF se consideră un fel de JPEG al 3d-ului. În sensul că este foarte eficient, dar și că comprimă (și face greu de editat) obiectele salvate în acest format.

În cazul nostru, obiectele sunt toate într-un singur fișier GLB (GLTF Binary), și importate folosind o utilitară asincronă @react-three/drei, "UseLoader" astfel:

>       const { nodes, materials } = useGLTF(PUBLIC_URL + '/gltf/scene.glb') as GLTFResult;

Fiecare obiect 3D poate fi spart în componentele sale, în multiple componente JSX parentate unele la altele. În mod normal ar trebui să facem asta manual, pentru a crea toate elementele JSX din `/3d/factory.tsx`, dar din fericire există o utilitară pentru asta: [GLTF2JSX](https://github.com/pmndrs/gltfjsx).
