---
title: 加快Github Pages服务+Hexo博客的首次加载速度解决方案
tags: Hexo魔改
categories: IT
date: 2019-09-20 15:57:04
---

# 情况分析

国内往GithubPages发送GET请求，很慢，第一次访问的速度在我这边透过浏览器F12工具解析大概是

建立连接（初始化，SSL等等）好几s
等待响应（TTFB）好几s
下载速度倒还行几毫秒


下载到index.html后，浏览器对html进行解析，继续请求html内的各种js，css，字体库等等等等静态资源！

然后我的网页才开始展示！

# 如何解决

1. 访问github很慢，是由于国外网站，而我在国内，不开代理情况下，肯定慢。所以解决方法是让网站备案然后加入CDN，但是好的CDN要钱（万一一个DDOS攻击呵呵），作为一个垃圾个人博客，没必要，暂时先不搞

2. 将所有静态资源托管到国内服务器上，这里有两种选择：
    - 白嫖国内免费pages服务（我自己的骚操作）: 我发现gitee的pages支持跨域访问（目前发现只支持css,js,image资源，不支持字体库，json文件），于是可以在gitee上上传一份hexo的文件，然后在_config.yml中配置一个`baseUrl`，然后在各类模板文件中加上这个`baseUrl`配置，比如我现在是这样的：
    ```yml
    Trusteeship:
        baseUrl: https://your.gitee.io/your.gitee.repo/
    ```
    然后在模板文档里这样搞一下(需要的地方加上前缀))：
    ```html
    <%- css(theme.Trusteeship.baseUrl + 'css/style') %>
    ```
    这个方法总体来看很不错，唯一缺点就是字体库，json文件没法跨域访问，导致加载失败，最后只能把这些加载失败的文件单独重新转到github pages上或者转到你别的托管服务器上了。。这过程中由于我对hexo整体代码架构也不是很熟悉，所以为了一时爽，我直接硬编码了！

    最后在hexo配置文件中加入gitee的git库配置就行了，这样`hexo d`就会依次推到这两个pages上了，然后github page上的部分静态资源从gitee pages上去获取！ xswl。
    ```yml
    deploy:
    - type: git
      repository: 'your github repo'
      branch: master
    - type: git
      repository: 'your gitee repo'
      branch: master
    ```
    注意先git remote 'gitee repo'
    

    - 托管到自己的服务器上：比如你搞个阿里云轻量服务器，专门搞个后台负责管理静态资源，由于服务器在国内，所以访问肯定不慢。 不过这个方法是个伪命题，你既然都有自己的服务器了，那就直接把hexo也搬过来不就好了。由于服务器花钱，我暂时不考虑。

# 说说为啥我要这么做

其实回过头来看我觉得肯定有人会说我这样搞折腾，麻烦，既然用了gitee了，那就直接全部搬家搬到gitee就好了。 

但是那样的话域名的跳转，CNAME，这些东西都要改QAQ， 我想了想算了，不改已经搞定的东西了，毕竟完全没必要，而且github pages更稳定

CDN加速等我完成备案再搞

# 存在的坑

1. 如果采用上面的第二种方法，当你想换主题的时候，额外的工作量会很比较大，因为你换个主题后，这个主题内的配置你要转移到新主题上，重新配！

2. gitee pages需要重新部署才能访问你新加的静态资源，比如访问新加入的图片，新加的css，js文件，不然直接404！ 除非你开通gitee pages pro， 不然都需要在网页上手动重新部署！ 对gitee的这种行为我只能竖一个中指.. 毕竟网站也要盈利...


暂时就总结这些，有事先闪了！！

<div id="donationPoint">

<div id="licensePoint">