/*
 * name: ajax-cache.js
 * version: v0.0.4
 * update: 修复请求成功队列
 * date: 2019-01-17
 */
(function($) {

	function isEqual(o, x) {
		if (!o || !x) {
			return false;
		}
		var p;
		for (p in o) {
			if (typeof(x[p]) == 'undefined') {
				return false;
			}
		}
		for (p in o) {
			if (o[p]) {
				switch (typeof(o[p])) {
					case 'object':
						if (!isEqual(o[p], x[p])) {
							return false;
						}
						break;
					case 'function':
						if (typeof(x[p]) == 'undefined' ||
							(p != 'equals' && o[p].toString() != x[p].toString()))
							return false;
						break;
					default:
						if (o[p] != x[p]) {
							return false;
						}
				}
			} else {
				if (x[p])
					return false;
			}
		}
		for (p in x) {
			if (typeof(o[p]) == 'undefined') {
				return false;
			}
		}
		return true;
	};
	// 进程管理
	var ajaxLocalCacheQueue = {};
	//配置
	var conf = {
		storage: 'localStorage',
		cacheNamePrefix: '_ajaxcache'
	};

	$.ajaxSetup({
		beforeSend: function(xhr, setting) {
			if (window[conf.storage] && setting.localCache !== void(0)) {
				var storage = window[conf.storage],
					cacheKey,
					cacheNameSep = ['|', '^', '@', '+', '$'],
					cacheNamePrefix = conf.cacheNamePrefix,
					cacheName,
					cacheDeadline,
					cacheVal;
				if (typeof setting.success !== 'function') {
					return console.warn('setting.success error!');
				}
				//获取url
				if (setting.type.toUpperCase() === 'POST') {
					cacheKey = setting.url + '?' + setting.data;
				} else {
					cacheKey = setting.url;
				}
				//请求队列
				if (ajaxLocalCacheQueue[cacheKey]) {
					ajaxLocalCacheQueue[cacheKey].push(setting.success);
					if (setting.localCache !== 'snapshot') {
						xhr.ignoreError = true;
						return xhr.abort();
					}
				}
				//间隔符容错
				$.each(cacheNameSep, function(i, sep) {
					if (cacheKey.indexOf(sep) === -1) {
						cacheNameSep = sep;
						return false;
					}
				});
				if (!cacheNameSep.split) {
					return console.log('url(' + cacheKey + ')包含异常字符无法缓存');
				}
				//查找缓存
				$.each(storage, function(key, val) {
					if (key.indexOf([cacheNamePrefix, cacheKey].join(cacheNameSep) + cacheNameSep) === 0) {
						cacheName = key;
						cacheDeadline = key.split(cacheNameSep)[2];
						cacheVal = val;
						return false;
					}
				});
				if (cacheVal && setting.dataType === 'json') {
					cacheVal = $.parseJSON(cacheVal);
				}
				if (setting.localCache && (setting.localCache === 'snapshot' || !isNaN(setting.localCache))) {
					var nowDate = new Date().getTime();
					if (cacheDeadline && (cacheDeadline > nowDate)) {
						//console.log('使用缓存 '+cacheDeadline+'>'+nowDate);
						setting.success(cacheVal);
						return false;
					} else {
						if (cacheDeadline && cacheDeadline <= nowDate) {
							//console.log('缓存过期');
							storage.removeItem(cacheName);
						}
						//使用快照
						if (cacheDeadline === 'snapshot') {
							var snapshotData = cacheVal;
							if ($.isPlainObject(cacheVal)) {
								snapshotData = $.extend(true, {}, cacheVal, {
									snapshot: true
								});
							}
							setting.success(snapshotData);
						}
						//console.log('建立缓存');
                        if (typeof(ajaxLocalCacheQueue[cacheKey]) === "undefined") {
                            ajaxLocalCacheQueue[cacheKey] = [];
                        }
                        ajaxLocalCacheQueue[cacheKey].push(setting.success);
						setting.success = function(res) {
							//数据校验
							if (setting.localCache === 'snapshot' && isEqual(res, cacheVal)) {
								res.snapshotEqual = true;
							}
							var newDeadline = setting.localCache === 'snapshot' ? 'snapshot' : (new Date().getTime() + setting.localCache),
								newCacheName = [cacheNamePrefix, cacheKey, newDeadline].join(cacheNameSep);
							$.each(ajaxLocalCacheQueue[cacheKey], function(i, cb) {
								typeof cb === 'function' && cb(res);
							});
							delete ajaxLocalCacheQueue[cacheKey];
							//缓存数据
							if ($.isPlainObject(res) || $.isArray(res)) {
								if (window.JSON) {
									res = JSON.stringify(res);
								}
							}
							storage.setItem(newCacheName, res);
							newDeadline = null;
							newCacheName = null;
						};
						var errorHandle = setting.error || function(){};
						setting.error = function(jqXHR, textStatus, errorThrown){
							delete ajaxLocalCacheQueue[cacheKey];
							errorHandle(jqXHR, textStatus, errorThrown)
						}
					}
					nowDate = null;
				} else if (cacheName) {
					//清除缓存
					storage.removeItem(cacheName);
					console.log('缓存数据[' + cacheName + ']已清除');
				}
			}
		}
	});

	$.ajaxCache = {
		set: function(config) {
			if ($.isPlainObject(config)) {
				$.extend(conf, config);
			}
		},
		clear: function() {
			var storage = window[conf.storage];
			var lst;
			for (lst in storage) {
				if (lst.indexOf(conf.cacheNamePrefix) === 0) {
					storage.removeItem(lst);
				}
			}
		}
	};
})(window.jQuery);
