---
title: 放弃Disqus, 拥抱Gitalk(基于Hexo)
tags: hexo魔改
categories: IT
date: 2019-09-19 16:36:36
---

## 前言

Disqus用起来啥都还行，就是国内访问不了太差劲了。。

最终决定改用Gitalk， 简单看下了文档， 上手还是很快的， 结合自己写的脚本， 可以做到一键开闭Gitalk功能（日后在完善成package打包到npm上供我自己更方便的使用）

## 安装Gitalk到Hexo中

### 修改_config.yml

在Hexo的`_config.yml`中添加如下配置：
z
```yml
# Gitalk comments config. (if use Gitalk, please close Disqus comments first)
gitalk:
  enabled: true
  clientID: 'GitHub Application Client ID',
  clientSecret: 'GitHub Application Client Secret',
  repo: 'GitHub repo',
  owner: 'GitHub repo owner',
  admin: ['GitHub repo owner and collaborators, only these guys can initialize github issues'],
  distractionFreeMode: false # 是否需要遮罩
```

该配置中的`clientID`和`clientSecret` 需要 GitHub Application，可以在这个网站注册后获得

https://medium.com/platform-engineer/understanding-java-memory-model-1d0863f6d973

注册的时候`Homepage URL`和`Authorization callback URL`都填你的博客域名即可

下面是我的gitalk配置，还不是很理解的小伙伴可以参考下

```yml
# Gitalk comments config. (if use Gitalk, please close Disqus comments first)
gitalk:
  enabled: true
  clientID: '我的clientID'
  clientSecret: '我的clientSecret'
  repo: 'zazaluMonster.github.io'
  owner: 'zazaluMonster'
  admin: ['zazaluMonster']
  distractionFreeMode: false # 是否需要遮罩
```

## 编写脚本-自动注入Gitalk启动代码

脚本内容如下：
```js
/**
 * gitalk_register.js
 * @description 注入gitalk内容到index.html末尾
 */
const _ = require('lodash');

// Apply options with default
let config = _.defaultsDeep({
}, hexo.config.gitalk);

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
        id: md5(location.pathname),
        distractionFreeMode: ${config.distractionFreeMode}
      });
      
      gitalk.render('gitalk-container');
    }
    `;
    const contentToInject = `
    <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
    <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
    <script src="/js/md5.min.js"></script>
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
```

没有lodash模块的话使用npm自己安装下.（说实话这里也不需要用到lodash，由于我代码复制过来然后自己改了点，所以保留了这个方法）

这段脚本就是在渲染完成后的html末尾加上gitalk的启动代码，非常好理解，唯一注意的地方用到了md5加密方法来加密id，防止gittalk报错. id字段不允许超过50个字符，所以迫不得已只能对location.pathname进行加密。

`md5.min.js`这个js的内容在https://github.com/blueimp/JavaScript-MD5
把这个js下下来后放置到`your.github.io\themes\your-theme-folder\source\js`下即可

将该脚本`gitalk_register.js`放置到`your.github.io\themes\your-theme-folder\scripts`下即可， 这个文件夹下的js文件会在hexo-cli工具运行的时候自动执行(执行时机就不说明了，可以自己看官方文档)

如果仍然出现文件404问题，请自行根据自己的情况来改变路径即可

## 大功告成

试试`hexo g`,`hexo d`然后看看效果吧

<div id="donationPoint">