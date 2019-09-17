---
title: interview
date: 2019-08-22 13:41:21
---

# 银信科技面试题

## HR提前放出的题目

1. 从项目开始到线上的流程

我就拿我黄河银行收单系统来举例说明, 当时项目一期刚好结束, 我过去接手开发时(已经提前熟悉了一遍项目一期的项目架构,代码以及系统负责的黄河银行业务内容),双方正准备筹划项目二期建设需求,黄河银行那边先给了我们一份项目二期建设的需求书, 随后我和另一名负责pos的app相关开发(c的)的同事(他全程参加了项目一期的开发,但是java那块的负责人在一期结束后离职,他对java后台不太熟悉), 我们两人外加上部门负责的领导, 进行了几次开会, 其中涉及java后台的改动和新功能的开发, 我对需求进行了评测,从现有系统架构以及现有代码出发, 评估了下工时, 并说了一些自己的看法, 领导听取了一些意见, 最后与银行方一起开会把需求定版. 随后就是分模块开发, 二期开发过程中, 公司也多派了几位开发人员,协助完成了整体开发工作. 

由于项目还包括ios和app,所以开发期间也少不了和移动端开发人员进行沟通,为他们编写后台接口文档

整体开发的差不多后, 将测试环境部署起来(由于一期构建好了一个完整的测试环境, 我做的只是将新版本导包部署), 银行测试人员开始进行业务测试, 银行技术人员开始查阅源代码以及做压力测试等技术性高的测试. 测试过程中银行方会发现需求业务存在问题(我按照需求做了), 要求我改逻辑. 一开始我由于缺乏行业经验, 同时觉得难度不大,就加班加点帮忙改了. 随后银行方要求改的越来越多, 脱离需求书过多, 我便提出要求银行方重新定制新的需求书, 并发版本备案, 走正式流程, 否则不能进行修改(前提是自己实现的功能和需求已经一致)

最后测试环境测试没问题后, 需要进行项目上线,, 上线前,我先编写了傻瓜式的上线步骤,每一步干什么都要写清楚. 然后召开一次上线评审. 评审没问题后就会上线, 当时上线时间是选择了晚上12点, 我10点左右陪同银行技术人员进入生产区, 然后银行技术人员根据上线步骤文档,一步步操作系统. 关闭系统-部署项目-重启服务-对重要业务进行立即在线测试, 这些全都没问题后便开始了真正的试运行阶段

试运行期间, 我常常跑生产区看日志(有些地方实现确实缺乏经验,包括日志打印这些), 在试运行阶段出现的问题, 会统一在一个时间点打补丁包进行更新(所谓的增量更新)

最终系统稳定后, 可能会继续做一些边缘的开发任务(公司项目组开发人员有限,其实后期就我一个java后台), 比如测试期间的一些页面觉得不好看的进行下一些优化, 银行部分机构撤并后, 系统需要进行下数据修改(写数据变动sql,系统不能停止运行), 符合最新的机构报表情况(因为会影响到资金清算入账,所以很重要)

2. mybatis的$和#

比如 select name from user where ${column} = #{value},jdbcType=VARCHAR}(先暂且不谈sql注入啥的,我只是举个简单例子来说明) 首先它们都会被替换为mapper中传入的参数的具体值, 但是有个区别, #内的参数会被mybatis预处理, 有点类似jdbc的preparedStatement中的?, 就像我这个例子中的描写的一样,最终`value`参数会使用双引号来修饰,使得其在sql中表示为一个字符串. 而${column}它是不会进行预处理,或者说进行转义的, 它会直接将column参数包含的内容替换到这个sql语句中.

3. 数据库的优化? 索引怎么创建?

数据库优化如果指的是查询优化,那么我的个人经验总结如下(根据体系结构从上倒下来讲):

