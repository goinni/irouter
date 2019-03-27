# Auther: 侯振宇
## 兼容 ie8+
## 注册：
带参数 
```
	iRouter.push('/user/:age/:name', function(param){ 
		Todo... 
	});
```	
无参数 
```
	iRouter.push('/user/profile', function(){
		// Todo...
	});
```
## 跳转：
```
 	iRouter.go('/user/profile');
 	iRouter.go('/user/20/jerry');
```
或
```
	iRouter.push('/user/profile');
	iRouter.push('/user/20/jerry');
```
## 当前路由
```
	iRouter.get();
```

