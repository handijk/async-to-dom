import { isAsyncIterator } from '@async-to-html/render/matchers/is-async-iterator.js';
import { isPromise } from '@async-to-html/render/matchers/is-promise.js';
import { isFunction } from '@async-to-html/render/matchers/is-function.js';
import { isEmpty } from '@async-to-html/render/matchers/is-empty.js';
import { isIterable } from '@async-to-html/render/matchers/is-iterable.js';
import { isString } from '@async-to-html/render/matchers/is-string.js';
import { renderPromiseFactory } from '@async-to-html/render/renderers/render-promise-factory.js';
import { renderFunctionFactory } from '@async-to-html/render/renderers/render-function-factory.js';
import { renderAsyncIteratorFactory } from './render-async-iterator-factory.js';
import { renderEmptyAttributeFactory } from './render-empty-attribute.js';
import { renderIterableFactory } from './render-iterable-factory.js';
import { renderStringAttributeFactory } from './render-string-attribute.js';

export const ATTRIBUTE_RENDERERS = [
  [isAsyncIterator, renderAsyncIteratorFactory],
  [isPromise, renderPromiseFactory],
  [isFunction, renderFunctionFactory],
  [isIterable, renderIterableFactory],
  [isEmpty, renderEmptyAttributeFactory],
  [isString, renderStringAttributeFactory],
];