- 作为数据库使用者,还非数据库开发者, 最显而易见的道理就是, 我查的少了速度肯定就快了. 在实际开发中, 我遇到不少抉择, 是再查一遍数据(只需增加少量代码), 还是修改多处java代码把数据重新传进来(需要改动很多地方,从开发者角度出发,产生了极度的抗拒心理). 我认为这也算是一种优化, 我应该恪守DRY原则, 不重复获取数据,并且争取在一次业务逻辑中就获取到所需的数据,不多查也不少查. 真正想去完成到这一点其实很难. 很多时候由于项目周期紧,所以很容易打破这个原则,采用比较暴力的方式去获取.

- 在sql层面上, 最重要的优化思路就是重构查询方式, 但是mysql不是静止不变的东西,所以不同版本,对于sql的重构方式也不经相同, sql解析器和查询优化器的行为不是我能掌控的, 因为我没看过源代码,也不是其开发人员. 幸运的是, 这个优化思路可以说是在长远来看不会变的, 针对不同的情况, 我们可以将我们的sql重构,来达到更快的效果, 比方说现在被大多数人所认同的 用JOIN替代子查询的方式就是一种优化思路. 子查询虽然更容易理解,但是在基准测试上会发现其性能不如JOIN的形式. 其他还有很多sql优化思路,比如切分查询,分解关联查询等等.

- 使用索引, 分表等等

- 理解数据库的内部机制,比如通信协议数据包定义是否还能继续优化,查询优化器怎么运作的, 如何配合他使得我的sql更加高效的运作, 或者说有能力的话对其进行改造,. 这一层次的优化思路对开发人员的要求特别高, 一般来说对于忙碌(菜)的应用开发人员来说是不太可能的. 或者说分配给数据库更多的可用内存空间等等

- 文件引擎层面, 我们的数据最终是需要存到存储器中的, 那么想加速, 提高硬盘IO速度也是很关键的一环, 最快的当然是直接跑在内存中.


索引如何创建?

CREATE INDEX indexName ON mytable(username(length));?

4. 数据库的引擎? 以及区别

首先说到数据库的引擎, 一般指的是Mysql的存储引擎, 而不是Oracle. 因为Mysql的体系结构中,从上到下大致分四层, 第一层就是我们应用开发人员一直接触的一层, 就是连接池组件, 第二层可以算是Mysql的控制层,里面包含sql分析,sql优化器,缓存组件等等, 这一层的任务不是查数据,而是处理应用开发人员的各类sql语句,并根据既定的优化方案去制定如何查询数据, 第三层便是Mysql的存储引擎, 由于Mysql制定了存储引擎规范, 所以我们可以自定义存储引擎的行为来得到我们需要的查询效果(本人并没有自定义存储引擎的任何经验),所以世界各地不同地方的编程大牛或者公司都开发了自己的存储引擎, 最著名的应该就是InnoDB, MyISAM以及Memory引擎(拿出来作对比,因为其数据都存在内存中,和别的存储引擎区别明显). 第四层是就是文件引擎了,真正持久化数据的地方.

而Oracle的体系结构没有这个特点,所以没有引擎这种说法, 但是其内部的数据存储机制,换句话来说其实也是一种"引擎"

Mysql引擎的区别我觉得总结起来有几点核心的技术点:

- 如何存储数据? 是存储在文件硬盘中还是存储在内存中,或者存储在其他存储器上. 比如InnoDB和Memory的区别, Memory的数据都是存储在内存中, 好处显而易见,内存中操作数据的速度是最快的

- 是否支持事务? 我们知道事务的好处是, 万一中间的某个sql执行失败, 就全部失败, 不会影响数据库已有数据. 当我在进行数据迁移的时候, 对事务的距离是最近的, 编写数据迁移脚本的时候, 我个人水平有限, 没法一口气写出毫无错误的代码, 所以使用事务已经是一个必须品了(不过也要注意DDL和DML, 当使用DDL语句,比如CREATE,DROP,ALTER的时候,由于表本身结构要变动,所以变动前会隐式提交事务, 这一点一定要非常注意,我以前在数据迁移的时候遇到过这个问题,导致了严重后果,花费了更多的时间去修复). InnoDB就是支持事务的一个存储引擎, 而MyISAM则不支持事务. 支持与不支持, 我觉得好与坏,一切都要根据实际. 因为事务逻辑, 必将导致InnoDB写更多的代码去实现事务, 这也就会降低InnoDB的执行效率,因为它要处理的事情变多了. 从这一点上也可以很好的解释为什么MyISAM的查询速度通常都比InnoDB表现要好

