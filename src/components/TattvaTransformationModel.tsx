import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type Material,
  type Mesh,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type TransformationModelState = 'aerial' | 'mechanism' | 'transforming' | 'ground'

type ModelRecord = {
  path: string
  focus: Vector3
  distance: number
  cameraDirection: Vector3
  cameraUp: Vector3
}

type ModelBlend = {
  from: TransformationModelState
  to: TransformationModelState
  amount: number
}

const ASSEMBLY_SCALE = 3.7 / 526.17626953125
const modelRecords: Record<TransformationModelState, ModelRecord> = {
  aerial: {
    path: '/models/TATTVA_Aerial.glb',
    focus: new Vector3(0, 0, 23.75 * ASSEMBLY_SCALE),
    distance: 8.65,
    cameraDirection: new Vector3(0.08, -0.16, 1).normalize(),
    cameraUp: new Vector3(0, 1, 0),
  },
  mechanism: {
    path: '/models/TATTVA_Mechanism.glb',
    focus: new Vector3(0, 0, 21.25 * ASSEMBLY_SCALE),
    distance: 2,
    cameraDirection: new Vector3(0.12, -0.28, 1).normalize(),
    cameraUp: new Vector3(0, 1, 0),
  },
  transforming: {
    path: '/models/TATTVA_Transforming.glb',
    focus: new Vector3(0, 79.06061553955078 * ASSEMBLY_SCALE, -66.64125061035156 * ASSEMBLY_SCALE),
    distance: 8.2,
    cameraDirection: new Vector3(0.08, -1, 0.12).normalize(),
    cameraUp: new Vector3(0, 0, 1),
  },
  ground: {
    path: '/models/TATTVA_Ground.glb',
    focus: new Vector3(0, -0.0004730224609375 * ASSEMBLY_SCALE, -66.64132690429688 * ASSEMBLY_SCALE),
    distance: 7.3,
    cameraDirection: new Vector3(0.08, -1, 0.12).normalize(),
    cameraUp: new Vector3(0, 0, 1),
  },
}

function ease(progress: number) {
  return progress * progress * (3 - 2 * progress)
}

function getModelBlend(progress: number): ModelBlend {
  if (progress < 0.22) return { from: 'aerial', to: 'aerial', amount: 0 }
  if (progress < 0.38) return { from: 'aerial', to: 'mechanism', amount: ease((progress - 0.22) / 0.16) }
  if (progress < 0.48) return { from: 'mechanism', to: 'mechanism', amount: 0 }
  if (progress < 0.6) return { from: 'mechanism', to: 'transforming', amount: ease((progress - 0.48) / 0.12) }
  if (progress < 0.72) return { from: 'transforming', to: 'transforming', amount: 0 }
  if (progress < 0.88) return { from: 'transforming', to: 'ground', amount: ease((progress - 0.72) / 0.16) }
  return { from: 'ground', to: 'ground', amount: 0 }
}

function setModelOpacity(model: Group, opacity: number) {
  model.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      const usableMaterial = material as Material
      const shouldBeTransparent = opacity < 0.999
      const shouldWriteDepth = opacity > 0.995
      if (usableMaterial.transparent !== shouldBeTransparent || usableMaterial.depthWrite !== shouldWriteDepth) {
        usableMaterial.transparent = shouldBeTransparent
        usableMaterial.depthWrite = shouldWriteDepth
        usableMaterial.needsUpdate = true
      }
      usableMaterial.opacity = opacity
    })
  })
}

function disposeModel(model: Group) {
  model.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    mesh.geometry.dispose()
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => (material as Material).dispose())
  })
}

function applyPresentationMaterial(model: Group) {
  model.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      const presentationMaterial = material as MeshStandardMaterial
      presentationMaterial.color.setHex(0x5b6365)
      presentationMaterial.metalness = 0.34
      presentationMaterial.roughness = 0.44
      presentationMaterial.needsUpdate = true
    })
  })
}

