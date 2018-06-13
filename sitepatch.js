export default function(Site){
  Site.use = function(...mixins){
    return {
      widget: (name, self) => {
        const mixeds = mixins.map(mixin => {
          return mixin(Site, Site.$, name, clone(self))
        })
  
        const saved = saveProps(self, mixeds, name)
        
        Site.widget(name, clone(self, flatten(mixeds, saved)))
      }
    }
  }
  
  function flatten (arr, ...args){
    return [].concat(arr, args).reduce((res, obj) => {
      return clone(res, obj)
    }, {})
  }
  
  function clone(...args){
    return Site.$.extend({}, ...args)
  }
  
  function saveProps(self, mixins, name, propsToSave = ['_create', '_destroy', '_transitionIn', '_transitionOut']){
    return propsToSave.reduce((result, key) => {
      result[key] = function(...args){
        if(typeof self[key] === 'function') self[key].apply(this, args)
  
        mixins
          .filter(x => typeof x[key] === 'function')
          .forEach(mixin => {
            mixin[key].apply(this, args)
          })
      }
      return result
    }, {})
  }
}