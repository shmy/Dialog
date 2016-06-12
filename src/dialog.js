/**
 *  实现自定义风格的alert/confirm toast 对话框
 *  支持回调 ok
 *  支持动画过渡 ok 
 *  支持是否模态 ok
 *  目前实现了Alert
 */
// 'use strict';
(function(global) {
    function Dialog() {
        this.dialogMask = this.dialogWrap = this.dialogTitle = this.dialogContent = this.dialogButtons = null;
        // touch事件or鼠标事件
        this.type = 'ontouchstart' in window ? 'touchstart' : 'click';
        // 默认模态
        this.isModal = false;
        // 动画类名
        this.animationName = 'dialog-';
        // 任务链集合
        this.tasks = [];
        // 是否有任务在运行
        this.isRun = false;
        // 执行初始化
        this.init();
    }
    // 初始化
    Dialog.prototype.init = function() {
        var _this = this;
        // 创建文档碎片
        var df = document.createDocumentFragment();
        // 创建Div
        this.dialogMask = document.createElement('div');
        this.dialogWrap = document.createElement('div');
        this.dialogTitle = document.createElement('div');
        this.dialogContent = document.createElement('div');
        this.dialogButtons = document.createElement('div');
        // 赋予样式
        this.dialogMask.className = 'dialog-mask';
        this.dialogWrap.className = 'dialog-wrap';
        this.dialogTitle.className = 'dialog-title';
        this.dialogContent.className = 'dialog-content';
        this.dialogButtons.className = 'dialog-buttons';
        // 分类装载
        this.dialogWrap.appendChild(this.dialogTitle);
        this.dialogWrap.appendChild(this.dialogContent);
        this.dialogWrap.appendChild(this.dialogButtons);
        this.dialogMask.appendChild(this.dialogWrap);
        df.appendChild(this.dialogMask);
        // 禁止滑轮事件 防止穿透
        this.dialogMask.addEventListener('mousewheel', penetrate, false);
        // 禁止触摸移动事件 防止穿透
        this.dialogMask.addEventListener('touchmove', penetrate, false);
        // 通过判断事件源的进行阻止,在titlt，content，buttons上依然会触发
        function penetrate(e) {
            var srcElement = e.srcElement || e.target;
            if (srcElement === this) {
                e.preventDefault();
            }
        }
        // 绑定动画结束事件
        this.dialogMask.addEventListener('webkitAnimationend', animationEnd, false);
        this.dialogMask.addEventListener('animationend', animationEnd, false);
        // 非退出动画不执行
        function animationEnd(e) {
            if (e.animationName !== _this.animationName + 'out') {
                return;
            }
            // 删除第一个任务
            _this.tasks.shift();
            // 如果任务链中还有任务
            if (_this.tasks.length !== 0) {
                // 再次执行渲染
                _this.render();
            } else {
                _this.isRun = false;
                // 清空提示内容
                _this.dialogTitle.innerText = '';
                _this.dialogContent.innerText = '';
                _this.dialogButtons.innerHTML = '';
            }
        }
        // 加入DOM
        document.body.appendChild(df);
    };
    // Alert
    Dialog.prototype.alert = function(arg) {
        var _this = this;
        var t, c, b, m;
        // 如果是个对象
        if (typeof(arg) === 'object') {
            t = arg.t || '提示';
            c = arg.c || '';
            m = arg.m || this.isModal;
            b = arg.b || {
                '确定': function() {
                    _this.hide();
                }
            };
            // 否则视为字符
        } else {
            t = '提示';
            c = arg;
            m = this.isModal;
            b = {
                '确定': function() {
                    _this.hide();
                }
            };
        }
        // push进任务链集合
        this.tasks.push({
            't': t,
            'c': c,
            'm': m,
            'b': b
        });
        this.do();
    };
    Dialog.prototype.do = function() {
        if (this.isRun) {
            return;
        }
        this.isRun = true;
        this.render();
    };
    // 渲染
    Dialog.prototype.render = function() {
        var _this = this;
        // 取得第一个任务
        var opt = this.tasks[0];
        // 设置对应文本
        this.dialogTitle.innerText = opt.t;
        this.dialogContent.innerText = opt.c;
        // 创建文档碎片
        var df = document.createDocumentFragment();
        var button = null;
        // 遍历创建按钮
        for (var key in opt.b) {
            button = document.createElement('div');
            button.className = 'dialog-button';
            button.innerText = key;
            // 绑定点击事件
            button.addEventListener(this.type, function() {
                // opt.b[key](); 得到的永远是最后一个遍历的对象的key
                // 并不是动态遍历
                opt.b[this.innerText]();
                _this.hide();
            }, false);
            df.appendChild(button);
        }
        // 先清空下
        this.dialogButtons.innerHTML = '';
        this.dialogButtons.appendChild(df);
        // 是否设置非模态事件
        opt.m && this.modal();
        // 显示
        this.show();
    };
    // 显示
    Dialog.prototype.show = function() {
        this.dialogMask.classList.remove(this.animationName + 'out');
        this.dialogMask.classList.add(this.animationName + 'in');
    };
    // 隐藏
    Dialog.prototype.hide = function() {
        this.dialogMask.classList.remove(this.animationName + 'in');
        this.dialogMask.classList.add(this.animationName + 'out');
    };

    // 绑定非模态事件
    Dialog.prototype.modal = function() {
        var _this = this;
        this.dialogMask.addEventListener(this.type, modal, false);

        function modal(e) {
            var srcElement = e.srcElement || e.target;
            if (srcElement === this) {
                _this.hide();
                this.removeEventListener(_this.type, modal, false);
            }
        }
    };
    // 主动注册对象
    global.addEventListener('DOMContentLoaded', function() {
        global['Dialog'] = new Dialog();
    }, false);
})(window);
