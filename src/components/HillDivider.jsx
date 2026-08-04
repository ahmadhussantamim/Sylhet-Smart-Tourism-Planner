// components/HillDivider.jsx
// -----------------------------------------------------------------------
// A small recurring visual signature used between homepage sections:
// a soft layered-hill contour line, standing in for a plain <hr>.
// It nods to Sylhet's tea-garden hillsides without being a decoration
// that carries no meaning.
// -----------------------------------------------------------------------

export default function HillDivider({ color = '#DCE3D8' }) {
  return (
    <svg
      className="hill-divider"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,40 C150,10 300,55 450,30 C600,5 750,50 900,25 C1050,5 1150,35 1200,20"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}
