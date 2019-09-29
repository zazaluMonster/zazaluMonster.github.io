---
title: Gitalk初始化评论自动生成
tags: Gitalk
categories: IT
date: 2019-09-24 15:01:10
---

# 1

切换到Gitalk后，存在一个问题，就是issue需要我人工干预去创建，没法自动。 

所以这时候就需要借助Github API的力量，编写一个脚本自动创建文章对应的issue。

我想这种需求应该有人比我早需要，所以搜索了下，确实由人用nodejs写了一个脚本实现了，勉强能用，我也在上面稍微改动了下符合我自己的情况，下面贴个原文地址：
https://daihaoxin.github.io/post/322747ae.html


# 2

不过原文遗漏了一个配置点， 就是要把站点_config.yml中url属性配置成自己域名，默认的http://yoursite.com

会导致生成的sitemap.xml中的都是这个域名开头的，导致生成的所有issue都是不匹配的。

# 3

还有一个问题是，label不能超过50个字符，所以要md5下

# 4 最终代码

comment.js

```js
const request = require("request");
const fs = require("fs");
const path = require("path");
const url = require("url");
const xmlParser = require("xml-parser");
const YAML = require("yamljs");
const cheerio = require("cheerio");
const md5 = require("md5");
// 根据自己的情况进行配置
const config = {
    username: "zazaluMonster", // GitHub 用户名
    token: "d234d6a7234f3b547975f59c81adc879353189ac",  // GitHub Token
    repo: "zazaluMonster.github.io",  // 存放 issues的git仓库
    // sitemap.xml的路径，commit.js放置在根目录下，无需修改，其他情况自行处理
    sitemapUrl: path.resolve(__dirname, "./public/sitemap.xml"),
    kind: "Gitalk",  // "Gitalk" or "Gitment"，
    baseUrl: "https://zazalu.space/"
};
let issuesUrl = `https://api.github.com/repos/${config.username}/${config.repo}/issues?access_token=${config.token}`;

let requestGetOpt = {
    url: `${issuesUrl}&page=1&per_page=1000`,
    json: true,
    headers: {
        "User-Agent": "github-user"
    }
};
let requestPostOpt = {
    ...requestGetOpt,
    url:issuesUrl,
    method: "POST",
    form: ""
};

console.log("开始初始化评论...");

(async function() {
    console.log("开始检索链接，请稍等...");
    
    try {
        let websiteConfig = YAML.parse(fs.readFileSync(path.resolve(__dirname, "./_config.yml"), "utf8"));
        
        let urls = sitemapXmlReader(config.sitemapUrl);
        console.log(`共检索到${urls.length}个链接`);
        
        console.log("开始获取已经初始化的issues:");
        let issues = await send(requestGetOpt);
        console.log(`已经存在${issues.length}个issues`);
        
        let notInitIssueLinks = urls.filter((link) => {
            return !issues.find((item) => {
                link = removeProtocol(link);
                return item.body.includes(link);
            });
        });
        if (notInitIssueLinks.length > 0) {
            console.log(`本次有${notInitIssueLinks.length}个链接需要初始化issue：`);
            console.log(notInitIssueLinks);
            console.log("开始提交初始化请求, 大约需要40秒...");
            /**
             * 部署好网站后，直接执行start，新增文章并不会生成评论
             * 经测试，最少需要等待40秒，才可以正确生成， 怀疑跟github的api有关系，没有找到实锤
             */
            setTimeout(async ()=>{
                let initRet = await notInitIssueLinks.map(async (item) => {
                    let html = await send({ ...requestGetOpt, url: item });
                    let title = cheerio.load(html)("title").text();
                    let pathLabel = url.parse(item).path;
                    pathLabel = md5(config.baseUrl + pathLabel);//中文过长所以要md5
                    let body = `${item}<br><br>${websiteConfig.description}`;
                    let form = JSON.stringify({ body, labels: [config.kind, pathLabel], title });
                    return send({ ...requestPostOpt, form });
                });
                console.log(`已完成${initRet.length}个！`);
                console.log("可以愉快的发表评论了！");
            },40000);
        } else {
            console.log("本次发布无新增页面，无需初始化issue!!");
        }
    } catch (e) {
        console.log(`初始化issue出错，错误如下：`);
        console.log(e);
    } finally {
    
    }
})();

function sitemapXmlReader(file) {
    let data = fs.readFileSync(file, "utf8");
    let sitemap = xmlParser(data);
    return sitemap.root.children.map(function (url) {
        let loc = url.children.filter(function (item) {
            return item.name === "loc";
        })[0];
        return loc.content;
    });
}

function removeProtocol(url) {
    return url.substr(url.indexOf(":"));
}

function send(options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (!error) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

```

# 5 操作步骤

每次`hexo d`后执行`node ./comment.js`即可,不过不要觉得他们的执行顺序由强约束，其实你可以随时执行`node ./comment.js`，两者没有必要关联，只不过每次你hexo d后，肯定会新增的文章需要生成评论，所以调用一次

# 6 后续发生的问题总结

当执行node ./comment.js出现如下问题时, 
```shell
internal/modules/cjs/loader.js:638
    throw err;
    ^

Error: Cannot find module './options'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:636:15)
    at Function.Module._load (internal/modules/cjs/loader.js:562:25)
    at Module.require (internal/modules/cjs/loader.js:692:17)
    at require (internal/modules/cjs/helpers.js:25:18)
    at Object.<anonymous> (/home/zazalu/blog/zazaluMonster.github.io/node_modules/cheerio/lib/cheerio.js:6:22)
    at Module._compile (internal/modules/cjs/loader.js:778:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
    at Module.load (internal/modules/cjs/loader.js:653:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
    at Function.Module._load (internal/modules/cjs/loader.js:585:3)

```

直接删除整个`node_modules`文件夹,重新执行`npm install`解决,我猜测是node模块构建问题
---

如果切换环境调用github api, token需要重新生成, 请注意

<div id="donationPoint">