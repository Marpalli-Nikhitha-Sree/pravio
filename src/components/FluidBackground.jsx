import { motion } from "framer-motion";
import "../styles/fluidBackground.css";
export default function FluidBackground() {
  return (
    <div className="fluid-bg">

      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <motion.svg
        className="fluid-waves"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        animate={{
          x: [-20, 20, -20]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >

        <path
          className="layer layer1"
          d="M0 220 C250 40 500 40 800 220 C1050 360 1350 360 1600 120 L1600 900 L0 900 Z"
        />

        <path
          className="layer layer2"
          d="M0 380 C240 220 520 250 760 430 C1000 610 1280 620 1600 350 L1600 900 L0 900 Z"
        />

        <path
          className="layer layer3"
          d="M0 520 C250 380 540 420 800 610 C1080 810 1340 760 1600 520 L1600 900 L0 900 Z"
        />

        <path
          className="layer layer4"
          d="M0 650 C320 540 640 540 980 700 C1220 820 1450 780 1600 660 L1600 900 L0 900 Z"
        />

        <path
          className="layer layer5"
          d="M0 760 C300 690 620 700 900 810 C1150 900 1400 860 1600 760 L1600 900 L0 900 Z"
        />
        <path
  className="layer layer6"
  d="M0 300 C220 250 420 250 700 340 C980 430 1280 430 1600 300 L1600 900 L0 900 Z"
/>

<path
  className="layer layer7"
  d="M0 700 C260 650 520 670 820 760 C1080 830 1340 820 1600 720 L1600 900 L0 900 Z"
/>

<path
  className="layer layer8"
  d="M0 840 C300 790 600 810 920 870 C1200 920 1420 900 1600 850 L1600 900 L0 900 Z"
/>
      </motion.svg>

    </div>
  );
}