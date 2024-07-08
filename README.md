<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/anzol_logo_white_clear_zone.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/anzol_logo_blue_clear_zone.svg">
    <img src="assets/anzol_logo_blue_clear_zone.svg" alt="Logo" width="50%" height="50%">
  </picture>

[![NPM Package](https://img.shields.io/npm/v/anzol?style=flat-square&logo=npm)](https://www.npmjs.com/package/anzol)
[![MIT License](https://img.shields.io/github/license/konstantin-lukas/intl-currency-input?style=flat-square)](https://raw.githubusercontent.com/konstantin-lukas/intl-currency-input/main/LICENSE)
![Type Definitions](https://img.shields.io/npm/types/intl-currency-input?style=flat-square)
![Code Coverage](https://img.shields.io/coverallsCoverage/github/konstantin-lukas/anzol?style=flat-square)
![Bundle Size](https://img.shields.io/bundlephobia/min/anzol?style=flat-square)
</div>



Anzol provides very useful React hooks for very common tasks such as data fetching
or deferring the updating of values with a custom timeout. You can find working examples in the 
[documentation](https://konstantin-lukas.github.io/anzol/) or if you just want the code in the examples/components 
directory.

Anzol is built alongside automated tests to ensure quality.

## Currently Available Hooks
- <b>useFetch:</b> Fetches data without showing stale responses and allows writing easy-to-understand code that 
- communicates intention.
- <b>useDefer:</b> Delays the update of a value until that value has stopped changing for a chosen amount of time.

## Installation
Anzol is available on the NPM registry. To install it, just run:
```bash
npm install anzol
```

## Planned features
These features are not yet implement but we plan to do so in the foreseeable future. Feel free to make your own 
suggestions.
- <b>useFirstRender:</b> Returns true on the first render and false otherwise.
- <b>useClickOutside:</b> Takes a reference to an HTML element and a callback function, and calls that function when the 
- user clicks anywhere outside the given element.
- <b>useLocalStorage:</b> Provides access to local storage, with the additional option to update all usages of this hook 
- when local storage changes.
- <b>useEvent:</b> Encapsulates the code needed to correctly listen to events in React, including event listener 
- cleanup.
- <b>useInView:</b> Takes a reference to an HTML element and returns whether that element's bounding client rectangle is 
- currently in view. You can choose if this hook tests for an element being completely or only partially in view.
- <b>usePreferredScheme:</b> Listens for changes in the user's preferred scheme and returns it.
- <b>useDarkMode:</b> Similar to usePreferredScheme but allows setting the user scheme manually and automatically 
- updates it when the preferred scheme changes. Uses local storage to save the chosen scheme across reloads.
- <b>useLazyLoad:</b> Takes a batch size and a max element count, and provides a function to add elements. Allows you to 
- pass in a callback function to transform elements. The hook keeps track of the elements and returns a transformed list 
- of all elements, as well as a flag indicating whether the end of content was reached. This flag will be set to true 
- when the given max element count is reached or an added batch is shorter than the batch size.