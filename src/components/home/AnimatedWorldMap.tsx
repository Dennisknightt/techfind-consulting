"use client";

import React, { useEffect, useState } from "react";

const nodes = [
  { x: 35, y: 40, color: "#7C3AED" },    // Nairobi, Kenya - Purple
  { x: 52, y: 38, color: "#3B82F6" },    // London, UK - Blue
  { x: 72, y: 35, color: "#22D3EE" },    // Mumbai, India - Cyan
  { x: 85, y: 28, color: "#10B981" },    // Singapore - Green
  { x: 75, y: 48, color: "#F59E0B" },    // Middle East - Orange
  { x: 20, y: 45, color: "#EC4899" },    // USA East - Pink
  { x: 10, y: 52, color: "#8B5CF6" },    // USA West - Purple-pink
  { x: 62, y: 62, color: "#06B6D4" },    // Australia - Cyan
];

// Create connections between nodes
const connections = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [0, 4], [4, 2], [1, 5], [5, 6],
  [3, 7], [7, 2], [6, 0], [4, 5],
];

export function AnimatedWorldMap() {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % connections.length);
    }, 400); // Change active connection every 400ms
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 100 70"
      className="w-full h-full"
      style={{ opacity: 0.35 }}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Animated gradient definitions */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for each connection */}
        {connections.map((conn, i) => {
          const [n1, n2] = conn;
          const color1 = nodes[n1].color;
          const color2 = nodes[n2].color;
          return (
            <linearGradient
              key={`grad-${i}`}
              id={`gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color1} stopOpacity="0.6" />
              <stop offset="50%" stopColor={color1} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
            </linearGradient>
          );
        })}
      </defs>

      {/* World map outline (simplified) */}
      <g stroke="#FFFFFF" strokeWidth="0.3" fill="none" opacity="0.08">
        {/* Europe */}
        <path d="M 40 28 L 55 30 L 58 32 L 52 36 L 40 32 Z" />
        {/* Africa */}
        <path d="M 42 38 L 55 35 L 58 45 L 52 58 L 38 55 Z" />
        {/* Asia */}
        <path d="M 58 28 L 85 25 L 88 38 L 72 42 Z" />
        {/* Australia */}
        <path d="M 75 48 L 82 50 L 80 62 L 70 60 Z" />
        {/* Americas */}
        <path d="M 5 25 L 25 20 L 28 45 L 22 60 L 8 55 Z" />
      </g>

      {/* Animated connection lines */}
      {connections.map((conn, i) => {
        const [n1, n2] = conn;
        const node1 = nodes[n1];
        const node2 = nodes[n2];
        const isActive = i === animationPhase;

        return (
          <g key={`line-${i}`}>
            {/* Base line */}
            <line
              x1={node1.x}
              y1={node1.y}
              x2={node2.x}
              y2={node2.y}
              stroke={`url(#gradient-${i})`}
              strokeWidth={isActive ? "0.4" : "0.15"}
              opacity={isActive ? 1 : 0.3}
              filter="url(#glow)"
              style={{ transition: "all 0.4s ease" }}
            />

            {/* Animated pulsing effect for active line */}
            {isActive && (
              <>
                <line
                  x1={node1.x}
                  y1={node1.y}
                  x2={node2.x}
                  y2={node2.y}
                  stroke={node1.color}
                  strokeWidth="0.6"
                  opacity="0"
                  style={{
                    animation: "pulse-line 0.6s ease-out",
                  }}
                  filter="url(#glow)"
                />
                <style>{`
                  @keyframes pulse-line {
                    0% { opacity: 1; stroke-width: 0.6; }
                    100% { opacity: 0; stroke-width: 1.2; }
                  }
                `}</style>
              </>
            )}
          </g>
        );
      })}

      {/* Animated nodes */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          {/* Outer glow circle */}
          <circle
            cx={node.x}
            cy={node.y}
            r="0.8"
            fill={node.color}
            opacity="0.2"
            style={{
              animation: `glow-pulse ${2 + i * 0.2}s ease-in-out infinite`,
            }}
            filter="url(#glow)"
          />

          {/* Inner solid node */}
          <circle
            cx={node.x}
            cy={node.y}
            r="0.35"
            fill={node.color}
            filter="url(#glow)"
            style={{
              animation: `node-pulse ${3 + i * 0.3}s ease-in-out infinite`,
            }}
          />

          {/* Very small pulsing dot at center */}
          <circle
            cx={node.x}
            cy={node.y}
            r="0.15"
            fill="#FFFFFF"
            opacity="0.8"
            style={{
              animation: `center-pulse 1.5s ease-in-out infinite`,
            }}
          />
        </g>
      ))}

      <style>{`
        @keyframes glow-pulse {
          0%, 100% { r: 0.8; opacity: 0.2; }
          50% { r: 1.2; opacity: 0.35; }
        }

        @keyframes node-pulse {
          0%, 100% { r: 0.35; opacity: 1; }
          50% { r: 0.5; opacity: 0.7; }
        }

        @keyframes center-pulse {
          0%, 100% { r: 0.15; opacity: 0.8; }
          50% { r: 0.25; opacity: 0.4; }
        }
      `}</style>
    </svg>
  );
}
