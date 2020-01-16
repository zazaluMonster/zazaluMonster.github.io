---
title: Java流式编程-第二章
tags: 流式编程
categories: IT
date: 2019-10-28 20:38:38
---

## 前言

用ubuntu18.04有一段时间了, 最近发现开机越来越慢了, 而且系统有很明显的一段预热期, 是时候对ubuntu开工优化了, 把Java的流式编程搞定后就开工.

这对于我来说一定是一个艰巨的任务, 因为我几乎对ubuntu系统没有任何了解, 安装也是按照网上的各种攻略配合自己的一点拙见知识, 所以这是一个挑战, 我希望我不会因太麻烦而半途而废

今天继续梳理Java流式编程的知识.

上一章, 我主要回答了为什么要掌握流式编程.

今天开始, 我们就抛开所有的为什么要吃掉流式编程(利益驱动), 把重点放到StreamAPI本身的语法学习上来(语法学习完后我还会写一篇研究底层实现的文章, 来专门讲解Stream的底层是怎么实现的, 比如你一定好奇foreach的底层是怎么搞的, 其实foreach底层是用到了while循环哦, 只不过写法比较神奇, 循环的主体逻辑代码是在while条件里的!而while本身的循环主体是空的!黑人问号!)

## StreamAPI的语法结构

StreamAPI有一个非常明确的语法结构, 这结构简单来说就是分为三个部分, 或者说三个阶段, 或者说三个操作类型

1. 流创建

2. 流处理(中间处理, 会将流数据进行各种改造并向下传递)

3. 流终端处理(结束操作, 使用流数据进行各类操作, 不再传递流数据)

## 流创建

接下来列举jdk给我们封装好的所有的流创建案例:

### Stream.of()创建一个流

of方法接受任意数量的类, 然后返回一个以这些类为数据的流

```java
import java.util.stream.*;
public class StreamOf {
    public static void main(String[] args) {
        Stream.of(new Bubble(1), new Bubble(2), new Bubble(3))
            .forEach(System.out::println);
        Stream.of("It's ", "a ", "wonderful ", "day ", "for ", "pie!")
            .forEach(System.out::print);
        System.out.println();
        Stream.of(3.14159, 2.718, 1.618)
            .forEach(System.out::println);
    }
}
```

### 从Random类获取随机数流

```java
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Random rand = new Random(47);

        //创建一个含2个数的int流, 然后forEach循环打印一下
        rand.ints(2).forEach(System.out::println);
        //创建一个含无数个数的int流(因为我们没有做数量控制), 然后forEach打印一下, 该行代码会使程序一直运行, 所以我注释掉了, 这里只是为了展示
        // rand.ints().forEach(System.out::println); 
        //创建一个含2个数的long流
        rand.longs(2).forEach(System.out::println);
        //创建一个含2个数的double流
        rand.doubles(2).forEach(System.out::println);

        /**
         * 输出(由于是随机数所以你得到的结果和我是不同的)
         * -1172028779
         * 1717241110
         * -8652529054300476342
         * 2955289354441303771
         * 0.18847866977771732
         * 0.5166020801268457
         */
    }
}
```

在上面的代码中, 我提前使用了`forEach`方法, 这个方法属于`流终端操作`方法, 由于其太过于常用, 以至于我提前就拿出来使用了. forEach方法的用法很好理解, 它接受一个函数式接口方法, 比如我们这里传入的是System.out的println方法, 所以流中的每个函数都会执行一次System.out.println(x), 这么说我想再笨的你也应该能理解了.

回到正题上, 上面阐述了4个创建随机流的方式, 随机流的创建就只有这些, 其余的顶多只是一些重载函数, 我在下面也一一列出:

```java
 // 控制上限和下限：
rand.ints(10, 20);
rand.longs(50, 100);
rand.doubles(20, 30);

// 控制流的大小和界限
rand.ints(3, 3, 9);
rand.longs(3, 12, 22);
rand.doubles(3, 11.5, 12.3);
```

几乎没有什么难度! 非常好理解!

