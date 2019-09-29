---
title: 面对涉及金额计算的需求,我该如何应对(一)?
tags: Java高精度计算
categories: IT
date: 2019-09-25 11:30:22
---

## 前言

本文主要讨论作为JavaWeb应用程序员, 当接手涉及金额计算需求的时候, 如何确保金额计算, 金额保存, 金额显示不失真! 

如果你是其他语言的应用程序员, 本文内容可能不会立马对你有用, 但是相关知识的涉及在语言间的作用一般是想通的, 你也可以拿来作为参考

接下来我们开始正题

## 先聊聊Java层面出现的精度问题是什么

对于刚上手Java的新人来说, 涉及数字的计算, 最容易想到的是int和double(由于float的取值范围小于double, 在不是对内存要求非常苛刻的条件下, 我们一般都是用double的), 如果整数就用int, 如果带有小数就用double.

但是很快的, 你会发现double的计算结果往往不符合真正的数学计算结果, 比如执行以下代码:
```java
System.out.println(0.1 + 0.2);
```
这个结果是0.30000000000000004, 而不是0.3

这是怎么回事呢? 

### double类型计算陷阱

如果想要理解这种现象, 我们首先要明确一个大前提, 就是计算机是如何存储`0.1`,`0.2`这些值的

对计算机原理有一定了解的话, 你一定不难理解其实这些数在计算机上真正是用二进制的形式来存储的, 不仅是这些float和double这些浮点数, int值其实也是. 

这时候你可能又会冒出一个问题, 为什么同样都是二进制存储, int值的计算从来不会存在精度问题, 而float和double缺会存在.

这就要涉及到他们转换为二进制的过程中是否有截断的问题了.

float和double转换为二进制表示有一个非常致命的问题就是: 

>就像十进制无法用有限位表示1/3一样, 二进制也无法用有限的位数来表示部分浮点数, 比如0.1

下面将0.1和0.2转为2进制表示。

0.1
0.10 * 2 = 0.20 未进位 0
0.20 * 2 = 0.40 未进位 0
0.40 * 2 = 0.80 未进位 0
0.80 * 2 = 1.60 进位 1
0.60 * 2 = 1.20 进位 1
0.20 * 2 = 0.40 未进位 0
0.40 * 2 = 0.80 未进位 0
0.80 * 2 = 1.60 进位 1
0.60 * 2 = 1.20 进位 1
0.20 * 2 = 0.40 未进位 0
0.40 * 2 = 0.80 未进位 0
0.80 * 2 = 1.60 进位 1
0.60 * 2 = 1.20 进位 1
0.20 * 2 = 0.40 未进位 0
0.40 * 2 = 0.80 未进位 0
0.80 * 2 = 1.60 进位 1
0.60 * 2 = 1.20 进位 1
0.20 * 2 = 0.40 未进位 0
无限循环...
二进制表示0.1:
0.00011001100110011001100110011001100110011001100110011001...
科学记数表示：
1.1001100110011001100110011001100110011001100110011001... * 2^-4

可以看到二进制表示0.1 实际上是一个无限循环的二进制数, 既然是无线循环, 这就代表了无法用有限的空间去存储到计算机的存储容器上, 所以计算机必须对其进行截断, 最终导致在计算机上存储0.1的二进制数只存储了其中的23位(float)或者52位(double).

我想看到这里的你也许已经明白了float和double的计算失去精度的原理了, 不过为了延伸阅读, 我认为我们也应该对一个标准有一定的概念(你应该对我上面说的23位和52位提出疑问,为什么是23位,为什么是52位,而这些都与IEEE754二进制浮点数标准有关)

### IEEE754标准

绝大多数的编程语言都遵循了IEEE754标准进行浮点数的运算,

简单来说, 该标准定义了一个浮点数的表示方式为:

```
值 = 符号位 + 指数位偏移 + 尾数位
```

