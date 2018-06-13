# Sitekit extensions

## Installation
If using yarn type:
```sh
yarn add sitekit-extensions
```

If using npm type:
```sh
npm i sitekit-extensions
```

## Usage
To begin using the extensions you must first patch your Site instance.
You can do this by
```javascript
import { patch } from 'sitekit-extensions'

patch(Site)
```

This allows you to use the `Site.use(...extensions).widget()` syntax

An example of using the reactive and knockout widgets: 
```javascript
import { reactive, knockout } from 'sitekit-extensions'

export default function(Site, $){
  Site
    .use(
      reactive(/*opts{}*/)
      knockout(/*opts{}*/)
    )
    .widget('menuToggle', {
      _create(){}
      // etc
    })
}


```