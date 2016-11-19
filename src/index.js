const md = require('markdown-it')();
const mdContainer = require('markdown-it-container');
const frontMatter = require('front-matter');

const formatModule = (imports, content) => {
    let moduleText = `
    ${imports}
    
    function MarkdownComponent(props) {
      return (
        <div>
          ${content}
        </div>
      );
    };

    export default MarkdownComponent;`;

    return moduleText;
};

const formatCode = (code) => {
    return (
        `<div className="demo-box">
    <div className="demo-instance">
        <h4>Example</h4>
        {${code}}
    </div>
    <div className="demo-meta">
        <div className="demo-code">`);
};

const formatDescription = (description) => {
    return (
        `        </div>
        <div className="demo-description">${description}</div>
    </div>
</div>`);
};

module.exports = function (source) {
    this.cacheable();

    const {body, attributes: {imports: importMap}} = frontMatter(source);
    const imports = 'import React from \'react\'; ' + importMap;

    let description = '';

    md.use(mdContainer, 'demo', {
        validate: function (params) {
            return params.trim().match(/^demo\s+(.*)$/);
        },
        render: function (tokens, idx) {
            const m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);

            if (tokens[idx].nesting === 1) {
                const code = tokens[idx + 1].content;
                description = md.utils.escapeHtml(m[1]);

                return formatCode(code);
            }
            return formatDescription(description);
        }
    });

    // md 处理过后的字符串含有 class 和 style ，需要再次处理给到react
    const content = md.render(body).replace(/class=/g, 'className=').replace(/<hr>/g, '<hr />').replace(/<br>/g, '<br />');

    return formatModule(imports, content);
};