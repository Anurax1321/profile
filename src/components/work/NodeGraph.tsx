import { useEffect, useMemo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { ProjectNode, RoleId } from '../../data/projects';
import { playSound } from '../../utils/sound';
import styles from './NodeGraph.module.css';

interface NodeGraphProps {
  nodes: ProjectNode[];
  /** Active role from the URL filter; null means show all at full brightness. */
  activeRole: RoleId | null;
  /** Fired when a node is clicked or activated by keyboard (Enter/Space). */
  onSelect: (node: ProjectNode) => void;
}

interface PlacedNode {
  node: ProjectNode;
  /** Percentage positions inside the canvas (0..100). */
  xPct: number;
  yPct: number;
}

/** Uniform hex flat-to-flat width. Type info surfaces in the modal pill. */
const HEX_SIZE = 110;
/** Cursor influence: pixels of effective range and max push amount. */
const REPEL_RADIUS = 180;
const MAX_PUSH = 28;

/** Pointy-top hex polygon points on a 100x100 viewBox, inset 3px for stroke. */
const HEX_POINTS = '50,3 94,27 94,73 50,97 6,73 6,27';

/** Deterministic pseudo-random in [0,1) seeded by string. */
function seededRandom(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/**
 * Place nodes symmetrically: left half and right half of the canvas, balanced
 * around the vertical center. Each side gets roughly half the nodes spread
 * vertically with a small jitter so they do not look too gridded.
 */
function placeNodes(nodes: ProjectNode[]): PlacedNode[] {
  const count = nodes.length;
  if (count === 0) return [];

  // Alternate left/right so order in PROJECTS interleaves visually.
  const leftIds: ProjectNode[] = [];
  const rightIds: ProjectNode[] = [];
  nodes.forEach((n, i) => {
    if (i % 2 === 0) leftIds.push(n);
    else rightIds.push(n);
  });

  const layoutSide = (
    list: ProjectNode[],
    centerX: number,
  ): PlacedNode[] => {
    const len = list.length;
    return list.map((node, i) => {
      // Distribute vertically across the canvas; pad top/bottom by 15%.
      const yBase = len === 1 ? 50 : 18 + ((i + 0.5) * (64 / len));
      const yJitter = (seededRandom(node.id, 1) - 0.5) * 6;
      const xJitter = (seededRandom(node.id, 2) - 0.5) * 8;
      return {
        node,
        xPct: centerX + xJitter,
        yPct: yBase + yJitter,
      };
    });
  };

  return [
    ...layoutSide(leftIds, 26),
    ...layoutSide(rightIds, 74),
  ];
}

/**
 * One hex node. Encapsulated so each can own its own motion values for cursor
 * push without triggering re-renders on every cursor frame.
 */
function HexNode({
  placed,
  cursorX,
  cursorY,
  reduceMotion,
  dimmed,
  onSelect,
}: {
  placed: PlacedNode;
  cursorX: ReturnType<typeof useMotionValue<number>>;
  cursorY: ReturnType<typeof useMotionValue<number>>;
  reduceMotion: boolean;
  dimmed: boolean;
  onSelect: (n: ProjectNode) => void;
}) {
  const { node, xPct, yPct } = placed;
  const elRef = useRef<HTMLDivElement | null>(null);

  // Cursor-push offset relative to the node's actual screen position.
  const pushX = useTransform(() => {
    const el = elRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const nx = r.left + r.width / 2;
    const ny = r.top + r.height / 2;
    const cx = cursorX.get();
    const cy = cursorY.get();
    if (!Number.isFinite(cx)) return 0;
    const dx = nx - cx;
    const dy = ny - cy;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > REPEL_RADIUS) return 0;
    const factor = (1 - dist / REPEL_RADIUS) * MAX_PUSH;
    return (dx / dist) * factor;
  });
  const pushY = useTransform(() => {
    const el = elRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const nx = r.left + r.width / 2;
    const ny = r.top + r.height / 2;
    const cx = cursorX.get();
    const cy = cursorY.get();
    if (!Number.isFinite(cx)) return 0;
    const dx = nx - cx;
    const dy = ny - cy;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > REPEL_RADIUS) return 0;
    const factor = (1 - dist / REPEL_RADIUS) * MAX_PUSH;
    return (dy / dist) * factor;
  });

  // Spring for smooth push/release.
  const springX = useSpring(pushX, { stiffness: 90, damping: 14, mass: 0.6 });
  const springY = useSpring(pushY, { stiffness: 90, damping: 14, mass: 0.6 });

  // Gentle perpetual drift on the OUTER wrapper. Cursor push lives on inner.
  const ax = reduceMotion ? 0 : 4 + seededRandom(node.id, 3) * 4;
  const ay = reduceMotion ? 0 : 4 + seededRandom(node.id, 4) * 4;
  const dur = 18 + seededRandom(node.id, 5) * 8;
  const delay = seededRandom(node.id, 6) * 4;

  return (
    <motion.div
      ref={elRef}
      className={[styles.node, dimmed ? styles.dimmed : ''].filter(Boolean).join(' ')}
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: HEX_SIZE,
        height: HEX_SIZE,
        marginLeft: -HEX_SIZE / 2,
        marginTop: -HEX_SIZE / 2,
      }}
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, ax, -ax * 0.6, 0],
              y: [0, -ay, ay * 0.5, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <motion.button
        type="button"
        className={styles.inner}
        style={{ x: springX, y: springY }}
        onClick={() => {
          playSound('/click.mp3', 0.4);
          onSelect(node);
        }}
        aria-label={`Open details for ${node.title}`}
      >
        <svg
          className={styles.hex}
          viewBox="0 0 100 100"
          aria-hidden
          preserveAspectRatio="xMidYMid meet"
        >
          <polygon className={styles.hexFill} points={HEX_POINTS} />
          <polygon className={styles.hexStroke} points={HEX_POINTS} />
        </svg>
        <span className={styles.initials}>{node.initials}</span>
        <span className={styles.label}>{node.title}</span>
      </motion.button>
    </motion.div>
  );
}

export default function NodeGraph({ nodes, activeRole, onSelect }: NodeGraphProps) {
  const placed = useMemo(() => placeNodes(nodes), [nodes]);
  const reduceMotion = useReducedMotion() ?? false;

  // Cursor position in viewport coordinates. Each HexNode reads its own bounding
  // rect to compute distance, so this is cheap and shared.
  const cursorX = useMotionValue(Number.NaN);
  const cursorY = useMotionValue(Number.NaN);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onLeave = () => {
      cursorX.set(Number.NaN);
      cursorY.set(Number.NaN);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [cursorX, cursorY, reduceMotion]);

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      role="region"
      aria-label="Projects filtered by role"
    >
      {placed.map((p) => {
        const matchesRole = activeRole === null || p.node.roles.includes(activeRole);
        return (
          <HexNode
            key={p.node.id}
            placed={p}
            cursorX={cursorX}
            cursorY={cursorY}
            reduceMotion={reduceMotion}
            dimmed={!matchesRole}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
