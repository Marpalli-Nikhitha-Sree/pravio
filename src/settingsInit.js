try {
  const saved = localStorage.getItem("pravio-settings");

  if (saved) {
    const { appearance } = JSON.parse(saved);

    if (appearance?.textSize) {
      document.documentElement.setAttribute(
        "data-text-size",
        appearance.textSize
      );
    } else if (appearance?.compactLayout) {
      document.documentElement.setAttribute("data-text-size", "small");
    } else {
      document.documentElement.setAttribute("data-text-size", "medium");
    }

    if (appearance?.reduceMotion) {
      document.documentElement.setAttribute("data-reduce-motion", "true");
    }
  } else {
    document.documentElement.setAttribute("data-text-size", "medium");
  }
} catch {
  document.documentElement.setAttribute("data-text-size", "medium");
}
