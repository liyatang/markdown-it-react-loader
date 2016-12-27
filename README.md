---
imports:
    import {Loading} from 'react-gm';
---
# markdown-it-react-loader

用Markdown提供一份直观的React文档，有可运行的示例，有示例源代码，有示例的说明。

这样用户看起来直观，编写者写起来也直观，维护成本低。

经过几番尝试，结合 React 的特点。写了一套处理 Markdown 文件的 webpack loader，可以将 Markdown 转成 React 文件。

本md对应生成的文档是[readme.md](https://liyatang.github.io/markdown-it-react-loader/)

---

## Install

`npm install markdown-it-react-loader`

在 webpack 中加入 loader 

```js
{
    test: /\.md$/,
    loader: 'babel!markdown-it-react-loader'
}
```

随后把md文件当成一个react component去使用即可。比如本工程中的demo

```js
import ReadMe from '../README.md';
```

如需运行demo `npm install; npm start;` 打开 http://localhost:5000

### options

- `className` 默认'doc'，页面容器的class

```js
// webpack.config.js
module.export = {
    //...省略
    markdownItReact: function () {
        return {
            className: 'doc' // 默认也是doc
        };
    }
};
```

具体见`webpack.config.js`

### 样式

提供样式文件`index.css`，可直接引入或自定义。

---

## 语法介绍

正常的Markdown语法不影响。有几个需要注意的地方：

### 使用示例

#### 纯渲染

::: demo 这是描述这是**描述**，点三角可展开代码。也可以不提供
```jsx
<button onClick={() => alert('dou la mi fa sou')}>click me</button>
```
:::

```
    ::: demo 这是描述这是**描述**，点三角可展开代码
    ```jsx
    <button>adfasdfa</button>
    ```
    :::
```

注意：渲染到页面的代码语言必须写`jsx`，因为loaders会把语言为`jsx`放入render的jsx内

#### 引入其他库

::: demo [react-gm](https://github.com/gmfe/react-gm)的Loading组件
```jsx
<Loading/>
```
:::

在md开头添加引入库

```js
---
imports:
    import {Loading} from 'react-gm';
---
```

然后
```
    ::: demo [react-gm](https://github.com/gmfe/react-gm)的日历组件
    ```jsx
    <Loading/>
    ```
    :::
```

#### 更丰富的交互

比如需要 state，需要handleXXX

::: demo 更丰富的交互写在js内，这种场景更多
```js
class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'hello'
        };
    }
    handleChange(e){
        this.setState({value: e.target.value});
    }
    render(){
        return (<input value={this.state.value} onChange={::this.handleChange} />)
    }
}
```
```jsx
<Test/>
```
:::

```
    ::: demo 更丰富的交互写在js内，这种场景更多
    ```js
    class Test extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: 'hello'
            };
        }
        handleChange(e){
            this.setState({value: e.target.value});
        }
        render(){
            return (<input value={this.state.value} onChange={::this.handleChange} />)
        }
    }
    ```
    ```jsx
    <Test/>
    ```
    :::
```


### 花括号 (表达式）

有意思的是可以用花括号写表达式，比如我要显示

当前url是：`{location.href}`

userAgent是：`{navigator.userAgent}`

因而你要用花括号时`{'{}'}`需要写成`{'{\'{}\'}'}`

### 代码里面的花括号

`{'{ }'}`会自动转，无需关注

```jsx
<div>{location.href}</div>
```

---

## 参考

- [markdown-it](https://github.com/markdown-it/markdown-it)
- [element](https://github.com/ElemeFE/element)
- [react-markdown-loader](https://github.com/javiercf/react-markdown-loader)

## 其他

### anchor

github page是不支持browserHistory的，一般路由用hash处理。而锚点也是用hash，会冲突。
所以只能自己处理。 监听锚的点击，阻止默认事件，然后用你自己的规则处理吧。

我是这样做的 https://github.com/gmfe/react-gm/blob/master/demo/index.js

### react模块

默认已经`import React from 'react';`
