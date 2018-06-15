/**
 * Compose - 
 * A high order function that applies other high order functions. The last function in the array will be called first
 * @param {Array.<Function>} hofs - An array of high order functions that will applied to the recipient function.
 * @example <caption>Example usage of compose</caption>
 * compose([ondifference(), debounce()])(fn)
 * @returns {Function}
 */
export const compose = hofs => fn => {
  const newFn = hofs.reduce((newFn, decorate) => decorate(newFn), fn)
  return (...args) => {
    newFn(...args)
  }
}

/**
 * Ondifference - 
 * A high order function that takes a predicate and will only run when the predicate returns a new value.
 * @param {Function} predicate - A predicate indicating when to run.
 * @example <caption>Example usage of ondifference</caption>
 * // Only runs when the window's height changes
 * ondifference(() => window.outerHeight)(fn)
 * @returns {Function}
 */
export const ondifference = predicate => fn => {
  let val = predicate()

  return (...args) => {
    const newVal = predicate()

    // Compare objectsobjects
    if (typeof newVal === 'object' && val === 'object') {
      // Check for strict equality and continue if not equal
      if (val === newVal) return

      const oldKeys = Object.keys(val)
      const newKeys = Object.keys(newVal)

      if (oldKeys.length === newKeys.length) return

      for (const key of oldKeys) {
        if (val[key] !== newVal[key]) {
          fn(...args)
          val = newVal
          return
        }
      }

      fn(...args)
      val = newVal
    }
    if (newVal !== val) {
      fn(...args)
      val = newVal
    }
  }
} 

/**
 * Debounce - 
 * A high order function that only runs after it hasn't been called for a specified amount of time.
 * @param {Number} time - Amount of time in millisenconds to debounce.
 * @example <caption>Example usage of ondifference</caption>
 * // Only runs after it hasn't been called for 60 ms
 * debounce(60)(fn)
 * @returns {Function}
 */
export const debounce = (time = 60) => {
  let timeout
  
  return fn => (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), time)
  }
}

/**
 * OnFirst - 
 * A high order function that only runs after it hasn't been called for a specified amount of time.
 * @param {Number} time - Amount of time in millisenconds to debounce.
 * @example <caption>Example usage of ondifference</caption>
 * // Only runs after it hasn't been called for 60 ms
 * debounce(60)(fn)
 * @returns {Function}
 */
export const onFirst = (time = 60) => {
  let timeout
  let canRun = true
  
  return fn => (...args) => {
    if (canRun) {
      fn(...args)
      canRun = false
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => { canRun = true }, time)
  }
}

/**
 * Throttle - 
 * A high order function that can only run every <n> milliseconds.
 * @param {Number} time - Amount of time in millisenconds to wait between call.
 * @example <caption>Example usage of ondifference</caption>
 * // Only runs if it hasn't run for 60 ms
 * throttle(60)(fn)
 * @returns {Function}
 */
export const throttle = (time = 60) => {
  let ready = true
  let lastFn
  let timeout

  return fn => (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => { 
        ready = true
        if (lastFn) lastFn(...args)
        timeout = null
      }, time)
    }
    if (ready) {
      ready = false
      fn(...args)
      lastFn = false
    } else {
      lastFn = fn
    }
  }
}

/**
 * Wait - 
 * Returns a promise that resolves after <n> milliseconds
 * @param {Number} time - Amount of time in millisenconds to wait.
 * @example <caption>Example usage of wait</caption>
 * // Only runs if it hasn't run for 60 ms
 * await wait(60)
 * @returns {Promise}
 */
export const wait = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * Wait - 
 * Returns a promise that resolves after <n> milliseconds
 * @param {Number} time - Amount of time in millisenconds to wait.
 * @example <caption>Example usage of wait</caption>
 * // Only runs if it hasn't run for 60 ms
 * await wait(60)
 * @returns {Promise}
 */
export const onlyEvery = times => {
  let doneTimes = 0
  return fn => (...args) => {
    if (doneTimes % times === 0) {
      fn(...args)
    }
    doneTimes++
  }
}

/**
 * Diff - 
 * Difference between two different numbers
 * @returns {Numbers}
 */
export const diff = (a, b) => Math.abs(a - b)

/**
 * Parse - 
 * Parses JSON or returns undefined
 * @param {String} json - Stringified object.
 * @example Example use of parse
 * @returns {Object}
 */
export const parse = json => {
  try { return JSON.parse(json) } catch (e) {}
}

/**
 * ToDP - 
 * To decimal places
 * @param {Number} dp - Amount of decimal places 
 * @param {Number} num - num
 * @example Example use of parse
 * @returns {Number}
 */
export const toDP = (dp, num) => {
  const places = Math.pow(10, dp)
  return Math.round(num * places) / places
}

function set (arr, key, value) {
  const result = arr
  result[key] = value
  return result
}

/**
 * Clump - 
 * Groups array into specified
 * @param {Array} original Original array
 * @param {Number} size - Group size
 * @example Example use of clump
 * clump([1, 2, 3, 4, 5], 2)
 * 
 * returns [[1, 2], [3, 4], [5]]
 * @returns {Array}
 */
export const clump = (original, size) => {
  function addToArray (prev, value, i) {
    const index = Math.floor(i / size)
    if (!prev[index]) {
      prev[index] = []
    }
    prev[index].push(value)
    return prev
  }
  return original.reduce(addToArray, [])
}
