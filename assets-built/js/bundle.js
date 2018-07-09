/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


;(function () {
  try {
    if (localStorage.getItem('wasDevReloaded')) {
      console.log('%cPage was reloaded automatically because of a code change.', 'color: #9c55da');
      localStorage.removeItem('wasDevReloaded');
    }
    if (window.location.host.match(/(\.dev|\.local)$/) && window.WebSocket) {
      var ws = new WebSocket('ws://127.0.0.1:' + 0);
      ws.addEventListener('message', function (msg) {
        if (msg.data === 'reload') {
          console.log('%cDetected code changes! Reloading page.', 'color: #9c55da');
          localStorage.setItem('wasDevReloaded', true);
          window.location.reload();
        }
      });
      ws.onerror = function () {
        console.log('%cError connecting to dev reload server, you may need to refresh manually!', 'color: #da6955');
      };
    }
  } catch (err) {}
})();

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map;
        }
      });
      ws.onerror = function () {
        console.log('%cError connecting to dev reload server, you may need to refresh manually!', 'color: #da6955');
      };
    }
  } catch (err) {}
})();

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map