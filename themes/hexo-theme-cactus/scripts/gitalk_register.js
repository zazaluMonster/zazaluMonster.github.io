/**
 * 加载gitalk
 * @description 注入gitalk内容到index.html末尾
 */

const _ = require('lodash');

// Apply options with default
let config = _.defaultsDeep({
}, hexo.config.gitalk, hexo.config.Trusteeship);

console.log(config);

if(config.enabled){
  hexo.extend.filter.register('after_render:html', (htmlContent) => {
    const scriptToInject = `
    if(location.pathname == '/'){
      //首页不需要评论系统
    }else{
      var gitalk = new Gitalk({
        clientID: '${config.clientID}',
        clientSecret: '${config.clientSecret}',
        repo: '${config.repo}',
        owner: '${config.owner}',
        admin: '${config.admin}',
        id: md5(location.origin + "/" +location.pathname),
        distractionFreeMode: ${config.distractionFreeMode}
      });
      gitalk.render('gitalk-container');
    }
    `;
    const contentToInject = `
    <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
    <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
    <script src="${config.baseUrl}/js/md5.min.js"></script>
    <div id="gitalk-container"></div>
    <script>${scriptToInject}</script>
    `;
    let newHtmlContent = htmlContent;
    if ((/([\n\r\s\t]*<\/body>)/i).test(htmlContent)) {

      const lastIndex = htmlContent.lastIndexOf('</body>');
      newHtmlContent = `${htmlContent.substring(0, lastIndex)}${contentToInject}${htmlContent.substring(lastIndex, htmlContent.length)}`; // eslint-disable-line no-magic-numbers

    }
    return newHtmlContent;

  });

}