- 索引类型的区别,换句话说, 它们是如何想办法查数据的,数据的组织方式是怎么样的. InnoDB采用的是主键索引(也就是聚集索引)为主,非聚集索引为辅的模式, 我们可以抽象成, 它把所有数据构建成了一个B+树, 利用B+树的特点, 做到快速定位. 而MyISAM最大的特点也许就是全文索引了,同时它将数据和文件分开存储, 所以采用的是类似非聚集索引的机制(后者能不说则不说,毕竟我自己用的很少)

又比如InnoDB支持外键约束, 而其他常见Mysql的存储引擎不支持

5. 聚集索引和非聚集索引的区别?

简单来说, 在Mysql中存在聚集索引这种说法, 聚集的意思其实就是, InnoDB它将数据和索引放在了一起,抽象成了一颗B+树, 叶节点上存放了所有的行数据, 所以叫聚集. 

而非聚集的意思是, 数据和索引它是分开的. 比如InnoDB的普通索引(非主键索引)都是非聚集索引, 这些索引自身构成了一个B+树, 并且叶节点上存的是主键索引对应的值(理解为存的是一个指针,或者说引用). 拿到这个引用后,再去主键索引的那颗B+树上搜索到对应的行

6. 怎么和第三方或APP交互?

- 交互的大前提是, 两台计算机必须可以进行网络互联, 简单来说就是可以进行TCP或者UDP连接(Socket则是这些连接协议的一个抽象层,方便开发人员使用的), 随后在TCP基础上,数据包内容按照HTTP协议规定的格式(目前使用最广的TCP/IP通信协议)进行传输数据. 

- 我们的业务数据都是放在http请求的报文体中的, 目前来看json格式是最流行的一种方式, 因为应用层上有很多优秀的解析库支持, 且json数据易读, 方便沟通.

- 最终请求会根据url地址 被转发器代码分配到不同的业务逻辑代码中进行处理,并返回

这样便完成了一次简单的第三方或者APP交互(也可以举支付宝对账文件的例子)

7. 会单元测试吗?

说实话, 我的单元测试的思维只停留下, 比如使用Junit 测试下我的一些我不太确定的函数是否运行正常,输出对不对,会不会报错等等. 或者使用框架的单元测试框架 比如Spirng-test对我刚开发的一个controller方法进行测试.

但是一些普通的 我感觉很自信的地方, 我都不会去写专门的单元测试代码. 毕竟写单元测试代码也是一种时间的开销, 如果原代码出现问题, 那么你还必须同时修改单元测试代码的逻辑. 

所以对于这一块, 我仍然存在一定的迷惑, 不知道面试官可以说一点自己的见解

8. 经常使用的集合?

list有ArrayList,LinkedList, 简单通用性能中肯, 如果插入频繁,量大的话 我会用LinkedList,因为不需要做扩容. 如果读取操作比较多的话,会使用ArrayList, 总而言之要根据不同情况使用.

Set有HashSet,当我不希望有重复数据的时候使用,但是实际用的很少,因为重复数据基本不会出现在java业务层面上; TreeSet, 当我希望进行自动排序的时候会用.

Map有HashMap, 效率高, jdk8后碰撞几率低,真的碰撞了还会用红黑树来降低查询时间复杂度. 如果存在并发操作map的场景的话, 会使用ConcurrentHashMap代替; TreeMap, 当我需要对key做排序的时候使用

CopyOnWriteArrayList 没用过,但是CopyOnWrite是个很不错的编程思想

若需要考虑线程安全, 则都会对应使用相关的线程安全实现类, 或者使用同步转换方法

