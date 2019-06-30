---
title: 前后端分离之跨域问题以及curl在web测试上的应用
tags: 跨域访问
categories: IT
date: 2019-06-30 16:26:15
---

前后端分离已经不稀奇了，今天我就稍微讲一下前后端分离后在数据对接上容易出现的跨域问题。

# 问题何时发生

发起一次http请求的时候，若源域名和目标域名(或者ip和端口不一致)不同，则目前大多数服务器都会拒绝响应此http请求。

你会遇到类似如下的http报错

```
Access to XMLHttpRequest at ....
No 'Access-Control-Allow-Origin' header is present on the requested resource
```

因为这种请求属于跨域请求，在web服务器的通用实现方式上，默认的它们被设置为拒绝跨域请求。

# 2 通常解决方法

于是我们第一时间想到的是开启跨域请求。

先不提开启跨域请求的风险（在javaweb的Model框架中，一般可以使用contants+javaconfig来控制测试环境和生产环境的跨域的开启和关闭）

开启跨域请求是双向的，首先在请求头中我们必须使用相关header去表示本次请求为跨域请求，其次是服务端开启跨域访问，最重要的一个header域是`Access-Control-Allow-Origin`

最暴力的做法：`'Access-Control-Allow-Origin'： '*'`
这样你的服务器就可以支持所有域名的跨域访问，接受一切

不过一般我们肯定不希望服务器暴露太多，所以可以根据自己的情况适当调整

此外，请求端(通常使我们的ajax调用端)，也需要带上跨域的相关header来供后端验证

# 3 当被拒绝跨域的时候

很多人可能都没留意到一个细节，所有POST的跨域请求，如果服务器不支持跨域，那么你的POST请求可能没有发出去就死在了摇篮里。

因为在HTTP请求规范中，POST请求之前先发送的是OPTIONS请求，用于做一些验证操作

OPTIONS请求被服务端拒绝跨域，POST请求就根本没必要发送了。

# 4 使用curl做简单的http测试

curl是一个文件下载工具，但是我更喜欢把它当做一个功能全面的http工具

我们可以通过curl来做一些简单的http测试

这里我简单的举个例子:
```shell
curl -XPOST -v -d '{ "test": "abc123" }' -H "Content-type: application/json" http://localhost:8080/MyBelfast/crew/login
```

可以测试`http://localhost:8080/MyBelfast/crew/login`是否支持接受json数据

# 5 尾

本文提到的跨域问题会常常会在前后端开发阶段中出现，生产上是比较少的。在开发阶段，前端和后端的测试服务器往往被部署在不同的端口，这就会使得两者的http连接是跨域的

有关跨域访问的事情还远远不止本文所讲的这一些，只不过本文的问题是最容易出现的问题，也是最低级的问题

参考：
https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-cors
