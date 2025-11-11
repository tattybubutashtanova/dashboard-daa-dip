"""Histogram matching (specification) utility using OpenCV and NumPy.

Run this script directly to see a side-by-side comparison of the source,
reference, and matched images using matplotlib. Update the image paths in the
`__main__` block before running.
"""

from __future__ import annotations

import cv2
import numpy as np
import matplotlib.pyplot as plt


def histogram_matching(source_image: np.ndarray, reference_image: np.ndarray) -> np.ndarray:
    """Return a new image whose histogram matches the reference image.

    Parameters
    ----------
    source_image : np.ndarray
        Grayscale source image (uint8, values 0-255).
    reference_image : np.ndarray
        Grayscale reference image whose histogram we wish to match.

    Returns
    -------
    np.ndarray
        Matched image with the same shape as `source_image`.
    """

    if source_image.ndim != 2 or reference_image.ndim != 2:
        raise ValueError("Both images must be grayscale (single channel).")

    # Flatten both images; easier to compute histograms/CDFs on 1-D arrays.
    src_flat = source_image.ravel()
    ref_flat = reference_image.ravel()

    # Histograms (probability mass functions) with 256 bins covering [0, 255].
    src_hist, _ = np.histogram(src_flat, bins=256, range=(0, 255), density=True)
    ref_hist, _ = np.histogram(ref_flat, bins=256, range=(0, 255), density=True)

    # Cumulative distribution functions.
    src_cdf = np.cumsum(src_hist)
    ref_cdf = np.cumsum(ref_hist)

    # Build lookup table: for each gray level in source, find the nearest gray
    # level in reference with a CDF >= source CDF.
    lut = np.zeros(256, dtype=np.uint8)
    ref_idx = 0
    for src_idx in range(256):
        while ref_idx < 255 and ref_cdf[ref_idx] < src_cdf[src_idx]:
            ref_idx += 1
        lut[src_idx] = ref_idx

    # Apply mapping to entire image.
    matched = lut[source_image]

    return matched


def main() -> None:
    """Demonstrate histogram matching with matplotlib visualization."""

    source_path = "source.jpg"
    reference_path = "reference.jpg"

    source = cv2.imread(source_path, cv2.IMREAD_GRAYSCALE)
    reference = cv2.imread(reference_path, cv2.IMREAD_GRAYSCALE)

    if source is None or reference is None:
        raise FileNotFoundError(
            "Update 'source_path' and 'reference_path' with valid grayscale image files."
        )

    matched = histogram_matching(source, reference)

    fig, axes = plt.subplots(1, 3, figsize=(12, 4))
    titles = ["Source", "Reference", "Matched"]
    images = [source, reference, matched]

    for ax, title, img in zip(axes, titles, images):
        ax.imshow(img, cmap="gray", vmin=0, vmax=255)
        ax.set_title(title)
        ax.axis("off")

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()
