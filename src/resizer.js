
const defaultOpts = {
  log: false
}

export default function resizeConfig(options = {}){
  const opts = Object.assign({}, defaultOpts, options)
  const log = opts.log ? console.log : () => {}

  return function resizer(Site, $, name, def){
    return {
      _create(){

        if(this.onResize) {
          this._resizer = {
            events: [],
          }

          const evt = (thing, name, fn) => {
            $(thing).on(name, fn)
            this._resizer.events.push(
              () => {
                $(thing).off(name, fn)
              }
            )
            return 
          }

          this._resizer.stop = () => this._resizer.events.forEach(ev => ev()),
          this._resizer.start = () => {
              evt(window, 'resize', () => {
                if(this.onResize) {
                  this.onResize({width: window.innerWidth, height: window.innerHeight})
                }
              })
            }

          this._resizer.start()
        }
      }
    }
    
  }
}