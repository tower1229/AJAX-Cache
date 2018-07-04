中文 | [English](README.md)

# AJAX-Cache

[![npm](https://img.shields.io/npm/v/ajax-cache.svg)](https://www.npmjs.com/package/@tower1229/AJAX-Cache) [![GitHub release](https://img.shields.io/github/release/tower1229/AJAX-Cache.svg)]() [![license](https://img.shields.io/github/license/tower1229/AJAX-Cache.svg)]()

> :tophat:最好用的jQuery-Ajax缓存插件

## 介绍

AJAX-Cache是一款jQuery插件，基于localStorage/sessionStorage实现异步请求缓存功能，并提供“快照”和“定时”两种缓存模式。

## 安装

### npm

`npm i ajax-cache  --save`

### Download

https://github.com/tower1229/AJAX-Cache

## 使用

你只需要为jQuery.ajax()增加一个`localCache`配置

### 开启快照缓存

```
$.ajax({
    url: "http://rapapi.org/mockjsdata/9195/common/getRandom",
    dataType:'json',
    localCache: 'snapshot',
    success: function(res) {
        if (res.snapshot) {
            console.log('[snapshot] ' + res.data);
        } else if (res.snapshootEqual) {
            console.log('remote data is equal snapshot');
        } else {
            console.log('[remote data] ' + res.data);
        }
    }
});
```

### 开启定时缓存

```
$.ajax({
    url: "http://rapapi.org/mockjsdata/9195/common/getRandom",
    dataType:'json',
    localCache: 5000,
    success: function(res) {
        console.log('\n[Caching for 5 seconds] ' + res.data);
    }
});
```

### 清除缓存

```
$.ajax({
    url: "http://rapapi.org/mockjsdata/9195/common/getRandom",
    dataType:'json',
    localCache: false,
    success: function(res) {
    	console.log('Cache has been cleared');
        console.log(res.data);
    }
});
```

### 清除所有缓存

```
$.ajaxCache.clear();
```

### 配置

```
$.ajaxCache.set({
	storage: 'localStorage', 		//存储方式，默认"localStorage"，可选择"sessionStorage"
	cacheNamePrefix: '_ajaxcache'	//存储前缀，通常不需要修改
});
```

## 演示

http://refined-x.com/AJAX-Cache/test/

## 许可证

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, [refined-x.com](http://refined-x.com)
