// Pixel-art Mario, drawn as an inline SVG so there are no image assets to
// ship or break. 12x16 grid based on the classic NES small-Mario sprite.
const PIXELS = [
  '000111110000',
  '001111111110',
  '003332272000',
  '032322272220',
  '032332227222',
  '033222277770',
  '000222222200',
  '001141110000',
  '011141141110',
  '111144441111',
  '221454454122',
  '222444444222',
  '224444444422',
  '004440044000',
  '033300003330',
  '333300003333',
]

const COLORS = {
  '1': '#e52521', // red cap & shirt
  '2': '#f8b888', // skin
  '3': '#6a3403', // brown hair / shoes
  '4': '#2a41e8', // blue overalls
  '5': '#ffd800', // yellow buttons
  '7': '#000000', // eyes
}

export default function MarioSprite({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 12 16"
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
      shapeRendering="crispEdges"
      aria-label="Mario"
      role="img"
    >
      {PIXELS.flatMap((row, y) =>
        row.split('').map((c, x) =>
          COLORS[c] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[c]} />
          ) : null
        )
      )}
    </svg>
  )
}
