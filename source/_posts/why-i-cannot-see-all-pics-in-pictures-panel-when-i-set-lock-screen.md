---
title: ubuntu18.04设置lock-screen存在的一个坑
tags: Bugs
categories: 计算机
date: 2019-08-25 00:31:24
---


当你在用使用ubuntu18.04的时候, 你发现背景图片(backgroud),锁屏背景图片(lock-screen)还有输入密码时候的背景图片(login-screen)是分开的,也就是说需要分开设置

而设置背景图片可以直接通过右键"Set As WallPaper"来快速修改, 但是锁屏背景图片(也就是lock-screen)最快捷的方法就是在Settings->backgroud->lock screen进行修改,

在弹出来的对话框内, 有系统自带的图片, 你也可以选择自己的图片, 但是存在一个问题, ubuntu会将你Picture根目录下的图片显示出来供你选择, 但是它会忽略由系统截图工具产生的图片

ubuntu后台会有如下日志打印:

```
(gnome-control-center:5886): background-cc-panel-DEBUG: 00:24:13.369: Ignored URL 'file:///home/zazalu/Pictures/xxx.png' as it's a screenshot from gnome-screenshot

```

这个设定我觉得问题很大....而且不会做任何有效提示.... 使用者会感觉非常懵逼(比如我)

