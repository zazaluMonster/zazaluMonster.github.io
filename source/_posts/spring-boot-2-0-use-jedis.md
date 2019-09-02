---
title: 当你不得不在SpringBoot2中使用jedis的时候
tags: redis
categories: IT
date: 2019-08-15 12:14:50
---

# 1

当我把上一个项目的代码功能模块,原封不动的移到某银行内网的一个小项目中去的时候,发现java7不支持使用Lettuce,爆了一大堆错(汗)

看来Lettuce用了很多java8特性并且没有做兼容

所以就google下, 最偷懒的方式就是改用jedis, 虽然它是线程不安全的, 但是自己封装点控制代码也无妨

# 2

> maven配置

```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
	<exclusions>
		<exclusion>
			<groupId>io.lettuce</groupId>
			<artifactId>lettuce-core</artifactId>
		</exclusion>
	</exclusions>
</dependency>
<dependency>
	<groupId>redis.clients</groupId>
	<artifactId>jedis</artifactId>
</dependency>
```

**[注意]**: 建议用spring-boot-starter-data-redis, 因为看xml配置, spring-data-redis已经包含在starter里面了,别重复定义

**[注意]**: 必须先移除lettuce依赖,不然会报错,感觉肯定是坑,因为官方给出的报错提示和解决方案根本不对应= =

> 编程式配置

```java
@Bean
    JedisConnectionFactory jedisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration =
                new RedisStandaloneConfiguration(hostName, port);
        return new JedisConnectionFactory(redisStandaloneConfiguration);
    }

    @Bean
    public RedisTemplate<String,Object> redisTemplate() {
        RedisTemplate<String,Object>  template = new RedisTemplate<String,Object> ();
        template.setConnectionFactory(jedisConnectionFactory());

        //为RedisTemplate配置序列化策略,这样我就不用自己做序列化反序列化了

        //使用Jackson2JsonRedisSerializer来序列化和反序列化redis的value值（默认使用JDK的序列化方式）
        Jackson2JsonRedisSerializer jacksonSeial = new Jackson2JsonRedisSerializer(Object.class);

        ObjectMapper om = new ObjectMapper();
        // 指定要序列化的域，field,get和set,以及修饰符范围，ANY是都有包括private和public
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        // 指定序列化输入的类型，类必须是非final修饰的，final修饰的类，比如String,Integer等会跑出异常
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jacksonSeial.setObjectMapper(om);

        // 值采用json序列化
        template.setValueSerializer(jacksonSeial);
        //使用StringRedisSerializer来序列化和反序列化redis的key值
        template.setKeySerializer(new StringRedisSerializer());

        // 设置hash key 和value序列化模式
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(jacksonSeial);
        template.afterPropertiesSet();

        return template;
    }
```

至于序列化,你可以自己搞,也可以像我这样交给RedisTemplate去搞,它有做封装,进行下配置即可(说实话配置有够多的= =)


> 使用

在test类中试试
```java
 @Autowired
    RedisTemplate<String, Object> redisTemplate;

 @Test
 public void testRedis() {
     User userVo = new User();
     userVo.setId(1);
     userVo.setName("hello");
     ValueOperations<String, Object> operations = redisTemplate.opsForValue();
     operations.set("user1", userVo);

    User cacheUser = (User) operations.get("user1");
    logger(cacheUser);
 }
```

# 3 参考

[移除lettuce坑](https://www.concretepage.com/questions/599)
[SpringBoot2中redis简单使用](https://www.devglan.com/spring-boot/spring-boot-redis-cache)
[还算不错的redis使用分享贴,我部分代码直接摘抄了](https://www.cnblogs.com/superfj/p/9232482.html)