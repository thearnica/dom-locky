export const LOCKY_GROUP = 'data-locky-group';
export const LOCKY_TRANSPARENT = 'data-locky-transparent';

const getAllInGroup = (node) => {
  const group = node.getAttribute(LOCKY_GROUP);
  if (group) {
    return [...document.querySelectorAll(`[${LOCKY_GROUP}="${group}"]`)];
  }
  return [node];
};

export const isInside = (ref, target) => {
  const all = getAllInGroup(ref);
  return !!all.find(node => node.contains(target));
};

export const shouldIgnoreEvent = (eventNode) => {
  const freeNodes = [...document.querySelectorAll(`[${LOCKY_TRANSPARENT}="true"]`)];
  return freeNodes.some(node => node.contains(eventNode));
};
