---
title: 函数式编程范式初探-Java-第二天
tags: FunctionalProgramming
categories: IT
date: 2019-10-21 19:52:49
---

## 前言

昨天, 我花了一点时间, 从各种函数式编程的教学资料和各类函数式编程相关的出版书籍中吸取精华, 编写了[函数式编程范式初探-第一天](https://zazalu.space/2019/10/20/learn-FP/)

很幸运, 今天没有加班, 所以今天早点回家编写第二篇有关函数式编程的文章!

第二章的内容主要是围绕Java8的函数式编程的相关语法
- Lambda
- FunctionalInterface(函数式接口)
- MethodReferences(方法引用)
- Closure(闭包)

以上就是本章的主要内容, 同样的, 本文的内容为个人总结, 不保证全部正确.

## Lambda

Lambda表达式提供了一种简洁的方式去表示单方法接口(只有一个方法的接口)的实现函数

They provide a clear and concise way to represent one method interface using an expression. 

### 从我们熟悉的Runnable接口说起

Runnable接口是我们进行多线程编程的一个常用接口, 并且它是一个`单方法接口`, 只有一个run方法

我相信大家或多或少的写过如下的Runnable代码

```java
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("hello");
    }
};
```

在这几行代码里, 有多处代码其实在每次编写类似功能的时候, 都是必须带上的, 比如 `@Override`, `public void run()`, 甚至`new Runnable`

这些重复代码, 在以前的java项目代码中是随处可见的, java的coder们也已经早已习惯了这种语法(包括我)

不过作为开发人员来说, 要有一颗, 从不做重复劳作的心.

在这里 `@Override`, `public void run()`, 甚至`new Runnable`是重复的, 我们就可以使用Lambda表达式来去除这种重复性, 请看下面的代码

```java
Runnable r = () -> System.out.println("hello");
```
可以看到, 使用Lambda表达式, 我们将代码缩减到了一行, 并且每一个字符都有它的意义, 我们没有做任何重复劳作 , fantastic!

当然Lambda表达式的存在除了能够去除重复性代码外, 还有一个比较有趣的说法

Lambda表达式的起源是`λ演算`, 而λ演算中, 就用常常用到一个类似`->`符号, 所以Lambda表达式使用了这个符号, 下面是Lambda表达式写法的一个简单总结图

<img src="/images/tmpImage/lambda.png">

Lambda的语法非常简单, 我会在下面展示各类Lambda表达式写法, 你要做的只是多看, 多看, 就会记住了

### Lambda表达式的魔法

刚刚我们看到了Runnable的实现代码通过Lambda表达式改写后, 代码非常精简, 那么其中到底发生了什么魔法呢? 

可以肯定的是, 上面的例子中, `() -> System.out.println("hello")`的写法替代了整个匿名实现类的写法

但是Java并不是简单的通过语法控制来使得这种写法不会报错, Java通过引入一种叫`FunctionalInterface(函数式接口)`的模式, 来支持Lambda表达式的语法

前面我说的`单方法接口`, 其实就是`函数式接口`, 接下来为了统一, 我就都用函数式接口来说明

### 函数式接口

函数式接口的概念很简单, 就是一个单方法的接口实例, 比如Runnable, 就是一个典型的函数式接口

java的设计者还专门提供了一个注释类来标注函数式接口, `@FunctionalInterface`, 我们打开Runnable的实现代码就能发现它:

```java
//↓↓↓ 对函数式接口的特殊标注
@FunctionalInterface
public interface Runnable {
    /**
     * When an object implementing interface <code>Runnable</code> is used
     * to create a thread, starting the thread causes the object's
     * <code>run</code> method to be called in that separately executing
     * thread.
     * <p>
     * The general contract of the method <code>run</code> is that it may
     * take any action whatsoever.
     *
     * @see     java.lang.Thread#run()
     */
    public abstract void run();
}
```

不仅如此, java设计者还给我们提供了一个叫`java.util.function`的包, 这个包中内置了大量的函数式接口, 如果我要在这里全部介绍它们, 就或许有点费时费力, 不过幸运的是, 有人对其进行了一定的总结, 我先把它贴出来, 大家可以看看就好, 不需要自己去记, 需要的时候检索下即可

<img src="/images/tmpImage/FunctionInterface_1.png">
<img src="/images/tmpImage/FunctionInterface_2.png">

想必看到这一堆东西, 大家已经开始头疼了, FP是为了简洁而生的, 怎么感觉还是一大堆设定呢? 

先别急, 因为我上面只是列类似API的东西, 所以肯定一次性列的比较全

事实上, 我们平时用的时候, 就只用到里面的其中一种, 而且常用的就那么几个.

我们拿Function<T,R>举例, 下面是它的实现(源自jdk8, 为了节省篇幅, 我去掉了注释):

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    //default关键字是jdk8的新关键字, 被它修饰的方法可以不需要实现类进行实现
    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    //静态方法
    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

也许你开始产生疑问, 不是说函数式接口是单方法接口吗, 这个Function怎么拥有那么多方法.

其实函数式接口只要求只有一个强制要求实现的方法就行了, 在这里唯一一个强制实现类必须实现的方法是`apply`方法

接下来说说我们怎么直接利用这个Function<T, R>函数式接口

通过研究方法签名, 我们知道了apply方法接收一个泛型T, 返回另一个泛型R, 所以我们可以写出如下这样的代码去直接用它

```java
Function function = a -> "Hello, " + a;  //a -> "Hello, " + a这个Lambda表达式就是apply方法的实现
System.out.println(function.apply("zazlau")); //打印Hello, zazlau
```

在这里我们使用Lambda表达式结合函数式接口, 做了一次简单的配合, 写出了一个非常小巧的程序

而如果按照原本的写法, 我们需要写下面这样的代码: 
```java
//我们需要先自己定义一个接口
interface MyFunction<T, R> {
    R myApply(T t);
}

//然后使用匿名内部类进行实现
 MyFunction function = new MyFunction() {
    @Override
    public Object myApply(Object o) {
        return "Hello, " + o;
    }
};
System.out.println(function.myApply("zazlau")); //打印Hello, zazlau
```

我的天呐! 人生短暂, 我选择函数式编程....

函数式接口的内容就暂时介绍到这里, 对于学习来说, 已经足够了, 但是`java.util.function`包中还有许多东西可以拿出来聊聊, 我会以后的文章中继续完善它.

### 自定义函数式接口

自定义函数式接口非常的简单, 其实我们刚刚已经不知不觉完成了, 我们把上面MyFunction接口稍微加点点缀

```java
@FunctionalInterface
interface MyFunction<T, R> {
    R myApply(T t);
}
```

大功告成! 这就是自定义函数式接口, 真没什么好说的!

为什么要有自定义函数式接口? 那肯定是因为`java.util.function`包提供给你的不够用造成的!

### Lambda表达式例子

通过前面的学习, 我们已经掌握了不少Lambda表达式的语法, 不过也还有一些需要我们学习的, 下面列出的代码中全部进行了列出

```java
// [1] h, 代表入参, 名字可以随意取, 这里省略了括号, 
// h + " No Parens!"是返回内容, 注意这里省略了return, 实际上是{return h + " No Parens!"}
h -> h + " No Parens!"; 

// [2]和第一点的区别是这里括号没有省略
(h) -> h + " More details"; 

// [3]无入参的情况
() -> "Short info";

// [4]两个入参的情况, 必须加括号
(h, n) -> h + n;

// [5]当方法体有多行的时候, 则必须加上花括号, 不能省略了.
h -> {
    int i = 1;
    i++;
    return h + " No Parens!";
}

// [6]当你不想省略return的时候, 也必须加上花括号
h -> {return h + " No Parens!";}
```

### Lambda表达式的递归

其实正常来说Lambda表达式是不能递归的, 因为Lambda表达式没有函数名, 但是java是个神奇的语言:), 请看下面例子:
```java
interface IntCall {
  int call(int arg);
}

public class RecursiveFactorial {
  static IntCall fact;
  public static void main(String[] args) {
    fact = n -> n == 0 ? 1 : n * fact.call(n - 1); //递归!
    for(int i = 0; i <= 10; i++)
      System.out.println(fact.call(i));
  }
}
```

好吧! 上面的写法确实通过定义一个域fact, 给我们的Lambda表达式间接的附上了一个名称! 

我自己试了下, 要写递归代码, 则必须按照上面这样写, 十分苛刻! fact必须是static的!

**[注意]**: 大家还可以关注下尾递归这玩意.

## 总结

这一章, 我仔细说明了Java的函数式编程中的Lambda和FunctionalInterface, 由于时间不早了, 明天要加班, 后天继续来填坑!
