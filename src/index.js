const mdContainer = require('markdown-it-container');
const RegexPlugin = require('markdown-it-regexp');
const frontMatter = require('front-matter');
var highlight = require('highlight.js');
let md = require('markdown-it');

md = md('commonmark').use(
    // TODO copy
    // Plugin to pass through assignment expressions without escaping
    RegexPlugin(/{({\s*(?:<.*?>|.*?)\s*})}/, (match) => match[1])
).set({
    // TODO copy
    highlight(content, languageHint){
        // const preprocessed_content = {};
        let highlightedContent;

        highlight.configure({
            useBR: true,
            tabReplace: '  '
        });

        // Hold onto JSX assignment expressions before passing to highlighter
        // content = content.replace(/{({\s*(?:<.*?>|.*?)\s*})}/g, (match, value) => {
        //     const key = hash('sha256').update(value, 'utf-8').digest('hex');
        //     preprocessed_content[key] = value;
        //     return key;
        // });

        // Try highlighting with a given hint
        if (languageHint && highlight.getLanguage(languageHint)) {
            try {
                highlightedContent = highlight.highlight(languageHint, content).value;
            } catch (err) {
            } // eslint-disable-line no-empty
        }

        // Highlight without a hint
        if (!highlightedContent) {
            try {
                highlightedContent = highlight.highlightAuto(content).value;
            } catch (err) {
            } // eslint-disable-line no-empty
        }

        // Quote curly braces
        highlightedContent = highlightedContent.replace(/[\{\}]/g, (match) => `{'${match}'}`);

        // Put back the JSX assignment expressions we pulled out before returning
        // Object.keys(preprocessed_content).forEach((key) =>
        //     highlightedContent = highlightedContent.replace(key, preprocessed_content[key])
        // );

        return highlight.fixMarkup(highlightedContent);
    }
});

const formatModule = (imports, js, jsx) => {
    let moduleText = `
    ${imports}
    
    ${js}
    
    class MarkdownItReactComponent extends React.Component {
        render(){
            return (
                <div>
                    ${jsx}
                </div>
            );
        }
    };

    export default MarkdownItReactComponent;`;

    return moduleText;
};

const formatOpening = (code, description) => {
    return (
        `<div className="demo-box">
    <div className="demo-instance">
        <h4>Example</h4>
        ${code}
    </div>
    <div className="demo-meta">
        <div className="demo-description">${description}</div>
        <div className="demo-code">`);
};

const formatClosing = () => {
    return (
        `</div>
    </div>
</div>`);
};

module.exports = function (source) {
    this.cacheable();

    const {body, attributes: {imports: importMap}} = frontMatter(source);
    const imports = 'import React from \'react\'; ' + importMap;

    let moduleJS = '';

    md.use(mdContainer, 'demo', {
        validate: function (params) {
            return params.trim().match(/^demo\s+(.*)$/);
        },
        render: function (tokens, idx) {
            // container 从开头到结尾把之间的token跑一遍，其中idx定位到具体的位置

            // 获取描述
            const m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);

            // 有此标记代表 ::: 开始
            if (tokens[idx].nesting === 1) {
                let jsx = '', i = 1;

                // 从 ::: 下一个token开始
                let token = tokens[idx + i];

                // 如果没有到结尾
                while (token.markup !== ':::') {
                    // 只认```，其他忽略
                    if (token.markup === '```') {
                        if (token.info === 'js') {
                            // 插入到import后，component前
                            moduleJS = token.content;
                        } else if (token.info === 'jsx') {
                            // 插入render内
                            jsx = token.content;
                        }
                    }
                    i++;
                    token = tokens[idx + i]
                }

                // 描述也执行md
                return formatOpening(jsx, md.render(m[1]));
            }
            return formatClosing();
        }
    });

    // md 处理过后的字符串含有 class 和 style ，需要再次处理给到react
    const content = md.render(body).replace(/class=/g, 'className=').replace(/<hr>/g, '<hr />').replace(/<br>/g, '<br />');

    return formatModule(imports, moduleJS, content);
};