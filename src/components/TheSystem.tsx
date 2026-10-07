import { useMemo, useState } from 'react'
import '../styles/the-system.css'

type LayerId = 'sensing' | 'perception' | 'intelligence' | 'action'
type SelectionId = LayerId | ComponentId | null

type ComponentId =
  | 'rgb' | 'depth' | 'lidar' | 'thermal' | 'imu' | 'gps'
  | 'detection' | 'localization' | 'mapping'
  | 'environmental-representation' | 'spatial-understanding' | 'analysis'
  | 'navigation' | 'inspection' | 'mission-decisions'

type Item = { id: LayerId | ComponentId; label: string; description: string; layer: LayerId }

const layers: Array<Item & { id: LayerId }> = [
  { id: 'sensing', label: '01 / SENSING', description: 'Collects information about the surrounding environment and the platform\'s state.', layer: 'sensing' },
  { id: 'perception', label: '02 / PERCEPTION', description: 'Converts sensor observations into detections, localization and spatial maps.', layer: 'perception' },
  { id: 'intelligence', label: '03 / INTELLIGENCE', description: 'Structures environmental information so the system can reason about space and context.', layer: 'intelligence' },
  { id: 'action', label: '04 / ACTION', description: 'Uses the resulting information to support navigation, inspection and mission decisions.', layer: 'action' },
]

const components: Item[] = [
  { id: 'rgb', label: 'RGB', description: 'Visible-spectrum imagery used for scene and object perception.', layer: 'sensing' },
  { id: 'depth', label: 'DEPTH', description: 'Depth measurements provide spatial structure around the platform.', layer: 'sensing' },
  { id: 'lidar', label: 'LiDAR', description: 'Range measurements support spatial reconstruction and localization.', layer: 'sensing' },
  { id: 'thermal', label: 'THERMAL', description: 'Thermal sensing provides information that may not be visible in RGB imagery.', layer: 'sensing' },
  { id: 'imu', label: 'IMU', description: 'Inertial measurements support motion estimation and state awareness.', layer: 'sensing' },
  { id: 'gps', label: 'GPS', description: 'Global position provides geographic reference for the system.', layer: 'sensing' },
  { id: 'detection', label: 'DETECTION', description: 'Identifies relevant objects or conditions within sensor data.', layer: 'perception' },
  { id: 'localization', label: 'LOCALIZATION', description: 'Estimates the platform\'s position and motion within the environment.', layer: 'perception' },
  { id: 'mapping', label: 'MAPPING', description: 'Builds a spatial representation of the surrounding environment.', layer: 'perception' },
  { id: 'environmental-representation', label: 'ENVIRONMENTAL REPRESENTATION', description: 'Combines spatial and semantic information into a structured representation of the environment.', layer: 'intelligence' },
  { id: 'spatial-understanding', label: 'SPATIAL UNDERSTANDING', description: 'Associates entities with their spatial context and relationships.', layer: 'intelligence' },
  { id: 'analysis', label: 'ANALYSIS', description: 'Interprets environmental information to support downstream decisions.', layer: 'intelligence' },
  { id: 'navigation', label: 'NAVIGATION', description: 'Uses environmental and state information to guide movement.', layer: 'action' },
  { id: 'inspection', label: 'INSPECTION', description: 'Supports close-range assessment of areas, objects, and conditions.', layer: 'action' },
  { id: 'mission-decisions', label: 'MISSION DECISIONS', description: 'Converts environmental information into actionable mission-level decisions.', layer: 'action' },
]

const links: Array<[ComponentId, ComponentId]> = [
  ['rgb', 'detection'], ['depth', 'localization'], ['lidar', 'localization'], ['lidar', 'mapping'], ['thermal', 'detection'], ['imu', 'localization'], ['gps', 'localization'],
  ['detection', 'environmental-representation'], ['localization', 'environmental-representation'], ['mapping', 'environmental-representation'],
  ['environmental-representation', 'spatial-understanding'], ['spatial-understanding', 'analysis'], ['environmental-representation', 'navigation'], ['spatial-understanding', 'inspection'], ['analysis', 'mission-decisions'], ['navigation', 'mission-decisions'], ['inspection', 'mission-decisions'],
]