9. 用到SpringCloud的哪些组件?

没用过SpringCloud

10. 用的什么开发工具?

个人毕业开始就一直用的InteliJ idea, 用它的好处是, 总是能第一时间支持框架的最新功能, 界面风格更喜欢

大学期间用的是Eclipse

代码编辑器一直再用Vscode, 有良好的插件社区, 能当半个IDE使用

11. 有用到定时器吗?

有, 但是不知道您问这个问题具体含义是什么呢? 目前来看我使用定时器并没有踩到过什么坑, 他们都很好的在工作

12. redis主要场景使用?

- 做缓存, 因为全是内存操作,读写性能优异, 且支持过期时间设置

- redis不同于Ehcache Memchache 它有多种存储数据结构,而不是单一的String, redis支持使用存储list,而且可以从前后端进行操作, 可以用于实现消息队列. 又比如有序set, 可以用于实现一些排行榜热度榜功能; 

- redis的部分指令是原子性的, `incr`, 这样就可以用于做一些简单的计数器功能, 比如浏览数, 播放量等等

## 面试当天流程记录

发我的面试邮件突然说地址错了,更改地址, 所以我判断这肯定有点猫腻, 有可能存在邮件造假风险

说好的两点钟, 结果居然没有提前,反而是延迟了9分钟才下来..

ok, 人下来了, 准备进行第一场社交面试,管他是黑是白, 反正我就是个半斤八两但是愿意干活的人

待会不要紧张, 不要以为面试官有多厉害, 回答好自己知道的就行了, 同时也不要关心自己说的语气啥的, 慢慢说就行了

面试官一开始有两个, 但是面着面着有一个出去了. 

面试问的问题还算可以, 但是有些东西我确实没答上来(感觉面试前HR给的题目我回答的都特别棒, 但是没给的题目我就回答的不是特别好了)

我回答的特别不好的有: 

1. 知道消息中间件吗, 它有什么作用?

