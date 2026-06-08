import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/fluidBackground.css";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

export default function FluidBackground() {
  const isDark = useTheme() === "dark";
  const wave = (lightOpacity, darkOpacity, color = "white") => ({
    color: isDark ? "#b4b4bc" : color,
    opacity: isDark ? darkOpacity : lightOpacity,
  });

  const w1 = wave(0.22, 0.14);
  const w2 = wave(0.24, 0.12);
  const w3 = wave(0.14, 0.09);
  const w4 = wave(0.12, 0.07);
  const w5 = wave(0.08, 0.05);

  return (
    <div className="fluid-bg">

      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>
      <div className="glow glow-4"></div>

      <div className="center-light"></div>

      <div className="sparkles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <motion.svg
        className="fluid-waves"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        animate={{
          x: [-15, 15, -15],
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >

        <defs>

  <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stopColor={w1.color} stopOpacity={w1.opacity} />
    <stop offset="60%" stopColor={w1.color} stopOpacity={w1.opacity * 0.45} />
    <stop offset="100%" stopColor={w1.color} stopOpacity="0" />
  </linearGradient>

  <linearGradient id="wave2" x1="1" y1="0" x2="0" y2="0">
    <stop offset="0%" stopColor={w2.color} stopOpacity={w2.opacity} />
    <stop offset="40%" stopColor={w2.color} stopOpacity={w2.opacity * 0.33} />
    <stop offset="100%" stopColor={w2.color} stopOpacity="0" />
  </linearGradient>

  <linearGradient id="wave3" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stopColor={w3.color} stopOpacity={w3.opacity} />
    <stop offset="70%" stopColor={w3.color} stopOpacity={w3.opacity * 0.43} />
    <stop offset="100%" stopColor={w3.color} stopOpacity="0" />
  </linearGradient>

  <linearGradient id="wave4" x1="1" y1="0" x2="0" y2="0">
    <stop offset="0%" stopColor={w4.color} stopOpacity={w4.opacity} />
    <stop offset="50%" stopColor={w4.color} stopOpacity={w4.opacity * 0.42} />
    <stop offset="100%" stopColor={w4.color} stopOpacity="0" />
  </linearGradient>

  <linearGradient id="wave5" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stopColor={w5.color} stopOpacity={w5.opacity} />
    <stop offset="75%" stopColor={w5.color} stopOpacity={w5.opacity * 0.38} />
    <stop offset="100%" stopColor={w5.color} stopOpacity="0" />
  </linearGradient>

</defs>

        <path
          fill="url(#wave1)"
          d="
          M0 120
          C250 40 500 80 760 180
          C1020 280 1300 280 1600 150
          L1600 900
          L0 900
          Z
          "
        />

        <path
          fill="url(#wave2)"
          d="
          M1600 260
          C1300 170 1050 200 820 340
          C600 470 280 480 0 320
          L0 900
          L1600 900
          Z
          "
        />

        <path
          fill="url(#wave3)"
          d="
          M0 430
          C320 330 620 350 900 470
          C1180 590 1400 580 1600 500
          L1600 900
          L0 900
          Z
          "
        />

        <path
          fill="url(#wave4)"
          d="
          M0 560
          C260 500 520 540 820 650
          C1080 760 1380 760 1600 680
          L1600 900
          L0 900
          Z
          "
        />

        <path
          fill="url(#wave5)"
          d="
          M0 720
          C300 650 650 670 980 790
          C1260 890 1450 860 1600 780
          L1600 900
          L0 900
          Z
          "
        />

      </motion.svg>

    </div>
  );
}