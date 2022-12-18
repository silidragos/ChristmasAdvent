# Ziua 3. Să meargă banda! Cum scriem funcționalitățile?
---

# Ziua 3. Să meargă banda!


##
Avem cadouri! Dar banda nu funcționează. Ei bine.. nu vom mișca banda, ci cadourile pe bandă. Pentru ca 3D-ul e mult "Smoke & Mirrors" 🧙‍♂️

Ți-am pregătit deja traseul, folosing o clasă făcută de noi, `Curve` ale cărei poziții le poți sample-ui cu `curve.Sample(x: number)`. 

Task-ul tău este de a muta cadourile de-a lungul acestui Spline. 
Totul fiind Smoke and Mirrors, când un cadou ajunge la capătul liniei, acesta ar trebui să sară la început, pentru simplicitate și pentru a putea refolosi un număr fix de obiecte.


## Cerință

Azi vom modifica direct componenta `Gift`. Aici ai acces printre altele la:

- `curve:Curve` - clasa prin care vom sample-ui poziția corectă de-a lungul curbei anterior definite (unde 0 este începutul acesteia și 1 este finalul ei)
- `initialOffsetAlongCurve` în intervalul (0,1) - un Ref în care vom seta offsetul curent de-a lungul curbei pentru fiecare Gift în parte
- `deltaTime` - timpul trecut de la frame-ul anterior
- `giftSpeed:number` - viteza pe secundă pe care am ne-o dorim


1) La fiecare frame vom calcula noi poziția nouă în metoda `CalculateNewPosition(...)` dar avem nevoie de offsetul pe curbă cu care s-a mutat elementul de la ultimul frame. 
Ajută-ne calculând corect formula pentru `offsetAlongCurveSinceLastFrame`.

2) De asemenea, vom stoca rezultatul într-un Vector3 numit `calculatedPosition: Vector3`. Asignează la fiecare frame poziția calculată pe elementul `parent.current`.

![Cerinta 2](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c2-cerinta.png)

---

# React Hooks

Deja presupunem că ai cunoștinte de React, însă un small recap nu strică. Pentru challenge-ul de astăzi nu o să trebuiască să le stăpânești, dar pentru proiecte mai complexe sunt esențiale. Plus că le folosim extensiv și în core code-ul acestui proiect, pe care recomandăm cu căldură să îl citești 🚀. 

Unele concepte React nu se potrivesc out-of-the-box cu anumite caracteristici ThreeJS. Așa că haide să sărim direct la...

## UseState

>       const [val, setVal] = useState(0)
>       ...
>       <myProp attribute={val} onClick={()=>{setVal(100)}}/>

State-urile sunt foarte folosite în React. La fiecare schimbare de state componenta React în care ne aflăm și copiii ei sunt re-randate. Iar aici intervine problema. Uneori în ThreeJS vrem să updatam anumite valori (cum ar fi poziția cadourilor astăzi), la fiecare frame. Deci de până la 60 de ori pe secundă (60fps). Lucru care, dacă vom re-randa bucăți din DOM la fiecare update, va produce 💀 **lag** 💀. 

>       ///Not recommended, unless myPos changes rarely
>       let [myPos, setMyPos] = useState([1, 0, 0]);
>       ...
>       useFrame(()=>{
>           let newPos = myPos;
>           newPos[0] += 0.1;
>           setMyPos(newPos)    
>       })

Din fericire avem o soluție pentru asta. 

## UseRef
Uneori dorim să avem o referință în cod, pentru ai seta anumite proprietăți. Pentru asta avem UseRef. Orice astfel de obiect stochează referința în atributul `.current`. 

*Trebuie să ne asigurăm că acesta este inițializat. 

În cazul obiectelor JSX care referențiază obiecte ThreeJS, ele referențiază de fapt un `Object3D` cu toate [funcționalitățile sale](https://threejs.org/docs/#api/en/core/Object3D).

>       let myBox = useRef();
>       ...
>       if(myBox.current !== undefined){
>           myBox.current.position.set(1, 0 ,0);
>       }
>       ...
>       <mesh ref={myBox}>

UseRef mai are o funcție interesantă, și anume aceea ca putem referenția orice obiect, și îl putem actualiza **fără a re-randa DOM-ul**. Astfel, daca avem un atribut pe care îl modificăm la fiecare frame, este indicat să folosim un Ref, nu State-ul.

>       ///Recommended
>       let myPos = useRef([1, 0, 0])
>       ...
>       useFrame(()=>{
>           myPos.current[0] += 0.1;
>       })

## Altele
### UseEffect, UseMemo, UseCallback etc
React a introdus conceptul de Hooks și ne folosim de acestea prin tot proiectul, în special:
- UseEffect - pentru metode ce dorim să se apeleze în special doar odată, la inițializare, dar și la update-ul anumitor proprietăți.
- useMemo - pentru declararea variabilelor
- useCallback - pentru declararea metodelor

Este mult de disctutat aici, așa că, dacă încă nu le stăpânești cum trebuie recomandăm să [arunci o privire](https://reactjs.org/docs/hooks-intro.html).


## R3F Hooks

Hook-urile sunt extensibile, așa că bibliotecile vin de multe ori cu hook-urile lor. R3F nu face excepție.

### UseThree

Pentru a lua diferite atribute interne din orice componentă.
>       const {gl, scene, camera...} = useThree();


### UseFrame
Un Hook apelat o dată la fiecare frame. Metodă specifică game-engine-urile, și foarte rar folosit pe web în mod normal.

* Evitați să scrieți `console.log`-uri aici.
>       useFrame(()=>{
>           //call this each frame
>       })

### UseLoader
Un hook specializat pe încărcarea asset-urilor externe - modele 3D, texturi, audio.


[Mai multe aici](https://gracious-keller-98ef35.netlify.app/docs/api/hooks/introduction)


## Despre Spline
În scenă se poate vedea o linie frântă roșie. `curve.Sample(x: number)` așteaptă o valoare de la 0 la 1, unde 0 este începutul curbei, iar 1 capătul ei.

Pentru a crea curba, am inițializat-o oferindu-i un array de poziții Vector3, reprezentând fiecare punct intermediar al acesteia.

Aceasta este folosită în `src/3d/gifs.tsx`.

>       let [myLineGeometry, curve] = useMemo(() => {
>           let points = [
>               new Vector3(0, 0, 0),
>               new Vector3(-0.8, 0, -.05),
>               new Vector3(-1.1, 0, -.25),
>               new Vector3(-1.3, 0, -.7),
>               new Vector3(-1.1, 0, -1.3),
>               new Vector3(-0.4, 0, -1.8),
>               new Vector3(0.5, 0, -2.1),
>               new Vector3(1.4, 0, -2.1),
>               new Vector3(2.5, 0, -2.1),
>               new Vector3(3.5, 0, -1.6),
>               new Vector3(4.1, 0, -1.0),
>               new Vector3(4.2, 0, -.75),
>               new Vector3(4.3, 0, 0.5),
>               new Vector3(4.0, 0, 1.3),
>               new Vector3(3.5, 0, 1.7),
>               new Vector3(2.5, 0, 1.85),
>               new Vector3(1.5, 0, 2)];
>       
>           const lineGeometry = new BufferGeometry().setFromPoints(points);
>           return [lineGeometry, new Curve(points)];
>       }, []);


Codul este în `src/3d/curve.tsx`.
