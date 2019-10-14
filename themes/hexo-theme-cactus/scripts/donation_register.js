/**
 * 识别加载模块指定div(在写文章的时候由作者添加),若加载捐赠模块
 */

const _ = require('lodash');

// Apply options with default
let config = _.defaultsDeep({
}, hexo.config.Trusteeship);


hexo.extend.filter.register('after_render:html', (htmlContent) => {
  const contentToInject = `
    <div id="donationWrap">
        <p style="
      text-align: center;
      border-top: gold;
      border-top-style: solid;
      border-top-width: 1px;
      color: #eee;
      font-weight: bold;
      font-size: 1rem;
      padding-top: 15px;
      margin-top: 70px;
  ">感谢作者</p>
        <img src="${config.baseUrl}/images/tmpImage/blog_donation_zfb.png"
          style="margin-left: auto;margin-right: auto;display: block;width: 30%;padding-bottom: 30px;">
      </div>
      `;
  let newHtmlContent = htmlContent;
  if ((/([\n\r\s\t]*<\/body>)/i).test(htmlContent)) {
    const showDonation = htmlContent.lastIndexOf('<div id="donationPoint">');
    if (showDonation >= 0) {
      const lastIndex = htmlContent.lastIndexOf('<div id="donationPoint">');
      newHtmlContent = `${htmlContent.substring(0, lastIndex)}${contentToInject}${htmlContent.substring(lastIndex, htmlContent.length)}`; // eslint-disable-line no-magic-numbers
    }

  }
  return newHtmlContent;

});