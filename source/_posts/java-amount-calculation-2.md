---
title: 面对涉及金额计算的需求,我该如何应对(二)
tags: Java高精度计算
categories: IT
date: 2019-09-27 11:29:32
---

## 前言

上一章 [面对涉及金额计算的需求,我该如何应对(一)? ](https://zazalu.space/2019/09/25/java-amount-calculation/)

我主要讲了Java层面如何做到高精度的计算

本章我们继续探讨数据库(mysql为例)中如何正确保存我们的金额

其实我们的目的很简单, 一是存储到数据库中的数据必须是能保证精度的数据类型, 而在mysql中能够保证精度的有`DECIMAL`或者`NUMBER`, 两者是一致的没有区别, 都是用字符串存储. 或者使用`INT`,`BIGINT`等, 这两个虽然是二进制存储, 但是因为不含小数, 所以不会出现精度问题, 缺点是还需要额外维护`scale`, 如果是国内, 直接除以100的做法也是常见; 二是保证可扩展性以及保证空间不要浪费, 这个其实是非常灵活的一种需求, 需要我们对自己项目所用到的情况有非常深的理解, 最后才能确定使用多少空间去存储.

事前声明: 本文只是阐述我个人的想法, 是本人通过各类网上查阅别人的解决方案后总结的成果, 并不是我自己的亲身使用经验, 所以请阅读者带有自己的思考, 多问为什么.

## 第一种方式 - 使用DECIMAL存储金额

网上讨论什么数据类型去存储金额做了非常多的讨论, 但是绝大部分的答案都会指向使用`DECIMAL`, 这是个非常有力的答案, 因为Mysql官方都建议我们使用`DECIMAL`来存储需要精度计算的数字数据. Mysql官方的原文如下:

>The DECIMAL and NUMERIC types store exact numeric data values. These types are used when it is important to preserve exact precision, for example with monetary data.

原文地址: https://dev.mysql.com/doc/refman/5.7/en/fixed-point-types.html

使用DECIMAL存储金额是一种比较通用的形式, 因为很多成熟的数据库, 都使用这个关键字来作为高精度计算数据类型的名称, 它的存在本身就是为了提供准确的精度计算服务. 由于底层由字符串存储, 和`float`,`double`这种近似值数据类型有本质上的区别, 因为浮点数类型底层由二进制存储, 它无法正确显示0.1, 只能存储其近似值, 这个知识点我们在第一章也明确的进行了说明.

### 如何使用DECIMAL?

就算我们懂得了`DECIMAL`来存储金额这件事, 我们还需要面对第二个问题, 那就是如何确定一个比较好的DECIMAL精度. 

`DECIMAL`有两个输入参数, 一个是精度precision, 还有一个是小数位数scale, 比如我们定义`decimal(19,2)`, 在mysql(后续内容全部已mysql为准)中它代表了19为的长度, 小数位只有2位的十进制数字. 需要注意的是这个19代表总长度,它包含了小数点.

一般来说precision我们可以定义为19就可以完全满足大部分金额的需求, 比如`decimal(19,2)`, 那么它支持的最大数额是9999999999999999.99, 这个数额差不多是9999千亿元, 注意我的单位是千亿. 如果还不够你可以加大大小 , 不过需要注意decimal最大长度是65(出自mysql官网,The maximum number of digits for DECIMAL is 65)

scale的长度定义是更加要注意的事情, 目前来看很多人喜欢定义2位小数! 但是我们作为程序员要身怀全球化开发的大志, 稍微了解下其他国家的币种, 你会发现2位是不够的, 为了减少后期需求变动导致2位不足的情况, 其实可以使用4位小数, 比如Bahraini, Jordanian, or Kuwaiti Dinars都是在使用常常有3位小数的币种的国家.

### Mybatis中获取写法

说完了精度和小数位数的设定, 最后我们还要了解下从mysql数据库读取到java, 这个过程该如何处理, 由于国内Java常见的orm框架是mybatis, 我在这里就不聊jpa或者hibernate或者其他orm框架了, 这里只说明mybatis如何正确读取. 

在mybatis中, 读取decimal类型数据有一种万能的写法, 就是`jdbcType=NUMERIC`. 如果你觉得这样看不出数据类型具体是啥, 那么你可以这样写`jdbcType=DECIMAL`, 然后java类型使用`java.math.BigDecimal`接收即可!

##　第二种方式 - 使用INT或者BIGINT存储无标度值的金额

另一种常见的方式是使用2个字段分别存储金额(类似BIgDecimal的底层原理), 一个字段使用`INT`或者`BIGINT`存储无标度值的金额, 比如18.134, 保存为18134, 这里提出`BIGINT`代替`INT`是因为可能部分场景`INT`不够你用, 而`BIGINT`基本不用担心(可以看看[这篇文章](https://segmentfault.com/a/1190000005124246)对这些数据类型重新回顾下).然后使用另一个字段,比如scale保存为3, 这样我们从数据库取出来后,就可以知道是18.134了. 这些操作在精度上是不存在问题的, 所以也是一种可行方案.

比较值得一提的是,如果只是针对RMB, 你甚至可以不需要保存scale, 默认在程序中做除以100的操作就行了, 也就是针对到分即可.

到此为止, 网上最流行的方案就是这两种形式, 接下来我们来探讨下到底哪种更好

## INT vs DECIMAL

现在我们开始讨论这两种方式到底哪种更优秀

从空间上来说, INT是胜利的, 因为DECIMAL所需的空间很大

从性能上来说, 这是一个没法很好定夺的问题, 因为我一直坚持要比对性能, 必须结合实际情况做对应的基准测试, 才能得到自己的结论, 所以这里我就卖个关子, 不回答性能问题.

从开发复杂度来说, 我认为是DECIMAL简单, 因为直接封装到BigDecimal类中可以直接使用, 而INT还需要做除法操作来移动小数点位置.


## 在JS层面如何展示

最后再来说说JS吧, 在页面上我坚持是只传String过去即可, 这样对于前端工程师来说, 他们不用担心显示出现精度问题, 因为是String的格式. 此外JS做精度计算最好移动到后台处理, 是在巴不得以, 可以使用别人的计算库比如math.js做处理, 减少我们自己编写出现精度问题的几率!

由于我个人偏后端, 所以前端展示这块不是很熟悉, 就不多扯了.

本系列到此结束

<div id="donationPoint">

<div id="licensePoint">