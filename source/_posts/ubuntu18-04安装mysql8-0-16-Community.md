---
title: ubuntu18.04安装mysql8.0.16(Community)，内附详细说明适合小白学习哦
tags: mysql
categories: IT
date: 2019-06-14 10:14:12
---

# 0

首先mysql已经不是以前的mysql了，自从加入oracle旗下后，各类付费mysql产品已经陆续上线了。目前最新的付费企业mysql版中，居然已经支持了nosql！但是非常遗憾！这个功能在社区版（也就是免费开源版）中是不支持的！╮(╯▽╰)╭ 好吧，想白嫖nosql还是老老实实用别的把！Oracel爸爸不收钱是不可能的

今天记录安装的是使用`ubuntu18.04`安装`MySQL Community Edition 8.0.16`

MySQL Community Edition就是我们最熟知的mysql啦，可以白嫖的mysql啦！

# 1

打开mysql官方下载网页
https://dev.mysql.com/downloads/

寻找如下的位置
```
MySQL Community Server (GPL)
(Current Generally Available Release: 8.0.16)
MySQL Community Server is the world's most popular open source database.
DOWNLOAD
```

随后我们来到了下载页面，先选择我们的操作系统版本，我是`ubuntu18.04 64-bit`，如下图所示

<img src="/images/tmpImage/mysql_1.png">

我刻意没有截图下面的那些各种各样的软件包，那是因为选择安装最新的8.0x，官方已经强力推荐使用包管理工具来安装了！所以我们没必要去看那些名字复杂，乱七八糟的各种安装包了！

点击推荐我们使用apt下载mysql的那个企鹅图片，我们会跳转到apt下载mysql的专栏网页。

该网页分成三个部分，第一部分介绍apt安装mysql的优点和它目前支持的版本，第二部分是一个快速开始的操作文档会教你怎么用！，第三部分是一个deb下载包`mysql-apt-config_0.8.13-1_all.deb`，可以先下好保存在本地，待会要用

下载好`mysql-apt-config_0.8.13-1_all.deb`后，你如果看不懂官方的操作文档，或者对其内部用到的东西感兴趣，那么看下面的内容是最好的！

# 2 开始安装

1. 为了文件摆放合理，请创建一个mysql-config-deb的文件夹，随后把你下载好的`mysql-apt-config_0.8.13-1_all.deb`移动过去，并在当前文件夹开启terminal

2. 在terminal内输入`sudo dpkg -i mysql-apt-config_0.8.13-1_all.deb `，随后会弹出一个配置界面，除非你有特殊需求，不然直接选择`OK`即可，最后你会得到如下输出：
```s
(Reading database ... 224799 files and directories currently installed.)
Preparing to unpack mysql-apt-config_0.8.13-1_all.deb ...
Unpacking mysql-apt-config (0.8.13-1) over (0.8.13-1) ...
Setting up mysql-apt-config (0.8.13-1) ...
Warning: apt-key should not be used in scripts (called from postinst maintainerscript of the package mysql-apt-config)
OK
```
**[讲解]**: `sudo dpkg -i mysql-apt-config_0.8.13-1_all.deb` 这一步是使用dpkg工具运行我们的mysql-config的程序，dpkg是ubuntu这类linux系统的底层包管理工具，也负责管理.deb结果的程序包。 mysql-cofig弹出的配置界面用于选择你要安装的是什么版本的mysql以及想要安装哪些mysql插件，选择完毕后，这个工具会生成一个类似`source.list`的东西，内部记录了mysql的apt软件仓库的服务器地址，用于后续的apt工具可以正常的安装mysql，会告知apt工具应该去检索哪些软件仓库的软件包。当然这个步骤其实也可以手动来添加这些apt的相关配置，如果你对apt的软件仓库配置非常熟悉，那么可以自己尝试，或者从这篇文档开始`https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/#repo-qg-apt-repo-manual-setup`

