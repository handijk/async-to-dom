import { renderStringAttribute } from './render-string-attributes.js';
import { renderStringElement } from './render-string-element.js';

export const renderStringChildren = ({ element, ...props }, ...args) =>
  Promise.all(
    Array.from(element.childNodes).map((childNode) => {
      switch (childNode.nodeType) {
        case Node.ELEMENT_NODE:
          return Promise.all([
            ...Array.from(childNode.attributes).map((attribute) =>
              renderStringAttribute(
                { ...props, element: childNode, attribute },
                ...args
              )
            ),
            recursive.renderStringChildren(
              { ...props, element: childNode },
              ...args
            ),
          ]);
        case Node.TEXT_NODE:
        case Node.COMMENT_NODE:
          return renderStringElement({ ...props, element: childNode }, ...args);
      }
    })
  );

const recursive = {
  renderStringChildren,
};

export default recursive;
