$(function () {
    $('#link_reg').on('click', () => {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui获取form对象
    let form = layui.form
    // 从layui获取layer对象
    let layer = layui.layer
    //通过form.verify()函数来自定义校验规则
    form.verify({
        //自定义了一个叫做pwd校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的值
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            let re = $('.reg-box [name=password]').val()
            if (re !== value) return '两次密码不一致!'

        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功!请登录');
                $('#link_login').click()
            }
        })
    })
    //监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单的数据serialize()函数
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功!')
                //将登录成功后得到的token字符串保存到loaclStorage里面
                localStorage.setItem('token', res.token)
                //跳转到后台首页
                location.href = '/index.html'
            }
        })
    })
})
