---
title: 函数式编程范式初探-Java-第三天
tags: FunctionalProgramming
categories: IT
date: 2019-10-23 19:41:41
---

## 前言

刚下班, 挺疲劳和悲催的, 今天上班遇到几个不爽的问题, 最终导致本来今天能完成的事, 没完成, 本来想着早点完成可以摸摸鱼, 现在在担心明天能不能做完(要求是周五必须完成)

上班的问题归上班, 现在下班了, 继续我们的函数式编程学习

上一回我记录了Lambda表达式的相关知识, 接下来来聊聊另一个东西, 叫`MethodReferences-方法引用`

## MethodReferences-方法引用

同样的, 方法引用的最终效果和Lambda一样, 可以极大的简化我们的代码.

顾名思义, 方法引用, 意思就是我们可以直接引用一个方法, 这在面向对象编程思想里是没有的概念, 在面向对象概念里, 引用的一般都是对象

### 传统方法实现方法引用

假设我们现在有一个接口`MyCall`,

```java
interface MyCall {
    int call(int arg);
}
```

然后我们现在如果要面向接口编程的话, 必须赋予一个实现类引用给他, 比如下面这样

```java
class MyCallImpl implements MyCall {
    @Override
    public int call(int arg) {
        return 0;
    }
}
public class Main {
    public static void main(String args[]) throws Exception {
        MyCall myCall = new MyCallImpl();
        myCall.call();
    }
}

```

总结一下就是, 传统方式我们要用一个接口去使用的时候, 是必须再编写一个实现类(或者编写匿名实现类)的, 你没办法直接引用其他和call方法签名一样的方法的, 什么意思?

我继续举例子, 比方说我们的项目里就有一个类叫`MyCallClone`, 它本身就已经实现了一个和`MyCall`的call的签名一模一样的方法, 如下:

```java
class MyCallClone {
    public int call(int arg) {
        return 0;
    }
}
```

可以看到`MyCallClone`的call方法的方法签名和`MyCall`的call方法是一致的, 都接收一个int参数, 返回一个int值.

所以对于我们来说, MyCallClone的call方法我们如果可以直接拿来用就好了, 而不是再写一个实现类去做重复劳作(这里假设MyCallClone由于项目要求, 不能实现MyCall接口,或者说MyCallClone是lib包里的一个类, 你没法直接进行改动)

`方法引用`就可以在这里大显神威了

### 方法引用的威力

我们现在将上面的例子, 用方法引用的方式去改写后, 代码会像下面这样, 我们此时已经不再需要MyCallImpl():

```java
public class Main {
    public static void main(String args[]) throws Exception {
        MyCallClone myCallClone = new MyCallClone();//必须实例化一个MyCallClone
        MyCall myCall = myCallClone::call;
        myCall.call(1);
    }
}
```

可以看到我们省去了MyCallImpl, 直接使用方法引用, 将MyCallClone的call方法, 引用给了MyCall

这就是方法引用最基本的用法

### 未实例化的方法引用

细心朋友应该发现, 前面的例子, 用方法引用必须先实例化一个MyCallClone出来才能使用, 那么能不能直接使用呢?

答案是能, 但是与此同时, MyCallClone的call方法必须是静态方法才行

```java
class MyCallClone {
    public static int call(int arg) { //加了static修饰
        return -1;
    }
}
public class Main {
    public static void main(String args[]) throws Exception {
        MyCall myCall = MyCallClone::call;
        myCall.call(1);
    }
}
```

如果你已经理解了静态方法, 那么这里你也应该能够理解为什么, 我就不多费口舌了

### 构造函数的方法引用

我们知道构造函数也是一个方法, 只不过是一种特殊的方法

所以构造函数也能够使用到方法引用:

```java
class Dog {
  String name;
  Dog() { name = "stray"; }
  Dog(String nm) { name = nm; }
}

interface MakeNoArgs {
  Dog make();
}

interface Make1Arg {
  Dog make(String nm);
}

public class CtorReference {
  public static void main(String[] args) {
    MakeNoArgs mna = Dog::new; // [1]
    Make1Arg m1a = Dog::new;   // [2]

    Dog dn = mna.make();
    Dog d1 = m1a.make("Comet");
  }
}
```

在这个例子中, 由于Dog的构造函数的方法签名与另两个接口的make方法的方法前面可以匹配上, 所以我们可以用这种方式神奇的实例一个Dog类

### 方法引用总结

方法引用是一个非常不错的功能, 如果你现在云里雾里, 没关系, 多看几遍例子, 自己敲敲, 这里面的奥妙就会很快融会贯通了

## 高阶函数

其实lambda表达式, 函数式接口, 方法引用就是Java函数式编程的全部语法了, 不过我们说过函数式编程的一个核心概念就是函数, 我们可以将函数作为参数传来传去, 达到最大的重复利用, 提高开发效率, 所以我们不得不讲一下, `高阶函数`

### 什么是高阶函数

高阶函数（Higher-order Function）只是一个消费或产生函数的函数。

比如我们写一个消费一个函数的函数, 我使用java和js各写一份!(因为我不喜欢java的写法, 所以我在这里刻意提供一份js的写法)

```java
@FunctionalInterface
interface DingDong {
    void dingdong(String s);
}

public class Main {
    public static void consume(DingDong d){
        d.dingdong("zazalu");

    }
    public static void main(String args[]) throws Exception {
        consume(n ->System.out.println("dingdong, " + n));//dingdong, zazalu
    }
}
```

我先来说说, 这些代码在做什么.

首先我们有一个DingDong的函数式接口类(注意这里必须是函数式接口才行, 由于java不像js那样可以单独指定一个函数, java是必须用函数式接口作为介质来表达我是一个函数! 不得不说这是一种遗憾的设计, 待会我写js版本的时候你就会和我有一样的感触了), 

然后我们有一个consume方法, 这个方法接收一个DingDong函数式接口, 随后在方法体中调用dingdong方法! 

这里最神奇的魔法就是, 编译器允许我们在没有实现dingdong方法的情况下, 就可以编写调用dingdong方法的代码, 这一切都是函数式接口的作用.

最后我们调用consume方法, 使用lambda表达式传入一个函数, 这个函数`n ->System.out.println("dingdong, " + n)`就是dingdong方法的实现.

最终控制台打印`dingdong, zazalu`

总体来说, 这一切都非常的简单轻松, 用函数式语法来完成这个任务比传统的方式要简洁的多

接来下我们来看看js的写法(对js不感兴趣可以跳过)

```javascript
function dingdong(n){
    console.log("dingdong, " + n);
}

function consume(dingdong){
    dingdong("zazalu");
}

consume(dingdong);// dingdong, zazalu
```

我们可以看到js写起来是多么的简单! 毕竟在js的世界里, 函数本来就是一种对象!

从这里我们可以知道js天生就拥有对函数式编程的支持!

语言设计真的有太多意外了!

## 总结

今天我们讲了函数式编程的方法引用和高阶函数! 

不过在java的函数式编程世界里, 我们还不得不知道以下`闭包`和`函数组合`, 这些我下次下班后再总结!
