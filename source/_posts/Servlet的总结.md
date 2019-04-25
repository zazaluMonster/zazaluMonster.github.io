---
title: Servlet的总结
tags: JavaWeb
categories: IT
date: 2019-04-24 13:52:41
---

一篇对JavaWeb的Servlet的个人理解

<!-- more -->
## 什么是Servlet

---

servlet是运行在web服务器上的小型Java程序（即服务器端的小应用程序），servlet通常通过HTTP接收和响应来自web客户端的要求

我所熟知的是关于httpservlet的使用。不要觉得知道了http servlet，但是却不知道https的相关使用。其实https只是http的一层安全包装而已，底层使用的还是一样的东西。所以并没有https servlet这个说法

本文不会阐述servlet的使用。因为会使用和懂是两码事，比如你知道枪如何使用，但是你知道枪的内部运行原理吗？

所以本节将努力的将Servlet的工作原理解释清楚，希望学习web开发的读者也可以用心去理解，虽然不需要你去掌握，但至少理解是必要的。

## Tomcat基本知识

---
对于学习web开发的我们来说，tomcat那是再熟悉不过的东西了。简单来说，tomcat就是一种servlet容器，就好比手枪，手枪有很多种，tomcat就像一种手枪，里面装的“子弹“就是我们要讲的servlet。这小节我会阐述下什么是tomcat，tomcat怎么样，tomcat能干什么

作为web开发人员来说，知道tomcat，那么肯定也知道apache。

Tomcat现在是Apache 软件基金会（Apache Software Foundation）的Jakarta 项目中的一个核心项目。由Apache、Sun 和其他一些公司及个人共同开发而成。（Java开发人员不知道Sun的人可以去死了）

Tomcat的特点

* 免费，开源，清凉，很适合我们学习人员的使用。
* 它内含了一个单独的Http服务器，它也可以被视作一个单独的Web服务器。但是如果说只是将Tomcat用于单独的web服务器，那么在一些有速度和事务处理有要求的情况下来说是不利的，他没有其它完备的web服务器功能那么牛逼，比如（Apache服务器？）所以Tomcat常常会讲其中的Servlet引擎配合其它web服务器使用。
* Tomcat实现了对Servlet和JavaServer Page（JSP）的支持，所以Tomcat内部有一个Jsp编译器（Jsper模块），用以将JSP编译成一个Servlet。这里就不得不说JSP的九大隐含对象了，request，response，pageContext，session，application，config，out，page，exception

Tomcat简单来说就是可以作为一个简易的web服务器，你可以将你的站点放置在Tomcat上，由Tomcat进行管理。
## Tomcat的总体架构

---
讲完了Tomcat的一些基本知识，接下来说说Tomcat的总体架构

一个好的软件是需要非常模块化的，tomcat也不例外，我们先了解了Tomcat的总体架构，那么再对其中的一部分一部分进行分析，我想作为一个web开发人员，你掌握了这些，也可算是合格的一员了。

