# Sitekit extensions

## Installation
If using yarn type:
```sh
yarn add sitekit-extensions
```

If using npm type:
```sh
npm i sitekit-extensions -add
```

## Usage
To begin usage just import the extensions you want to use and add them into your widgets `use: []` property


An example of using the reactive and knockout widgets: 
```javascript
import { reactive, mousemove } from 'sitekit-extensions'

export default function (Site, $){
  Site.widget('mousepos', {
    use: [
      reactive(),
      mousemove(),
    ]
    onMousemove({x, y}){
      this.setState({
        pos: {x, y}
      })
    }
    react(){
      this.changed('pos', (prevState, newState, self) => {
        this.element.toggleClass('right', this.state.x > window.innerWidth / 2)
      })

      /* or use no namespace to react to all props */

      this.changed((prevState, newState, self) => {
        this.element.toggleClass('left', this.state.x < window.innerWidth / 2)
      })
    }
  })
}


```