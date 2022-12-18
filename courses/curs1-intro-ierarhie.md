# Ziua 1. Javascript în 3 dimensiuni?
---

## ThreeJS??

Ne bucurăm că vrei sa participi la adventul 3D de Crăciun Front-end.ro! Ne dorim ca acesta să fie un intro cât mai smooth in React-Three-Fiber, și în ThreeJS ca framework 3D peste WebGL. Browserul tău va câștiga după aceste 5 zile o nouă dimensiune 🤯

Când vrem să lucrăm avem câteva opțiuni. Desigur, biblioteci precum [ThreeJS](https://threejs.org/) despre care vom vorbi de-acum înainte, sau [BabylonJS](https://www.babylonjs.com/). Peste acestea la rândul lor există alte librării mai high-level, cum este biblioteca de WebVR [AFrame](https://aframe.io/). Iar pe lângă toate acestea, mai există Engine-uri 3D, care pot fi mai complexe dar nu sunt open-source sau free, precum [PlayCanvas](https://playcanvas.com/).

Opțiuni există, dar am decis pentru săptămâna aceasta sa rămânem la ThreeJS pentru ca este una din bilbiotecile 3D ThreeJS cu cei mai mulți contributori, dar și pentru ca wrapperul său de React, [React-Three-Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) ne face viețile foarte ușoare când vine vorba de organizarea proiectelor mai mari.

Așa că hai să facem un scurt intro despre aceasta.


![mesh-to-geo](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c1-main.png)

### Setup

Pentru a folosi R3F (cum vom prescurta de acum React-Three-Fiber), trebuie doar să ai un proiect existent (sau nou) care folosește React, în care să imporți biblioteca @react-three/fiber. 

Sau să urmezi pașii de [aici](https://docs.pmnd.rs/react-three-fiber/getting-started/installation).

Pe lângă asta, vom mai folosi @react-three/drei, o bilbiotecă de utilități peste R3F, @react-three/cannon pentru physics și @react-spring/three pentru animații simple.

Resurse și exemple puteți găsi [aici](https://docs.pmnd.rs/react-three-fiber/getting-started/examples) și [aici](https://codesandbox.io/examples/package/react-three-fiber) pentru R3F, [aici pentru drei](https://codesandbox.io/examples/package/@react-three/drei), și cel mai important [aici](https://threejs.org/examples) pentru concepte de bază ThreeJS.

Pe lângă acestea, proiectul nostru se va folosi de React Hooks, și de Typescript.

### Object3D & Mesh

În R3F orice obiect 3D este un element JSX. De multe ori acestea corespund obiectelor din ThreeJS. Astfel, `new SphereGeometry()` devine `<sphereGeometry>`, `new Mesh()` devine `<mesh>` etc.

La bază, orice obiect are în spate un [Object3D](https://threejs.org/docs/?q=object3#api/en/core/Object3D) din ThreejS, care este conținut de obicei de un element numit `<mesh>` în R3F. Orice mesh, are cel puțin niște geometrie, care ne spune ce formă are obiectul respectiv în spațiu, și un material, care ne va spune cum arată acesta (cum reacționează la lumină). Spre exemplu, așa creăm o sferă:

>       <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
>           <sphereGeometry args={[1, 16, 16]} />
>           <meshStandardMaterial color="hotpink" />
>       </mesh>

Don't worry! Vom învăța mai multe despre tipuri de geometrie și materiale în zilele care urmează. 

![mesh-to-geo](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c1-mesh.jpg)

Importantă de menționat aici este ierarhia/parentarea. Orice entitate care aparține de o alta, este parentată în DOM de aceasta. Apoi, pentru a descrie fiecare entitate avem atribute, cum sunt în cazul nostru `position`, `rotation`, sau `args` (care se refera de obicei la parametrii din constructor).

R3F este doar un wrapper peste ThreeJS. Astfel, `<sphereGeometry args={[1, 16, 16]} />` este doar un mod specific JSX (mai clar și mai simplu, părerea noastră) de a scrie linia de cod `mesh.geometry = new SphereGeometry(1, 16, 16)`. 
Altfel, în vanilla ThreeJS am ajunge la 

>       const geometry = new THREE.SphereGeometry( 1, 16, 16 );
>       const material = new THREE.MeshStandardMaterial( { color: 'hotpink } );
>       const sphere = new THREE.Mesh( geometry, material );
>       scene.add( sphere );

Prea mult cod, nu?

Pe lângă `<mesh>` mai avem `<group>`, o componentă care are ca singur scop să ne ajute să grupăm componente. 

### Poziție, Rotație, Scale

Orice `<mesh>` sau `<group>` au un atribut de position, rotation și scale. Pozitia este un array de 3 valori [X, Y, Z] în unități similare cu metrii. Scale-ul este relativ, dar tot un array [X, Y, Z].

Rotația este reprezentată și ea în 3 valori, in functie de axa în jurul căreia vor aplica rotația. De exemplu o rotație de 30 de grade în jurul axei Y, va fi o rotație in jurul axei verticale. De menționat că ThreeJS lucrează cu *radiani*, deci rotația ar fi 30 * Math.PI/ 180, sau Math.PI/6 😊



![Position, rotation and scale](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c1-pos-rot-scale.jpg)


!!Fiecare din aceste trei valori sunt relative la părintele lor direct. Pentru asta trebuie să vorbim despre Ierarhie.

### Ierarhia

Parentarea obiectelor este un lucru foarte important în 3D din mai multe motive. Unul din ele este faptul că fiecare obiect are o transformare (pos+rot+scale) locală, și una globală (vezi getWorldPosition vs GetPosition). Cele locale sunt relative la părinte direct, pe când cele globale sunt poziții absolute în spațiu.

>       <group name="parent" position={[1, 0, 0]}>
>           <group name="child" position={[1, 0, 0]}></group>
>       </group>

în cazul acesta, "parent" are atât poziția locală cât și cea globală la 1 metru pe axa X. În schimb "child" are poziția locală față de acesta la 1m pe axa X, ceea ce înseamnă că se află la 2m pe axa X în spațiu real.

>Ierarhia poate merge oricât de adânc, dar aici vine React să ne salveze. Mereu când simțiti că sunt prea multe layere, poate este timpul pentru o nouă componentă.

În fine, zilele care urmează vă recomandăm să lucrați cu spațiile locale, dar să fiți conștienți de diferența dintre acestea.

### Object3D, și atributele sale

Obiectul Javascript din spatele oricărui obiect 3D este [Object3D](https://threejs.org/docs/#api/en/core/Object3D).

Cateva atribute foarte la care avem acces prin acesta sunt:

>       object3D.position
>       object3D.rotation
>       object3D.scale
>
>       //Acces la object3D-ul părintelui direct
>       object3D.parent
>       //Acces la o lista de object3D-uri ale copiilor direcți
>       
>       object3D.visible
>       object3D.castShadow
>       //...etc

Ne vom întoarce la acestea zilele următoare. Ce este important de știut este ca în final, totul se rezumă la un Object3D.

---
# Adventul de Crăciun Front-End.ro
Ok, am făcut o introducere în mare, dar este timpul să vă explicăm în ce constă provocarea zilei 1 din Advent. Fiind doar începutul, scopului acestei zile este să vă familiarizați cu cerința, cu codul proiectului și cu modul de gândire din spatele R3F.

### Platforma

<< ... Explicatie folosire platforma >>

---

# Ziua 1. Bateriile
Fabrica de cadouri a lui Moș Crăciun este nefuncțională. Un an a trecut, și a fost neatinsă.

Primul pas este acela de a **pune cele două baterii în formă de inel pe cilindrele lor corespunzătoare**. Pentru aceasta fiecare baterie trebuie *poziționată* și *rotită* corespunzător, cu semnele +/- spre exterior.

Poziția necesită o exactitate de +-0.1, iar rotația de +- 15 grade.

îți vei da seama că sunt așezate corect, dupa lumina roșie care va deveni verde odată ce bateriile sunt conectate. Nu uita să dai submit spre server odată ce totul este funcțional!

![Cerinta-1](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c1-cerinta.png)

### Hint 1
Rotațiile se exprimă în radiani. Pentru acces la constanta Pi, Javascript oferă `Math.PI`.

### Hint 2
Fii sigur ca verifici poziția **globală** nu este aceiași cu cea **locală**.