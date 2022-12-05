import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';

/* eslint-env browser */
describe('e2e', () => {
  let htmlDomElement;
  let htmlStringElement;
  let createElementDomElement;
  let createElementStringElement;
  const x = Symbol();
  const props = {};
  const args = [props, x];
  const ENABLE_HTML = 1;
  const ENABLE_CREATE_ELEMENT = 1;
  const ENABLE_STRING_RENDER = 1;
  const ENABLE_DOM_RENDER = 1;

  const description = [
    ENABLE_HTML ? 'html' : '',
    ENABLE_CREATE_ELEMENT ? 'createElement' : '',
    ENABLE_STRING_RENDER ? 'string render' : '',
    ENABLE_DOM_RENDER ? 'dom render' : '',
  ]
    .filter(Boolean)
    .join(', ');

  const htmlTestItems = [
    ENABLE_HTML && ENABLE_DOM_RENDER,
    ENABLE_HTML && ENABLE_STRING_RENDER,
  ].filter(Boolean).length;

  const stringTestItems = [
    ENABLE_CREATE_ELEMENT && ENABLE_DOM_RENDER,
    ENABLE_CREATE_ELEMENT && ENABLE_STRING_RENDER,
  ].filter(Boolean).length;

  const testItems = htmlTestItems + stringTestItems;

  describe(`test: ${description}`, () => {
    const htmlFactory = async (factoryProps = {}, domError, stringError) => {
      let htmlString;
      let htmlDom;
      if (ENABLE_HTML) {
        if (ENABLE_DOM_RENDER) {
          const htmlDomImport = await import('@async-to-html/dom/html.js');
          htmlDom = htmlDomImport.html({
            document,
            ...factoryProps,
          });
        }
        if (ENABLE_STRING_RENDER) {
          const htmlStringImport = await import(
            '@async-to-html/string/html.js'
          );
          htmlString = htmlStringImport.html({
            ...factoryProps,
          });
        }
      }
      return (...args) =>
        (...props) => {
          if (htmlString) {
            const result = htmlString(...args)(...props).then((value) => {
              htmlStringElement.innerHTML = value;
              return value;
            });
            if (stringError) {
              expect(result).rejects.toEqual(stringError);
            } else {
              expect(result).resolves.not.toBeTypeOf(Error);
            }
          }
          if (htmlDom) {
            const elementIterator = htmlDom(...args)(...props);
            const result = elementIterator.next().then(({ value }) => {
              htmlDomElement.appendChild(value);
              return elementIterator.next();
            });
            if (domError) {
              expect(result).rejects.toEqual(domError);
            } else {
              expect(result).resolves.not.toBeTypeOf(Error);
            }
          }
        };
    };

    const createElementFactory = async (
      factoryProps = {},
      domError,
      stringError
    ) => {
      let createElementString;
      let createElementDom;
      if (ENABLE_CREATE_ELEMENT) {
        if (ENABLE_DOM_RENDER) {
          const createElementDomImport = await import(
            '@async-to-html/dom/create-element.js'
          );
          createElementDom = createElementDomImport.createElement({
            document,
            ...factoryProps,
          });
        }
        if (ENABLE_STRING_RENDER) {
          const createElementStringImport = await import(
            '@async-to-html/string/create-element.js'
          );
          createElementString = createElementStringImport.createElement({
            ...factoryProps,
          });
        }
      }
      return (...args) =>
        (...props) => {
          if (createElementString) {
            const result = createElementString(...args)(...props).then(
              (value) => {
                createElementStringElement.innerHTML = value;
                return value;
              }
            );

            if (stringError) {
              expect(result).rejects.toEqual(stringError);
            } else {
              expect(result).resolves.not.toBeTypeOf(Error);
            }
          }
          if (createElementDom) {
            const elementIterator = createElementDom(...args)(...props);
            const result = elementIterator.next().then(({ value }) => {
              createElementDomElement.appendChild(value);
              return elementIterator.next();
            });
            if (domError) {
              expect(result).rejects.toEqual(domError);
            } else {
              expect(result).resolves.not.toBeTypeOf(Error);
            }
          }
        };
    };

    const compareHtml = () => {
      if (ENABLE_STRING_RENDER) {
        expect(htmlStringElement.innerHTML).toMatchSnapshot();
        if (ENABLE_DOM_RENDER) {
          expect(htmlDomElement.innerHTML).toEqual(htmlStringElement.innerHTML);
        }
      } else if (ENABLE_DOM_RENDER) {
        expect(htmlDomElement.innerHTML).toMatchSnapshot();
      }
    };

    const compareCreateElement = () => {
      if (ENABLE_STRING_RENDER) {
        expect(createElementStringElement.innerHTML).toMatchSnapshot();
        if (ENABLE_DOM_RENDER) {
          expect(createElementDomElement.innerHTML).toEqual(
            createElementStringElement.innerHTML
          );
        }
      } else if (ENABLE_DOM_RENDER) {
        expect(createElementDomElement.innerHTML).toMatchSnapshot();
      }
    };

    const compareBoth = () => {
      if (ENABLE_STRING_RENDER && ENABLE_CREATE_ELEMENT && ENABLE_HTML) {
        expect(createElementStringElement.innerHTML).toEqual(
          htmlStringElement.innerHTML
        );
      }
      if (ENABLE_DOM_RENDER && ENABLE_CREATE_ELEMENT && ENABLE_HTML) {
        expect(createElementDomElement.innerHTML).toEqual(
          htmlDomElement.innerHTML
        );
      }
    };

    const timeout = (delay, resolveWith) =>
      new Promise((resolve) => setTimeout(() => resolve(resolveWith), delay));

    beforeEach(() => {
      htmlStringElement = document.createElement('div');
      htmlDomElement = document.createElement('div');
      createElementStringElement = document.createElement('div');
      createElementDomElement = document.createElement('div');
      document.body.appendChild(htmlStringElement);
      document.body.appendChild(htmlDomElement);
      document.body.appendChild(createElementStringElement);
      document.body.appendChild(createElementDomElement);
    });

    beforeAll(() => {
      AbortSignal.timeout = (delay) => {
        const abortController = new AbortController();
        setTimeout(() => {
          abortController.abort();
        }, delay);
        return abortController.signal;
      };
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    test('string', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = 'henk en bert';
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('multiple strings', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = 'henk en bert';
      const item2 = 'graddus en harry';
      html`<div>${item1}${item2}</div>`(...args);
      createElement('div', null, item1, item2)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('unsafe string', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = '<span>henk en bert</span>';
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('safe string', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = safeHtml('<span>henk en bert</span>');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('promise', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = Promise.resolve('henk en bert');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('method', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = vi.fn(() => 'henk en bert');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
      expect(item1).toBeCalledTimes(testItems);
      let i = testItems;
      while (i--) {
        expect(item1.mock.calls[i][0]).toBe(...args);
      }
    });

    test('element', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      // pass a method to make sure added elements are not removed immediately
      const item1 = () => document.createElement('span');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('text node', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      // pass a method to make sure added elements are not removed immediately
      const item1 = () => document.createTextNode('bert en henk');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('comment node', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      // pass a method to make sure added elements are not removed immediately
      const item1 = () => document.createComment('bert en henk');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('document fragment', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      // pass a method to make sure added elements are not removed immediately
      const item1 = () => {
        const frag = document.createDocumentFragment();
        const text = document.createTextNode('henk en bert');
        const comment = document.createComment('henk en bert');
        const element = document.createElement('span');
        frag.append(text, comment, element);
        return frag;
      };
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('iterable', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = ['bert', ' ', 'en', ' ', 'henk'];
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('empty', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = null;
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('async iterator', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      async function* item1() {
        yield 'wie zijn de beste';
        yield 'henk en bert';
      }
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('string attribute value', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = 'henk en bert';
      html`<div title="${item1}"></div>`(...args);
      createElement('div', { title: item1 })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('multiple string attribute values', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = 'henk en bert';
      const item2 = 'gradus en harry';
      html`<div title="${item1}" data-test="${item2}"></div>`(...args);
      createElement('div', { title: item1, ['data-test']: item2 })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('promise attribute value', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = Promise.resolve('henk en bert');
      html`<div title="${item1}"></div>`(...args);
      createElement('div', { title: item1 })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('empty attribute value', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = null;
      html`<div title="${item1}"></div>`(...args);
      createElement('div', { title: item1 })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('multiple string attribute value', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = 'henk';
      const item2 = 'en';
      const item3 = 'bert';
      html`<div title="${item1} ${item2} ${item3}"></div>`(...args);
      createElement('div', { title: `${item1} ${item2} ${item3}` })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('array attribute value', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = ['henk', ' ', 'en', ' ', 'bert'];
      html`<div title="${item1}"></div>`(...args);
      createElement('div', { title: item1 })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('nested array attribute value', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = ['henk', [' ', 'en', ' '], 'bert'];
      html`<div title="${item1}"></div>`(...args);
      createElement('div', { title: item1 })(...args);
      await timeout();
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('multiple string attribute name', async () => {
      const html = await htmlFactory();
      const item1 = 'henk';
      const item2 = 'en';
      const item3 = 'bert';
      html`<div data-${item1}-${item2}-${item3}="test"></div>`(...args);
      await timeout();
      // create element supports only string indexes
      compareHtml();
    });

    test('string attribute name and value', async () => {
      const html = await htmlFactory();
      const item1 = 'henk';
      const item2 = 'bert';
      html`<div data-${item1}="${item2}"></div>`(...args);
      await timeout();
      // create element supports only string indexes
      compareHtml();
    });

    test('string directive', async () => {
      const html = await htmlFactory();
      const item1 = safeHtml('title="henk en bert"');
      html`<div ${item1}></div>`(...args);
      await timeout();
      // create element supports only string indexes
      compareHtml();
    });

    test('multiple string directives', async () => {
      const html = await htmlFactory();
      const item1 = safeHtml('title="henk en bert"');
      const item2 = safeHtml('data-test="graddus en harry"');
      html`<div ${item1} ${item2}></div>`(...args);
      await timeout();
      // create element supports only string indexes
      compareHtml();
    });

    test('multi part string directives', async () => {
      const html = await htmlFactory();
      const item1 = safeHtml('title="henk en bert"');
      const item2 = safeHtml(' data-test="graddus en harry"');
      html`<div ${item1}${item2}></div>`(...args);
      await timeout();
      // create element supports only string indexes
      compareHtml();
    });

    if (ENABLE_HTML && ENABLE_STRING_RENDER) {
      test('html string child', async () => {
        const html = await htmlFactory();
        const createElement = await createElementFactory();
        const htmlString = (
          await import('@async-to-html/string/html.js')
        ).html();
        const item1 = htmlString`<span></span>`;
        html`<div>${item1}</div>`(...args);
        createElement('div', null, item1)(...args);
        await timeout();
        compareHtml();
        compareCreateElement();
        compareBoth();
      });
    }

    if (ENABLE_HTML && ENABLE_DOM_RENDER) {
      test('html dom child', async () => {
        const html = await htmlFactory();
        const createElement = await createElementFactory();
        const htmlDom = (await import('@async-to-html/dom/html.js')).html({
          document,
        });
        const item1 = htmlDom`<span></span>`;
        html`<div>${item1}</div>`(...args);
        createElement('div', null, item1)(...args);
        await timeout();
        compareHtml();
        compareCreateElement();
        compareBoth();
      });
    }

    if (ENABLE_CREATE_ELEMENT && ENABLE_STRING_RENDER) {
      test('createElement string child', async () => {
        const html = await htmlFactory();
        const createElement = await createElementFactory();
        const createElementString = (
          await import('@async-to-html/string/create-element.js')
        ).createElement();
        const item1 = createElementString('span');
        html`<div>${item1}</div>`(...args);
        createElement('div', null, item1)(...args);
        await timeout();
        compareHtml();
        compareCreateElement();
        compareBoth();
      });
    }

    if (ENABLE_CREATE_ELEMENT && ENABLE_DOM_RENDER) {
      test('createElement dom child', async () => {
        const html = await htmlFactory();
        const createElement = await createElementFactory();
        const createElementDom = (
          await import('@async-to-html/dom/create-element.js')
        ).createElement({ document });
        const item1 = createElementDom('span');
        html`<div>${item1}</div>`(...args);
        createElement('div', null, item1)(...args);
        await timeout();
        compareHtml();
        compareCreateElement();
        compareBoth();
      });
    }

    test('aborted signal', async () => {
      const signal = AbortSignal.timeout(10);
      const html = await htmlFactory({ signal });
      const createElement = await createElementFactory({ signal });
      const item1 = timeout(20, 'henk en bert');
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout(30);
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('canceled async iterator', async () => {
      async function* item1() {
        yield 'wie zijn de beste';
        await timeout(2000);
        yield 'henk en bert';
      }
      const signal = AbortSignal.timeout(1000);
      const html = await htmlFactory({ signal });
      const createElement = await createElementFactory({ signal });
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await timeout(3000);
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('erroring async iterator', async () => {
      const mockedError = new Error('mocked error');
      async function* item1() {
        yield 'wie zijn de beste';
        yield 'henk en bert';
        throw mockedError;
      }
      const html = await htmlFactory(undefined, mockedError, mockedError);
      const createElement = await createElementFactory(
        undefined,
        mockedError,
        mockedError
      );
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
    });

    test('rejected promise', async () => {
      const mockedError = new Error('mocked error');
      const html = await htmlFactory(undefined, mockedError, mockedError);
      const createElement = await createElementFactory(
        undefined,
        mockedError,
        mockedError
      );
      html`<div>${Promise.reject(mockedError)}</div>`(...args);
      createElement('div', null, Promise.reject(mockedError))(...args);
    });

    test('aborted signal', async () => {
      const item1 = timeout(300, 'henk en bert');
      const signal = AbortSignal.timeout(20);
      const html = await htmlFactory({ signal });
      const createElement = await createElementFactory({ signal });
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      await new Promise((resolve) => setTimeout(resolve, 500));
      compareHtml();
      compareCreateElement();
      compareBoth();
    });

    test('impossible value', async () => {
      const mockedError = new TypeError('Cannot convert item to node');
      const item1 = { toString: undefined };
      const html = await htmlFactory(undefined, mockedError, mockedError);
      const createElement = await createElementFactory(
        undefined,
        mockedError,
        mockedError
      );
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
    });

    test('impossible attribute value', async () => {
      const mockedError = new TypeError('Cannot convert item to node');
      const item1 = { toString: undefined };
      const html = await htmlFactory(undefined, mockedError, mockedError);
      const createElement = await createElementFactory(
        undefined,
        mockedError,
        mockedError
      );
      html`<div title="${item1}"></div>`(...args);
      createElement('div', { title: item1 })(...args);
    });

    test('impossible directive', async () => {
      const mockedError = new TypeError('Cannot convert item to node');
      const item1 = { toString: undefined };
      const html = await htmlFactory(undefined, mockedError, mockedError);
      html`<div ${item1}></div>`(...args);
    });

    test('complex tree', async () => {
      const html = await htmlFactory();
      const createElement = await createElementFactory();
      const item1 = [
        'bert',
        ' ',
        'en',
        ' ',
        'henk',
        ' ',
        async function* () {
          await timeout(100);
          yield ['garrus', ' ', 'en', ' ', 'barry'];
          await timeout(100);
          yield 'eten';
          await timeout(100);
          yield [
            async function* () {
              await timeout(100);
              yield 'een';
              await timeout(100);
              yield 'twee';
              await timeout(100);
              yield 'drie';
            },
            ' ',
            async function* () {
              await timeout(100);
              yield 'boterham';
              await timeout(100);
              yield 'muizen';
              await timeout(100);
              yield 'kikkers';
            },
          ];
        },
        ' ',
        timeout(100, ['met', ' ', 'hagelslag']),
      ];
      html`<div>${item1}</div>`(...args);
      createElement('div', null, item1)(...args);
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      expect(createElementDomElement.innerHTML).toEqual(
        htmlDomElement.innerHTML
      );
      await timeout();
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      expect(createElementDomElement.innerHTML).toEqual(
        htmlDomElement.innerHTML
      );
      await timeout(100);
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      expect(createElementDomElement.innerHTML).toEqual(
        htmlDomElement.innerHTML
      );
      await timeout(100);
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      expect(createElementDomElement.innerHTML).toEqual(
        htmlDomElement.innerHTML
      );
      await timeout(100);
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      await timeout(100);
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      await timeout(100);
      expect(htmlDomElement.innerHTML).toMatchSnapshot();
      await timeout(100);
      compareHtml();
      compareCreateElement();
      compareBoth();
    });
  });
});
