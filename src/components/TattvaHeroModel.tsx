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

    renderer.setClearColor(new Color(0x11110f), 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = 'srgb'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    stage.appendChild(renderer.domElement)

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
        rotationGroup.rotation.set(MathUtils.degToRad(-8), MathUtils.degToRad(-34), 0)

        const scaledSize = size.multiplyScalar(scale)
        const verticalDistance = scaledSize.y / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)))
        const horizontalFov = 2 * Math.atan(Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect)
        const horizontalDistance = scaledSize.x / (2 * Math.tan(horizontalFov / 2))
        const cameraDistance = Math.max(verticalDistance, horizontalDistance, 3.4) * 2
        const cameraDirection = new Vector3(0.76, 0.5, 1).normalize()

        camera.position.copy(cameraDirection.multiplyScalar(cameraDistance))
        camera.lookAt(0, 0, 0)
        modelLoaded = true
        setIsLoaded(true)
        render()
      },
      undefined,
      () => {
        stage.dataset.loadError = 'true'
      },
    )

    const animate = () => {
      if (modelLoaded && !reduceMotion) {
        rotationGroup.rotation.y += 0.00135
        render()
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
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
    </div>
  )
}
