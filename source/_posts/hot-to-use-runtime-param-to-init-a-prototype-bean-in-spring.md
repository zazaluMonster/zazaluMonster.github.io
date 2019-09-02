---
title: 在SpringBoot中使用运行时参数注入到多例Bean中的一个简单解决方案
tags: Bugs
categories: 计算机
date: 2019-07-26 21:56:12
---

# 场景说明

在某些情况下，我希望我的Bean是多例的(大部分正常情况下Bean单例足矣)，因为这个Bean有一个状态变量，每次我希望它在new的时候可以初始化为不同的值，这个值取自运行时。

# 问题

直接采用set的方式？ 不可行，由于IOC容器高度管理化，想在Spring框架下做如此open的操作是不行的，因为你能操作的只是代理类罢了。

# 解决方案

0. 为你的Bean创建一个带参构造器(用于赋予运行时参数)

```java
public Bean(String args1, String args2) {
    this.field1 = args1;
    this.field2 = args2;
}
```

1. 在你的控制器层获取IOC容器(调用非默认注入方法的途径)

```java
@Autowired
ApplicationContext applicationContext;
```


2. [借助BeanFactory的getBean(String name,Object... args)](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactory.html#getBean-java.lang.String-java.lang.Object...-)


```java
applicationContext
    .getBean("bean",
    args1,
    args2));
```
# 支持版本

Spring 4+

# 吐槽

Spring对于这一块的支持代码不够优雅，或者说有更好的方式，只不过我没发现？
