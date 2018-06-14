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
import { reactive, knockout } from 'sitekit-extensions'

export default function(Site, $){
  Site.widget('menuToggle', {
      use: [reactive(), knockout()],
      _create(){}
      // etc
    })
}


```