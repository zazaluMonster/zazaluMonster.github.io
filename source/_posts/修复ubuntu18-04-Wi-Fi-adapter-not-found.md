---
title: 修复ubuntu18.04上的问题Wi-Fi adapter not found（Realtek RTL8821CE）
tags: ubuntu
categories: IT
date: 2019-05-01 11:42:24
---

刚使用ubuntu18.04，在桌面版上想使用wifi的时候，发现显示
**Wi-Fi adapter not found**

这个是因为我们没有安装网卡驱动程序的缘故

所以解决此问题的关键是先明确自己电脑是什么无线网卡！

## 1

首先我们需明确ubuntu所使用的是什么网卡

使用命令`lspci`获取我们的network-controller信息。

我的是
```s
(前面的大量输出省略，找到下面这一行就行)
Network controller: Realtek Semiconductor Co., Ltd. RTL8821CE 802.11ac PCIe Wireless Network Adapter
```

从中可以看出我的无线网卡是为**Realtek RTL8821CE**

所以我们要安装的是RTL8821CE的网卡驱动程序

## 2

由于没有wifi，所以你目前没有网络环境，但是为了修复这个问题你必须连接上网络，这个时候你必须先准备好可以上网的有线网络(wired network)

## 3

打开terminal，先输入如下代码

```s
sudo apt update
```

先更新您的apt软件包管理工具，防止后续我们安装使用相关软件时不会报出一些神奇的错误

## 4

安装下必须的一些软件
```s
sudo apt-get install --reinstall git dkms build-essential linux-headers-$(uname -r)
git clone https://github.com/tomaspinho/rtl8821ce
cd rtl8821ce
chmod +x dkms-install.sh
chmod +x dkms-remove.sh
sudo ./dkms-install.sh
```
上述命令会去
1. 先安装
    git(这个不用我解释是什么了吧？) 
    dkms(DKMS是基于动态内核模块支持的可以让开发者无需使用最新的内核版本而对某个单一的内核模块做升级) 
    build-essential（携带编译必须软件包） 
    linux-header-$(uname -r)（重装当前linux内核版本的linux-headers）
2. 将rtl8821ce的驱动程序clone至本地，相当于我们在windows下载驱动程序一个意思
3. 进入驱动程序包文件夹
4. 使用chmod调整相关sh脚本的权限
5. 运行脚本dkms-install.sh，会自动将rtl8821ce驱动程序安装完毕

## 5

重启ubuntu

再看看你的wifi配置，应该已经可以使用了！

## 6
其他你可能遇到的问题

信号弱，使用关键字`weak signal`去google上搜查答案吧


