---
title: 函数式编程范式初探-Java-毕业天
tags: FunctionalProgramming
categories: IT
date: 2019-10-26 15:13:25
---

## 前言

通过前几天的努力, 总算慢慢的啃下了java函数式编程这一块肉. 在啃这块肉之前, 说实话我觉得它是臭的, 因为很多人都说java的函数式支持不够优雅, 但是通过这几天的学习, 光编写一些验证语法的demo, 都让我觉得真的很cool

只有在体验过大量重复多余的java开发后, 学习java的函数式编程才会更有感觉, 在我看来, 这完全颠覆了java代码的给人的感觉, 虽然我觉得在函数式接口那里设定的不够优雅, 但是至少Lmabda,方法引用, 高阶函数, 以及我待会要说的函数组合, 都让我感觉自己在编写的不是java, 而是在写入执行命令一样, 通过简单的类似"指令"的函数, 可以将代码精简到客观的程度!

今天我将讲下java函数式编程的最后一点知识, `函数组合`

这是一个很简单的模块, 因为它的实现是通过代码逻辑实现的, 编译器并没有做其他魔法操作

从函数组合上我们可以看到`流编程`的影子

## 什么是函数组合

顾名思义, 函数组合就是函数与函数的组合, 但是我觉得真正意义来讲, 函数组合就是函数与函数的互相配合调用, 并且利用函数式编程的语法支持, 使得函数组合可以写出一连串链式般的函数调用.

### java.util.function 接口中包含支持函数组合的方法

其实java.util.function已经帮我们实现了函数组合的常用方法, 比如`andThen()`

```java
public class Main {
    static Function<String, String>
    f1 = s -> s+",dog",
    f2 = s -> s+",cat",
    f3 = f1.andThen(f2);
    public static void main(String[] args) {
        System.out.println(f3.apply("zazalu")); //zazalu,dog,cat
    }
}
```

andThen顾名思义就是先执行什么,再执行什么, 比如上面的例子中`f1.andThen(f2);`, 就是指先执行f1, 然后执行f2

怎么样, 是不是觉得非常的直观!

但是要达到这个效果, 其背后的实现逻辑乍一看还是挺绕的, 下面是andThen方法的实现

```java
default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
}
```

我在分析下, andThen方法传入一个函数after, 然后返回一个函数`(T t) -> after.apply(apply(t))`, 这个函数我们分析下, 就是会先调用本类的`apply`方法, 也就是f1的apply, 随后将返回值送给f2的apply方法.

其他还有许多这种函数组合用到的函数, 比如`compose()`, `and()`, `or()`, `negate()`等, 下面我给另一个简单例子:

```java
public class PredicateComposition {
  static Predicate<String>
    p1 = s -> s.contains("bar"),
    p2 = s -> s.length() < 5,
    p3 = s -> s.contains("foo"),
    p4 = p1.negate().and(p2).or(p3); // 如果字符串中不包含 bar 且长度小于 5，或者它包含 foo ，则结果为 true。
  public static void main(String[] args) {
    Stream.of("bar", "foobar", "foobaz", "fongopuckey")
      .filter(p4)
      .forEach(System.out::println);
  }
}
```
 函数组合能实现的另一个原因就是, 实现函数组合的方法的返回值也是一个函数表达式, 所以可以zongjie被下一个函数组合方法直接用, 从表面上来看就会变成像上面这样, 形成一条链式反应.

 ### 柯里化

 柯里化意为：将一个多参数的函数，转换为一系列单参数函数。

 个人觉得不太需要去了解过多, 因为觉得对于我目前项目来说实用性并不高, 有兴趣的可以自己去了解

 ## 函数式编程&&Stream

 到这里, java的函数式编程的知识就差不多概括完了,

 后续, 我会讨论java8在集合上大显神威的新特性, `Stream`

 `Stream`就是利用函数是编程思想而诞生的产物, 所以使用函数是编程, 很多时候往往就是一直在使用`Stream`的API进行开发.

 等我们学习完Stream的API使用后, 我们会更加对函数式编程求知若渴, 因为曾经一度觉得繁琐的集合代码, 特别是map的遍历代码, 借助Stream的API, 可以做到简单的调用一个方法就可以解决

 ## 总结

函数式编程可以有效的简化我们的代码, 所以学习它并运用它是理所当然的, 我在一开始接触的时候, 由于最早这种函数式思想, 我是在js开发过程中有所体会, 所以对于java的写法, 就会有比较大的反感. 但是学习完后, 我觉得啃下来是正确的

<!-- 在此处插入赞赏模块，若不需要请删除 -->
<div id="donationPoint">


<!-- 在此处插入License模块，若不需要请删除 -->
<div id="licensePoint">