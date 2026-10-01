
interface MatchColorBadgeProps {
  colors?: string[];
  names?: string[];
  size?: number;
}

export default function MatchColorBadge({
  colors,
  names,
  size = 14,
}: MatchColorBadgeProps) {
  if (!colors?.length) return null;

  return (
    <div style={{ display: "flex", justifyContent: "start", gap: 4 }}>
      {colors.map((color, i) => (
        <div
          key={i}
          title={names?.[i]}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: "0 0 2px rgba(0,0,0,0.35)",
          }}
        />
      ))}
    </div>
  );
}
