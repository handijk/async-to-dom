import { SPECIAL_PLACEHOLDER_ITEM } from '../constants.js';
import { render } from '@async-to-html/render/render.js';
import { ELEMENT_RENDERERS } from '../element-renderers/get-default-renderers.js';
import { filterResult } from './filter-result.js';
import { getResult } from './get-result.js';

export const renderStringElement = (
  { document, element, components, ...props },
  ...args
) => {
  const placeholder = document.createComment(SPECIAL_PLACEHOLDER_ITEM);
  const items = getResult(element.nodeValue, components);
  element.replaceWith(placeholder);
  return render(
    filterResult(items),
    {
      ...props,
      placeholder,
      renderers: ELEMENT_RENDERERS,
      document,
    },
    ...args
  );
};
