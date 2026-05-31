import API_BASE_URL from "../config";

export const IMAGE_PLACEHOLDER = "/assets/img/image-placeholder.svg";

export function getImageUrl(img, placeholder = IMAGE_PLACEHOLDER) {
  if (!img) {
    return placeholder;
  }

  if (img.startsWith("http")) {
    return img;
  }

  return `${API_BASE_URL}${img}`;
}