2. 知道axios的底层是什么吗? 我说了ajax, 然后他说是promise. (https://segmentfault.com/a/1190000006708151 + https://www.jianshu.com/p/c09916018f3d)

3. vue里的三个点是什么 ...(主要是写了ES6,结果导致他问了,结果我没复习好,加上本身用到es6的语法就很少)
    https://forum.vuejs.org/t/vue-form/29440

4. 微服务,分布式,SpringCloud 这三个都问了, 我没接触过,所以都没回答

5. oracle三大范式(https://blog.csdn.net/Daniel_Chen_/article/details/53482663)

6. springboot的properties文件或者yaml文件是怎么读取的(https://blog.csdn.net/jlh912008548/article/details/81437036 + 建议自己读一下源码)


最后面试官觉得我数据库这块说的还是蛮好的, 感觉面试官非常和蔼, 让我面试体验很棒, 虽然已经被筛掉, 但是整个面试过程对我来说获益匪浅


## SpringBoot是如何读取properties文件或者yaml文件的

SpringBoot启动时, 先创建SpringApplicationContext, SpringApplicationContext在初始化阶段, 会从spring.factorys文件中读取初始化器和监听器, 其中有一个ConfigFileListener, 当Enviromet类准备完毕后. 会调用ConfigFileListener的一个回调方法onApplicationEnvironmentPreparedEvent, 这个方法会去搜索默认位置下的配置文件内容以及profile的内容, 并将他们也加载到Environment中

Environment是SpringBoot存储运行时所有配置资源的地方, 后期SpringBoot获取properties文件或者yaml文件的配置,都是从这个类中读取的

## vue的promise

https://segmentfault.com/a/1190000006708151 + https://www.jianshu.com/p/c09916018f3d

总结来说: 
当遇到多次回调的时候, js代码会变因不同开发人员的习惯, 写出不同的臃肿代码, 不美观且不宜读, 这种叫做回环金字塔或者回调地域问题. 

而promise是es6标准的一部分, 它将异步回调进行的统一, 使得开发人员拥有了统一的编写异步回调的语法, 遵照promise可以让我们的异步编程代码更规范更合理

promise使用了三种状态pending, resolve, reject来统一管理回调执行时期, 同时使用then函数和catch函数分别处理正常回调和异常回调(then函数也可以处理异常,只不过为了更合理,写在catch函数中更好)

# 仍需了解的知识

消息中间件RabbitMQ, springcloud+dubbo, oracle或者mysql的存储过程,函数编写, db2数据库使用

zookeeper, kafka, webservice, lua, nginx, elasticsearch,


# 浙江承志信科技有限公司面试流程

面试官题目:

1. 抽象类和接口的区别

抽象类通常作为一种骨架实现，为各自子类实现公共的方法, 包含了公共的基类行为, 减少了代码重复性, 提高了代码可重用

此外(我的个人见解), 抽象类的这种能力, 其实我们也完全可以使用一个非抽象类的父类去实现, 在父类中也可以为各自子类实现公共的方法. 但是这就好比正式与非正式的区别, 当你使用抽象类语法的时候, 其他开发人员可以一目了然的知道, 这个类包含了基类的公共方法, 为我们实现某个接口提供了一个骨架实现. 而如果你写的是一个普通的方法, 你可能还需要写注释去解释类的行为目的.

接口是一种行为约束, 一种规范, 使得声明和实现解耦 , 提高了代码灵活性, 比如jdbc是java官方提出的接口, 随后不同的数据库厂商对其进行了实现, 当想换另一个数据库的时候, 不需要修改大部分代码(因为它们和实现是解耦的), 只需要修改使用的实现类即可

接口类体现了自然界“如果你是……则必须能……”的理念

我认为，抽象类和接口的区别在于使用动机。

使用抽象类是为了代码的复用，是具体开发后会考虑的事情
而使用接口的动机是为了实现多态性,声明和实现解耦,是具体开发之前做的事情, 

接口就像领导分配职位和职位要求, 这样的话, 后续想要替换某个职位的人员, 就找相应职位的其他人员即可(解耦,组件化,多态)
而抽象类就像一个职位的一个代表, 当领导不知道如何具体讲述一个岗位该干什么的时候, 便挑一个代表出来, 告诉大家这个代表知道所有的基本工作内容, 大家可以学习借鉴(代码复用)以及创新(重写)


2. 谈谈你熟悉的设计模式

3. 对Spring的理解, IOC, AOP

# 久久基因

1. 二分查找

2. 实现String的indexOf

3. 伪代码实现生产者/消费者模式

```java
//生产者消费者伪代码
Producer p;
Consumer c;
LinkedList buffer;
Boolean door = true;//true = open , flase = close

void produceItem(){
    if(closeDoor()){
        if(buffer.size >= max){
            sout("is full, i can take a rest now");
            openDoor();
        }else{
            buffer.add(Item);
        }
    }else{
        sout("door is close, i am waiting"); // sout = System.out.println
    }
}

void comsumeItem(){
    if(closeDoor()){
        if(buffer.size != 0){
            buffer.remove(Item);
        }else{
            sout("nothing to do!");
        }
        openDoor();
    }else{
        sout("door is close, i am waiting");
    }
}

void synchronized closeDoor(){
    if(door){
        door = false;
    }
    return door;
}

void openDoor(){
    if(!door){
        door = true;
    }
}

main(){
    //Thread A
    while(true){
        produceItem();
    }

    //Thread B
    while(true){
        comsumeItem();
    }
}
```


4. 单点登录

- 什么是单点登录

单点登录(SSO, Single Sign on), SSO的定义是在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统。

- 为什么要单点登录

针对企业多套不同系统提供统一的登录方式, 提高用户的使用体验. 简单来说就是为了方便, 一把锁可以开同一个公司的多个门, 而不是每次开个门都要换一把锁

- 如何实现单点登录

同域:
如果你的所有域名地址都是同域的, 比如app1.a.com, app2.a.com, 那么可以使用cookie和session就能够实现单点登录
在不同的后台server中进行session的共享, 同时将sessionid存至顶级域cookie中, 比如存至a.com中(cookie的存取是按照域来划分的,它无法跨域获取,比如你如果是a.com的系统,是无法获取到baidu.com的cookie的). 这样如果你在app1.a.com中登录, 那么当你在app2.a.com中登录的时候,发现已存在cookie,所以就直接发送这个cookie内容给app2的后台, 而app2的后台从共享session中获取到了由app1存取的session, 于是验证成功,登录完成

不同域:
如果是不同域, 那么cookie就没法用了,因为cookie是无法跨域访问的, 这时候就必须使用另一种方式, token的方式.
专门分配一个sso服务用于登录, 比如sso.a.com, 当访问app1.a.com的时候, 会先跳转至sso.a.com进行登录, 要求输入用户名和密码,并返回一个唯一的token, app1拿到这个token后, 发送给后端sso进行验证, 验证无误后, 记录登录状态, 并成功登录. 随后访问app2的时候, 也是一样跳转到sso.a.com进行登录, 但由于之前已经登录过, 所以这次就直接返回token给app2, app2拿到后也进行一次验证, 无误后,直接登陆成功.


# 鸿程系统

1. mysql分页
https://zazalu.space/2019/08/28/mysql-pagination-optimization-1/

2. mybatis的statement要素 

比如<select> 我们最常见的属性有:

- id, 唯一的标识符，可以被用来引用这条语句。

- parameterType, 指示传入参数的类型, 我自己最常用的是传入map,  这个参数可以不选, 因为mybais可以通过类型选择器(TypeHandle)进行判断

- resultType 或者 resultMap, resultMap对应自己定义的<resultMap>我觉得适用了大部分情况, 也可以使用resultType, 对应指定相应的pojo类

- flushCache, 如果设置为true, 则会清除一级和二级缓存, 一个在特殊需求下会很好用的设置

- useCache, 设置为false, 则会取消这个statement进行二级缓存, <select>是默认为true的

- timeout, 超时时间

3. vue的生命周期

beforeCreate 和 created
在这俩个钩子函数执行的时候，并没有渲染 DOM，所以我们也不能够访问 DOM，一般来说，如果组件在加载的时候需要和后端有交互，放在这俩个钩子函数执行都可以，如果是需要访问 props、data、method 等数据的话，就需要使用 created 钩子函数

在 mounted 钩子函数中可以访问到 DOM

在 destroy 钩子函数中可以做一些定时器销毁工作，了解它们有利于我们在合适的生命周期去做不同的事情。

4. 常用的io类

- 字节流 File(Buffered)Input(Output)Stream
- 字符流 BufferedWriter和BufferedReader, PrintWriter和PrintReader

看下我写的Java基础.md中的I/O部分


# 其他

1. simpleDataFormat 高并发下存在问题

由于SimpleDateFormat不是线程安全的, 导致多个线程使用同一个SimpleDateFormat实例的时候, 会因为状态变量共享导致异常报错

解决方法: 使用ThreadLocal包装,使得每个线程对应一个实例. 但是这样如果线程很多的情况下又会创建太多的SimpleDateFormat实例, 这时候你可以使用DateTimeFormatter, LocalDateTime(jdk8)去代替, 不过线程安全其实也就意味着要做控制,所以我认为性能可能会低于前者

2. 常见的线程安全集合类

Vector HashTable

ConcurrentXXX, CopyOnWriteXXX


# 非技术类问题

1. 为什么离职

- 工作不在浙江,父母不愿意
- 出差过久
- 自己原因

2. 为什么那么久没有再工作

- 自己原因

3. 你觉得你的优点 你的核心竞争力是什么

- 处境不容乐观, 但是依旧开朗
- 前后端,测试,生产全都熟悉,会写数据接口, 会搞整一点系统架构, 有长期单人驻场开发经验, 有很好的沟通能力
- 深知自己以前的缺点, 不卑不亢, 踏实干事