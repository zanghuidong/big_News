$(function () {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    //定义查询参数对象，将来i请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示条数
        cate_id: '', //文章类型
        state: '', //文章状态
    }

    function initDate(n) {
        return n > 9 ? n : '0' + n
    }

    template.defaults.imports.dateFormat = function (date) {
        let dt = new Date(date)
        let Y = dt.getFullYear()
        let M = initDate(dt.getMonth() + 1)
        let D = initDate(dt.getDate())
        let HH = initDate(dt.getHours())
        let mm = initDate(dt.getMinutes())
        let ss = initDate(dt.getSeconds())
        return Y + '-' + M + '-' + D + ' ' + ' ' + HH + ':' + mm + ':' + ss
    }

    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                let htmlStr = template('art_list', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    getCateList()

    function getCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                let htmlStr = template('art_cates', res)

                $('[name=cate_id]').empty().html(htmlStr)




                form.render()
            }
        })
    }


    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total,   //总数据条数
            limit: q.pagesize, //每页显示几条数据
            limits: [2, 3, 5, 10],
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }





    //文章列表编辑按钮
    // 定义opan弹窗层返回的id
    let index_edit = null

    //编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {


        // 定义弹窗层
        index_edit = layer.open({
            type: 1,
            area: ['1000px', '600px'],
            title: '编辑文章',
            content: $('#dialog_edit').html()
        })

        // 调用初始化裁剪区域
        initImg()

        // 获取要编辑的文章id
        let id = $(this).attr('data-id')

        // 调用GET请求根据文章id获取文章内容

        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                let htmlStr = template('art_cates', res)


                $('#cate_id').empty().html(htmlStr)



                form.render()
                $.ajax({
                    method: 'GET',
                    url: '/my/article/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('获取文章失败!')
                        }
                        layer.msg('获取文章成功!')

                        // 获取到文章内容赋值给编辑的form表单
                        form.val('form_pub', res.data)

                        form.render()
                        // 初始化富文本编辑器
                        initEditor()




                    }
                })
            }
        })




    })

    //初始化裁剪图片

    var $myimage = {};
    //
    function initImg() {
        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)
        //为创建的文件选择框绑定点击事件
        $('#upFile').on('click', function () {
            $('.file').click()
        })
        // 为文件选择框绑定change事件
        //裁剪区域显示所选图片
        $('.file').on('change', function (e) {

            let files = e.target.files
            if (files.length === 0) {
                return layer.msg('请选择图片!')
            }


            let newImgURL = URL.createObjectURL(files[0])

            $myimage = $image.cropper('destroy').attr('src', newImgURL).cropper(options)// 重新初始化裁剪区域


        })
    }

    //定义文章发布的状态，默认状态已发布
    let art_state = '已发布'
    //通过代理为草稿按钮绑定点击事件
    $('body').on('click', '#btn_draft', function () {
        //点击草稿按钮文章发布状态变为草稿
        art_state = '草稿'
    })


    //通过代理为编辑弹出层form表单绑定提交事件
    $('body').on('submit', "#form_pub", function (e) {
        //阻止默认行为
        e.preventDefault()

        //实例化formData对象
        let fd = new FormData($(this)[0])
        // 将状态插入到formData对象中
        fd.append('state', art_state)
        // 定义一个DOM对象接收裁剪区函数返回的DOM对象

        // 调用裁剪区DOM对象，将其数据格式转换为blob格式
        $myimage
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 调用更新文章接口方法来为文章更新
                updateArticle(fd)
            })
    })



    //  定义更新文章函数
    function updateArticle(fd) {


        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('修改文章失败!')
                }
                layer.msg('修改文章成功!')
                // 更新文章成功后文章状态改为默认状态
                art_state = '已发布'
                // 关闭弹出层
                layer.close(index_edit)
                //调用初始化文章列表，将更新文章的内容显示在文章列表中
                initTable()
            },
        })
    }


    //删除文章功能
    // 为删除按钮绑定点击事件弹窗提示框
    $('tbody').on('click', '.btn-del', function () {
        //获取删除按钮的个数
        let len = $('.btn-del').length
        let id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章删除失败!')
                    }
                    layer.msg('文章删除成功!')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });



    })




})