而我们上文中提到的一长串二进制数据,就是存储在尾数位上的(当然会做一些必要的转换,不是原封不动的), 因为该标准规定了尾数位的长度, float是23位, double是52位, 所以超过的部分都会被四舍五入进行抹除, 从而导致了精度问题的发生.


### 关于浮点数运算精度问题其他想说的

想必一般智商的人看我上面的总结, 已经可以非常容易理解精度问题发生的根源, 但是我还是想声明的是, 实际上这块领域还是需要有一定的数学基础, 数学不好的人可能会看的头晕, 并且网上针对这一块有很深入研究的论文存在, 我在阅读它们的时候由于数学知识匮乏,所以更深层次的东西没法进行总结,也不敢乱说.如果您有兴趣,则请自己通过搜索引擎进行更深入的探讨. 不过这也不代表我上面的描述是非真实的说法, 我上面的说法可以说是最通俗的说法来让我们理解为啥会出现精度问题

## Java层面使用BigInteger和BigDecimal来完成高精度计算

在Java社区中, 我们已经达成了共识, 如果希望自己所做的运算不会损失精度, 可以使用BigInteger或者BigDecimal类来做运算处理.

先提出质疑是, 必须需要使用这两个类来操作吗?

答案是: 不是必须的

只不过编写JDK的大神们已经呕心沥血帮我们完成了这两个完美的大数运算类, 我们岂有不用之理? 当然如果你的能力够厉害, 你也完全可以自己来实现高精度计算类

### 从BigInteger说起

由于BigDecimal底层有用到BigInteger, 在BigDecimal类实现第一行就出现如下代码:

```java
/**
     * The unscaled value of this BigDecimal, as returned by {@link
     * #unscaledValue}.
     *
     * @serial
     * @see #unscaledValue
     */
    private final BigInteger intVal;
```

所以我们如果想了解它们的秘密的话, 还是从BigInteger说起.

我尝试着自己阅读BigInteger源码, 但是太多的数学术语还是打败了我, 代码写的简直可以堪称神级, 所以本文对BigInteger的描述是结合java doc+网上的博文+自己看了部分源码后的总结, 我会努力保证其正确性, 从而让读者对BigInteger有个基本认识, 而不是懵里懵懂

#### 首先BigInteger是什么?

官方说明是的说明是它是`Immutable arbitrary-precision integers. `

意思就是说它是可变任意精度整数. 可能这种说法有些平时学习不好的同学已经开始懵逼了. 那我就举个例子来说把.

在Java的世界中, 所有基本数据类型都有取值范围, 取值范围的多少取决于它们底层可用多少位去存储数据. 比如我们常用的byte是由8位二进制数据组成, int类型是由32位数据类型组成, 更直观点, 请看下面的说明

```java
System.out.println(Integer.toBinaryString(1231231231)); // 1001001011000110001100011111111
```

可以看到1231231231十进制数字就是1001001011000110001100011111111的二进制数字, 只不过这里是31位,因为还有一位是符号位没有显示出来

但是现实生活中我们可能要使用更大的数去做各种计算, 这时候, java的基本数据类型不够用了怎么办, 所以就有了BigInteger. 它可以表示任意长度的十进制整数, 不过由于太长的十进制整数是不科学且无意义的, 所以BigInteger内部使用了好几个常量去专门做了一些控制. 目前来看官方文档的说明里, BigInteger可表示的范围为:`-2的Integer.MAX_VALUE次方 (不可兼) 到 +2的Integer.MAX_VALUE次方 (不可兼)`, 不可兼的意思是不包括边界值的意思. Integer.MAX_VALUE的值是2的31次方-1, 可以想象这个范围已经是超级大的! 一般的计算器都已经无法显示这个数值呢. 

#### BigInteger是如何做到可以存储任意精度的整数的

俗话说, 一个人干不了, 就两个人一起干. BigInteger的底层原理抽象来看其实也符合这句俗话的道理.