export function TattvaTransformationModel({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const scene = new Scene()
    const camera = new PerspectiveCamera(32, 1, 0.1, 100)
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    const assembly = new Group()
    const loader = new GLTFLoader()
    const models = new Map<TransformationModelState, Group>()
    const currentFocus = new Vector3()
    const nextFocus = new Vector3()
    const nextCameraDirection = new Vector3()
    const nextCameraUp = new Vector3()
    const targetCameraPosition = new Vector3()
    const worldFocus = new Vector3()
    let frameId = 0
    let isDisposed = false

    renderer.setClearColor(new Color(0x11110f), 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = 'srgb'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.style.pointerEvents = 'none'
    stage.appendChild(renderer.domElement)

    assembly.rotation.set(0, 0, 0)
    scene.add(assembly)
    scene.add(new AmbientLight(0xd7d7d1, 0.54))
    scene.add(new HemisphereLight(0xdedfd9, 0x20211f, 0.74))

    const keyLight = new DirectionalLight(0xf2f0ea, 2)
    keyLight.position.set(5, 7, 8)
    scene.add(keyLight)

    const fillLight = new DirectionalLight(0xc8cbc8, 0.5)
    fillLight.position.set(-5, 2, 5)
    scene.add(fillLight)

    const rimLight = new DirectionalLight(0xb7b9b4, 0.9)
    rimLight.position.set(-6, 5, -6)
    scene.add(rimLight)

    const updateSize = () => {
      const { clientWidth, clientHeight } = stage
      if (!clientWidth || !clientHeight) return

      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(stage)
    updateSize()

    const loadModel = (state: TransformationModelState) => new Promise<void>((resolve, reject) => {
      loader.load(
        modelRecords[state].path,
        (gltf) => {
          if (isDisposed) {
            disposeModel(gltf.scene)
            resolve()
            return
          }

          const model = gltf.scene
          model.scale.setScalar(ASSEMBLY_SCALE)
          applyPresentationMaterial(model)
          setModelOpacity(model, 0)
          assembly.add(model)
          models.set(state, model)
          resolve()
        },
        undefined,
        reject,
      )
    })

    Promise.all((Object.keys(modelRecords) as TransformationModelState[]).map(loadModel))
      .then(() => {
        if (!isDisposed) setIsLoaded(true)
      })
      .catch(() => {
        if (!isDisposed) stage.dataset.loadError = 'true'
      })

    const render = () => {
      const blend = getModelBlend(progressRef.current)
      const fromRecord = modelRecords[blend.from]
      const toRecord = modelRecords[blend.to]
      const fromOpacity = blend.from === blend.to ? 1 : 1 - blend.amount
      const toOpacity = blend.from === blend.to ? 0 : blend.amount

      models.forEach((model, state) => {
        if (state === blend.from) setModelOpacity(model, fromOpacity)
        else if (state === blend.to) setModelOpacity(model, toOpacity)
        else setModelOpacity(model, 0)
      })

      nextFocus.copy(fromRecord.focus).lerp(toRecord.focus, blend.amount)
      nextCameraDirection.copy(fromRecord.cameraDirection).lerp(toRecord.cameraDirection, blend.amount).normalize()
      nextCameraUp.copy(fromRecord.cameraUp).lerp(toRecord.cameraUp, blend.amount).normalize()
      const nextDistance = MathUtils.lerp(fromRecord.distance, toRecord.distance, blend.amount)
      assembly.localToWorld(worldFocus.copy(nextFocus))
      targetCameraPosition.copy(worldFocus).addScaledVector(nextCameraDirection, nextDistance)
      camera.position.lerp(targetCameraPosition, 0.12)
      currentFocus.lerp(worldFocus, 0.12)
      camera.up.copy(nextCameraUp)
      camera.lookAt(currentFocus)
      renderer.render(scene, camera)
    }

    const animate = () => {
      render()
      frameId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      models.forEach(disposeModel)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progressRef])

  return (
    <div
      className={`transformation-model-canvas${isLoaded ? ' is-loaded' : ''}`}
      data-asset="tattva-transformation-model"
      ref={stageRef}
      aria-busy={!isLoaded}
      aria-label="TATTVA aerial-to-ground transformation model sequence"
    >
      {!isLoaded && <span className="transformation-model-loading" aria-hidden="true" />}
    </div>
  )
}
