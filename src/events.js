const { values } = Object

const defaultOpts = {
  log: false
}

const events = [
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
        const getKey = () => `eve${this._events.index++}`

        events.forEach(obj => {
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
                const res = fn(...args)

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
                const res = fn(...args)
                
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
      },
      _destroy(){
        values(this._events.cancels)
          .forEach(doFn)
      }
    }
    
  }
}