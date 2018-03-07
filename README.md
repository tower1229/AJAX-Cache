English | [中文](README_CN.md)

# AJAX-Cache

[![npm](https://img.shields.io/npm/v/ajax-cache.svg)](https://www.npmjs.com/package/@tower1229/AJAX-Cache) [![GitHub release](https://img.shields.io/github/release/tower1229/AJAX-Cache.svg)]() [![license](https://img.shields.io/github/license/tower1229/AJAX-Cache.svg)]()

> :tophat:The best jQuery-ajax-cache plugin

## Introduction

AJAX-Cache is a jQuery plug-in. It implements asynchronous request caching based on localStorage/sessionStorage, and provides two cache modes: snapshot and timer.

## Install

### npm

`npm i ajax-cache  --save`

### Download

https://github.com/tower1229/AJAX-Cache

## Usage

You only need to add a `localCache` configuration for jQuery.ajax ()

### Open the snapshot cache

```
$.ajax({
    url: "http://rapapi.org/mockjsdata/9195/common/getRandom",
    dataType:'json',
    localCache: 'snapshot',
    success: function(res) {
        if (res.snapshot) {
            console.log('[snapshot] ' + res.data);
        } else {
            console.log('[remote data] ' + res.data);
        }
    }
});
```

### Open the timing caching

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

### Scavenging caching

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

### Scavenging all caches

```
$.ajaxCache.clear();
```

### Configuration

```
$.ajaxCache.set({
	storage: 'localStorage', 		//Storage mode, default "localStorage", optional "sessionStorage"
	cacheNamePrefix: '_ajaxcache'	//Storage prefix, usually without modification
});
```

## Live Example

http://refined-x.com/AJAX-Cache/test/

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, [refined-x.com](http://refined-x.com)
