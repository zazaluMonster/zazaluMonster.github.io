---
title: hexo next主题自定义css格式切换
tags: hexo
categories: IT
date: 2019-04-24 14:15:52
---

当我每次想要进行自己的hexo next博客的外观变更的时候,每次都需要去修改配置文件,会非常的麻烦,而且容易忘记.所以自己稍微研究了下,做了一些bat批处理文件,用于控制博客的页面外观(css)的自动转换.比如新年的时候,就切换到新年的配置文件.

本文档主要就是简单记录下,防止自己未来忘记了,强烈建议其他阅读者不要读此文档，大概率你看不懂写的什么东西

>适用版本
hexo版本：3.3.9
nexT版本: 5.0.0
可能最新的版本不符合本文档的描述，若你使用的是别的主题，使用举一反三的思考方式，其实也是类似的

## hexo-nexT主题自定义css配置文件

nexT主题自定义css配置文件路径: `themes\next\source\css\_custom\custom.styl`

修改custom.styl中文件内容 重新部署hexo后即可看到修改后的css效果.

## 创建css格式切换临时文件夹

在themes\next\source\css\_custom下 可以自行创建一个css格式切换文件夹

比如我创建的就是
`themes\next\source\css\_custom\themes`

目前我在其中放置了两个版本的css配置文件

`custom_new_year.styl`
`custom_normal.styl`
分别对应新年版本css配置文件和普通版本的css配置文件

## 创建bat批处理文件

使用批处理文件 其功能是可以将custom_*.styl文件移动到`themes\next\source\css\_custom`
下并且重命名为custoom.styl即可
这个批处理文件就是将css切换为新年模式的一个很简单的bat脚本.




