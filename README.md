<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/anzol_logo_white_clear_zone.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/anzol_logo_blue_clear_zone.svg">
    <img src="assets/anzol_logo_blue_clear_zone.svg" alt="" width="50%" height="50%">
  </picture>

[![NPM Package](https://img.shields.io/npm/v/anzol?style=flat-square&logo=npm)](https://www.npmjs.com/package/anzol)
[![MIT License](https://img.shields.io/github/license/konstantin-lukas/intl-currency-input?style=flat-square)](https://raw.githubusercontent.com/konstantin-lukas/intl-currency-input/main/LICENSE)
![Type Definitions](https://img.shields.io/npm/types/intl-currency-input?style=flat-square)
![Code Coverage](https://img.shields.io/coverallsCoverage/github/konstantin-lukas/anzol?style=flat-square)
![NPM Downloads](https://img.shields.io/npm/dm/anzol?style=flat-square)
</div>



Anzol provides very useful client-side React hooks for very common tasks such as data fetching
or deferring the updating of values with a custom timeout. It supports both SSG and SSR. You can find working examples 
in the [documentation](https://konstantin-lukas.github.io/anzol/) or, if you just want the code, in the examples/components 
directory.

Features:
- ✅ Fully Tested
- ✅ SSR and SSG compatible
- ✅ Detailed documentation

## Installation
Anzol is available on the NPM registry. To install it, just run:
```bash
npm install anzol
```

## Currently Available Hooks
- ✅ <b>useFetch:</b> Fetches the provided URL and optionally parses the response. Aborts requests when a new request is
  started before the previous has finished to prevent flickering of stale responses by default.
- ✅ <b>useDefer:</b> Delays the update of a value until the input has stopped changing for a certain time. This is different 
  from React's built-in useDeferredValue because you can set the delay yourself.
- ✅ <b>useFirstRender:</b> Returns true on first render; false otherwise.
- ✅ <b>useToggle:</b> Provides a boolean toggle that does not persist between page reloads.
- ✅ <b>useIntersectionObserver:</b> Provides a hook API that wraps the IntersectionObserver API. This hook is for use with a single element only. For
  simplicity this is the recommended approach. If you have an extremely large number of objects to observe and want
  to avoid creating an IntersectionObserver for each, refer to useIntersectionObserverArray to use a single observer
  for multiple elements with a common root.
- ✅ <b>useIntersectionObserverArray:</b> Like useIntersectionObserver but for multiple elements.
- ✅ <b>useEvent:</b> Provides a wrapper around the EventListener API. Use the return value to define the event target.
- ✅ <b>useLazyLoad:</b> Provides a simple API for fetching data from a resource in batches.
- ✅ <b>useLocalStorage:</b> Provides access to local storage, with the additional option to update all usages of this hook
  when local storage changes.
- ✅ <b>useClickOutside:</b> Provides a ref to attach to an HTML element and takes a callback function, and calls that
  function when the user clicks anywhere outside the given element.
- ✅ <b>usePreferredScheme:</b> Listens for changes in the user's preferred scheme and returns it.