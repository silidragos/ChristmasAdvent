# Ziua 5. Împinge cadourile în sac!

Trebuie să mișcăm paleta de împingere! Aceasta trebuie să meargă ba în față ba în spate, să împingă cadourile colorate anterior, care cad pe măsuță, ca în cele din urmă să se rostogolească în sac,

Pentru a nu brusca nimic prea tare recomandăm un traseu sinusoidal.

Testele noastre urmăresc numărul de cadouri care ajung la destinație 🧑‍🔧

![](https://vr-projects-eu.s3.eu-central-1.amazonaws.com/front-end-ro/c5-cerinta.png)

---

# Legile fizicii

Animațiile liniare sunt de multe ori îndeajuns, dar de multe ori dorim ceva mai realistic. Atunci suntem nevoiți să importăm un engine de physics. Asta vom face și noi astăzi pentru a ajuta cadourile (care acum au formă și culoare) să se rostogolească în sac. ⚽


## CannonJS - [@react-three/cannon](https://github.com/pmndrs/use-cannon/tree/master/packages/react-three-cannon#readme)

## Principii de bază
CannonJS își creeaza propriile meshe primitive 3D, cuburi, sfere, plane etc. Acestea sunt invizibile, nu sunt randate. Mișcare și rotația lor este controlată de engine în totalitate, noi setându-le atribute precum forța de frecare, bounciness-ul, viteza și aplicând diferite forțe asupra lor, în diferite puncte.

Ce putem face apoi, este să *parentăm* meshele noastre create anterior la aceste forme care sunt în totalitate controlate de CannonJS.

## Setup?

În primul rând trebuie să wrap-uim totul într-un context special.

>       <Physics>
>           <Debug color="black" scale={1.1}>
>           ....
>           </Debug>
>       </Physics>

Nu uita să dezactivezi tag-ul `<Debug>` în producție. Acesta este foarte util deoarece ne permite să vedem formele în scenă, care altfel ar deveni invizibile.

## Hooks
În funcție de formele dorite putem folos diferite hook-uri precum *useBox*, *useCylinder*, *useSphere* etc. Fiecare hook primește o serie de argumente. Unele ajută pentru a defini dimensiunile fiecăre primitive, foarte similar cu **Ziua 2**. Restul sunt proprietăți fizice.

De exemplu, pentru cadourile care ies colorate, folosim componenta `src/3d/gifts-physics.tsx`. Aici fiecare cadou este o cutie, ți zona de physics o definim astfel:

>       const [gift, physicsAPI] = useBox<Group>((idx) => ({
>               args: [.4, .4, .4],
>               position: [0, 10, 2],
>               rotation: [0, 0, 0],
>               mass: 1,
>               material: {
>                   friction: 0
>               }
>           }
>       ));

Aici, *physicsAPI* este o clasă prin care putem schimba diferite atribute direct din cod, iar *gift* o vom folosi pentru a atașa forma noastră la un tag JSX:


>       <group ref={gift}> <--- cubul invizibil controlat de CannonJS
>           <group ref={mesh}>    <--- meshele noastre vizibile, parentate la componenta de physics.
>               ....
>           </group>
>       </group>

Tot în prima parte de cod, avem:
- **args** - similar cu BoxGeometry, se referă la lățime, înălțime și lungime
- **position**, **rotation**
- **mass** - când doua obiecte se ciocnes este important să știm care lovește mai tare 🧨. Pentru podea de exemplu am setat `mass:0`, care este un mod de a spune că podeaua noastră nu va fi mutată în niciun fel, nici de gravitație, nici de ciocniri. Dar ea va lovi toate celelalte obiecte 3D.
- **material** - aici punem tot ce ține de friction, bounciness etc.

## Runtime
Cum spuneam, prin al doilea parametru returnat (physicsAPI în cazul nostru), putem apela tot felul de metode asupra obiectului nostru.

Câteva linii de cod relevante folosite de noi, fiind:
>       physicsAPI.mass.set(0);
>       physicsAPI.position.set(0, 1.25, 2);
>       physicsAPI.velocity.set(-1, 0, 0); //Velocity = Viteza
>       ...
>       physicsAPI.sleep();
>       physicsAPI.wakeUp();

Pretty self-explanatory 😊