一个BigInteger代表的值是使用int[]来存储的, 源码中域定义如下:
```java
/**
 * mag是BigInteger的magnitude, 遵照Big-endian顺序. 每个数字都有对应的一种mag的表示, 同时数字0对应的mag是空数组
 * 
 */
final int[] mag;
```

举个例子来说, 比如你有一个数字 `18927348347389543834934878` , 那么就会分成三部分分别存储至int[]数组里, 最终底层是这样存放的
`18927348 | 347389543 | 834934878`

从这个例子中, 我们可以观察到:
1. 每组最多存储长度是9, 为什么是9? 因为2的31次方-1的数值(2147483647)对应是一个长度为10的数字, 如果采用10长度的话, 会溢出int的最大取值范围; 并且在BIgInteger的add方法内,有直接做加法运算,两个9位的相加肯定不会溢出;
2. 由于java中数组的最大长度也是2147483647(实际大小会根据dk版本有点不同,因为部分位会被挪用去存储数组的元信息),所以最大可存储的数字长度是9*2147483647, 这是个相当可怕的长度.....肯定够你用

除此之外, BigInteger还有个小点就是, 它将符号位单独拿出来表示, 源码中域定义如下:
```java
/**
 * BigInteger的符号位, -1是代表负的,0代表0,1代表正的. 要注意的是 如果是数字0 则这个signum也必须是0 不能是1 
 * (这是为了确保每个BigInteger都有唯一的表示)
 * @serial
 */
final int signum;
```

#### BigInteger是怎么做运算的

这个我暂时就不予乱谈, 先贴个源码:
```java
private static int[] add(int[] x, int[] y) {
        // If x is shorter, swap the two arrays
        if (x.length < y.length) {
            int[] tmp = x;
            x = y;
            y = tmp;
        }

        int xIndex = x.length;
        int yIndex = y.length;
        int result[] = new int[xIndex];
        long sum = 0;
        if (yIndex == 1) {
            sum = (x[--xIndex] & LONG_MASK) + (y[0] & LONG_MASK) ;
            result[xIndex] = (int)sum;
        } else {
            // Add common parts of both numbers
            while (yIndex > 0) {
                sum = (x[--xIndex] & LONG_MASK) +
                      (y[--yIndex] & LONG_MASK) + (sum >>> 32);
                result[xIndex] = (int)sum;
            }
        }
        // Copy remainder of longer number while carry propagation is required
        boolean carry = (sum >>> 32 != 0);
        while (xIndex > 0 && carry)
            carry = ((result[--xIndex] = x[xIndex] + 1) == 0);

        // Copy remainder of longer number
        while (xIndex > 0)
            result[--xIndex] = x[xIndex];

        // Grow result if necessary
        if (carry) {
            int bigger[] = new int[result.length + 1];
            System.arraycopy(result, 0, bigger, 1, result.length);
            bigger[0] = 0x01;
            return bigger;
        }
       
```

我没有特别看明白(菜鸡如我~), 但是我感觉其实就是分组相加, 然后有进位则做进位处理, 如果我猜测的不对, 欢迎留言

### BigDecimal大显神威

我们前面已经说明了一些BigInteger的知识, 现在我们已经有了相当的知识储备来学习BigDecimal的实现原理了.

#### BigDecimal是什么

BigDecimal represents an immutable arbitrary-precision signed decimal number.
bigdecimal表示一个不可变的任意精度有符号十进制数。

从这句话中我们可以知道的最切题的信息就是它是支持任意精度! 所以说BigDecimal是不存在double那样,在底层存储的时候把超出的位数抹掉从而导致精度问题.

BigDecimal相比于BigInteger来说,最大的区别就是它支持带小数的十进制数

#### 那么BigDecimal是怎么做到任意精度,怎么做到支持带小数的?

BigDecimal由两部分来支持数据存储:

