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

export type InsideMachineVisualState = 'outer' | 'compute' | 'control' | 'sensing' | 'transformation' | 'propulsion'

type CadRecord = {
  path: string
  focus: Vector3
  distance: number
  direction: Vector3
}

const ASSEMBLY_SCALE = 3.7 / 526.17626953125

const cadRecords = {
  outer: {
    path: '/models/TATTVA_Aerial.glb',
    focus: new Vector3(0, 0, 23.75 * ASSEMBLY_SCALE),
    distance: 8.4,
    direction: new Vector3(0.12, -0.2, 1).normalize(),
  },
  transformation: {
    path: '/models/TATTVA_Mechanism.glb',
    focus: new Vector3(0, 0, 21.25 * ASSEMBLY_SCALE),
    distance: 2.05,
    direction: new Vector3(0.1, -0.24, 1).normalize(),
  },
} satisfies Record<'outer' | 'transformation', CadRecord>

function setOpacity(model: Group, opacity: number) {
  model.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      const usableMaterial = material as Material
      const transparent = opacity < 0.999
      if (usableMaterial.transparent !== transparent || usableMaterial.depthWrite !== !transparent) {
        usableMaterial.transparent = transparent
        usableMaterial.depthWrite = !transparent
        usableMaterial.needsUpdate = true
      }
      usableMaterial.opacity = opacity
    })
  })
}

function applyIndustrialMaterial(model: Group) {
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

function disposeModel(model: Group) {
  model.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    mesh.geometry.dispose()
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => (material as Material).dispose())
  })
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function getCadOpacity(progress: number, key: keyof typeof cadRecords) {
  const window = key === 'outer' ? [0, 0, 0.18, 0.3] : [0.66, 0.76, 0.86, 0.96]
  const [enterStart, enterEnd, exitStart, exitEnd] = window
  if (progress < enterStart || progress > exitEnd) return 0
  if (progress < enterEnd) return clamp((progress - enterStart) / Math.max(enterEnd - enterStart, 0.001))
  if (progress > exitStart) return 1 - clamp((progress - exitStart) / Math.max(exitEnd - exitStart, 0.001))
  return 1
}

export function InsideMachineCad({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const scene = new Scene()
    const camera = new PerspectiveCamera(30, 1, 0.1, 100)
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    const assembly = new Group()
    const loader = new GLTFLoader()
    const models = new Map<keyof typeof cadRecords, Group>()
    const cadOpacities = new Map<keyof typeof cadRecords, number>()
    const currentFocus = new Vector3()
    const targetFocus = new Vector3()
    const targetDirection = new Vector3()
    const targetCameraPosition = new Vector3()
    let frameId = 0
    let isDisposed = false

    renderer.setClearColor(new Color(0x11110f), 0)
    const isPhone = window.matchMedia('(max-width: 640px)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isPhone ? 1.25 : 2))
    renderer.outputColorSpace = 'srgb'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.style.pointerEvents = 'none'
    stage.appendChild(renderer.domElement)

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

    const load = (key: keyof typeof cadRecords) => new Promise<void>((resolve, reject) => {
      loader.load(cadRecords[key].path, (gltf) => {
        if (isDisposed) {
          disposeModel(gltf.scene)
          resolve()
          return
        }

        const model = gltf.scene
        model.scale.setScalar(ASSEMBLY_SCALE)
        applyIndustrialMaterial(model)
        setOpacity(model, 0)
        assembly.add(model)
        models.set(key, model)
        cadOpacities.set(key, 0)
        resolve()
      }, undefined, reject)
    })

    Promise.all((Object.keys(cadRecords) as Array<keyof typeof cadRecords>).map(load))
      .then(() => {
        if (!isDisposed) setIsLoaded(true)
      })
      .catch(() => {
        if (!isDisposed) stage.dataset.loadError = 'true'
      })

    const render = () => {
      const progress = progressRef.current
      const outerOpacity = getCadOpacity(progress, 'outer')
      const mechanismOpacity = getCadOpacity(progress, 'transformation')

      models.forEach((model, key) => {
        const targetOpacity = key === 'outer' ? outerOpacity : mechanismOpacity
        const nextOpacity = MathUtils.lerp(cadOpacities.get(key) ?? 0, targetOpacity, 0.14)
        cadOpacities.set(key, nextOpacity)
        setOpacity(model, nextOpacity)
      })

      const cameraRecord = progress > 0.66 ? cadRecords.transformation : cadRecords.outer
      targetFocus.copy(cameraRecord.focus)
      targetDirection.copy(cameraRecord.direction)
      const cameraDistance = cameraRecord === cadRecords.outer
        ? MathUtils.lerp(9.15, 7.5, clamp(progress / 0.3))
        : MathUtils.lerp(3.2, 1.8, clamp((progress - 0.66) / 0.3))
      targetCameraPosition.copy(targetFocus).addScaledVector(targetDirection, cameraDistance)

      const outerModel = models.get('outer')
      if (outerModel) {
        outerModel.rotation.set(
          MathUtils.degToRad(-4 + (clamp(progress / 0.3) * 8)),
          MathUtils.degToRad(22 - (clamp(progress / 0.3) * 34)),
          MathUtils.degToRad(-3 + (clamp(progress / 0.3) * 6)),
        )
      }

      const mechanismModel = models.get('transformation')
      if (mechanismModel) {
        const phase = clamp((progress - 0.66) / 0.3)
        mechanismModel.rotation.set(
          MathUtils.degToRad(-8 + (phase * 12)),
          MathUtils.degToRad(18 - (phase * 30)),
          MathUtils.degToRad(-4 + (phase * 8)),
        )
      }

      camera.position.lerp(targetCameraPosition, 0.1)
      currentFocus.lerp(targetFocus, 0.1)
      camera.lookAt(currentFocus)
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      models.forEach(disposeModel)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progressRef])

  return <div className={`inside-machine-cad${isLoaded ? ' is-loaded' : ''}`} data-visual-system="cad" ref={stageRef} aria-hidden="true" />
}
