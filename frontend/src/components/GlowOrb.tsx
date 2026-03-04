interface GlowOrbProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  blur?: number;
}

export default function GlowOrb({
  color = '#7c3aed',
  size = 500,
  top,
  left,
  right,
  bottom,
  opacity = 0.15,
  blur = 80,
}: GlowOrbProps) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        top,
        left,
        right,
        bottom,
        opacity,
        filter: `blur(${blur}px)`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
