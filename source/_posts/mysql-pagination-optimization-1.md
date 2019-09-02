---
title: 细说mysql分页系统(入门篇, 本篇主要是网上一些方法的搜集和验证)
tags: 数据库优化
categories: 计算机
date: 2019-08-28 15:22:27
---

# 1

分页优化是最常见问题之一, 针对日宜扩大的业务数据, 分页优化是数据库查询优化中的一个必经环节. 目前虽然我负责的项目日流量不大, 每天2000+订单量, 但是已经开始后怕后期的数据库查询响应速度, 由于并不是什么互联网公司, 所以在分页这块依旧停留在`limit`,`offset`上, 公司内部并没有成型的分页优化方案 ,对于几十万的数据量来说, 它们是可以忍受的, 事实上低于1s的查询速度都是我可以接受的, 但是随着数据量的加大, 特别是数据量超过100w往上走, 达到千万级别的时候, `limit`的方式则需要更多的辅料才能勉强达到不分表,同时有一个较小的查询时间. 

本系列旨在研究mysql分页优化而开展的, 本篇为基础篇, 即我不会引入具体的业务场景, 而是简单的在一个千万级别的测试表上, 进行一些特别不靠谱的基准测试, 最终得出一个基本结论(干货不会很多)

部分单词含义说明:
`total` 总数据量
`pageSize` 每页大小
`pageTotal` 是(total / pageSize)向上取整

# 分页优化基础 - keyset pagination

keyset pagination应该是任何数据库分页的最快解决方案, 但是无法做到跳页, 只能提供上一页,下一页功能

详情请参考:
http://allyouneedisbackend.com/blog/2017/09/24/the-sql-i-love-part-1-scanning-large-table/

# 分页优化基础 - Maintain a Page or Place column

可以在你的表中为每行单独维护一个`page`列, 比如前100行都是`page=1`, 代表前100个数据都是第一页, 以此类推(给page加个索引)

```sql
SELECT id, name, address, phone
FROM customers
WHERE page = 1
ORDER BY name;
```

**[缺点]**: 
这个方案可以执行的前提:
 - `pageSize` 不变
 - 表中的数据只增不减

# 分页优化深入 - 水平切分优化

根据现有业务按列分表,将用于排序的列数做最小拆分，尽量不要有大规模字符串,查询后用 in(ids)方式聚合 

实施起来复杂, 增加了不少工作量, 不建议使用

# 分页优化的小聪明 - 反转 (效果不明显,谨慎使用)

> 利用Order来反转查询, 

就拿我前面的例子来说, 我有如下查询
```sql
select id from Merchant_1000w where createTime=347446113 limit 9000000,10;
```

直接查900 0001开始的数据, 但是我们知道表目前只有1000w条数据, 所以 这时候为何不先逆向排序, 然后从100 0000开始查呢?

我们稍微修改下sql

```sql
select id from Merchant_1000w where createTime=347446113 order by id DESC limit 1000000,10; 
```

效果不是很明显, 但是普遍加快了100ms左右
