import { isRenderable } from '@async-to-html/render/matchers/is-renderable.js';
import { renderRenderable } from '@async-to-html/render/renderers/render-renderable.js';
import { isAsyncIterator } from '@async-to-html/render/matchers/is-async-iterator.js';
import { isPromise } from '@async-to-html/render/matchers/is-promise.js';
import { isFunction } from '@async-to-html/render/matchers/is-function.js';
import { isElement } from '@async-to-html/render/matchers/is-element.js';
import { isIterable } from '@async-to-html/render/matchers/is-iterable.js';
import { isEmpty } from '@async-to-html/render/matchers/is-empty.js';
import { isString } from '@async-to-html/render/matchers/is-string.js';
import { isSafeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { renderPromiseFactory } from '@async-to-html/render/renderers/render-promise-factory.js';
import { renderFunctionFactory } from '@async-to-html/render/renderers/render-function-factory.js';
import { renderHtmlSafeStringFactory } from '@async-to-html/render/renderers/render-html-safe-string-factory.js';
import { renderAsyncIteratorFactory } from '@async-to-html/render/renderers/render-async-iterator-factory.js';
import { renderElementFactory } from './render-element-factory.js';
import { renderIterableFactory } from './render-iterable-factory.js';
import { renderStringFactory } from './render-string-factory.js';
import { renderEmptyFactory } from './render-empty.js';

export const STRING_RENDERERS = [
  [isRenderable, renderRenderable],
  [isAsyncIterator, renderAsyncIteratorFactory],
  [isPromise, renderPromiseFactory],
  [isFunction, renderFunctionFactory],
  [isElement, renderElementFactory],
  [isIterable, renderIterableFactory],
  [isSafeHtml, renderHtmlSafeStringFactory],
  [isEmpty, renderEmptyFactory],
  [isString, renderStringFactory],
];
