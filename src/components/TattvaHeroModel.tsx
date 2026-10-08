import { useEffect, useRef, useState } from 'react'
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const MODEL_PATH = '/models/TATTVA_Aerial.glb'

export function TattvaHeroModel() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const scene = new Scene()
    const camera = new PerspectiveCamera(32, 1, 0.1, 100)
    const renderer = new WebGLRenderer({ alpha: true, antialias: true })
    const rotationGroup = new Group()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0
    let modelLoaded = false
    let isInteracting = false
    let resumeAt = 0
    let presentationStartedAt = 0
    let presentationCenterYaw = MathUtils.degToRad(-16)
    const presentationPitch = MathUtils.degToRad(-8)
    const pitchAmplitude = MathUtils.degToRad(2.2)
    let pitchPhaseOffset = 0

    renderer.setClearColor(new Color(0x11110f), 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = 'srgb'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    stage.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.055
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = true
    controls.minPolarAngle = MathUtils.degToRad(42)
    controls.maxPolarAngle = MathUtils.degToRad(138)
    controls.target.set(0, 0, 0)

    scene.add(new AmbientLight(0xf2f0ea, 1.4))

    const keyLight = new DirectionalLight(0xf2f0ea, 2.1)
    keyLight.position.set(5, 7, 8)
    scene.add(keyLight)

    const fillLight = new DirectionalLight(0xc97932, 0.45)
    fillLight.position.set(-6, 2, -5)
    scene.add(fillLight)
    scene.add(rotationGroup)

    const render = () => renderer.render(scene, camera)

    const updateSize = () => {
      const { clientWidth, clientHeight } = stage
      if (!clientWidth || !clientHeight) return

      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      render()
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(stage)
    updateSize()

    const loader = new GLTFLoader()
    loader.load(
      MODEL_PATH,
      (gltf) => {
        const model = gltf.scene
        const bounds = new Box3().setFromObject(model)
        const size = bounds.getSize(new Vector3())
        const center = bounds.getCenter(new Vector3())
        const largestDimension = Math.max(size.x, size.y, size.z) || 1
        const scale = 3.7 / largestDimension

        model.scale.setScalar(scale)
        model.position.copy(center).multiplyScalar(-scale)
        rotationGroup.add(model)
        rotationGroup.rotation.set(presentationPitch, MathUtils.degToRad(-34), 0)

        const scaledSize = size.multiplyScalar(scale)
        const verticalDistance = scaledSize.y / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)))
        const horizontalFov = 2 * Math.atan(Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect)
        const horizontalDistance = scaledSize.x / (2 * Math.tan(horizontalFov / 2))
        const cameraDistance = Math.max(verticalDistance, horizontalDistance, 3.4) * 1.65
        const cameraDirection = new Vector3(0.76, 0.5, 1).normalize()

        camera.position.copy(cameraDirection.multiplyScalar(cameraDistance))
        camera.lookAt(0, 0, 0)
        controls.update()
        presentationCenterYaw = rotationGroup.rotation.y + MathUtils.degToRad(18)
        presentationStartedAt = performance.now()
        modelLoaded = true
        setIsLoaded(true)
        render()
      },
      undefined,
      () => {
        stage.dataset.loadError = 'true'
      },
    )

    const pausePresentation = () => {
      isInteracting = true
      resumeAt = 0
      stage.dataset.interacting = 'true'
    }

    const schedulePresentation = () => {
      isInteracting = false
      resumeAt = performance.now() + 3000
      delete stage.dataset.interacting
    }

    controls.addEventListener('start', pausePresentation)
    controls.addEventListener('end', schedulePresentation)

    const animate = (time: number) => {
      if (modelLoaded) {
        if (!reduceMotion && !isInteracting && resumeAt > 0 && time >= resumeAt) {
          presentationCenterYaw = rotationGroup.rotation.y + MathUtils.degToRad(18)
          pitchPhaseOffset = Math.asin(MathUtils.clamp((rotationGroup.rotation.x - presentationPitch) / pitchAmplitude, -1, 1))
          presentationStartedAt = time
          resumeAt = 0
        }

        if (!reduceMotion && !isInteracting && resumeAt === 0) {
          const elapsed = time - presentationStartedAt
          const yawAmplitude = MathUtils.degToRad(18)
          const yawPhase = (elapsed / 16000) * Math.PI * 2 - Math.PI / 2
          const pitchPhase = (elapsed / 21000) * Math.PI * 2 + pitchPhaseOffset

          rotationGroup.rotation.y = presentationCenterYaw + yawAmplitude * Math.sin(yawPhase)
          rotationGroup.rotation.x = presentationPitch + pitchAmplitude * Math.sin(pitchPhase)
        }

        controls.update()
        render()
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    animate(performance.now())

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      controls.removeEventListener('start', pausePresentation)
      controls.removeEventListener('end', schedulePresentation)
      controls.dispose()
      rotationGroup.traverse((object) => {
        const mesh = object as typeof object & { geometry?: { dispose: () => void }; material?: { dispose?: () => void } | Array<{ dispose?: () => void }> }
        mesh.geometry?.dispose()
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose?.())
        else mesh.material?.dispose?.()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      className={`opening-model-stage${isLoaded ? ' is-loaded' : ''}`}
      data-asset="tattva-hero-model"
      ref={stageRef}
      aria-busy={!isLoaded}
      aria-label="Rotating TATTVA aerial configuration model"
    >
      {!isLoaded && <span className="opening-model-loading" aria-hidden="true" />}
      <p className="opening-model-provenance" aria-hidden="true">
        <span>CUSTOM CAD / DEVELOPED FOR TATTVA</span>
        <span>AERIAL CONFIGURATION · ENGINEERING MODEL</span>
      </p>
    </div>
  )
}
