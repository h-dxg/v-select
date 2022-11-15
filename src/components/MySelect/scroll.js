// 抽象下拉框数据对象
const Refaa = class {
  _value = ''
  _key = ''
  constructor(op) {
    this.el = op.el
    this.liHeight = op.liHeight
    this.data = op.data
    this.list = []
    this.offsetY = 0
    this.tolHeight = this.data.length * this.liHeight //所有数据总高度
    this.lastTime = new Date().getTime()
    this.value = ''
    this.key = ''
  }
  get value () {

    // 只读属性
    return this._value
  }
  set value (value) {
    if (value) {
      this._value = value
    }

  }
  get key () {
    // 只读属性
    return this._key
  }
  set key (val) {
    if (val) {
      this._key = val
    }
  }
  init () {
    this.create()
    this.initData()
    // 初始化滚动事件
    this.el.addEventListener(
      'scroll',
      //  这里本来应该写滚动函数,又去this指向发生改变,所以直接借用滚动函数的this过来
      this.handeScroll.bind(this), //ps 这里需要用bind函数不能用call和apply,详情可参考(this指向问题2文章)
      false
    )
  }
  create () {
    // 生成dom结构
    let totalBox = document.createElement('div') // 生成总盒子 超出隐藏
    totalBox.className = 'totalBox'
    totalBox.style.height = this.tolHeight + 'px'
    let listBox = document.createElement('div') // 生成可视区域盒子
    listBox.className = 'listBox'
    totalBox.append(listBox)
    this.el.append(totalBox)
    this.totalBox = totalBox
    this.listBox = listBox
  }
  initData () {
    // 计算行数 由于固定高度为600px
    this.showNum = 280 / this.liHeight
    // this.showNum = Math.floor(600 / this.liHeight) + 4
    this.list = this.data.slice(0, this.showNum)
    this.createByList(this.list)
  }
  createByList (list) {
    this.listBox.innerText = '' // 不能缺少 每次重新渲染需要清空上次记录
    let fragment = document.createDocumentFragment()
    let li = ''
    let this_ = this
    // 生成虚拟标签每次循环都添加在虚拟标签里面 减少dom操作
    for (let i = 0; i < this.showNum; i++) {
      li = document.createElement('li')
      li.style.height = this.liHeight + 'px'
      li.style.textAlign = 'center'
      li.style.color = '#606266'
      li.style.lineHeight = this.liHeight + 'px'
      li.onmouseover = function (e) {
        this.style.background = '#f5f7fa'
      }
      li.onmouseout = function (e) {
        this.style.background = '#fff'
      }
      li.setAttribute('value', list[i].value)
      li.innerText = list[i].key
      li.addEventListener("click", function (e) {
        this_.value = e.target.value
        this_.key = e.target.innerHTML
      }, true)
      fragment.append(li)
    }
    this.listBox.append(fragment)
  }
  handeScroll (e) {
    // 滚动事件给一个延迟处理 防止重复滚动
    if (new Date().getTime() - this.lastTime > 20) {
      // 滚动事件
      let scrollTop = e.target.scrollTop //滚动距离
      let prevNum = Math.floor(scrollTop / this.liHeight) //向下取整 (展示滚动的行数)
      this.offsetY = scrollTop - (scrollTop % this.liHeight) //需要偏移的距离
      // console.log(this.offsetY, ' this.offsetY')
      // console.log(this.data, 'this.data')
      // 获取新滚动的数据进行加载渲染
      // 根据下标的变化 由于这次滚动距离scrollTop,可以得到prevNum为改变的位置 也就是下标,再和上一次滚动的位置得到一个新的结束位置下标,可以得到新展示区域的数据
      this.list = this.data.slice(prevNum, prevNum + this.showNum)
      // console.log(this.list, '    this.list')
      // 新的到的数据再次构建虚拟节点
      this.createByList(this.list)
      this.listBox.style.transform = `translateY(${this.offsetY}px)` //可视区域随之改变y距离
      this.lastTime = new Date().getTime()
    }
  }
  // 销毁
  destroy (el) {
    // 删除每次生成的dom结构
    for (let i = el.children.length - 1; i >= 0; i--) {
      el.removeChild(el.children[i]);
    }

  }
}

export default {
  Refaa
}