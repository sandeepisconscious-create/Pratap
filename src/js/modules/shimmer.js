/**
 * Shimmer skeleton loader utility.
 * Wraps an element in a shimmer skeleton that fades out once the
 * primary media (img/iframe) inside the element has loaded.
 */
export function setupShimmerOnElement(container) {
  // Avoid double-wrapping
  if (container.querySelector('.shimmer-skeleton')) return;

  const skeleton = document.createElement('div');
  skeleton.className = 'shimmer-skeleton';

  const shimmerBar = document.createElement('div');
  shimmerBar.className = 'shimmer-gradient animate-shimmer';
  skeleton.appendChild(shimmerBar);

  container.style.position = 'relative';
  container.appendChild(skeleton);

  const media = container.querySelector('img, iframe');

  const removeSkeleton = () => {
    skeleton.style.opacity = '0';
    setTimeout(() => skeleton.remove(), 500);
  };

  if (media) {
    if (media.tagName === 'IMG') {
      if (media.complete && media.naturalWidth > 0) {
        removeSkeleton();
      } else {
        media.addEventListener('load', removeSkeleton, { once: true });
        media.addEventListener('error', removeSkeleton, { once: true });
      }
    } else {
      // iframes: remove after a brief delay
      setTimeout(removeSkeleton, 800);
    }
  } else {
    // No media found – remove skeleton after a short timeout
    setTimeout(removeSkeleton, 600);
  }
}
