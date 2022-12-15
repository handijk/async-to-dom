import { isAsyncIterator } from '@async-to-html/render/matchers/is-async-iterator.js';
import { isPromise } from '@async-to-html/render/matchers/is-promise.js';
import { isFunction } from '@async-to-html/render/matchers/is-function.js';
import { isIterable } from '@async-to-html/render/matchers/is-iterable.js';
import { isString } from '@async-to-html/render/matchers/is-string.js';
import { isSafeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { renderFunctionFactory } from '@async-to-html/render/renderers/render-function-factory.js';
import { renderPromiseFactory } from '@async-to-html/render/renderers/render-promise-factory.js';
import { renderHtmlSafeStringFactory } from '@async-to-html/render/renderers/render-html-safe-string-factory.js';
import { renderAsyncIteratorFactory } from '@async-to-html/render/renderers/render-async-iterator-factory.js';
import { renderIterableFactory } from './render-iterable-factory.js';
import { renderStringDirectiveFactory } from './render-string-directive-factory.js';

export const DIRECTIVE_RENDERERS = [
  [isAsyncIterator, renderAsyncIteratorFactory],
  [isPromise, renderPromiseFactory],
  [isFunction, renderFunctionFactory],
  [isIterable, renderIterableFactory],
  [isSafeHtml, renderHtmlSafeStringFactory],
  [isString, renderStringDirectiveFactory],
];
