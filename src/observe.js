// Observe 负责数据劫持

class Observe {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  //遍历data中所有数据
  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      //如果遇到了引用类型,继续递归劫持
      this.walk(data[key])
    })
  }

  //定义响应式数据(数据劫持)
  defineReactive(data, key, oldValue) {
    //保存this指向
    const OBSERVER = this
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        return oldValue
      },
      set(newValue) {
        if (oldValue === newValue) return
        oldValue = newValue
        //如果重新赋值,也进行数据劫持
        OBSERVER.walk(newValue)
      }
    })
  }
}
