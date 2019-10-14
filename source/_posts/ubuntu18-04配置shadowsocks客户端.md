---
title: ubuntu18.04配置shadowsocks客户端
tags: Proxy
categories: IT
date: 2019-06-06 12:11:49
---

## 下载shadowsock客户端

有两种shadowsocks客户端供你选择

1. 图形化界面的版本 Shadowsocks-Qt5 ，本文不介绍图形化界面客户端配置，
参考https://github.com/shadowsocks/shadowsocks-qt5/wiki
2. 命令行客户端，用包管理工具下载，分两种，一种python实现，一种c实现的，本文介绍python的，想要c的
参考https://github.com/shadowsocks/shadowsocks-libev#installation

## 安装

使用Ubuntu高级包管理工具apt安装：
```s
apt-get install python-pip
pip install git+https://github.com/shadowsocks/shadowsocks.git@master
```

## 配置网络连接文件

创建配置文件`/etc/shadowsocks.json`，路径随意，不想思考就装etc路径下，这样就符合linux文件系统目录规范放置方式；如果是etc的话，注意root权限

格式如下：
```json
{
    "server":"服务器 IP 或是域名",
    "server_port":端口号,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"密码",
    "timeout":300,
    "method":"加密方式 (chacha20-ietf-poly1305 / aes-256-cfb)",
    "fast_open": false
}
```

## 启动shadowsocks python版客户端

sslocal（ss提供的一个proxy工具）已一个守护进程启动：
```s
# sslocal是python客户度命令，-c是使用配置文件启动，-d是作为守护进程启动，start是启动。具体使用-h指令获取帮助信息
/usr/local/bin/sslocal -c /etc/shadowsocks.json -d start  
```

关闭：
```s
# sslocal是python客户度命令，-c是使用配置文件启动，-d是作为守护进程启动，start是启动。具体使用-h指令获取帮助信息
/usr/local/bin/sslocal -c /etc/shadowsocks.json -d stop
```
或者你直接kill进程也可以，使用`ps -aux | grep sslocal`就可以找到进程

**[!]**: 建议使用守护进程启动，如果不使用守护进程启动，那么这个工具就会一直在terminal页面挂起，实时的打印log。一旦关闭terminal，它也就异常退出了，代理功能就没法持续稳定的运行。

## 全局代理 （选填项）

打开ubuntu系统的设置 -> 点击Network ->点击Network Proxy设置 -> 选择Manual -> 在socks Host一栏输入 127.0.0.1，端口1080即可

**[!]** 全局代理指的是所有网络请求全部走这个代理，如果你不需要这样，，那就跳过这个步骤。

## 浏览器配置（Chrome例子）

由于我不想要全局都用一个代理，我更希望shadowsocks只是帮我上国外网站，所有我只限定浏览器使用shadowsocks。

### 下载Proxy SwitchyOmega扩展工具

**[!]** 不依赖工具你也可以手动，但是切换代理起来麻烦，所以直接推荐使用扩展工具

Proxy SwitchyOmega 可以轻松快捷的帮我们切换浏览器的代理设置

Proxy SwitchyOmega 的下载安装，如果你能打开chrome应用商店，那么直接输入Proxy SwitchyOmega即可安装

如果你没法打开chrome应用商店，可以在github该扩张工具项目的release下找到下载源，下载crx文件即可
github release地址：https://github.com/FelisCatus/SwitchyOmega/releases

嫌麻烦不想自己找，用下面这个，目前（2019-06-06）最新版本
下载地址：https://github.com/FelisCatus/SwitchyOmega/releases/download/v2.5.20/SwitchyOmega_Chromium.crx

下载好后，将.crx文件拖入`chrome://extensions/`

**[!]** 最新版chrome直接拖入crx文件会拒绝，解决方法：
```
把下载后的.crx扩展名的离线Chrome插件的文件扩展名改成.zip(建议不要改成rar，有可能出现损坏)
解压压缩文件
在Chrome的地址栏中输入：chrome://extensions/ 打开Chrome浏览器的扩展程序管理界面，并在该界面的右上方的开发者模式按钮上打勾
在勾选开发者模式选项以后，在该页面就会出现加载正在开发的扩展程序等按钮，点击“加载正在开发的扩展程序”按钮，并选择刚刚解压的Chrome插件文件夹的位置
```

全部完成后，在`chrome://extensions/`页面记得启动Proxy SwitchyOmega

启动后会在chrome的右上角（插件栏）观察到一个圆形的图标。

### 配置Proxy SwitchyOmega

使用之前，我们要先配置下。

可以直接使用这个配置文件来快速应用shadowsocks服务到Proxy SwitchyOmega中

配置文件下载地址：
https://home.shadowsocks.ch/dl.php?type=d&id=74

点击 “Proxy SwitchyOmega” > "选项" > "导入/导出" > "从备份文件中恢复" 

配置文件的内容：填写不同种代理设置而已，该配置文件帮你配置了四种模式，
[直接连接]， 不使用代理
[系统代理]， 使用系统默认代理，如果你没配过系统默认代理，那么就想到与直接连接
[Shadowsock]， 使用配置好的代理(127.0.0.1:1080)
[自动切换] ， 可以在所有上述模式中自动切换，已达到完成网页访问的目的（不推荐）

### 使用Proxy SwitchyOmega

点击圆形图标，选择Shadowsock模式你就发现能够上Google，youtube等网站了（注意先启动shadowsocks客户端服务）

## 开机自启动

我们希望不是每次自己调用启动命令来启动shadowsocks，而是开机可以自己启动。那么需要配置一个自定义的ubuntu开机启动服务，我们使用Systemd来完成这项任务

1. 创建文件sudo vim /etc/systemd/system/shadowsocks.service

2. 文件内容填写如下（我已我自己的为例）：
```
[Unit]
Description=Shadowsocks Client Service
After=network.target
After=network-online.target

[Service]
#Type=simple
Type=forking
User=root
ExecStart=/usr/local/bin/sslocal -c /etc/shadowsocks.json -d start

[Install]
WantedBy=multi-user.target
```

重点是填写ExecStart那里，把我们的启动指令填进去

**[!]** shadowsocks.json的路径填你自己的，如果你安全按照本配置文档来一路做过来的话，就可以直接使用上面的内容

**[!]**: Service模块的Type必须使用forking，因为指令`/usr/local/bin/sslocal -c /etc/shadowsocks.json -d start`执行完后不会一直运行，创建完守护线程后很快会退出，最后Service发现指令已经执行完，于是service就也退出了。但是sslocal这时的守护线程是挂载在service上的，所以service退出，守护线程立马也kill了。这就导致最终你的sslocal没开启，就和走了一次片场一样。所以必须要规定Type=forking，因为forking模式下，Service会将自己的所有守护线程移交给os，那就没问题了，sslocal会在os下继续运行！

3. 让配置文件生效

`systemctl enable /etc/systemd/system/shadowsocks.service`

4. 重启看看效果即可


## 有关Systemd管理的指令介绍

1. 当你因为某些原因要修改shadowsocks.service的内容，比如字母打错了。修改完后必须调用`systemctl enable /etc/systemd/system/shadowsocks.service`来使其重新生效

2. sslocal提供log打印到文件的功能，使用-help查看具体帮助就可以翻阅到如何使用了

3. 启动（关闭）service服务，使用指令`systemctl start(stop) shadowsocks.service` 

<div id="donationPoint">

<div id="licensePoint">
