//创建Vue实例
class Vue {
  constructor(options = {}) {
    //实例添加属性
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods
    //监视data中的数据
    new Observe(this.$data)
    this.proxy(this.$data)
    this.proxy(this.$methods)
    if (this.$el) {
      //Compile负责解析模板内容
      new Compile(this.$el, this)
    }
  }
  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] === newValue) return
          data[key] = newValue
        }
      })
    })
  }
}
