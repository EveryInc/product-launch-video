import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Starter composition. Replace scenes with your own launch video structure.
 *
 * Recommended structure:
 *   1. Hook (0-3s) — lead with the viewer's problem
 *   2. Product reveal (3-6s) — show the product solving it
 *   3. Before/after (6-15s) — the money shot
 *   4. Feature beats (15-25s) — 2-3 specific wins
 *   5. Endcard (25-30s) — one headline + CTA
 */
export const LaunchVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ opacity, textAlign: 'center', maxWidth: 1400 }}>
        <h1 style={{ fontSize: 120, fontWeight: 700, margin: 0 }}>
          Replace this scene
        </h1>
        <p style={{ fontSize: 36, opacity: 0.6, marginTop: 24 }}>
          Edit <code>src/LaunchVideo.tsx</code> to start.
        </p>
      </div>
    </AbsoluteFill>
  );
};
