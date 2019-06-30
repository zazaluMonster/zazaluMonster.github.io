---
title: Java乱码问题之URLEncoder和URLDecoder
tags: 编码
categories: IT
date: 2019-06-24 12:56:25
---

# 导言

关于编码，我曾经写过了2篇文章。在我个人运用来看，前两篇分享的知识已经足以去理解所有编码问题发生的根源问题。

那么为什么我今天又写了这篇文章呢？

接触过Web项目的同学，肯定对URLEncoder和URLDecoder，我们常常用这两个类来处理部分遇到的问题。

在早些时候，我个人还没理解透这块知识的时候，我以为下面的2句java表达式的背后机制是差不多的

```java
//1
String encodeUrl = URLEncoder.encode(url,"utf-8");
String decoderUrl = URLDecoder.decode(encodeUrl,"utf-8");
//2
new String(s.getBytes("gbk"),"utf-8")

```
后来，我分享了 [我编码的第二篇文章](https://zazalu.space/2019/06/15/Java%E7%9A%84%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81%E9%97%AE%E9%A2%98%E4%B8%80%E8%AF%AD%E9%81%93%E7%A0%B4-GBK-UTF%E7%AD%89%E5%B8%B8%E7%94%A8%E7%BC%96%E7%A0%81/) 
后我懂得了Stirng的那个表达式是做了如下的转换逻辑：
Unicode String  ->  根据传入的编码规则将Unicode转换为了Bytes[]  ->  使用utf-8的编码规则去将Bytes[]变成Unicode字符

总的来说String的这种方式是字符到字节再到字符的转换，其内部的Unicode字符的内容是会根据你的编码规则使用是否正确会改变的，使用的不当，结果还是乱码XS

但是在URLEncoder和URLDecoder的应用领域，它们干的事情和我对“编码”的一般理解是有区别的，下面我来细讲

# URLEncoder和URLDecoder

>我更愿意说URLEncoder和URLDecoder做的事情叫“字符转换”而不是“编码”，其内部包含了“编码”的操作，但不仅仅只有“编码”操作

**我们先拿URLEncoder说事**

假设你收到一个URL数据如下
`String url = 'http://localhost:8080/examples/servlets/servlet/镓钧?author=镓钧'`

但是带中文的URL在不同的程序解析下容易出现乱码问题最终导致数据丢失，所以为了不出现此类问题，URL规范使用utf-8（实际上不同地方规范不同，只不过现如今我们更推荐只使用utf-8）将这些中文字符转换为16进制表示的字符
如下所以：

`Stirng encodeUrl = 'http://localhost:8080/examples/servlets/servlet/%E9%95%93%E9%92%A7?author=%E9%95%93%E9%92%A7'`

这个过程有2个要点：
1. `镓钧`二字变成了`%E9%95%93%E9%92%A7`，说明String的内容有目的的被URLEncoder转换为了其他字符
2. `%E9%95%93%E9%92%A7`中将百分号去掉，其实就是`E995 93E9 92A7`这是`镓钧`的UTF-8的16进制表示形式

所以URLEncoder做的事情按顺序可以归类为下面2点：
1. 使用类似`s.getBytes("utf-8")`的机制，将`镓钧`这个Unicode字符使用utf8解码成Bytes[]，
2. 将Bytes[]按照每16位为单位，提升为了char[ ]，并且开头会附加上`%`，最后把这些char字符组装为新的Stirng返回

就这样其实URLEncoder把你的中文字符变成了英文字符！

**有关URLDecoder在有了前面的介绍后就更好解释了**

url在送达目的地后被解码，使用URLDecoder解码，因为URLDecoder它懂得规则，所以它会把这一串URL字符中的16位进制数据去挨个匹配utf-8的码表，找到对应的字符，最后达到得到了想要的数据

# 尾

总结：URLEncoder和URLDecoder的encode方法内部包含了我们一般说的编码操作，但是实际上这个方法本身可以算是使用了String的编码API来执行的一个上层程序。我们自己也可以实现一个简单的URLEnocder。所以我以前认为的URLEncoder本身也是一种编解码API的思想是错误的！ 故特写此文进行纠正