先给出一张tomcat容器模型图
{% img https://www.ibm.com/developerworks/cn/java/j-lo-tomcat1/image001.gif %}

可以看到一个tomcat下可以有很多个Service服务。

Service可以说是一个接口，实现它的标准类是StandardService
{% img https://www.ibm.com/developerworks/cn/java/j-lo-tomcat1/image002.png %}
{% img https://www.ibm.com/developerworks/cn/java/j-lo-tomcat1/image003.png %}

所以说一个Service服务，其实就是一个StandardService的实例进程。

那么我们可以说说一个StandardService在干嘛呢？从上图的方法名就可以知道，比如setContainer,setServer,addConnector（这些Container和Connector后面会重点讲，先别急）
这些方法其实可以说是对Container和Connector等相关初始化工作

是的，Service其实就是Container和Connector的一个外部包装，专门负责Container和Connector之间的管理。比如一个Connector要将request和response传递给Container，就是需要Service的帮忙。

那么Service由谁来管理呢？ 233，也许你会脱口而出，“由tomcat管理”。哈哈，tomcat其实只是一个名字而已，真正管理Service的肯定也是代码呢。

细心的同学应该会发现，之前有一个setServer方法，那么Server是谁呢？ 我想聪明的你肯定猜到了，对Server就是管理Service的。Server类中有一个addService方法，用于添加Service。

ok，说到这里，我想大家应该对Server和Service有了大致的了解，那么接下来就来说说有关Service内部的事情。

---

我们知道Service里面包含有Container和Connector，简单来说Connector是负责接收浏览器的发过来的 tcp 连接请求
，然后将其信息封装为Request和Response，将其传递给Container处理（在一个子线程中执行Container，主线程依旧等待新的tcp请求）

ok，我想大家应该知道Container和Connector之间的关系了吧，那么接下来说说Connector是如何工作的

Tomcat5 中默认的 Connector 是 Coyote，这个 Connector 是可以选择替换的.（至今也仍然在使用Coyote，此外是可以替换的，也说明了Tomcat模块化很好。是的，模块好真的很不错！其实减轻了不少开发人员的负担，可以更好的分配工作）

###### 首先呢Connector如何接受tcp请求？ 

嗯，交给Socket呗，不多讲了

###### 其次呢Connector是如何管理多个请求的？多线程体现在哪里？

你可以理解为一个while循环，检测一个信号量，如果有请求来了，会改变这个信号量，从而进入while循环内部，然后就会进行一次有关操作了。

同时主线程继续等待，等待新的请求进来。

###### Connector如何处理一次请求的

Connector处理一次请求，靠的是两个类的运作，HttpConnector和HttpProcessor

HttpConnector用于等待新的请求，有新的请求后，就会转交给HttpProcessor处理，HttpProcessor的process方法，会将tcp请求的信息封装为对应的Request和Response实例

最后这个Request和Response就会转递给Container，而转递的任务就是之前讲的Service的工作了。

---

理解了Connector的工作原理后，我们就来讲讲Container的工作原理吧

我们还是先来看看container容器的内部模型图

{% img https://www.ibm.com/developerworks/cn/java/j-lo-servlet/image002.jpg %}

可以看到一个Container内部有Engine，Host，Context还有Wrapper。ok，还是简单之上，我们其实不需要了解的很细，只要知道其每个部分都在干什么就行了

###### Engine容器
首先一个Container里有一个Engine容器，这个容器比较简单，它只定义了一些基本的关联关系，初始化和它相关联的组件，以及一些事件的监听。一个简单的Servlet，也许根本不需要Engine这一层的管理

---
###### Host容器
从英文单词上看就知道，host代表主机，不过host容器可以有多个，所以如果对web开发比较熟悉的人，应该就知道了，host其实就代表虚拟主机的意思。对，所以说其实一个host容器就代表一个站点哦！ 比方说，我想再建立一个站点，但是我不需要再去找一个web服务器重新设置我的站点，我只需要建立一个虚拟主机，虽然url看上去不一样，但是其实请求都是有同一个container再处理数据哦。

---
###### Context容器
Context代表Servlet的Context，它具备了Servlet运行的基本环境，理论上只要有Context就能运行Servlet了。简单的Tomcat可以没有Engine和Host。

所以简单来说，Context用于管理Servlet！

---
###### Wrapper容器
Wrapper 代表一个 Servlet，它负责管理一个 Servlet，包括的 Servlet 的装载、初始化、执行以及资源回收。Wrapper 是最底层的容器，它没有子容器了，所以调用它的 addChild 将会报错。

所以说一个Context容器里可以有很多个Wrapper，我们每次在web.xml中注册一个Servlet的时候，就会相应的建立一个Wrapper哦

---

## Servlet的工作原理

---

##### Servlet的初始化流程

我们之前有提到Context容器就是Servlet的居住地，里面的Wrapper就代表一个Servlet。（ps：Wrapper只是一层Servlet的封装，为了将Servlet和tomcat分开，因为tomcat是tomcat，而servlet则是另一个领域模块，意思就是说，也许今后会有更厉害的servlet改装版本，然后这个改装版本就可以直接装入wrapper类中，体现了低耦合，高内聚）

要执行一个Servlet的相关方法前，我们肯定要先实例化Servlet，由Context容器来实例化Servlet，那么我们就先从Conetxt的初始化讲起

Context容器的初始化可以看两大部分

1.ContextConfig 的 init 方法将会主要完成以下工作：

* 创建用于解析 xml 配置文件的 contextDigester 对象
* 读取默认 context.xml 配置文件，如果存在解析它
* 读取默认 Host 配置文件，如果存在解析它
* 读取默认 Context 自身的配置文件，如果存在解析它
* 设置 Context 的 DocBase

2.ContextConfig 的 init 方法完成后，Context 容器的会执行 startInternal 方法，这个方法启动逻辑比较复杂，主要包括如下几个部分：

* 创建读取资源文件的对象
* 创建 ClassLoader 对象
* 设置应用的工作目录
* 启动相关的辅助类如：logger、realm、resources 等
* 修改启动状态，通知感兴趣的观察者（Web 应用的配置）
子容器的初始化
* 获取 ServletContext 并设置必要的参数
* 初始化“load on startup”的 Servlet

这其中是很复杂的，但是我现在主要任务是让大家理解总体脉络，细节部分也不是我们应该掌握的

既然Context容器的初始化工作完了，那么接下来就要解析一个web应用了。我们知道一个web应用的一个重要的配置文件叫web.xml。所以说，接下来Context容器就会去解析web.xml文件，有Servlet就想应的调用wrapper的相关方法，初始化，创建Servlet等。所以说 Context 容器才是真正运行 Servlet 的 Servlet 容器。一个 Web 应用对应一个 Context 容器。

###### Servlet实例

上文所讲的，我们就已经做完了所有Servlet的初始化工作，接下来我们就要在应用启动的时候，实例化对应的Servlet了。Tomcat在实例化Servlet的时候，是按照有需求再实例化的逻辑的。不过其实这样是不好的，因为如果一个servlet的内容过去庞大的话，在初始化的时候就会需要大量的时间，那么这个初始化时间对于使用这个wen应用的客户来说就是一个blank的盲等待，过场的等待会让客户很生气的，毕竟电脑上的等待10秒，相当于等地铁30分钟呢。所以说，我们要尽量设置load-on-startup属性，这个属性设置后，Context容器就会在Tomcat启动的时候对相应的Servlet进行一次实例化

Servlet实例化的工作由Wrapper完成，Wrapper简单的调用Servlet的init方法，对Servlet进行初始化。（当然这里还可能初始化的是一个jspServlet，不过道理一样，不多说了）

---

## Servlet的体系结构

---

{% img https://www.ibm.com/developerworks/cn/java/j-lo-servlet/image010.jpg %}

从上图可以看到，和Servlet有关的类有ServletRequest，ServletResponse，ServletConfig，ServletContext

Request和Response我们就不多说了，这个学过Servlet的使用后就一定会接触的

ServletConfig，可以说是具有这个Servlet的相关配置信息的类

而ServletConetxt，则有这个Servlet所寄居的Contetx容器的相关信息，具体信息都请查阅相关API接口

---

## Servlet如何工作

---
一个请求到来后，如何知道这个请求要去哪个Servlet里进行相关操作呢？

这个分配去向的任务很简单

将url解析，映射到对应的Container容器，Container容器获取到的request里带有mappingData属性，这个属性是mapper类根据这次请求的 hostnane 和 contextpath 将 host 和 context 容器设置到 Request 的 mappingData 属性中的。所以request进入到Conetxt容器里时候，就会知道自己该去哪个wrapper里了！

---

## 总结

Servlet的所有工作流程已经总结完毕，有对其中部分不理解的地方，可以对这个部分进行google的关键字搜索了解更多的知识！

友情链接：

* https://www.ibm.com/developerworks/cn/java/j-lo-servlet/
* https://www.ibm.com/developerworks/cn/java/j-lo-tomcat1/
* http://www.tqcto.com/article/web/51385.html
