import { isRenderable } from '@async-to-html/render/matchers/is-renderable.js';
import { renderRenderable } from '@async-to-html/render/renderers/render-renderable.js';
import { isAsyncIterator } from '@async-to-html/render/matchers/is-async-iterator.js';
import { isElement } from '@async-to-html/render/matchers/is-element.js';
import { isEmpty } from '@async-to-html/render/matchers/is-empty.js';
import { isFunction } from '@async-to-html/render/matchers/is-function.js';
import { isIterable } from '@async-to-html/render/matchers/is-iterable.js';
import { isPromise } from '@async-to-html/render/matchers/is-promise.js';
import { isString } from '@async-to-html/render/matchers/is-string.js';
import { renderFunctionFactory } from '@async-to-html/render/renderers/render-function-factory.js';
import { isSafeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { renderPromiseFactory } from './render-promise-factory.js';
import { removeElementFactory } from './remove-element.js';
import { renderAsyncIteratorFactory } from './render-async-iterator-factory.js';
import { renderElementFactory } from './render-element.js';
import { renderHtmlSafeStringFactory } from './render-html-safe-string-factory.js';
import { renderIterableFactory } from './render-iterable-factory.js';
import { renderStringFactory } from './render-string-factory.js';

export const ELEMENT_RENDERERS = [
  [isRenderable, renderRenderable],
  [isAsyncIterator, renderAsyncIteratorFactory],
  [isPromise, renderPromiseFactory],
  [isFunction, renderFunctionFactory],
  [isElement, renderElementFactory],
  [isIterable, renderIterableFactory],
  [isSafeHtml, renderHtmlSafeStringFactory],
  [isEmpty, removeElementFactory],
  [isString, renderStringFactory],
];
