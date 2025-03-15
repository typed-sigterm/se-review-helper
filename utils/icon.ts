export const injectIconify = () => injectScript('/iconify.js');

export const UsedIcons = [
  'line-md:loading-loop',
  'mdi:question-mark-box',
  'mdi:text-box-check',
  'mdi:text-box-remove',
] as const;

/**
 * Create iconify icon element.
 * @param name icon name
 * @param tooltip `title` attribute
 * @returns icon element
 */
export function createIcon(name: typeof UsedIcons[number], tooltip?: string) {
  const icon = document.createElement('iconify-icon');
  icon.setAttribute('icon', name);
  icon.setAttribute('inline', 'true');
  tooltip && icon.setAttribute('title', tooltip);
  return icon;
}
