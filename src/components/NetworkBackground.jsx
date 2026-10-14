import React, { useMemo } from 'react';

/**
 * Animated SVG neural network background — represents the 200+ connected members.
 * Pure SVG/CSS, no images.
 */
export default function NetworkBackground({ className = '', nodeCount = 28 }) {
  const nodes = useMemo(() => {
    const arr = [];
    const seed = (i) => {
      const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < nodeCount; i++) {
      arr.push({
        x: 5 + seed(i) * 90,
        y: 5 + seed(i + 100) * 90,
        delay: seed(i + 200) * 3,
        size: 1.5 + seed(i + 300) * 2.5,
      });
    }
    return arr;
  }, [nodeCount]);

  const edges = useMemo(() => {
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 22) result.push({ i, j });
      }
    }
    return result;
  }, [nodes]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Edges */}
        {edges.map((e, idx) => (
          <line
            key={idx}
            x1={nodes[e.i].x}
            y1={nodes[e.i].y}
            x2={nodes[e.j].x}
            y2={nodes[e.j].y}
            stroke="currentColor"
            strokeWidth="0.08"
            className="text-primary/20"
          />
        ))}
        {/* Nodes */}
        {nodes.map((n, idx) => (
          <circle
            key={idx}
            cx={n.x}
            cy={n.y}
            r={n.size * 0.3}
            fill="currentColor"
            className="text-primary/40 animate-node-pulse"
            style={{ animationDelay: `${n.delay}s`, transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}