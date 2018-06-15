function clone(...args){
  return Object.assign({}, ...args)
}

const defaultOpts = {
  log: false,
}

export default function mousemove(options){
  const opts = clone(defaultOpts, options)
  const log = opts.log ? console.log : () => {}

  return function mouseExtension(Site, $, name, def){
    
    return {
      _create(){
        if(this.onMousemove) {
          const evt = (thing, name, fn) => {
            $(thing).on(name, fn)
            this._mousemove.events.push(
              () => {
                $(thing).off(name, fn)
              }
            )
            return 
          }

          this._mousemove = {
            events: [],
            start: () => evt(window, 'mousemove', (e) => this.onMousemove({x: e.clientX, y: e.clientY, e}, this._mousemove.stop)),
            stop: () => this._mousemove.events.forEach(e => e())
          }

          this._mousemove.start()
        }
      },
      _destroy(){
        this._mousemove.stop()
      }
    }
  }
}