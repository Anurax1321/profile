import styles from './CircuitLine.module.css';

const CircuitLine: React.FC = () => {
  // Circuit trace path with angular turns and nodes
  const tracePath =
    'M 10,10 L 60,10 L 70,5 L 120,5 L 130,10 L 200,10 L 210,15 L 260,15 L 270,10 L 340,10 L 350,5 L 400,5 L 410,10 L 480,10 L 490,15 L 540,15 L 550,10 L 590,10';

  return (
    <div className={styles.circuitContainer} aria-hidden="true">
      <svg
        className={styles.circuitSvg}
        viewBox="0 0 600 20"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background glow trace */}
        <path d={tracePath} className={styles.traceGlow} />

        {/* Main animated trace */}
        <path d={tracePath} className={styles.tracePath} />

        {/* Circuit nodes (junction points) */}
        {[10, 130, 270, 410, 550].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={10} r={3.5} className={styles.node} />
            <circle cx={cx} cy={10} r={1.5} className={styles.nodeCenter} />
          </g>
        ))}

        {/* Branch stubs for visual complexity */}
        <line x1="200" y1="10" x2="200" y2="2" className={styles.tracePath} style={{ animationDelay: '0.3s' }} />
        <line x1="340" y1="10" x2="340" y2="18" className={styles.tracePath} style={{ animationDelay: '0.6s' }} />
        <line x1="480" y1="10" x2="480" y2="2" className={styles.tracePath} style={{ animationDelay: '0.9s' }} />
      </svg>
    </div>
  );
};

export default CircuitLine;
