---
title: 踩坑的Bug总集
tags: Bugs
categories: IT
date: 2019-04-24 13:56:48
---


主要纪录我面向Google编程失败后自己解决的部分值得纪录问题，为LTS版本，长期更新

## Java Exceptions

---

### 1.java.lang.NoSuchMethodError: com.mchange.v2.async.ThreadPoolAsynchronousRunner.


第一次遇到这种java异常，看字面意思，找不到这样的方法的错误。

哇 当时看到这个错误 第一个反应就是 我是不是没导这个jar包？ 然后我排查了一次jar包后发现，明明就有，所以我就非常的无奈，一边吐槽着垃圾Eclipse 一边无奈的各种网上搜解决方案

很显然，大部分回答都是，checkout your jar！ 

但是我检查了jar包 然后海点进去检查了此jar包的对应的此方法，都是存在的 

同时我也没有使用maven 不存在maven方面的问题 

所以我就开始心急如焚，因为我发现自己解决不了这个问题 面向google编程也即将失效

就在我快要崩溃的时候，看到有一个人说，会不会是jar包冲突？

我瞬间就反应过来，还真说不定。因为我搭建这个项目的时候，跟着教程无脑导入了大量的jar包，也许就是这个问题

于是，我使用了eclispse的类搜索功能。我一搜ThreadPoolAsynchronousRunner。。

发现居然有两个结果

好吧 同名类。。。。

于是我删除了其中一个。。。

运行后 异常消失，一切正常。

###### 总结：
在java项目中导入jar包乱导入 没有自己去一个个分析每个包的作用导致的jar包冲突的问题。 就好比现实中，有病乱投医，什么药都吃。也表示我吗以后着手做事情的时候，一定要把自己的工具的作用了解清楚再做后续的事情。



## Mysql Exception

---

### 1.  the right syntax to use near "xxx"

当你看到sql报错
```
You have an error in your SQL syntax; check the manual that corresponds to >your MySQL server version for the right syntax to use near 'desc, name) >values (2, 'Test town desc.', 'Test town')' at line 1
```

类似这样的错误

第一反应便是 你使用了mysql的保留字作为了你的数据库表名或者列名