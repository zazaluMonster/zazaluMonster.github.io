---
title: JavaScript操作浏览器cookie容易发生的Path问题
tags: cookie
categories: IT
date: 2019-07-13 10:21:14
---

# 1

cookie已经是熟的不能再熟悉的东西，常常用于一些B和S会话管理的场景

JavaScript提供了一些好用的cookie api供我们使用(我自己测试用的原生的，你如果使用的是别的js库操作，比如npm上的库，那么和本文无关)，比如`document.cookie`

我们在使用的时候，最关注的是key和value，但是可能会忽略几个比较重要的东西，下面讲

# 2

cookie按照host和path进行了分类，默认的path是当前web访问路径，那么如果你在不同路径下操作cookie，就会发生生成了好多份key和value相同的拷贝，这是因为它们的path不一样，导致cookie删除api执行逻辑和你的预期不符导致

# 3

最简单的方法是指定path，我认为不错的写法是指定path为`/${ApplicationContext}`路径即可,或者干脆点指定为`/`，因为host每个网站是不同的，所以不会影响到其他站点cookie