不过这里有一个点我可以讲一下, 那就是比如`rand.ints();`, 这行代码我也说了是创建包含无数int值的随机int流, 按正常来说这里编译器应该会报错, 因为无限意味着内存溢出. 

但是编译器非常老实的允许我们这么做, 这是因为这一切都是懒加载的, 我们在这只是声明了流, 流并没有真正把数据"流"出来.

**[注意]**: 也许每次记忆这种API会让我觉得无聊和无趣, 甚至觉得会陷入学习的误区. 所以我现在喜欢往深入看看. 这次我发现Random的这些方法的都是用StreamSupport这个类的相关API来支持的. 比如产生int流, 就是 StreamSupport.intStream

### Arrays工具类的stream()方法

Arrays工具类新增了stream方法, 用于将一个数组转化为一个Stream,

```java
Arrays.stream(new int[] { 1, 3, 5 })
    .forEach(System.out::println);
```

很简单, 就不谈了!(虽然这个我估计会很常用, 但是真的没什么好讲的)

### 正则表达式的splitAsStream()方法

这个也很简单, 看代码你就理解了

```java
Pattern.compile("[ .,?]+").splitAsStream("awdawdjald, wdaawd, dwadadw,!dwad 1");
```

splitAsStream就会根据正则控制返回一个流

###　XXXStream的range()和concat()

记忆API总让人无趣和感觉愚蠢, 所以Stream的API方法的都几乎采用了非常易于理解的API名字, 比如range和concat.

有一定开发经验的开发人员, 一般凭感觉就可以猜到, range会产生范围的流, concat应该是拼接两个流的内容

而答案确实也是这样的, 我们还是拿最熟悉的IntStream类来说明

```java
// 使用流:
System.out.println(IntStream.range(10, 20).sum());//输出145, 也就是10~20之间所有int值的总和
```

这里提前介绍了sum方法, 不过我们并不介意这些, 我们要知道的是range这个方法, 它也是一种`流创建`函数

我们继续稍微深入下底层, 我们发现底层依旧是StreamSupport.intStream方法再产生int流, 看来我们未来探究底层实现, 是少不了分析这个方法了, 不过今天我们只是普通的学习了API, 不进行深入

接下来是演示下concat的用法,也比较简单, 比如

```java
System.out.println(IntStream.concat(IntStream.range(1,3),IntStream.range(4,6)).sum()); //12
```

concat接受两个流, 并且将其进行合并返回一个新流的操作, 至于是按照什么顺序组合的新流, 我觉得这个你自己用的试试使用.forEach(System.out::println)将流的内容打印一下, 应该就知道了, 就不谈了

我这里都在使用IntStream进行介绍, 你也可以自己尝试LongStream, DoubleStream等, 你也可以直接使用Stream<T>, 只不过由于没有具体到某个类型, 所以Stream类是泛型类

**[注意]**: 我列举的永远是比较常用的, 其他的API的使用是我们必须举一反三自己去探索的, 本文起到的作用是让你快速上手, 不会因API的说明文档突如其来的一些单词而一脸懵逼.

### XXXStream的generate()方法

刚刚我们上面讲了一大堆产生流的方法, 但是都是局限于数字类型的. 在现实的开发项目中, 这显然是不够用的. 

generate方法为我们提供了产生自定义类型的流的方式.

下面的代码, 我们就源源不断的产生Dog类, 并不停的打印Dog.

```java
class Dog{
    @Override
    public String toString() {
        return "汪!";
    }
}
public class Main {
    public static void main(String[] args) {
        Stream.generate(() -> new Dog()).forEach(System.out::println);// Dog类源源不断的产生(注意自行阻断程序哦)
        //汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!汪!....
    }
}
```

generate方法接受一个Supplier函数(如果你在java中对于参数接受一个函数的说法感到十分陌生, 那么说明你应该去补一下我写的Java函数式编程系列), Supplier函数的特点就是返回一个类T, 在这里我使用Lmabda表达式快速的传递了Supplier的实现类, `() -> new Dog()`就是Supplier的实现, 在这里我直接调用Dog的构造器并返回, 所以传递给generate方法的就是一个个Dog类, 所以最终在流中的数据都是Dog类, 所以forEach方法不停的打印Dog类, 而Dog类的toString方法被我重写成打印一个"汪", 所以最终控制台会不停的输出"汪"

