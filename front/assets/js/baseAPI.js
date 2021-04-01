//$.ajaxPrefilter() 可以在调用$.get()  $.post()   $.ajax()
//   接收到 ajax 响应后,也会触动这个方法

//1.开发环境服务器地址
// var baseURL = 'http://api-breakingnews-web.itheima.net';
//2.测试环境服务器地址
var baseURL = 'http://127.0.0.1:3030';
//3.生产环境服务器地址
// var baseURL = 'http://ajax.frontend.itheima.net';

//拦截所有ajax请求并处理参数
$.ajaxPrefilter(function (options) {
    // console.log(options);
    //1.手动为 url 拼接对应的环境服务器地址
    options.url = baseURL + options.url;

    // 2.身份认证头信息添加  包含 /my/ 路径的 url 则添加 token
    if (options.url.indexOf('/my/' > -1)) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        };

        // 登录拦截 拦截所有响应,判断身份认证信息
        options.complete = function (res) {
            // console.log(res.responseJSON);

            let obj = res.responseJSON;//定义 便于多次调用
            // if (obj.status == 1 && obj.message === "身份认证失败！") {
            //     // 清空本地token
            //     localStorage.removeItem('token');
            //     // 页面跳转 跳转回登录页面  强制用户登录
            //     location.href = "/login.html";
            // }
        }


    }

});