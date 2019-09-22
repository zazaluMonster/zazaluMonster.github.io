---
title: resume
date: 2019-08-19 12:46:21
---

>个人信息

何镓钧

浙江绍兴上虞人, 毕业于西安电子科技大学软件学院

曾就职于福建联迪商用设备有限公司, 担任java系统软件开发工作

手机：18767578219
QQ：451558654
微博：自由之翼
Email：hejiajun1432@gmail.com; 451558654@qq.com
GitHub: https://github.com/zazaluMonster

生为IT魂, 死为IT骨

> 项目一览

### 银行商户收单系统和一码付后台管理系统

#### 项目概述

1. 为黄河银行提供一码付聚合支付平台，包括了扫卡支付，微信支付，支付宝支付，银联一闪付

2. 为黄河银行提供一码付聚合支付平台的资金清算业务, 包括对账，清算，入账(T+1)系统

3. 为黄河银行提供一码付聚合支付平台的面向行内员工和面向商户的两套管理系统

#### 项目网络拓扑图

[查看大图](https://zazalu.space/images/tmpImage/huanghe.jpg)

<img src="/images/tmpImage/huanghe.jpg">

#### 我负责的内容

1. 功能开发与维护
      后端：
      -商户申请，商户审核(多级审核机制), 机构管理, 行内用户管理 
      -手续费管理, POS出入库管理, 码牌管理
      -资金对账清算入账系统(T+1)
      -移动端APP接口开发, 对接文档编写
      -根据银行提的数据修改单，编写过sql脚本来修改相关数据，比如机构撤并
      前端：
      -整合银行密码控件
      -优化旧版本的扫码支付页面(利用VUE.js)
      -各类JSP页面根据新需求进行调配修改，有效提高了页面可理解性，使得操作员更容易上手
2.  担任银行驻场现场技术支持
      -管理部署测试环境, 配合银行测试人员提供后台支持, 灵活开发,比如配合银行核心的资金划拨进行联调测试
      -负责排查生产环境的问题并及时解决, 比如排查不同层级员工查看同一商户显示内容不一致等问题
      -负责审查新需求和改动的需求, 把控需求不会走偏超出项目需求书的范围

### 一个SpringBoot+Vue的简易微博系统

#### 项目概述

一个拥有注册/登录, 会话管理, 发博, 转发, 评论, 点赞及在线聊天的微博系统

github地址: https://github.com/zazaluMonster/MyIona

在线地址(目前已失效): http://47.111.146.215:8080/MyIona/

#### 项目技术说明

1. 使用SpringBoot2搭建后台Server
2. 使用Vue2搭建前端用户界面
3. 使用Websocet实现实时性高的功能，比如在线聊天
4. 使用Redis存储临时数据，用户session，利用incr的原子性操作，计算点赞数
5. 使用MySQL数据库

#### 项目网络拓扑图

[查看大图](https://zazalu.space/images/tmpImage/MyIona.jpg)

<img src="/images/tmpImage/MyIona.jpg">


> 经历一览

### 福建联迪商用设备有限公司 系统软件开发 2017-07 - 2018-12

1. 公司现有系统和工具库的优化维护, 添加新工具等
2. 银行一码付收单系统的开发和维护, 银行驻场开发
3. 获得过公司内部的优秀新人奖, 说明具备了一定的责任心, 较强沟通能力, 能主动工作, 学习和适应能力强

### 个人私活项目组 2019-01 - 2019-03

原公司离职前就受前领导邀请，为他的个人项目组工作, 是一个接私活的小团队. 项目架构几乎和前公司一致, 业务也类似, 做了2个月后, 由于家庭原因, 家长要求还是回浙江,不想在外头,故离开了

### 日本旅游 2019-03 - 2019-04
进行了一次日本旅游, 算是圆了大学时候的愿望, 让我有了更广的见识和经历

### 自我充电 2019-05 - 至今
由于之前的公司项目技术比较老旧, 不太符合现在的招聘要求, 所以为了不被面试官怼的太惨, 我进行了一段时间的自我充电, 这段时间主要输出项目有

1. 我的个人电脑的shell工具, 用于提高我在ubuntu上做软件开发的效率, [sys-info-manager](https://github.com/zazaluMonster/terminal_costomizi_sh)

2. 纯JavaSE实现的Java网络爬虫应用, 组件式, 可以通过替换组件来实现不同的爬虫效果, [MySpider](https://github.com/zazaluMonster/MySpider)

3. 使用SpringMvc为爬虫应用做了Web应用,方便查看, [MyBelfast](https://github.com/zazaluMonster/MyBelfast) 

4. SpringBoot+Vue的简易微博系统, [MyIona](https://github.com/zazaluMonster/MyIona)


> 技术一览

技术 | 使用频率
--- | ---
Java|常用
JavaScript|常用
Linux-Shell-bash|常用
Mysql|常用
Maven|常用
Git|常用
Vue|熟悉
Spring相关|熟悉
MyBatis(-Plus)|熟悉
Oracle|会
Redis|会
Nginx|会







