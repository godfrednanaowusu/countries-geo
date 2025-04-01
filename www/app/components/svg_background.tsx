export default function SVGBackground(){
    return (
        <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  opacity: 0.04,
                  zIndex: -1,
                }}
              >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="40"
                      y2="0"
                      stroke="#ddd"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="40"
                      stroke="#ddd"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="#1a1a1a" />
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#grid)"
                />
                <path
                  d="M 0 0 H 10000 M 0 0 V 10000"
                  stroke="#ccc"
                  strokeWidth="2"
                  strokeDasharray="80"
                />
              </svg>
    )
}