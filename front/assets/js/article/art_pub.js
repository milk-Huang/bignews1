$(function () {
    // 1.初始化分类
    let layer = layui.layer;
    let form = layui.form;
    initCata();//调用函数
    // 封装函数
    function initCata() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                // 成功后  赋值  渲染页面
                let htmlStr = template('tpl-cata', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            },
        })
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)


    // 4.选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 5.选择图片 渲染到页面
    $('#coverFile').change(function (e) {
        let file = e.target.files[0]
        // 非空校验   URL.createObjectURL() 参数不能为undefied
        if (file == undefined) return layer.msg('您可以选择一张图片哦');
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    let state = null;
    $('#btnSave1').on('click', function () {
        state = '已发布';
    })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })


    // 7.发布文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建fd文件
        let fd = new FormData($(this)[0]);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                console.log(...fd);
                // 调用函数
                publishArticle(fd);
            });
    });

    // 封装函数
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // FormData 类型数据提交,需要设置两个false
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('恭喜您,文章发表成功啦🌶');
                // 页面跳转
                // location.href = "/article/art_list.html";
                setTimeout(function () {
                    window.parent.document.querySelector("#art_list").click();
                }, 1000);
            },
        })
    }


})