const itemById = new Map([...layers, ...components].map((item) => [item.id, item]))
const componentIdsByLayer = new Map(layers.map((layer) => [layer.id, components.filter((item) => item.layer === layer.id).map((item) => item.id as ComponentId)]))

const nodePositions: Record<ComponentId, [number, number, number]> = {
  rgb: [52, 103, 74], depth: [52, 160, 74], lidar: [52, 217, 74], thermal: [52, 274, 74], imu: [52, 331, 74], gps: [52, 388, 74],
  detection: [285, 138, 108], localization: [285, 231, 108], mapping: [285, 324, 108],
  'environmental-representation': [506, 111, 190], 'spatial-understanding': [506, 231, 190], analysis: [506, 351, 164],
  navigation: [778, 138, 130], inspection: [778, 231, 130], 'mission-decisions': [778, 324, 150],
}

const linkKey = ([source, target]: [ComponentId, ComponentId]) => `${source}-${target}`

function selectFromKeyboard(event: React.KeyboardEvent<SVGGElement>, callback: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

export function TheSystem() {
  const [selection, setSelection] = useState<SelectionId>(null)
  const [pulseRun, setPulseRun] = useState(0)

  const selectionDetails = useMemo(() => {
    if (!selection) return { label: 'SYSTEM ARCHITECTURE', description: 'Select a system layer or component to inspect its role.' }
    const item = itemById.get(selection)
    return item ? { label: item.label.replace(/^0\d \/ /, ''), description: item.description } : { label: 'SYSTEM ARCHITECTURE', description: 'Select a system layer or component to inspect its role.' }
  }, [selection])

  const selectedComponents = useMemo(() => {
    if (!selection) return new Set<ComponentId>()
    if (componentIdsByLayer.has(selection as LayerId)) return new Set(componentIdsByLayer.get(selection as LayerId))
    return new Set([selection as ComponentId])
  }, [selection])

  const pulseLevels = useMemo(() => {
    const levels = new Map<string, number>()
    if (!selection) return levels

    const queue = [...selectedComponents].map((id) => ({ id, level: 0 }))
    const visited = new Map<ComponentId, number>(queue.map(({ id, level }) => [id, level]))

    while (queue.length) {
      const current = queue.shift()
      if (!current) continue
      links.forEach((link) => {
        const [source, target] = link
        if (source !== current.id) return
        levels.set(linkKey(link), current.level)
        const knownLevel = visited.get(target)
        if (knownLevel === undefined || current.level + 1 < knownLevel) {
          visited.set(target, current.level + 1)
          queue.push({ id: target, level: current.level + 1 })
        }
      })
    }

    return levels
  }, [selectedComponents, selection])

  const highlightedLinks = useMemo(() => {
    const highlighted = new Set(pulseLevels.keys())
    if (!selection) return highlighted

    links.forEach((link) => {
      const [source, target] = link
      if (selectedComponents.has(source) || selectedComponents.has(target)) highlighted.add(linkKey(link))
    })

    return highlighted
  }, [pulseLevels, selectedComponents, selection])

  const connectedComponents = useMemo(() => {
    const connected = new Set<ComponentId>()
    if (!selection) return connected
    links.forEach(([source, target]) => {
      if (highlightedLinks.has(linkKey([source, target]))) {
        connected.add(source)
        connected.add(target)
      }
    })
    return connected
  }, [highlightedLinks, selection])

  const choose = (id: SelectionId) => {
    setSelection((current) => current === id ? null : id)
    setPulseRun((run) => run + 1)
  }
  const nodeState = (id: ComponentId) => {
    if (!selection) return 'is-idle'
    if (selectedComponents.has(id)) return 'is-selected'
    if (connectedComponents.has(id)) return 'is-connected'
    return 'is-subdued'
  }
  const linkState = (link: [ComponentId, ComponentId]) => (selection && highlightedLinks.has(linkKey(link)) ? 'is-highlighted' : selection ? 'is-subdued' : 'is-idle')

  return (
    <section className="the-system" id="the-system" aria-labelledby="the-system-title">
      <p className="system-kicker"><span aria-hidden="true" />05 / THE SYSTEM</p>
      <div className="system-copy">
        <h2 id="the-system-title">HOW THE MACHINE<br />WORKS AS ONE<br />SYSTEM.</h2>
        <p>TATTVA connects sensing, perception, environmental intelligence and action into one system.</p>
      </div>

      <div className="system-architecture" data-system-architecture onClick={() => setSelection(null)}>
        <svg className="system-architecture__desktop" viewBox="0 0 940 500" role="img" aria-label="Interactive TATTVA system architecture">
          <rect className="architecture-background" width="940" height="500" />
          {layers.map((layer, index) => {
            const groupX = [25, 258, 479, 751][index]
            const groupWidth = [126, 162, 184, 177][index]
            const active = selection === layer.id
            return (
              <g className={`architecture-group ${active ? 'is-selected' : selection ? 'is-subdued' : ''}`} key={layer.id}>
                <rect className="architecture-group__boundary" x={groupX} y="38" width={groupWidth} height="426" />
                <g className="architecture-group__trigger" role="button" tabIndex={0} aria-label={layer.label} aria-pressed={active} onClick={(event) => { event.stopPropagation(); choose(layer.id) }} onKeyDown={(event) => selectFromKeyboard(event, () => choose(layer.id))}>
                  <text x={groupX + 14} y="67">{layer.label}</text>
                </g>
              </g>
            )
          })}
          <path className="architecture-flow" d="M151 81 H285 M447 81 H506 M670 81 H778" />
          {links.map(([source, target], index) => {
            const [sourceX, sourceY, sourceWidth] = nodePositions[source]
            const [targetX, targetY] = nodePositions[target]
            const pathData = `M ${sourceX + sourceWidth} ${sourceY + 19} C ${(sourceX + sourceWidth + targetX) / 2} ${sourceY + 19}, ${(sourceX + sourceWidth + targetX) / 2} ${targetY + 19}, ${targetX} ${targetY + 19}`
            const level = pulseLevels.get(linkKey([source, target]))
            return (
              <g key={linkKey([source, target])}>
                <path className={`architecture-link ${linkState([source, target])}`} d={pathData} />
                {level !== undefined && <path className="architecture-pulse" d={pathData} pathLength="1" style={{ animationDelay: `${level * 160 + (selectedComponents.size > 1 ? (index % 3) * 80 : 0)}ms` }} key={`${linkKey([source, target])}-${pulseRun}`} />}
              </g>
            )
          })}
          {components.map((component) => {
            const [x, y, width] = nodePositions[component.id as ComponentId]
            const active = selection === component.id
            return (
              <g className={`architecture-node ${nodeState(component.id as ComponentId)}`} role="button" tabIndex={0} aria-label={component.label} aria-pressed={active} transform={`translate(${x} ${y})`} key={component.id} onClick={(event) => { event.stopPropagation(); choose(component.id as ComponentId) }} onKeyDown={(event) => selectFromKeyboard(event, () => choose(component.id as ComponentId))}>
                <rect width={width} height="38" />
                <text x="10" y="24">{component.label}</text>
              </g>
            )
          })}
        </svg>

        <div className="system-architecture__mobile" data-has-selection={Boolean(selection)}>
          {layers.map((layer) => (
            <div className={`mobile-system-group ${selection === layer.id ? 'is-selected' : selection ? 'is-subdued' : ''} ${selection && components.some((component) => component.layer === layer.id && (selectedComponents.has(component.id as ComponentId) || connectedComponents.has(component.id as ComponentId))) ? 'is-flow-active' : ''}`} key={layer.id}>
              <button type="button" className="mobile-system-layer" aria-pressed={selection === layer.id} onClick={() => choose(layer.id)}>{layer.label}</button>
              <div className="mobile-system-components">
                {components.filter((component) => component.layer === layer.id).map((component) => (
                  <button type="button" className={`mobile-system-node ${nodeState(component.id as ComponentId)}`} aria-pressed={selection === component.id} onClick={() => choose(component.id as ComponentId)} key={component.id}>{component.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="system-information" aria-live="polite"><strong>{selectionDetails.label}</strong><p>{selectionDetails.description}</p><button type="button" onClick={() => choose(null)} disabled={!selection}>CLEAR SELECTION</button></div>
      <p className="system-bottom-label">SYSTEM / ARCHITECTURE</p>
      <p className="system-section-number">05 / 06</p>
    </section>
  )
}
