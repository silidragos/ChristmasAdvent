const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const IGNORE_LIST = [
  '.DS_Store'
];

run();

async function run() {
  const FOLDER_PATH = 'src';

  const packageJSONStructure = await getPackageJSONStructure();
  const result = await createFolderStructure('', FOLDER_PATH);

  result.files.push(packageJSONStructure);

  fs.promises.writeFile(`${__dirname}/result.txt`, JSON.stringify(result));
  console.log("Written folder structure in result.txt");

  const types = await getTypeDefinitions();
  const threeJsTypes = await createDefinition('three');

  fs.promises.writeFile(`${__dirname}/types.txt`, JSON.stringify([
    ...types,
    ...threeJsTypes
  ]));
  console.log("Written type definitions in types.txt");
}

async function createFolderStructure(folderName, folderPath) {
  const currentFolderStructure = {
    key: uuid(),
    name: folderName,
    files: [],
    folders: [],
  };

  try {
    const filesOrFolders = await fs.promises.readdir(folderPath);

    for (const fileOrFolder of filesOrFolders) {
      const fileOrFolderPath = path.join('.', folderPath, fileOrFolder);
      if (IGNORE_LIST.includes(fileOrFolder)) {
        continue;
      }

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fileOrFolderPath);


      if (stat.isFile()) {
        const fileContent = await fs.promises.readFile(fileOrFolderPath, "utf-8");
        currentFolderStructure.files.push({
          key: uuid(),
          name: fileOrFolder,
          content: fileContent
        });
      }

      if (stat.isDirectory()) {
        const innerFolderStructure = await createFolderStructure(fileOrFolder, fileOrFolderPath);
        currentFolderStructure.folders.push(innerFolderStructure);
      }
    }

    return currentFolderStructure;
  }
  catch (err) {
    console.error("Something went wrong!", err);
  }
}

async function getPackageJSONStructure() {
  const packageJSONContent = await fs.promises.readFile(`${__dirname}/../package.json`, "utf-8");
  return {
    key: uuid(),
    name: 'package.json',
    content: packageJSONContent
  }
}