3. 输入`sudo apt-get update`，apt-get就开始重新更新软件仓库服务器内的所有包文件索引，在这里使用该命令的目的是，拉取mysql的apt软件仓库的服务器上的包索引列表。
**[讲解]**: apt工具是dpkg工具的上层软件，它拥有更强的包管理功能；它是利用自身软件仓库（source.list）内指定的源服务器地址内包含的包索引列表来正常的安装我们要安装的软件应用。这一步骤也正是在更新这些包索引列表，目的是添加我们刚刚引入的mysql的源软件仓库服务器内包含的包索引列表。可以把这个操作类比成电脑管家的查看更新。完成这步骤后，apt工具就会知道如何去下载安装我们的mysql了！所以这个步骤是使用apt安装mysql的关键步骤，是必须执行的哦！

4. 输入`sudo apt-get install mysql-server`，提示是否安装选`Y`，随后apt工具会根据本地的包索引列表去下载我们的mysql-server对应的包程序！为什么apt可以自我管理怎么去安装mysql-server，我们从这条命令也没有告知他安装啥版本，但是它就会去自行安装我们的8.0x版本。这一切都归功于我们前面对apt软件仓库的配置！

5. 等待片刻后，会弹出mysql一个小的配置程序界面，要求你输入下root用户的密码（输入2次），并且选择加密方式，8.0x使用了新的加密方式，也是官方推荐的，所以选推荐的就完事了！

6. 看到如下输出，恭喜你安装成功！（入坑成功！）
```s
emitting double-array: 100% |###########################################| 
reading /usr/share/mecab/dic/ipadic/matrix.def ... 1316x1316
emitting matrix      : 100% |###########################################| 

done!
update-alternatives: using /var/lib/mecab/dic/ipadic-utf8 to provide /var/lib/mecab/dic/debian (mecab-dictionary) in auto mode
Setting up mysql-community-server (8.0.16-2ubuntu18.04) ...
update-alternatives: using /etc/mysql/mysql.cnf to provide /etc/mysql/my.cnf (my.cnf) in auto mode
Created symlink /etc/systemd/system/multi-user.target.wants/mysql.service → /lib/systemd/system/mysql.service.
Setting up mysql-server (8.0.16-2ubuntu18.04) ...
Processing triggers for libc-bin (2.27-3ubuntu1) ...
```

7. 使用`sudo service mysql status`，查看mysql目前的状态，输出如下
```s
● mysql.service - MySQL Community Server
   Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2019-06-14 11:06:40 CST; 21s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 18991 ExecStartPre=/usr/share/mysql-8.0/mysql-systemd-start pre (code=exited, status=0/SUCCESS)
 Main PID: 19030 (mysqld)
   Status: "SERVER_OPERATING"
    Tasks: 39 (limit: 4915)
   CGroup: /system.slice/mysql.service
           └─19030 /usr/sbin/mysqld

6月 14 11:06:35 zazalu-ThinkPad-E480 systemd[1]: Starting MySQL Community Server...
6月 14 11:06:40 zazalu-ThinkPad-E480 systemd[1]: Started MySQL Community Server.
```

mysql的安装程序真的越来越傻瓜了！因为它不仅在安装完后自动运行了mysql，同时它还把它搞成了一个service，这样就可以在开机的时候自启动了！

# 3 其他控制命令

1. 关闭mysql，这里推荐如下命令，也是官方推荐的，当然你kill进程也是莫得问题的
`sudo service mysql stop`

2. 重启mysql
`sudo service mysql start`

# 4 卸载

1. 由于使用apt安装，所以卸载也会变得及其傻瓜式，使用如下命令即可
`sudo apt-get remove mysql-server`

2. 有些人喜欢下一些mysql的插件来增强mysql的功能，使用如下命令卸载这些插件
`sudo apt-get autoremove`
或者指定包名
`sudo apt-get remove package-name`

不知道有哪些包，先用如下命令查看
`dpkg -l | grep mysql | grep ii`


# 5 自动安装-超傻瓜式

可以写个shell脚本，把这些东西捆绑，一键执行！那就是真的超傻瓜式安装包了，我以后来填

<div id="donationPoint">

<div id="licensePoint">