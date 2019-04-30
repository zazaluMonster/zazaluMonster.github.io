---
title: 在我的双硬盘windows电脑上安装ubuntu18.04-Desktop-LTS
tags: ubuntu
categories: IT
date: 2019-04-30 16:12:21
---

在我的thinkpad电脑上安装ubuntu18.04-Desktop-LTS系统，达到windows+ubuntu的双系统环境

## 我的电脑配置

Intel i7-8550U，16GB内存，双硬盘256G的SSD，1T的机械硬盘，BOOT启动模式为UEFI,磁盘分区表模式是GPT，开机进入UEFI BIOS设置按住F12，磁盘分区情况如下：

<img src="https://github.com/zazaluMonster/zazaluMonster.github.io/blob/hexo/themes/hexo-theme-cactus/source/images/tmpImage/%E5%AE%89%E8%A3%85%E5%89%8D%E7%A3%81%E7%9B%98%E5%88%86%E5%8C%BA%E6%83%85%E5%86%B5.JPG?raw=true" />

## 制作ubuntu的U盘启动盘

准备的材料
1. ubuntu18.04-Desktop-LTS.iso镜像文件，在ubuntu官网就可以轻松下载
2. 一个16GB的u盘
3. Rufus，一个启动盘写入软件，官网下载最近版即可

打开Rufus，按照如下配置：

<img src="https://raw.githubusercontent.com/zazaluMonster/zazaluMonster.github.io/hexo/themes/hexo-theme-cactus/source/images/tmpImage/%E4%BD%BF%E7%94%A8Rufus%E5%88%9B%E9%80%A0U%E7%9B%98%E5%90%AF%E5%8A%A8%E7%9B%98.JPG">

分区类型选择GPT（因为我windows用的GPT分区），目标系统类型选择UEFI（因为我windows用的就是这个启动方式）
文件系统选择FAT32（FAT虽然只支持最高4GB的文件大小，但是兼容性强，所以先选择这个文件系统，后面我会尝试使用NTFS）
簇大小我用的默认8192字节(8K)

点击开始后会弹出选择什么镜像模式写入，选择推荐的ISO镜像
完成后u盘启动盘就制作完成了

## 为ubuntu准备磁盘空间

1. 在windows的系统盘C盘中预留10G，用于分配/boot分区（分配多一点，以防万一，如果你的SSD不够大的话，分2G应该就足以了）
2. 在1T的机械硬盘中分割500G作为ubuntu系统存储使用

如何分割？
使用windows自带的磁盘管理工具，右键压缩卷，输入压缩的大小就是分割出来的磁盘空间（黑色显示未分配的部分）

## 禁用快速启动fast startup
我暂时没做，用起来没啥区别，估计底层做了一定处理


## 关闭Secure Boot功能
由于过去 cracker 经常借由 BIOS 开机阶段来破坏系统，并取得系统的控制权，因此 UEFI加入了一个所谓的安全启动 （secure boot） 机制。
但是这个机制容易导致linux系统无法顺利开机，所以需要进行关闭

关闭方式：
重启电脑，按住F12打开BIOS界面，在该界面找到Secure Boot，改成disabled，然后保存重启即可（不同主版也许不同，具体请自己上网查询）

## 正式安装ubuntu

1. 插入我们u盘启动盘！
2. 开机，按住f12！选中自己的USB设备，回车运行
3. 选择install ubuntu
4. 中间什么语言，键盘设定我就不做说明了，选自己喜欢的就行，最好english，可以提高自己
5. 分区配置：
    在SSD的未分配空间分：
    /boot,至少2G,我给了10G,Logical逻辑分区(因为我的boot分区放在windows的SSD盘里，而这个SSD盘已经有windows的主分区了，所以这里我们选逻辑分区即可)
    在HHD的未分配空间分：
    /,至少15000MB，我给20G，逻辑分区
    swap area,你电脑实际内存(RAM)的两倍，不过很多资料说基本不需要了，所以就随便给了16G，逻辑分区
    /home,因为就我一个人用，所以把剩下的所有空间都放给这个用户文件夹，逻辑分区

    所有分区位置都选择从头位置开始（beginning of the space）

    最后一栏：
    Device for boot loader installation:
    选择刚刚我们分配的/boot对应的那个Device，意思就是把启动程序都装到那里

    下面放2张参考图
    <img src="https://github.com/zazaluMonster/zazaluMonster.github.io/blob/hexo/themes/hexo-theme-cactus/source/images/tmpImage/boot%E5%88%86%E5%8C%BA%E9%85%8D%E5%A5%BD%E5%90%8E%E6%88%AA%E5%9B%BE.png?raw=true" title="boot分区配好后">

     <img src="https://raw.githubusercontent.com/zazaluMonster/zazaluMonster.github.io/hexo/themes/hexo-theme-cactus/source/images/tmpImage/root%E5%88%86%E5%8C%BAhome%E5%88%86%E5%8C%BAswap%E5%88%86%E5%8C%BA%E9%85%8D%E5%A5%BD%E5%90%8E.png" title="root分区home分区swap分区配好后">

    全部搞定后点击下一步！
6. 设置用户
7. 等待安装完成，安装完成后提示重启
8. 开机后会自动先进入UEFI界面，然后选择启动ubuntu即可

## 总结

到此为止，我个人在双硬盘windows上安装ubuntu18.04-Desktop-LTS的流程已经完毕，上面所描述的步骤都是我亲手秩序的过程，最后成功安装完毕


参考：
1. <http://myviewsonfoss.blogspot.com/2018/05/this-article-willshow-you-how-you-can.html>
2. <https://blog.csdn.net/love666666shen/article/details/80947903>






