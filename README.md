| ![IE](https://github.com/alrra/browser-logos/blob/master/src/edge/edge_48x48.png?raw=true) | ![Chrome](https://github.com/alrra/browser-logos/blob/master/src/chrome/chrome_48x48.png?raw=true) | ![Firefox](https://github.com/alrra/browser-logos/blob/master/src/firefox/firefox_48x48.png?raw=true) | ![Opera](https://github.com/alrra/browser-logos/blob/master/src/opera/opera_48x48.png?raw=true) | ![Safari](https://github.com/alrra/browser-logos/blob/master/src/safari/safari_48x48.png?raw=true) |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| IE 10+ ✔                                                                                   | Chrome 31.0+ ✔                                                                                     | Firefox 31.0+ ✔                                                                                       | Opera 30.0+ ✔                                                                                   | Safari 7.0+ ✔                                                                                      |

![NPM version](http://img.shields.io/npm/v/xy-page-transition.svg?style=flat-square)
![node version](https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square)
![npm download](https://img.shields.io/npm/dm/xy-page-transition.svg?style=flat-square)

[![xy-page-transition](https://nodei.co/npm/xy-page-transition.png)](https://npmjs.org/package/xy-page-transition)

# xy-page-transition

页面过渡组件

## 安装

```bash
# yarn
yarn add xy-page-transition
```

## 使用例子

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { PageTransition } from "xy-page-transition";
ReactDOM.render(
    <PageTransition timeout={300} mode="both">
        {showHome ? <div className="home">Home</div> : <div className="about">About</div>}
    </PageTransition>,
    container
);
```

## API

| 属性             | 说明                                                                   | 类型   | 默认值 |
| ---------------- | ---------------------------------------------------------------------- | ------ | ------ |
| timeout          | 过渡时间                                                               | number | `300`  |
| inTimeout        | 进入元素过渡时间,如果不提供，则以 timeout 为准                         | number | -      |
| outTimeout       | 离开元素过渡时间,如果不提供，则以 timeout 为准                         | number | -      |
| delayTimeout     | 延迟进入元素过渡时间,如果不提供，则以 timeout 为准                     | number | -      |
| transitionAction | 页面过渡操作,指定是前进还是后退, using history.action from History API | Action | -      |
| mode             | 过渡模式,可选值为 `in-out` `out-in` `both` `delay` 或者不设            | string | `both` |
| data             | 传递给页面事件的附加参数                                               | any    | -      |

## 开发

```sh
yarn run start
```

## 例子

http://localhost:6006

## 测试

```
yarn run test
```

## 开源许可

xy-page-transition is released under the MIT license.
