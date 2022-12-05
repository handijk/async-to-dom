import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderStringAttribute } from './render-string-attributes.js';
import {
  renderStringChildren,
  default as renderStringChildrenModule,
} from './render-string-children.js';
import { renderStringElement } from './render-string-element.js';

vi.mock('./render-string-attributes.js', () => ({
  renderStringAttribute: vi.fn(),
}));

vi.mock('./render-string-element.js', () => ({
  renderStringElement: vi.fn(),
}));

vi.mock('./render-string-children.js', async () => {
  const importedModule = await vi.importActual('./render-string-children.js');
  vi.spyOn(importedModule.default, 'renderStringChildren');
  return importedModule;
});

describe('render string children', () => {
  const props = { prop: Symbol('prop') };
  const arg1 = Symbol('arg1');
  const arg2 = Symbol('arg2');
  const args = [arg1, arg2];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('single element without children and without attributes', async () => {
    const childNode = {
      nodeType: Node.ELEMENT_NODE,
      childNodes: [],
      attributes: [],
    };
    const node = {
      childNodes: [childNode],
    };
    await renderStringChildren({ element: node, ...props }, ...args);
    expect(renderStringAttribute).not.toHaveBeenCalled();
    expect(renderStringElement).not.toHaveBeenCalled();
    expect(
      renderStringChildrenModule.renderStringChildren
    ).toHaveBeenCalledTimes(1);
    expect(
      renderStringChildrenModule.renderStringChildren
    ).toHaveBeenCalledWith({ element: childNode, ...props }, ...args);
  });

  test('single element without children and with attributes', () => {
    const attribute = Symbol('attribute');
    const childNode = {
      nodeType: Node.ELEMENT_NODE,
      childNodes: [],
      attributes: [attribute],
    };
    const node = {
      childNodes: [childNode],
    };
    renderStringChildren({ element: node, ...props }, ...args);
    expect(renderStringAttribute).toHaveBeenCalledTimes(1);
    expect(renderStringAttribute).toHaveBeenCalledWith(
      { element: childNode, attribute, ...props },
      ...args
    );
    expect(renderStringElement).not.toHaveBeenCalled();
    expect(
      renderStringChildrenModule.renderStringChildren
    ).toHaveBeenCalledTimes(1);
    expect(
      renderStringChildrenModule.renderStringChildren
    ).toHaveBeenCalledWith({ element: childNode, ...props }, ...args);
  });

  test('three nodes', () => {
    const childNode1 = {
      nodeType: Node.ELEMENT_NODE,
      childNodes: [],
      attributes: [],
    };
    const childNode2 = {
      nodeType: Node.TEXT_NODE,
      childNodes: [],
      attributes: [],
    };
    const childNode3 = {
      nodeType: Node.COMMENT_NODE,
      childNodes: [],
      attributes: [],
    };
    const node = {
      childNodes: [childNode1, childNode2, childNode3],
    };
    renderStringChildren({ element: node, ...props }, ...args);
    expect(renderStringAttribute).not.toHaveBeenCalled();
    expect(
      renderStringChildrenModule.renderStringChildren
    ).toHaveBeenCalledTimes(1);
    expect(
      renderStringChildrenModule.renderStringChildren
    ).toHaveBeenNthCalledWith(1, { element: childNode1, ...props }, ...args);
    expect(renderStringElement).toHaveBeenCalledTimes(2);
    expect(renderStringElement).toHaveBeenNthCalledWith(
      1,
      { element: childNode2, ...props },
      ...args
    );
    expect(renderStringElement).toHaveBeenNthCalledWith(
      2,
      { element: childNode3, ...props },
      ...args
    );
  });
});
