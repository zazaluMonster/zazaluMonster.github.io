---
title: 既然自己懒得搞那就只好认真摸索别人的了-被一些人诟病的mybatis二级缓存
tags: mybatis
categories: IT
date: 2019-07-31 16:59:06
---

# 1 简单介绍

mybatis是javaweb开发再熟悉不过的orm框架。没有公司内部自研的orm框架的话，我见过的基本现在都走mybatis或者spring-jpa

为了加速查询，减少数据库I/O次数，我们都需要缓存这玩意来辅助我们存储一些数据在内存中，利用内存查询速度很快的特点，来让我们的读操作耗时更短。

# 2 吐槽PerpetualCache

我最近经常听人吐槽mybatis的缓存机制（无中生有？），并会在生产上停用其缓存功能，加入额外的(分布式)缓存中间件来自定义控制系统的缓存处理。

mybatis的缓存一路走来，已经从一开始的小小的基本缓存模块，到现在已经变成了一个相当健壮的缓存模块，已经提供了自定义缓存接口，来自定义改变mybatis的缓存策略(虽然还是不够灵活)。

其一级缓存(local cache)是默认使用的，同一个sqlsession使用一个Cache实例，不同的sqlsession使用的是不同的Cache实例。故其细粒度只到sqlsession。结合了ioc容器，比如spring后，这个缓存确实几乎变成了鸡肋。因为现在编程思想趋向于模块化，功能单一化，所以在一次请求范围内，同一个sqlsession能缓存到的数据少之又少（假设不使用分布式或者单机缓存中间件）

既然一级缓存几乎团灭，那么mybatis还有什么防线呢？二级缓存(2nd cache)

mybatis的二级缓存最显著的特点是可以让不同的sqlsession共享同一个Cache实例，细粒度到达命名空间级别(namespace)，也就是说同一个Mapper内的所有curd操作会被同一个Cache管理，不管你使用的是不是同一个sqlsession。

表面上看上去可以让人发出`哇哦`的声音，但是一用起来，还是很`sad`的。

由于根据业务逻辑，代码都是分模块的，所以我们有超多个Mapper来对应不同的表结构。于是鸡肋的一点依旧发生了，A_Mapper的修改不会刷新B_Mapper的缓存数据，导致缓存数据变成了`dirty data`，╮(╯▽╰)╭真的惨

# 3 挽救

很多人看到到这里应该也开始想放弃使用mybatis二级缓存，或者借助mybatis提供的自定义缓存接口，来改变mybatis策略，使用一些分布式缓存系统来控制mybatis的缓存。不过由于小项目是真的没必要上完整的缓存中间件的，所以默认存在的PerpetualCache还是挺香的。可是我前面也说了，二级缓存最大的毛病就是细粒度只到命名空间(namespace)，而我们正常的应用场景是需要一个全局缓存实例。那么该怎么玩呢？

查看mybatis3的文档，在cache的最角落里有一个小小的功能存在着。`cache-ref`功能。文档对它的描述真的非常短小精湛，而且是在最底下。

接下来我就说下如何使用它来实现一个简单的全局缓存实例

# 4 实验

本实验源码不开放了，大家看看结果就好，不懂可以回复我慢慢解答。（懒得整一份单独的代码出来！）

> 先来测试下默认的二级缓存的细粒度是否是namespace

我们执行两个Mapper方法，
一个是`LikeMapper`的`inserts`方法，更新方法，会刷新缓存
一个是`MessageMapper`的`selects`方法，查询方法，会利用到`LikeMapper`中的表数据进行查询
两者在不同的namespace中，所以`inserts`方法的执行不会刷新另一个方法所在的缓存空间

OK，接下来我按`selects`->`inserts`->`selects`的顺序来执行，我们的预期目的是：第二次`selects`方法依旧从缓存中取数据

下面是日志打印，
<img src="/images/tmpImage/mybatis_level_2.png">

第二次selects的打印可以看出，依旧会从缓存中获取数据验证了，确实默认的二级缓存细粒度是只到namespace的

> 使用cache-ref来使得两个Mapper使用同一个Cache实例

在LikeMapper中如下配置
```
<mapper namespace="LikeMapper">

    <!--选择一个Namespace作为主namespace，其余Mapper全部使用cache-ref引用此Cache-->
	<cache/>
...
...

</mapper>
```

在MessageMapper中如下配置
```
<mapper namespace="LikeMapper">

	<cache-ref namespace="LikeMapper"/>
...
...

</mapper>
```

随后，我们在按顺序执行一次刚刚的方法，下面是日志打印
<img src="/images/tmpImage/mybatis_level_2_global.png">

可以看到，第二次select依旧执行了sql语句，证明了不同namespace的Mapper都使用了同一个cache

# 5 总结

通过cache-ref可以间接的实现全局缓存实例的效果，从而解决目前常常遇到的一类缓存数据脏读问题而不得不抛弃mybatis二级缓存功能的现象

<div id="donationPoint">