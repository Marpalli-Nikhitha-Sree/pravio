import "../styles/background.css";

function AnimatedBackground() {
  return (
    <div className="background-container">

      <div className="sun sun-1"></div>
      <div className="sun sun-2"></div>
      
      <svg
  className="waves"
  viewBox="0 0 1600 900"
  preserveAspectRatio="none"
>

  {/* HERO WAVE */}
  <path
    className="wave-fill wave-fill-1"
    d="
      M0,170
      C250,20 650,90 900,320
      C1180,560 1420,520 1600,240
      L1600,900
      L0,900
      Z
    "
  />

  {/* LEFT FLOATING WAVE */}
  <path
    className="wave-fill wave-fill-2"
    d="
      M-100,350
      C180,220 420,280 650,480
      C860,660 980,700 1100,610
      L1100,900
      L-100,900
      Z
    "
  />

  {/* CENTER WAVE */}
  <path
    className="wave-fill wave-fill-2"
    d="
      M250,470
      C500,350 800,400 1020,580
      C1240,760 1450,730 1700,520
      L1700,900
      L250,900
      Z
    "
  />

  {/* LOWER LEFT WAVE */}
  <path
    className="wave-fill wave-fill-3"
    d="
      M-200,600
      C120,520 420,560 700,720
      C900,840 1050,860 1300,760
      L1300,900
      L-200,900
      Z
    "
  />

  {/* BOTTOM LONG WAVE */}
  <path
    className="wave-fill wave-fill-3"
    d="
      M500,760
      C820,670 1120,700 1380,820
      C1520,880 1600,850 1750,760
      L1750,900
      L500,900
      Z
    "
  />

  {/* FOREGROUND SUBTLE WAVE */}
  <path
    className="wave-fill wave-fill-3"
    d="
      M300,820
      C600,760 950,790 1300,850
      C1500,890 1650,880 1800,820
      L1800,900
      L300,900
      Z
    "
  />

</svg>

    </div>
  );
}

export default AnimatedBackground;