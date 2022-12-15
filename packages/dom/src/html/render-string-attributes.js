import { toDirectiveItem } from './to-directive-item.js';
import { getResult } from './get-result.js';
import { filterResult } from './filter-result.js';
import { DIRECTIVE_RENDERERS } from '../attribute-renderers/get-directive-renderers.js';
import { ATTRIBUTE_RENDERERS } from '../attribute-renderers/get-attribute-renderers.js';
import { render } from '@async-to-html/render/render.js';

export const renderStringAttribute = (
  { element, attribute, components, ...props },
  ...args
) => {
  const nameMatches = getResult(attribute.name, components);
  const valueMatches = getResult(attribute.value, components);
  if (nameMatches.length > 1) {
    const nameItems = filterResult(nameMatches);
    element.removeAttribute(attribute.name);
    if (nameItems || attribute.value) {
      return render(
        attribute.value
          ? toDirectiveItem(nameItems, filterResult(valueMatches))
          : nameItems,
        {
          ...props,
          lastNamesMap: new Set(),
          element,
          renderers: DIRECTIVE_RENDERERS,
        },
        ...args
      );
    }
  } else if (valueMatches.length > 1) {
    element.setAttribute(attribute.name, '');
    return render(
      filterResult(valueMatches),
      {
        ...props,
        key: attribute.name,
        element,
        renderers: ATTRIBUTE_RENDERERS,
      },
      ...args
    );
  }
};
