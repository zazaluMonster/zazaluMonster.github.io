---
title: Java流式编程-第三章
tags: 流式编程
categories: IT
date: 2019-11-06 18:51:05
---

## 前言

不知不觉6号了, 离上一次写学习记录已经好久了. 今天继续上一章的内容, 上一章我列举了StreamAPI的创建和流的中间操作. 那么今天就把剩下的也说一下.


## Optional类 - 流中数据的容器类

前面我们提到的各类流操作, 其实都是在一个流上直接操作.

现在我们有一个需求, 我们要把流中的某一个数据copy出来, 单独在外部代码域使用, 不能用collect(一个流的终端操作,专门用于将流中元素导出到一个新的集合中)

如果不知道Optional类, 你肯定会感觉无从下手.

所以我要介绍一下Optional类, 一个专门用于存储数据的类(数据的容器类container), 不过要注意的是, 它并不是专门给Stream用的, 它是java.util包下的, 所以其他情况也能使用.

### 从流中获取一个元素

很遗憾的是, 我们没法使用索引那样很方便的get到流中的数据, 不过我们可以借助skip或者limit达到一样的效果, 然后取出其中的一个元素, 就像下面这样

```java
Optional element =  Stream.of("Epithets", "Alice").skip(1).findFirst();
System.out.println(element.get()); // Epithets
```

我们使用Stream的findFirst方法获取该流的第一个元素并用Optional类包装后返回得到一个Optional类

随后使用Optional的get方法去取出其内部存储的数据, 也就是我们想要的流中的第一个元素.

除了findFirst, 我们还可以使用Stream的以下方法来获取Optional元素:

`findFirst()` 返回一个包含第一个元素的 Optional 对象，如果流为空则返回 `Optional.empty`(后面会讲Optional.empty是什么)

`findAny()` 返回包含任意元素的 Optional 对象，如果流为空则返回 `Optional.empty`

`max()` 和 `min()` 返回一个包含最大值或者最小值的 Optional 对象，如果流为空则返回 `Optional.empty`

`reduce(BinaryOperator<T> accumulator)` reduce方法有3种重载方式, 注意使用我写的这个才是返回Optional元素, 它是使用流中的前后两个元素生成一个新的元素, 并将数据包裹到一个Optional元素中返回, 这个和前面的几个方法都不太一样, 它有类似map的效果


### Optional.empty

这个其实是Stream底层对空值的处理, 当遇到空值的时候, 不会像以前一样抛出空值异常, 而是友好的用Optional.empty来代替显示, 这种设计可以有效的减少我们写的程序报空的问题发生

### Optional类的CRUD操作

作为一个数据包装类, 所以必然会有增删改查API, 这些API一个个讲未免太枯燥, 详情自己见Optional类的官方文档即可

### 流中存储Optional类的特殊情况

刚刚我们提到, 流Stream在获取某个流中元素的时候, Stream会自动将数据包装到Optional中, 所以如果你创建流的时候丢进去的就是Optional类, Stream会不会自动解包Optional的数据呢? 答案是no, 看下面的代码就明白了:

```java
Optional<Optional<String>> ele = Stream.of(Optional.of("a"),Optional.of("b")).findFirst();
```

所以这里我们有一个注意点, 就是一定要知道数据是怎么在传递的, 防止给自己增添不必要的麻烦

## 流终端处理

流的终端处理API, 这些API都不会像创建和中间处理的API一样, 会返回一个流, 终端处理API顾名思义会对流内数据做终结处理.

其实我们一开始就已经接触了一种流终端处理的操作, 那就是`forEach`

forEach的方法函数签名是这样的:

```java
forEach(Consumer)
```

传入一个Consumer函数, Consumer函数很简单, `void accept(T t);`是它会做的事情, 与Consumer方法签名完全匹配的jdk存在的方法比如有`System.out.println(Object)`, println方法接受一个函数且没有返回值. 所以我们结合方法引用的语法, 就可以写出下面这样我们已经很熟悉的写法

```java
Stream.of("a","b","v").forEach(System.out::println); // 输出a b v
```

forEach方法之所以是终端处理方法, 因为在它之后你没法继续调用Stream的API方法了, 换种说法就是它不会再返回一个新的流, 而是返回对应的处理的结果, 在它之后流的一整个处理就结束了

好了, 有了这些认识后, 我们就可以进入简单的API熟悉环节了.

### 常见终端操作

toArray()：将流转换成适当类型的数组。
toArray(generator)：在特殊情况下，生成器用于分配自定义的数组存储。

forEach(Consumer)：你已经看到过很多次 System.out::println 作为 Consumer 函数。
forEachOrdered(Consumer)： 保证 forEach 按照原始流顺序操作。

collect(Collector)：使用 Collector 收集流元素到结果集合中。
collect(Supplier, BiConsumer, BiConsumer)：同上，第一个参数 Supplier 创建了一个新结果集合，第二个参数 BiConsumer 将下一个元素包含到结果中，第三个参数 BiConsumer 用于将两个值组合起来。

reduce(BinaryOperator)：使用 BinaryOperator 来组合所有流中的元素。因为流可能为空，其返回值为 Optional。
reduce(identity, BinaryOperator)：功能同上，但是使用 identity 作为其组合的初始值。因此如果流为空，identity 就是结果。
reduce(identity, BiFunction, BinaryOperator)：这个形式更为复杂（所以我们不会介绍它），在这里被提到是因为它使用起来会更有效。通常，你可以显式地组合 map() 和 reduce() 来更简单的表达它

allMatch(Predicate) ：如果流的每个元素根据提供的 Predicate 都返回 true 时，结果返回为 true。这个操作将会在第一个 false 之后短路；也就是不会在发生 false 之后继续执行计算。
anyMatch(Predicate)：如果流中的任意一个元素根据提供的 Predicate 返回 true 时，结果返回为 true。这个操作将会在第一个 true 之后短路；也就是不会在发生 true 之后继续执行计算。
noneMatch(Predicate)：如果流的每个元素根据提供的 Predicate 都返回 false 时，结果返回为 true。这个操作将会在第一个 true 之后短路；也就是不会在发生 true 之后继续执行计算。

findFirst()：返回一个含有第一个流元素的 Optional，如果流为空返回 Optional.empty。
findAny(：返回含有任意流元素的 Optional，如果流为空返回 Optional.empty。

count()：流中的元素个数。
max(Comparator)：根据所传入的 Comparator 所决定的“最大”元素。
min(Comparator)：根据所传入的 Comparator 所决定的“最小”元素。

average() ：求取流元素平均值。
max() 和 min()：因为这些操作在数字流上面，所以不需要 Comparator。
sum()：对所有流元素进行求和。
summaryStatistics()：生成可能有用的数据。目前还不太清楚他们为什么觉得有必要这样做，因为你可以使用直接的方法产生所有的数据。

## 总结

到这里, 有关Java的StreamAPI的说明就到此为止了. 

说实话, 在我学习完这两大模块后, 我感觉Java的函数式编程, 除了Lambda表达式和方法引用需要额外理解一下外, 其他其实都没有从语法上改变多少, 说白了还是类的方法调用, 这种写法, 其实我们自己也能模拟做出来. 


<!-- 在此处插入License模块，若不需要请删除 -->
<div id="licensePoint">