/*
 * @Author: houzhenyu 
 * @Date: 2019-03-27 16:13:39 
 * @Last Modified by: jerry
 * @Last Modified time: 2019-03-27 16:13:39 
 */
(function(){
/**
 * 猴哥路由
 * 注册：
 		带参数 iRouter.push('/user/:age/:name', function(param){ Todo... });
 		无参数 iRouter.push('/user/profile', function(){});
 * 跳转：
 	iRouter.go('/user/profile');
 	iRouter.go('/user/20/jerry');
 	或
 	iRouter.push('/user/profile');
 	iRouter.push('/user/20/jerry');
 * 当前路由
 	iRouter.get();
 */
window.iRouter = {
	/**
	 * 跳转到指定路由
     * @param {*} path 路由地址
	 */
	go: function( path ){
		window.location.hash = path;
	},
	/**
     * 根据 hash 路由跳转(注：兼容 IE8+及主流浏览器)
     * 重复添加相同的path会被覆盖
     * @param {*} path     路由地址（注：当路由没有匹配时，设置为*）
     * @param {*} callback 回调方法（注：不存在回调，跳转新路由 ）
     * @param callback(param) param 路由参数
     */
    push: function ( path, callback ) {
        // 如果回调方法不存在
        // 则认为跳转到新路由
        if(!callback){
            window.location.hash = path;
            return ;
        }
        // 只创建一次监听
        if(!window.isInstalledRouter){
            // 处理浏览器兼容事件
            if (window.addEventListener) {
                // chrome,firefox
                window.addEventListener('hashchange', xevent);
                window.addEventListener('load', xevent);
            }else if (window.attachEvent) {
                // IE8+
                window.attachEvent('onhashchange', xevent);
                window.attachEvent('onload', xevent);
            }
            /** 
             * 监听 url 中 hash 变化 
             */
            function xevent() {
                // 从 url 中获取 hash
                var curr_path =window.location.hash.substring(1) || '/';
                // start.
                fire(curr_path);
            }
            /**
             * 解析路由并执行回调方法
             * @param {*} xpath
             */
            function fire(xpath){
                var p = fx(xpath);
                var params = {};
                var unmodel = true;
                // 从路由仓库中查找当前 path 对应的 model
                for(model in window.iRoutersStore){
                    var m = fx(model);
                    var match_model = new RegExp("^"+(m.modelPrefix==='*' ? '\\'+ m.modelPrefix : m.modelPrefix)+"+","g");
                    // 根据路由 path 获取匹配模型
                    if(match_model.test(xpath) 
                        && (m.modelPrefix != '/' || xpath == '/') 
                        && m.items.length == p.items.length){
                            
                        // 获取路由中所有参数
                        for(var i = m.modelPrefixLen; i<p.length; i++){
                            params[m.items[i].replace(/^:/, '')] = p.items[i];
                        }
                        // 执行路由对应的回调方法
                        window.iRoutersStore[model] && window.iRoutersStore[model](params);
                        // 缓存 当前路由信息
                        setCurrRouter(xpath, window.iRoutersStore[model], params);
                        // 关闭其它路由锁
                        unmodel = false;
                        break;
                    }
                }
                // path不存在，则走缺省路由 
                if(unmodel || (unmodel && xpath==='/')){
                    window.iRoutersStore['*'] && window.iRoutersStore['*']();
                    // 缓存 当前路由信息
                    setCurrRouter(xpath, window.iRoutersStore['*'], {});
                }
                // console.log(m,p,params);
            }
            /**
             * 设置当前路由
             */
            function setCurrRouter(path, callback, params){
                window.iCurrentRouterEntity = {
                    path: path,
                    callback: callback,
                    params: params
                };
            }
            /**
             * 路由 model 和 path 解析器
             * @param {*} path 
             */
            function fx(path){
                var ms = path.split('/');
                var prefix = ms[0];
                var len = ms.length;
                var modelPrefix = "";
                // 获取路由模型固定前缀
                if(path.indexOf('/:') != -1){
                    modelPrefix = path.split('/:')[0];
                }else{
                    modelPrefix = path;
                }
        
                return {
                    items: ms,
                    prefix: prefix,
                    length: len,
                    modelPrefix: modelPrefix,
                    modelPrefixLen: modelPrefix.split('/').length
                }
            }
            // 事件监听锁
            window.isInstalledRouter = true;
            // 路由仓库
            window.iRoutersStore = {};
        }
        // 将路由注册到仓库中
        // 重复添加会被覆盖
        window.iRoutersStore[ path ] = callback;
    },
    /**
     * 获取当前路由信息
     */
    get: function(){
        return window.iCurrentRouterEntity || {};
    }
}
})();