1. Unscaled value – an arbitrary precision integer, 一个任意精度整数, 由BigInteger作支持

```java
/**
 * 利用BigInteger存储任意精度整数
 */
private final BigInteger intVal;
```

2. Scale – a 32-bit integer representing the number of digits to the right of the decimal point, 用一个int类型存储小数位数(scale)

```java
 /**
  * int类型来存储位数
  */
private final int scale;
```

我们举个例子, 比如数字3.14, 那么其intVal就是314, 其scale就是2, 可以从下面的代码示例中同样验证这个结论

```java
BigDecimal bd = new BigDecimal("3.14");//利用String构造器构造,后面会再讲
System.out.println(bd.unscaledValue());//314
System.out.println(bd.scale());//2
```

所以BigDecimal利用了BigInteger来支持任意精度的表示, 同时使用一个scale域来保存小数位数, 两者结合, 就可以完美的保存一个任意精度的十进制数

#### BigDecimal的常见陷阱

本文不是API文档, 所以我不会一一列举BigDecimal的常见方法, 不过BigDecimal在使用上有一部分坑是需要我们稍加留意的.

1. 首先是不使用`BigDecimal(double val)`构造器, 为什么?

我们查阅这个构造器源码, 会发现其调用了`Double.doubleToLongBits()`, 看到这里我们其实已经可以得到答案了, 为了证明我说的没问题, 下面贴出构造器调用源码:

```java
public BigDecimal(double val, MathContext mc) {
    if (Double.isInfinite(val) || Double.isNaN(val))
        throw new NumberFormatException("Infinite or NaN");
    // Translate the double into sign, exponent and significand, according
    // to the formulae in JLS, Section 20.10.22.
    long valBits = Double.doubleToLongBits(val);
    int sign = ((valBits >> 63) == 0 ? 1 : -1);
    int exponent = (int) ((valBits >> 52) & 0x7ffL);
    long significand = (exponent == 0
            ? (valBits & ((1L << 52) - 1)) << 1
            : (valBits & ((1L << 52) - 1)) | (1L << 52));
    exponent -= 1075;

    // 下面过长省略
```

从第6行可以看到, 此构造器明确使用了`Double.doubleToLongBits(val)`返回的`valBits`来生成BigDecimal,

我们来窥探下这个`valBits`的内容,

```java
System.out.println(Double.doubleToLongBits(0.1d));
//4591870180066957722
System.out.println(Long.toBinaryString(Double.doubleToLongBits(0.1d)))
//11111110111001100110011001100110011001100110011001100110011010
```

我们从第二个打印结果中看出, 获取到的二进制数据是一个有限精度的数字, 而浮点数存储0.1的时候,是一种无限循环的表示情况,这在上文中我们也提及了. 所以我们已经可以断定, BigDecimal在这里会使用一个已经失去精度的数值来生成Bigdecimal,最终导致我们打印这个Bigdecimal的时候,获得的不是0.1,而是0.1000000000000000055511151231257827021181583404541015625这样的值, 从而又产生了精度问题!

所以这就是为什么不推荐使用`BigDecimal(double val)`构造器的原因,因为它依旧会产生精度问题.

一般的, 我们可以使用`BigDecimal.valueOf(double val)`或者`BigDecimal(String val)`来构造.

`BigDecimal.valueOf(double val)`内部会先调用Double的toString方法, 所以不会产生精度问题

2. 其次是谨慎使用`compareTo`和`equals`方法

如果你想比较两个Bigdecimal的值大小, 使用`compareTo`, 因为它会忽略scale, 所以1.00和1.0是相等的

如果你想完全比较两个Bigdecimal的是否相同, 使用`equals`, 比如1.00和1.0通过此方法比较是不等的

## 未完待续

本章主要讲解了java层面上如何做好高精度计算, 下一章我们会继续讨论数据库层面上以及前端层面上如何正确的进行展示

<div id="donationPoint">