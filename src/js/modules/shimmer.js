/**
 * Shimmer skeleton loader utility.
 * Appends a shimmer overlay to a container and removes it when the
 * contained image/iframe finishes loading. Uses rAF so it works even
 * when img.src is assigned after this function is called.
 */
export function setupShimmerOnElement(container) {
  // Avoid double-wrapping
  if (container.querySelector(".shimmer-skeleton")) return;

  const skeleton = document.createElement("div");
  skeleton.className = "shimmer-skeleton";

  const shimmerBar = document.createElement("div");
  shimmerBar.className = "shimmer-gradient animate-shimmer";
  skeleton.appendChild(shimmerBar);

  container.appendChild(skeleton);

  const removeSkeleton = () => {
    if (!skeleton.parentNode) return;
    skeleton.style.opacity = "0";
    setTimeout(() => skeleton.remove(), 500);
  };

  // Safety: always remove after 5 seconds no matter what
  const safetyTimer = setTimeout(removeSkeleton, 5000);

  const watchMedia = () => {
    const media = container.querySelector("img, iframe");

    if (!media) {
      // Media not inserted yet – try again next frame
      requestAnimationFrame(watchMedia);
      return;
    }

    if (media.tagName === "IMG") {
      const onLoad = () => {
        clearTimeout(safetyTimer);
        removeSkeleton();
      };
      if (media.complete && media.naturalWidth > 0) {
        onLoad();
      } else {
        media.addEventListener("load", onLoad, { once: true });
        media.addEventListener("error", onLoad, { once: true });
      }
    } else {
      // iframe – remove after a short delay
      setTimeout(() => {
        clearTimeout(safetyTimer);
        removeSkeleton();
      }, 800);
    }
  };

  // Use rAF so img.src assignment (which happens right after append) is picked up
  requestAnimationFrame(watchMedia);
}
