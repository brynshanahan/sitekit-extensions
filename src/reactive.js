export default function config(opts = {}){
  return function reactive(Site, $, name, self){
    const log = opts.log ? (...args) => console.log('Reactive.js\n', ...args) : () => {}

    const errs = host(self).protectedProps('setState', 'doChanges', 'changed').errors()
  
    if (errs) {
      throw new Error(`Propert${errs.length > 1 ? 'ies' : 'y'} ${errs.map(err => `this.${err}`)} ${errs.length > 1 ? 'are' : 'is'} reserved for reactive()`)
    }

    const _reactive = {
      allChanges: {},
      changes: {},
      cancels: {},
      index: 0,
      getKey(){
        const key = `key${this._reactive.index++}`
        log(key)
        return key
      },
      tearDown(host, key){
        delete this._reactive.cancels[key]
        delete host[key]
      },
      createWindow(){
        log('created window')
        const $window = $(window)
        const on = $window.on

        $window.on = function (e, fn, ...args) {
          on(`${e}.${this.uuid}`, fn, ...args)

          const newKey = this._reactive.getKey()
          this._reactive.cancels[newKey] = () => {
            delete this._reactive.cancels[newKey]
            $(window).off(`${e}.${this.uuid}`, fn)
          }
          return this._reactive.cancels[newKey]
        }

        return $window
      },
      init () {
        log('init')
        if (!this.window) {
          this.window = this.createWindow()
        }
        // Set reactions up first
        if (isFn(this.react)) {
          log('reacting')
          this.react()
        }
    
        // Set actions up second
        if (isFn(this.listen)) {
          log('listening')
          this.listen()
        }
    
        // Run first reactions with initialState
        if (isObject(this.state)) {
          log('doing first state')
          this.doChanges({}, Object.keys(this.state))
        } else {
          this.state = {}
        }
      }
    }

    function bindReactive(self){
      Object.keys(self._reactive).forEach(key => {
        if(typeof self._reactive[key] === 'function'){
          self._reactive[key] = self._reactive[key].bind(self)
        }
      })
    }

    const mixin = {
      _reactive,
      _create(){
        bindReactive(this)
        this._reactive.init()
      },
      _destroy(){
        // Unlisten to everything like a boss
        Object.values(this._reactive.cancels).forEach(cancel => cancel())
      },
      on(e, fn, el = false){
        const element = (el || this.element)
        const newKey = this._reactive.getKey()
        element.on(e + '.' + this.uuid + newKey, fn)
        this._reactive.cancels[newKey] = () => {
          element.off(e + '.' + this.uuid + newKey, fn)
          this._reactive.tearDown({}, newKey)
        }
        return this._reactive.cancels[newKey]
      },
      setState (state) {
        if (!this.state) this.state = {}
        log('this.state:', this.state, 'New State: ', state)
        const prevState = clone(this.state)
        const changes = Object.keys(state).filter(key => this.state[key] !== state[key])
        if (changes.length > 0) {
          this.state = clone(prevState, state)
          log(...changes.map(key => `${key}: ${prevState[key]} -> ${this.state[key]}`))
          this.doChanges(prevState, changes)
        }
      },
      // extChanged handles unlistening when either this component unmounts or the other component unmounts
      extChanged (widget, key, fn) {
        if (typeof widget === 'string') {
          throw new Error('listening to an external widget by name is not yet supported')
        }
  
        let newKey = this._reactive.getKey()
        const cancel = widget.changed(key, fn)
        this._reactive.cancels[newKey] = cancel
      },
      doChanges (prevState, changedKeys) {
        log('doing changes', changedKeys)
        // Clone everything so that state can't be modified
        Object.values(this._reactive.allChanges).forEach(cb => cb(clone(prevState), clone(this.state), this))
        changedKeys.forEach(key => {
          if (this._reactive.changes[key]) {
            Object.values(this._reactive.changes[key]).forEach(cb => cb(clone(prevState), clone(this.state), this))
          }
        })
      },
      changed (key, fn) {
        let newKey
    
        // When listening to a specific property the first param will be the property name
        if (typeof key === 'string') {
          if (!this._reactive.changes[key]) this._reactive.changes[key] = {}
          newKey = this._reactive.getKey()
    
          this._reactive.changes[key][newKey] = fn
    
          this._reactive.cancels[newKey] = () => this._reactive.tearDown(this._reactive.changes[key], newKey)
          return this._reactive.cancels[newKey]
        }
    
        // When listening to all changes just one param (a callback) will be passed in
        if (typeof key === 'function') {
          const newKey = this._reactive.getKey()   
          this._reactive.allChanges[newKey] = key
    
          this._reactive.cancels[newKey] = () => this._reactive.tearDown(this._reactive.allChanges, newKey)
          return this._reactive.cancels[newKey]
        }
      }
    }

    return mixin
  }
}

// Object checking
function host (obj) {
  let errors = []
  const result = {
    protectedProps: (...props) => {
      const reserved = props.reduce((acc, prop) => {
        if (obj[prop]) {
          acc.push(prop)
        }
        return acc
      }, [])
      errors = reserved

      return result
    },
    has: (...props) => {
      const hasnt = props.reduce((acc, prop) => {
        if (!obj[prop]) {
          acc.push(prop)
        }
        return acc
      }, [])

      errors = hasnt
      return result
    },
    errors: () => {
      return errors.length > 0 ? errors : undefined
    }
  }

  return result
}

function clone (...args) {
  if (Array.isArray(args[0])) {
    return [].concat(...args)
  }
  return Object.assign({}, ...args)
}

function isFn (fn) {
  return typeof fn === 'function'
}

function isObject (obj) {
  return typeof obj === 'object' && obj instanceof Object && obj !== null
}
