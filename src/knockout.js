function target(obj){
  return {
    get: (prop) => {
      return prop.split('.').reduce((pointer, key) => {
        return pointer[key] || undefined
      }, obj)
    }
  }
}

export default function config (opts) {
  return function knockout(Site, $, name, self){
    const mixin = {
      _create(){
        if(!this._reactive){
          console.error('widget should be reactive to use knockout')
        }

        this._knockout = {
          isFirst: true,
          lastRender: '',
          renderProp: (prop, el) => {
            el.text(target(this.state).get(prop) || '')
          },
          render: () => {
            if(this._knockout.isFirst){
              let html = this.element.html()
              const matches = html.match(/\${(.+?)}|{{(.+?)}}/g)
              const result = matches.reduce((res, match) => {
                const prop = match.replace(/{{|}}|\${|}/g, '')
                return res.replace(new RegExp(match), `<span data-knockout-id="${prop}">${target(this.state).get(prop) || ''}</span>`)
              }, html)

              this.element.html(result)

              if(typeof this.changed === 'function'){

                this.element.find('[data-knockout-id]').each((i, el) => {
                  const prop = $(el).attr('data-knockout-id')
                  this.changed(prop, prevState => this._knockout.renderProp(prop, $(el)))                  
                })
              }

              this._knockout.isFirst = false
            }else{

            }
          }
        }

        this._knockout.render()
      }, 
    }
    return mixin
  }
}