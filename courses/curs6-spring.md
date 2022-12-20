# Ziua 6. The final step!

Great! Tot flow-ul este complet, dar vrem un indicator care să ne anunțe când cadourile au intrat în sac. Ultimul pas este acela de a aplica o animație textului "Good Children".

Ce ne dorim este ca:
- atunci când numărul de cadouri strânse este impar, textul să sară 1 metru în sus, și să se rotească la 180 de grade pe axa verticală (în radiani).
- când numărul acestora este par, să se întoarcă la poziția și rotația inițială (position: `[0, 0, 0]` rotation: `[0, 0, 0]`)

Înțelege mai bine cum funcționează textul din `src/3d/destination-box.tsx`, în special metoda `onCollideBegin(()=>{})` din definirea colliderului interior sacului prin CannonJS - `useBox<>`. 

![](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c6-cerinta.png)


---

# Tweening animations
În primul rând, congrats că ai ajuns până aici. Experiența este deja funcțională, it oonly needs one last touch 💫

După cum știm, să facem animații în `useFrame` funcționează bine, dar cere mult cod, și grijă, mai ales daca e ceva mai mult decât o animație liniară.
Să facem animații folosing Physics Engines poate arăta foarte plăcut, dar este pentru lucruri mai complexe, și specifice zonei realistice.

Dar dacă vrem ceva mai similar cu animațiile din CSS? Unde putem anima orice proprietate, într-o anumită perioadă de timp, să aplicăm peste un *ease in*, un *ease out*, sau alte funcții care să facă animația noastră eye-catchy 😍 și totul în doar câteva linii de cod?

![](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c6-ease.png)
[Află mai multe despre ease functions](https://easings.net/)

În 3D sunt multe librării care fac asta, și de obicei poartă denumirea de "Tweening libraries", iar mai exact, noi vom vorbi astăzi despre 

## [@react-spring/three](https://github.com/pmndrs/react-spring)
[Documentation](https://docs.pmnd.rs/react-three-fiber/tutorials/using-with-react-spring)

Similar cu CannonJS, ieri, Spring ne oferă un hook

>       const [style, springAPI] = useSpring(()=>({
>        position: [1, 0, 0]  <---- putem numi atributul oricum, nu doar "position"
>       }));

unde `style` îl putem folosi ca stil direct pe componenta JSX, iar springAPI e o clasa prin care aplicăm directe metode direct din cod.
Atenție, nu putem folosi spring styles pe orice componenta ci doar pe componente spring-specific. Deci `<group/>` devine `<animated.group/>`, iar la aceasta putem parenta orice tip de componentă.

>       <animated.group position={style.position}/>

De exemplu pentru a anima un obiect de la poziția `[0, 0, 0]` la `[1, 1, 1]` în funcție de un state prop..să-i spunem isSet putem face așa:

>       [isSet, setIsState] = useState(false)
>       const [style, springAPI] = useSpring(()=>({
>        position: isSet ? [1, 0, 0] : [0, 0 ,0]
>       }));
>       ....
>       <animated.group position={style.position}/>

Și, ca prin magie, mereu când schimbăm state-ul `isSet`, animația nu se va mai produce instant, ci liniar. 

Pentru a controla tipul animației avem foarte multe opțiuni, dar deocamdată putem folosi preset-urile Spring, care se află în clasa `config` - [more here](https://www.react-spring.dev/docs/advanced/config)


>       const [style, springAPI] = useSpring(()=>({
>           position: isSet ? [1, 0, 0] : [0, 0 ,0],
>           config: config.slow // config.gentle, config.wobbly, config.stiff etc.
>       }));


## Cum avem mai mult control la runtime?
Trebuie să îi dăm poziția inițială obiectului nostru, deci pornim de la 

>       const [style, springAPI] = useSpring(()=>({
>        position: [0, 0 ,0]
>       }));
>       ...
>       <animated.group position={style.position} />

Dar, vrând să îl mutăm dinamic, din cod, vom folosi `springAPI`. Care poate fi folosit astfel:

>      springAPI.start({
>           to: {
>               position: [1, 0, 0]
>           }
>       })

E important ca atributul position să se numească la fel în ambele ipostaze (și în `from`, și în `to`), iar ca atributele din `start()` să fie wrapped într-un obiect `to:`;

## Primitiva de Text
Așa cum avem primitive precum cubul, sfera etc, există și [textGeometry](https://threejs.org/docs/#examples/en/geometries/TextGeometry), care primește ca argumente textul, fontul folosit, mărimea, înălțimea.