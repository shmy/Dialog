# Dialog
一个简单的对话框组件<br>

 *  实现自定义风格的alert/confirm toast 对话框<br>
 *  支持回调 ok<br>
 *  支持动画过渡 ok <br>
 *  支持是否模态 ok<br>
 *  目前实现了Alert<br>

默认均是模态<br>
#如何使用?<br>
引入 Dialog.css和Dialog.js<br>
最简单调用一个 ： Dialog.alert('欢迎！');<br>
传入一个字符串，显示一个最简单的提示框，当然不支持回调函数，只有一个默认的确定按钮，点击则会关闭对话框！<br>
或者使用更完整的选项：<br>
Dialog.alert({<br>
  t: '标题',<br>
  c: '内容',<br>
  m: true,<br>
  b: {<br>
    '确定': function() {<br>
            Dialog.alert('1你点击了确定！');<br>
        }<br>
      }<br>
});<br>
t:定义标题<br>
c:定义内容信息<br>
b:一个对象，key为按钮名字，value为回调函数<br>
m:是否非模态，默认false<br>
