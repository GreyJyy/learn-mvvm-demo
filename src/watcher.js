class Watcher {
  //vm:vue实例  expression:data中的数据名 cb:数据改变时的回调
  constructor(vm, expression, cb) {
    this.vm = vm
    this.expression = expression
    this.cb = cb
    //把创建的订阅者watcher存储到Dep.target属性上
    Dep.target = this
    //获取旧值,这里会触发get
    this.oldValue = this.getVmValue(vm, expression)
    //清空watcher
    Dep.target = null
  }
  //对外暴露的方法,用于更新视图
  update() {
    const oldValue = this.oldValue
    const newValue = this.getVmValue(this.vm, this.expression)
    if (oldValue !== newValue) {
      this.cb(oldValue, newValue)
    }
  }
  /**
   *
   * @param {Object} vm vue实例
   * @param {String} expression mustache匹配的字符串
   * @returns 获取最里层数据
   */
  getVmValue(vm, expression) {
    let data = vm.$data
    //解决[object Object]问题
    if (data[expression] instanceof Object)
      return JSON.stringify(data[expression])
    //循环赋值
    expression.split('.').forEach(key => (data = data[key]))
    return data
  }
}
