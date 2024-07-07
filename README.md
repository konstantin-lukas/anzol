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
- <b>useFetch:</b> fetch data without showing stale responses and write easy to understand code that communicates intention
- <b>useDefer:</b> delay the update of a value until that value has stopped changing for a chosen amount of time