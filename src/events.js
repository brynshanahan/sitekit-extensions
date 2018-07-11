const defaultOpts = {
  log: false
}

const requestAnimationFrame = fn => setTimeout(fn, 60);

let i = 0

const doTick = fn => new Promise(resolve => window.requestAnimationFrame(() => resolve(fn.apply(null, arguments))))

const eventsNames = [
  {e:'MouseDown'},
  {e:'MouseMove', window: true},
  {e:'MouseUp', window: true},
  {e:'MouseOut'},
  {e:'MouseOver'},
  {e:'TouchStart'},
  {e:'TouchEnd'},
  {e:'Scroll', window: true},
  {e:'Resize', window: true},
  {e:'TouchMove'},
  {e: 'Click'},
]

const doFn = fn => fn()


export default function eventsConfig(options = {}){
  const opts = Object.assign({}, defaultOpts, options)
  const log = opts.log ? console.log : () => {}

  return function events(Site, $, name, def){
    return {
      _create(){
        this._events = {
          cancels: {},
          index: 0,
        }
        const self = this
        const getKey = () => `eve${this._events.index++}`

        eventsNames.forEach(obj => {
          const {e} = obj
          const eve = 'on' + e

          if(typeof this[eve] === 'function'){
            const key = getKey()
            const fn = this[eve]
            let ready = true

            if(obj.window){

              // Set up cancel function
              const stop = () => {
                delete this._events.cancels[key]
                $(window).off(e.toLowerCase(), fn)
              }
              // Add it to the cancel callback thing
              this._events.cancels[key] = stop

              // Listen to the event
              $(window).on(e.toLowerCase(), (...args) => {

                // If we have a debounce thing
                if(!ready) return

                ready = false
                const res = fn.apply(self, args)

                // If you return null the functino will get removed
                if(res === null){
                  stop()
                }

                // If a number is returned and it's not 0
                if(res && typeof res === 'number'){
                  return setTimeout(() => {
                    ready = true
                  }, res)
                }

                ready = true
              })
            } else {

              // Set up cancel function
              const stop = () => {
                delete this._events.cancels[key]
                $(window).off(e.toLowerCase(), fn)
              }

              this._events.cancels[key] = stop

              this.element.on(e, (...args) => {

                if(!ready) return
                ready = false
                const res = fn.apply(self, args)
                
                // If you return null the functino will get removed
                if(res === null){
                  stop()
                }

                // If a number is returned and it's not 0
                if(res && typeof res === 'number'){
                  return setTimeout(() => {
                    ready = true
                  }, res)
                }

                ready = true
              })
            }
          }
        })

        this._events.raf = (fn) => {
          return new Promise(resolve => {
            window.requestAnimationFrame(() => {
              const res = fn.apply(undefined, arguments)
              resolve(res)
            })
          })
        }
      },
      async onTick(fn){
        // raf is set to null when the component unmounts
        if(this._events.raf === null) return
        if(typeof this._events.raf === 'number') return this.onTick(fn)
        // Dont queue another raf while a raf is still going
        if(this._events.raf) return 
        const res = await doTick(fn)
        // debounce if we have recieve a number
        if(typeof res === 'number'){
          this._events.raf = res
          setTimeout(() => {
            this._events.raf = undefined
          }, res)
        }
        if(res) this.onTick(fn)
      },
      _destroy(){
        this._events.raf = null
        Object.values(this._events.cancels)
          .forEach(doFn)
      }
    }
    
  }
}