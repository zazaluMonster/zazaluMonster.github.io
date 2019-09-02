---
title: 我还记得去年写过oracle的批量插入随机数据的脚本,今天补个mysql的吧
tags: batchInsert
categories: 计算机
date: 2019-08-27 22:25:17
---

# 1

银行项目一直用的oracle, 所以我回忆起来自己从来没碰过mysql的批量随机数据插入...

主要是简单记录下批量插入的方式, 会有一个优化的过程, 希望对你有点帮助哦

下面我就讲解如何插入100w条随机测试数据到mysql中

# 建表

```sql
-- drop table Merchant
create table Merchant
(
    id int auto_increment,
    merchantId VARCHAR(10) not null comment '10位商户编号',
    merchantName VARCHAR(10) not null comment '商户名称',
    createTime VARCHAR(12) not null comment '创建时间',
    constraint Merchant_pk
        primary key (id)
) comment '商户表';
```

# 存储引擎的配置进行优化

可以见:
https://blog.csdn.net/QWERDF10010/article/details/79770764

# insert语句优化

先来看看最暴力的插入

1. 包含100w条数据的爆炸sql :)

```sql
-- 100w条insert语句
insert (...) values (...);
...
...
..
.
```

这种形式,就算MyISAM都救不了你, 按下回车后你就可以去睡一觉了, 醒来说不定就好了,嘻嘻

2. 存储过程 写个循环100w次的插入

这种其实和第一种性质一样, 也是巨慢无比的.

```sql
delimiter //
create procedure batchInsert()
begin
    declare num int;
    set num=1;
    while num<=1000000do
    -- 100w次loop
    insert (...) values (...);
    set num=num+1;
    end while;
end
//
delimiter;
```

看完了暴力的,就来看看怎么优化.

其实优化很简单, 有一种特别简便的方式就可以达到插入速度提升几百倍, 就是使用批量插入的功能

```sql
insert (xxx) values(...),(...),(...),(...),(...) ....;
```

你可以像上面这样, 一次插入几百条.
然后你就会惊人的发现, 真的很快, 100w条数据大概30多s左右(不同机器环境稍微会不同)就可以完成,由于30s左右已经是我可以接受的范围了. 所以就停手不进行下一步优化, 如果你还是有一点深入的兴趣, 可以看看[这篇文章](https://www.jianshu.com/p/36b87cb3a05a)

# 随机数据如何处理?

你可以使用sql的函数,也可以用任意高级编程语言生成sql文件, 这样你就可以接住高级编程语言的一些api去做随机数据的处理了

如果你和我一样,希望统一用sql帮我们干事, 那么目前来看`rand()`, `floor()`等函数适合你, 但是注意多一个函数就相当于sql慢一点哦 :)

