export const renderStringDirectiveFactory = (
  item,
  { element, lastNamesMap, document }
) => {
  if (item !== false && item !== undefined && item !== null) {
    const template = document.createElement('template');
    template.innerHTML = `<${element.tagName} ${item}></${element.tagName}>`;
    const copy = template.content.childNodes[0];
    const currentNames = Array.from(copy.attributes, (attr) => attr.name);
    const removeNames = Array.from(lastNamesMap).filter(
      (lastName) => currentNames.indexOf(lastName) === -1
    );
    for (const removeName of removeNames) {
      element.removeAttribute(removeName);
    }
    lastNamesMap.clear();
    for (const currentName of currentNames) {
      lastNamesMap.add(currentName);
    }
    for (const attr of copy.attributes) {
      element.setAttribute(attr.name, attr.value);
    }
  }
  return element;
};