### XXXStream的iterate()方法

接下来我们说说iterate方法, 顾名思义, 这是一个迭代方法, 那么它到底迭代什么? 答案是迭代流中的数据, 下面的例子就不停的迭代流中的数字, 每次+1, 只要代码一执行, 流中就会不停的存储1,2,3,4,5,6,7,8,9,10,11,12....不停的增长下去.

```java
public class Main {
    public static void main(String[] args) {
        Stream.iterate(0, i -> ++i).forEach(System.out::println);//注意自己阻断函数执行
    }
}
```

iterate的第一个参数是种子, 它会被传入第二个参数函数, 作为第一个数开始迭代, 第二次函数触发时候会传入上一次函数return的结果. 在这个例子中每次都会return比上次大1的数, 所以整体效果就是不停的产生1,2,3,4,5,6,7,8,9,10,11,12....这样的流

### builder()方法

在builder方法面前, 前面的方法创建流都只能说是弱爆了!

builder()方法会返回一个Builder, 然后我们就可以通过add()方法给这个流传入各种各样你喜欢的东西! 并且由于Builder抽象出来了, 所以可以把它传到不同的地方, 收集不同的数据, 想想就觉得很不错!

```java
public class Main {
    public static void main(String[] args) {
        //1 你也可以写一长串, 因为
        Stream.builder().add(1).add(2).add(3.0).add(4.22).build().forEach(System.out::println);
        //2 你可以像下面这样先得到Builder, 然后到处add!
        Stream.Builder sb = Stream.builder();
        sb.add(new Dog());
        sb.add("ddd");
        sb.add("dddd").add("wdwd");
        Stream stream = sb.build();//最后通过build方法产生一个stream
        stream.forEach(System.out::println);
    }
}
```

## 流处理(中间操作)

在上面一个阶段中, 我们已经知道了流创建的大部分API, 但是我们上面的例子中, 流只是产生然后循环打印, 并没有做一些中处理, 这一节我就来说明一下大部分的处理API, 流也正是因为这些处理API的存在才体现出它真正的价值

由于中间操作的API很容易理解, 它们的总体逻辑都是, 将流中数据做某中处理然后返回新的流, 有些处理不会影响原来的流的数据, 而有些会改变原有流的数据

下面我列举了所有常用的中间操作! 每个方法的使用都写了注释说明! 
```java
public class Main {
    public static void main(String[] args) {
        Stream.iterate(0,i -> ++i)
                .skip(10) // 越过前10个数据
                .limit(10) //限制只取前10个数据
                .map(w -> w + "") //map将流中数据做处理转换
                .peek(System.out::print) //查看流中数据, 不进行任何其他操作
                .sorted(Comparator.reverseOrder()) //对流中数据继续排序
                .distinct() //排除重复数据
                .filter(i -> {
                    if(!i.equals("")) {
                        return true;
                    }else{
                        return false;
                    }
                }) // 过滤掉等于""的字符串
                .flatMap(i -> Stream.of("Gonzo", "Fozzie", "Beaker")) //将"Gonzo", "Fozzie", "Beaker"组合到新的流中, 注意原来的流的数据由于我没用到所以就这么没了, 全部变成了"Gonzo", "Fozzie", "Beaker"
                //.mapToInt(Integer::parseInt) //转换成IntStream, 类似的还有mapToDouble, mapToLong, 不过由于我这个流的数据已经无法解析成int了, 所以这行有运行时错误, 我先注释掉了
                .forEach(System.out::println);
    }
}
```

## 总结

这章主要学习了流创建和流处理的中间操作!

由于时间不够啦, 所以今天就先到这里

<!-- 在此处插入License模块，若不需要请删除 -->
<div id="licensePoint">