async function getTypeDefinitions() {
  const typePaths = [
    [
      '@react-spring/types/index.d.ts',
      '@react-spring/index.d.ts',
    ],
    [
      '@react-spring/types/animated.d.ts',
      '@react-spring/animated.d.ts',
    ],
    [
      '@react-spring/types/interpolation.d.ts',
      '@react-spring/interpolation.d.ts',
    ],
    [
      '@react-spring/types/util.d.ts',
      '@react-spring/util.d.ts',
    ],
    [
      '@react-spring/three/dist/react-spring-three.cjs.d.ts',
      '@react-spring/three/index.d.ts',
    ],
    '@react-spring/three/dist/declarations/src/animated.d.ts',
    '@react-spring/three/dist/declarations/src/index.d.ts',
    '@react-spring/three/dist/declarations/src/primitives.d.ts',

    [
      '@react-spring/core/dist/react-spring-core.cjs.d.ts',
      '@react-spring/core/index.d.ts',
    ],
    '@react-spring/core/dist/declarations/src/index.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/index.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/useChain.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/useSpring.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/useSprings.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/useSpringRef.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/useTrail.d.ts',
    '@react-spring/core/dist/declarations/src/hooks/useTransition.d.ts',

    '@react-spring/core/dist/declarations/src/components/index.d.ts',
    '@react-spring/core/dist/declarations/src/interpolate.d.ts',
    '@react-spring/core/dist/declarations/src/constants.d.ts',
    '@react-spring/core/dist/declarations/src/globals.d.ts',

    // Cannon
    '@react-three/cannon/dist/index.d.ts',
    '@react-three/cannon/dist/debug-context.d.ts',
    '@react-three/cannon/dist/debug-provider.d.ts',
    '@react-three/cannon/dist/hooks.d.ts',
    '@react-three/cannon/dist/physics-provider.d.ts',
    '@react-three/cannon/dist/physics-context.d.ts',

    '@pmndrs/cannon-worker-api/dist/index.d.ts',

    // Drei
    '@react-three/drei/index.d.ts',
    '@react-three/drei/web/index.d.ts',
    '@react-three/drei/web/Html.d.ts',
    '@react-three/drei/web/CycleRaycast.d.ts',
    '@react-three/drei/web/useCursor.d.ts',
    '@react-three/drei/web/Loader.d.ts',
    '@react-three/drei/web/ScrollControls.d.ts',
    '@react-three/drei/web/PresentationControls.d.ts',
    '@react-three/drei/web/Select.d.ts',
    '@react-three/drei/core/index.d.ts',
    '@react-three/drei/web/View.d.ts',
    '@react-three/drei/core/Billboard.d.ts',
    '@react-three/drei/core/QuadraticBezierLine.d.ts',
    '@react-three/drei/core/CubicBezierLine.d.ts',
    '@react-three/drei/core/CatmullRomLine.d.ts',
    '@react-three/drei/core/Line.d.ts',
    '@react-three/drei/core/PositionalAudio.d.ts',
    '@react-three/drei/core/Text.d.ts',
    '@react-three/drei/core/Text3D.d.ts',
    '@react-three/drei/core/Effects.d.ts',
    '@react-three/drei/core/GradientTexture.d.ts',
    '@react-three/drei/core/Image.d.ts',
    '@react-three/drei/core/Edges.d.ts',
    '@react-three/drei/core/Trail.d.ts',
    '@react-three/drei/core/Sampler.d.ts',
    '@react-three/drei/core/ComputedAttribute.d.ts',
    '@react-three/drei/core/Clone.d.ts',
    '@react-three/drei/core/MarchingCubes.d.ts',
    '@react-three/drei/core/Decal.d.ts',
    '@react-three/drei/core/OrthographicCamera.d.ts',
    '@react-three/drei/core/PerspectiveCamera.d.ts',
    '@react-three/drei/core/CubeCamera.d.ts',
    '@react-three/drei/core/DeviceOrientationControls.d.ts',
    '@react-three/drei/core/FlyControls.d.ts',
    '@react-three/drei/core/MapControls.d.ts',
    '@react-three/drei/core/OrbitControls.d.ts',
    '@react-three/drei/core/TrackballControls.d.ts',
    '@react-three/drei/core/ArcballControls.d.ts',
    '@react-three/drei/core/TransformControls.d.ts',
    '@react-three/drei/core/PointerLockControls.d.ts',
    '@react-three/drei/core/FirstPersonControls.d.ts',
    '@react-three/drei/core/pivotControls/index.d.ts',
    '@react-three/drei/core/GizmoHelper.d.ts',
    '@react-three/drei/core/GizmoViewcube.d.ts',
    '@react-three/drei/core/GizmoViewport.d.ts',
    '@react-three/drei/core/useCubeTexture.d.ts',
    '@react-three/drei/core/useFBX.d.ts',
    '@react-three/drei/core/useGLTF.d.ts',
    '@react-three/drei/core/useKTX2.d.ts',
    '@react-three/drei/core/useProgress.d.ts',
    '@react-three/drei/core/useTexture.d.ts',
    '@react-three/drei/core/useVideoTexture.d.ts',
    '@react-three/drei/core/Stats.d.ts',
    '@react-three/drei/core/useDepthBuffer.d.ts',
    '@react-three/drei/core/useAspect.d.ts',
    '@react-three/drei/core/useCamera.d.ts',
    '@react-three/drei/core/useDetectGPU.d.ts',
    '@react-three/drei/core/useHelper.d.ts',
    '@react-three/drei/core/useBVH.d.ts',
    '@react-three/drei/core/useContextBridge.d.ts',
    '@react-three/drei/core/useAnimations.d.ts',
    '@react-three/drei/core/useFBO.d.ts',
    '@react-three/drei/core/useIntersect.d.ts',
    '@react-three/drei/core/useBoxProjectedEnv.d.ts',
    '@react-three/drei/core/BBAnchor.d.ts',
    '@react-three/drei/core/CurveModifier.d.ts',
    '@react-three/drei/core/MeshDistortMaterial.d.ts',
    '@react-three/drei/core/MeshWobbleMaterial.d.ts',
    '@react-three/drei/core/MeshReflectorMaterial.d.ts',
    '@react-three/drei/core/PointMaterial.d.ts',
    '@react-three/drei/core/shaderMaterial.d.ts',
    '@react-three/drei/core/softShadows.d.ts',
    '@react-three/drei/core/shapes.d.ts',
    '@react-three/drei/core/RoundedBox.d.ts',
    '@react-three/drei/core/ScreenQuad.d.ts',
    '@react-three/drei/core/Center.d.ts',
    '@react-three/drei/core/Bounds.d.ts',
    '@react-three/drei/core/CameraShake.d.ts',
    '@react-three/drei/core/Float.d.ts',
    '@react-three/drei/core/Stage.d.ts',
    '@react-three/drei/core/Backdrop.d.ts',
    '@react-three/drei/core/Shadow.d.ts',
    '@react-three/drei/core/ContactShadows.d.ts',
    '@react-three/drei/core/AccumulativeShadows.d.ts',
    '@react-three/drei/core/Reflector.d.ts',
    '@react-three/drei/core/SpotLight.d.ts',
    '@react-three/drei/core/Environment.d.ts',
    '@react-three/drei/core/Lightformer.d.ts',
    '@react-three/drei/core/Sky.d.ts',
    '@react-three/drei/core/Stars.d.ts',
    '@react-three/drei/core/Cloud.d.ts',
    '@react-three/drei/core/Sparkles.d.ts',
    '@react-three/drei/core/useMatcapTexture.d.ts',
    '@react-three/drei/core/useNormalTexture.d.ts',
    '@react-three/drei/core/Points.d.ts',
    '@react-three/drei/core/Instances.d.ts',
    '@react-three/drei/core/Segments.d.ts',
    '@react-three/drei/core/Detailed.d.ts',
    '@react-three/drei/core/Preload.d.ts',
    '@react-three/drei/core/BakeShadows.d.ts',
    '@react-three/drei/core/meshBounds.d.ts',
    '@react-three/drei/core/AdaptiveDpr.d.ts',
    '@react-three/drei/core/AdaptiveEvents.d.ts',
    '@react-three/drei/core/PerformanceMonitor.d.ts',
    '@react-three/drei/core/RenderTexture.d.ts',
    '@react-three/drei/core/Mask.d.ts',


    // Renaming the file to `index.d.ts`
    [
      '@react-three/fiber/dist/react-three-fiber.cjs.d.ts',
      '@react-three/fiber/dist/index.d.ts',
    ],
    '@react-three/fiber/dist/declarations/src/index.d.ts',
    '@react-three/fiber/dist/declarations/src/native.d.ts',
    '@react-three/fiber/dist/declarations/src/three-types.d.ts',
    // Core
    '@react-three/fiber/dist/declarations/src/core/events.d.ts',
    '@react-three/fiber/dist/declarations/src/core/hooks.d.ts',
    '@react-three/fiber/dist/declarations/src/core/index.d.ts',
    '@react-three/fiber/dist/declarations/src/core/loop.d.ts',
    '@react-three/fiber/dist/declarations/src/core/renderer.d.ts',
    '@react-three/fiber/dist/declarations/src/core/store.d.ts',
    '@react-three/fiber/dist/declarations/src/core/utils.d.ts',

    // Native
    '@react-three/fiber/dist/declarations/src/native/Canvas.d.ts',
    '@react-three/fiber/dist/declarations/src/native/events.d.ts',
    '@react-three/fiber/dist/declarations/src/native/polyfills.d.ts',

    // Web
    '@react-three/fiber/dist/declarations/src/web/Canvas.d.ts',
    '@react-three/fiber/dist/declarations/src/web/events.d.ts',
    
    // React
    '@types/react/index.d.ts',
   
    // Three-stdlib
    'three-stdlib/index.d.ts',
    'three-stdlib/loaders/GLTFLoader.d.ts',
    
    // // Three JS
    // '@types/three/index.d.ts',
    // '@types/three/src/Three.d.ts',

    // // Three JS Objects
    // '@types/three/src/objects/Bone.d.ts',
    // '@types/three/src/objects/Group.d.ts',
    // '@types/three/src/objects/Line.d.ts',
    // '@types/three/src/objects/InstancedMesh.d.ts',
    // '@types/three/src/objects/Line.d.ts',
    // '@types/three/src/objects/LineLoop.d.ts',
    // '@types/three/src/objects/LineSegments.d.ts',
    // '@types/three/src/objects/LOD.d.ts',
    // '@types/three/src/objects/Mesh.d.ts',
    // '@types/three/src/objects/Points.d.ts',
    // '@types/three/src/objects/SkinnedMesh.d.ts',
    // '@types/three/src/objects/Sprite.d.ts',

    // // Three JS Audio
    // '@types/three/src/audio/Audio.d.ts',
    // '@types/three/src/audio/AudioAnalyser.d.ts',
    // '@types/three/src/audio/AudioContext.d.ts',
    // '@types/three/src/audio/AudioListener.d.ts',
    // '@types/three/src/audio/PositionalAudio.d.ts',

  ];

  const types = await Promise.all(typePaths.map(async (path) => {
    const inputPath = Array.isArray(path) ? path[0] : path;
    let outputPath = Array.isArray(path) ? path[1] : path;

    const content = await fs.promises.readFile(`${__dirname}/../node_modules/${inputPath}`, "utf-8");
    outputPath = outputPath.split('dist/').join('');

    return {
      content,
      path: `node_modules/${outputPath}`,
    };
  }));
  

  return types;
}


async function createDefinition(packageName) {
  const currentFolderStructure = [];
  const folderPath = `node_modules/@types/${packageName}`;

  try {
    const filesOrFolders = await fs.promises.readdir(folderPath);

    for (const fileOrFolder of filesOrFolders) {
      const fileOrFolderPath = path.join('.', folderPath, fileOrFolder);
      if (IGNORE_LIST.includes(fileOrFolder)) {
        continue;
      }

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fileOrFolderPath);


      if (stat.isFile()) {
        const fileContent = await fs.promises.readFile(fileOrFolderPath, "utf-8");
        currentFolderStructure.push({
          content: fileContent,
          path: fileOrFolderPath
        })
      }

      if (stat.isDirectory()) {
        const innerFolderStructure = await createDefinition(`${packageName}/${fileOrFolder}`, fileOrFolderPath);
        currentFolderStructure.push(...innerFolderStructure);
      }
    }

    return currentFolderStructure;
  }
  catch (err) {
    console.error("Something went wrong!", err);
  }
}
