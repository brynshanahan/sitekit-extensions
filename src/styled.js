import stylis from 'stylis'

const select = (selector) => {
  if(document.querySelector){
    return document.querySelector(selector)
  }
}

function bindTo(arr, self){
  arr.forEach(k => {
    self[k] = self[k].bind(self)
  })
}

const {keys} = Object
class StyleHandler{
  constructor(){
    this.tag = document.createElement('style')
    this.tag.type = 'text/css'
    this.lastStyle = ''
    this.head = select('head')
    this.head.appendChild(this.tag)
    this.ready = true
    this.previousUpdate = {}
    this.stylesToUpdate = {}

    bindTo(['enqueStyle', 'removeElement', 'doBatch', 'processString'], this)
  }

  enqueStyle(name, cssString){
    const css = this.processString(name, cssString)
    this.stylesToUpdate[name] = css
    this.doBatch()
  }

  removeElement(name){
    if(typeof this.stylesToUpdate[name] !== 'undefined') delete this.stylesToUpdate[name]
  }

  doBatch(){
    if(this.ready){
      window.requestAnimationFrame(() => {

        const newStyles = keys(this.stylesToUpdate)
          .filter(x => this.stylesToUpdate[x] && this.previousUpdate[x] !== this.stylesToUpdate[x])
          .reduce((res, key) => {
            return res + this.stylesToUpdate[key]
          }, '')

        if(newStyles){
          this.tag.innerHTML = newStyles
          this.previousUpdate = this.stylesToUpdate
          this.stylesToUpdate = {}
        }
        
        this.ready = false
        this.enquedBatch = false

        if(this.tm) clearTimeout(this.tm)
        this.tm = setTimeout(() => {
          this.ready = true
          if(this.enquedBatch){
            this.doBatch()
          }
        }, 16)
      })
    }else{
      this.enquedBatch = true
    }
  }

  processString (name, cssString){
    return stylis(name, cssString)
  }
}

const styleHandler = new StyleHandler()

const config = (opts = {log: false}) => function styled(Site, $, name, self){
  const log = opts.log ? console.log : () => {}

  return {
    _create(...args){
      const head = $('head')
      this._styled = {
        name: `ed-widget-${name}`,
        className: `.ed-widget-${name}`
      }
      this.element.addClass(this._styled.name)
      this.updateStyles()
    },
    _destroy(...args){
      styleHandler.removeElement(this._styled.className)
    },
    updateStyles(){
      log('Styles is about to update')
      this.styles((strings, ...args) => {
        const styles = doCSS(strings, args)
        // console.log(styles)
        styleHandler.enqueStyle(this._styled.className, styles)
      })
    }
  }
}

function doCSS(strings, values){
  const pairs = strings.map((str, i) => [str, values[i] || ''])
  return pairs.reduce((res, [str, val]) => {
    return res + str + (typeof val === 'function' ? val() : val)
  }, '')
}

export default config