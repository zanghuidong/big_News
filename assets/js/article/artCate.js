$(function () {
    let layer = layui.layer
    let form = layui.form
    //获取文章分类的列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //为添加类别按钮绑定点击事件
    let index_add = null
    $('#btn_add').on('click', function () {
        index_add = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        })
    })


    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.post('/my/article/addcates', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg('新增文章分类失败!')
            }
            layer.msg('新增文章分类成功!')
            initArtCateList()
            layer.close(index_add)
        })
    })

    let index_edit = null
    $('tbody').on('click', '.btn-edit', function () {
        index_edit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_update').html()
        })

        let id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败!')
                }
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败!')
                }
                layer.msg('更新分类信息成功!')
                initArtCateList()
                layer.close(index_edit)
            }

        })
    })

    $('tbody').on('click', '.btn-del', function () {
        let id = $(this).attr('data-id')

        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败!')
                    }
                    layer.msg('删除文章分类成功!')
                    initArtCateList()
                }
            })

            layer.close(index);
        });

    })


})