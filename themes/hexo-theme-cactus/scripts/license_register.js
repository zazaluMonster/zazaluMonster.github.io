/**
 * 识别加载模块指定div(在写文章的时候由作者添加),若加载捐赠模块
 */

const _ = require('lodash');

// Apply options with default
let config = _.defaultsDeep({
}, hexo.config.Trusteeship);


hexo.extend.filter.register('after_render:html', (htmlContent) => {
  const contentToInject = `
  <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img style="margin-left: auto;margin-right: auto;display: block;" alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>
  <p style="
  text-align: center;
  color: #eee;
  font-weight: bold;
  font-size: 1rem;">本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。</p>
  `;
  let newHtmlContent = htmlContent;
  if ((/([\n\r\s\t]*<\/body>)/i).test(htmlContent)) {
    const showDonation = htmlContent.lastIndexOf('<div id="licensePoint">');
    if (showDonation >= 0) {
      const lastIndex = htmlContent.lastIndexOf('<div id="licensePoint">');
      newHtmlContent = `${htmlContent.substring(0, lastIndex)}${contentToInject}${htmlContent.substring(lastIndex, htmlContent.length)}`; // eslint-disable-line no-magic-numbers
    }

  }
  return newHtmlContent;

});