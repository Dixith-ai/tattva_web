import { useState } from 'react'
import '../styles/mission-simulation.css'

type EvidenceId = 'flight' | 'rgb-depth' | 'lidar' | 'ros2'

type EvidenceRecord = {
  id: EvidenceId
  selector: string
  title: string
  description: string
  asset: string
  metadata: string[]
}

const evidenceRecords: EvidenceRecord[] = [
  {
    id: 'flight',
    selector: '01 / FLIGHT',
    title: 'FLIGHT SIMULATION',
    description: 'Flight control and vehicle behaviour are validated in simulation before hardware deployment.',
    asset: 'tattva-flight-simulation',
    metadata: ['PX4 SITL', 'GAZEBO SIM', 'X500', 'BAYLANDS'],
  },
  {
    id: 'rgb-depth',
    selector: '02 / RGB + DEPTH',
    title: 'RGB + DEPTH',
    description: 'RGB and depth sensing provide visual and spatial information about the environment.',
    asset: 'tattva-rgb-depth-simulation',
    metadata: ['RGB', 'DEPTH', 'SENSOR VIEW', 'SIMULATION'],
  },
  {
    id: 'lidar',
    selector: '03 / LiDAR',
    title: 'LiDAR',
    description: 'LiDAR provides spatial measurements for understanding obstacles and surrounding geometry.',
    asset: 'tattva-lidar-simulation',
    metadata: ['LiDAR', '3D SCAN', 'ROS 2', 'POINTCLOUD2'],
  },
  {
    id: 'ros2',
    selector: '04 / ROS 2',
    title: 'ROS 2',
    description: 'Sensor data is made available through the ROS 2 communication pipeline for perception development.',
    asset: 'tattva-ros2-simulation',
    metadata: ['PX4', 'ROS 2', 'SENSOR DATA', 'PERCEPTION'],
  },
]

export function MissionSimulation() {
  const [activeEvidence, setActiveEvidence] = useState<EvidenceId>('flight')
  const activeRecord = evidenceRecords.find((record) => record.id === activeEvidence) ?? evidenceRecords[0]

  return (
    <section className="mission-simulation" id="mission-simulation" aria-labelledby="mission-simulation-title">
      <p className="mission-simulation-kicker"><span aria-hidden="true" />06 / MISSION / SIMULATION</p>

      <div className="mission-simulation-copy">
        <h2 id="mission-simulation-title">TESTED<br />BEFORE<br />DEPLOYMENT.</h2>
        <p>TATTVA is being developed through simulation before physical deployment. Flight, sensing and robotic perception are validated as separate subsystems before integration.</p>
      </div>

      <div className="mission-evidence" aria-label="Interactive TATTVA simulation evidence">
        <div className="mission-evidence-frame">
          {/* TODO: Replace this media slot with the corresponding real TATTVA simulation capture. */}
          <div className="mission-evidence-media" data-asset={activeRecord.asset} key={activeRecord.id} role="img" aria-label={`${activeRecord.title} simulation evidence`}>
            <p className="mission-evidence-record">SIMULATION RECORD</p>
            <div className="mission-evidence-guides" aria-hidden="true"><span /><span /><span /></div>
            <p className="mission-evidence-title">{activeRecord.title}</p>
            <div className="mission-evidence-metadata" aria-label="Simulation metadata">
              {activeRecord.metadata.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>

        <div className="mission-evidence-footer">
          <div className="mission-evidence-controls" aria-label="Simulation evidence categories">
            {evidenceRecords.map((record) => (
              <button
                type="button"
                key={record.id}
                aria-pressed={activeEvidence === record.id}
                className={activeEvidence === record.id ? 'is-active' : ''}
                onClick={() => setActiveEvidence(record.id)}
              >
                {record.selector}
              </button>
            ))}
          </div>
          <div className="mission-evidence-information" aria-live="polite">
            <strong>{activeRecord.title}</strong>
            <p>{activeRecord.description}</p>
          </div>
        </div>
      </div>

      <p className="mission-simulation-bottom-label">SIMULATION / VALIDATION</p>
      <p className="mission-simulation-section-number">06 / 06</p>
    </section>
  )
}
