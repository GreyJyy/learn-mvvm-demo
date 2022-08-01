class Dep {
  constructor() {
    //管理订阅者
    this.subs = []
  }
  //添加订阅者
  addSub(watcher) {
    this.subs.push(watcher)
  }
  //通知
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}
