class Ref {
  constructor(data) {
    this._data = data
  }
  // 只读属性
  get data () {
    return this._data;
  }

}
let p = [] //存入数据 避免重复循环
const init = (options, select) => {
  // 格式化处理入参键值对
  // 内部固定键值对 key-value
  let result = []
  if (options.length > 0 && select) options.forEach(e => {
    result.push({
      key: e[select['key']],
      value: e[select['value']],
    })
  });

  if (result.length > 0) {
    p = new Ref(result).data
  }
  return result || []

}
// 根据value值查找出对应key值
const filter = (value) => {
  if (!value) return
  if (p && p.length > 0) {
    return p.find(e => {
      if (e.value === value) return e
    }).key
  }
}
export default {
  init,
  filter
}