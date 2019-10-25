---
title: 函数式编程范式初探-Java-第四天
tags: FunctionalProgramming
categories: IT
date: 2019-10-25 20:12:44
---

## 前言

我们继续昨天的话题, 昨天讲到了高阶函数, 但是只介绍了消费函数的方式, 也就是方法参数带有一个函数的方式, 遗漏了生产函数的方式.

由于今天要分析闭包的概念, 对于闭包的概念, 我以前只停留在匿名内部类上, 而且以前的理解我觉得太过机械, 没有想到点子上

而在函数式编程中, 高阶函数产生函数的过程中, 也会有产生闭包的情况发生.

所以在此之前, 我先来阐述下高阶函数产生函数的方式

## 高阶函数-产生函数

产生函数的意思就是一个函数会return一个函数, 比如下面这样:

```java
class ProductMethod {
    //makeFun会返回一个Function函数!
    Function<String, String> makeFun() {
        return n -> "hello, " + n;
    }
}

public class Main {
    public static void main(String[] args) {
        ProductMethod p = new ProductMethod();
        Function<String,String> f = p.makeFun();//生成一个函数, 将引用交给f变量
        System.out.println(f.apply("zazalu"));// hello, zazalu
    }
}
```
我想已经不需要再解释什么了, 一切都发生的非常顺利. 

这就是产生函数.

## 闭包

### 为什么要有闭包这个特性

和消费函数不一样, 消费函数时, 我们是将`函数`带进了函数, 是新数据进入了函数对应的内存中, 所以不涉及闭包.

而当函数产生一个新`函数`的时候, 新的函数是可以携带原函数的数据出去, 也就是携带函数内存中的数据到其他内存空间中使用(你可以这么简单理解)

从这个过程中, 显然后者的方式存在风险, 所以才有了闭包.

闭包可以使得数据就算被带出去了, 也是安全的

### 引用类变量不算闭包

我们知道, 函数可以引用的数据, 无非就两种, 一种是global的变量, 比如类变量; 一种是局部的变量, 比如方法内部定义的局部变量

在java中, 有global性质的变量应该就只有类变量了, 我们先看看下面的程序:

```java
public class Closure1 {
  int i;
  IntSupplier makeFun(int x) {
    return () -> x + i++;
  }
}
```

i变量是Closure1的类变量, i变量是对应存在类的内存空间中的, 这时候makeFun方法产生的函数`() -> x + i++`内部虽然用到了i变量, 但是i变量对于这个函数来说, 不管在哪里都是能正常访问到的, 所以不需要进行闭包操作.

### 局部变量需要闭包支持

那么什么情况下需要闭包呢? 看下面的代码你就知道了:

```java
public class Closure2 {
  IntSupplier makeFun(int x) {
    int i = 0;
    return () -> x + i;
  }
}
public class Main {
    public static void main(String[] args) {
        Closure2 c = new Closure2();
        c.makeFun().getAsInt();//makeFun函数已经结束, 其内存空间内的数据应该会被垃圾回收, 但是产生的函数中依旧可以正常使用i, 没有产生编译错误
    }
}
```

最魔法的地方出现了, 按照我们的知识体系来看, 当执行完makeFun方法后, 方法对应的内存空间应该很快会被回收, 所以返回的函数`() -> x + i`, 照理说应该不能再成功获取到i值才对, 所以这里编译器应该报错才对! 但是实际上并没有报错, 为什么? 因为`闭包`

闭包, 你可以想象成, 它将i变量绑定到了产生的新函数`() -> x + i`上, 也可以说是`() -> x + i`捕获了i变量, 所以闭包的另一种术语叫`变量捕获`

但是魔法这种东西肯定是虚假的, 事实上是如何实现的呢? 

事实上, 当i被函数`() -> x + i`捕获后, i变量就会被默认定义成`final`变量了, 而final变量我们都知道, 属于常量, 其内存空间是在常量池中的, 而不是普通的堆空间了, 所以就算makeFun函数结束了, 其对应的内存空间被回收了, 但是常量池是不会被对应回收的(除非i完全不可达), 所以这一切就变得合理了! 所以编译器允许了你的操作

### java8的Effectively Final

刚刚我说到了final变量, 但是对于不知道java8的新特性`Effectively Final`的玩家来说, 也许已经开始慢头疑问了.

`Effectively Final`是一种新的特性, 编译器会智能的知道哪个变量自始至终都没有被改变, 并在编译的时候将其同final变量相同处理

在java8以前, 我们编写匿名内部类的时候, 有用到外围的,但是是局部变量的情况, 是必须要加上final修饰的, 在java8后是不需要的, 不信你可以试试呢

### 闭包的变量操作

就拿上面的例子来说, 闭包内, i变量是不能改动的, 因为它是final的
```java
public class Closure3 {
  IntSupplier makeFun(int x) {
    int i = 0;
    return () -> x + i++;//报错
  }
}
```

不过在这里, 编译器的处理还是存在魔法的, final值得不能改变, 事实指的是指向的引用不能变, 所以当你操作一个集合的时候, 是可以任意改变集合内容而不报错, 如下面这样:

```java
public class Closure8 {
  Supplier<List<Integer>> makeFun() {
    final List<Integer> ai = new ArrayList<>();
    ai.add(1);
    return () -> ai;
  }
}
```

## 总结

今天花了一点时间彻底搞痛了闭包, 我们的函数式编程的学习也马上就要告一段落了!

明天是周末, 有更多的时间了, 会把剩下的一些函数式编程知识讲掉, 随后开始新的坑(中间我自己会进行一些实战, 实战内容都会在github上, 这里就先不贴了, 希望看到这里的你也可以马上找个实际项目试试, 使用函数式风格进行下代码重构)

<!-- 在此处插入License模块，若不需要请删除 -->
<div id="licensePoint">