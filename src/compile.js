//Compile负责解析模板内容
class Compile {
  constructor(el, vm) {
    //el : 选择器名
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    //vm : vue实例
    this.vm = vm

    //编译模板
    if (this.el) {
      //1.把el中所有的子节点通过fragment存放于内存中
      const _fragment = this.node2fragment(this.el)
      //2.在内存中编译fragment
      this.compile(_fragment)
      //3.把编译完成的fragment一次性添加到页面中,避免多次渲染DOM影响性能
      this.el.appendChild(_fragment)
    }
  }

  /**
   *
   * @param {HTMLElement} node 需要添加进内存的DOM
   */
  node2fragment(node) {
    const _fragment = document.createDocumentFragment()
    const _childrens = node.childNodes
    this.likeArray2Array(_childrens).forEach(node => {
      //将el中所有的子节点添加到文档碎片中
      _fragment.appendChild(node)
    })
    // 将文档碎片返回
    return _fragment
  }
  //编译模板
  compile(fragment) {
    const _childrens = fragment.childNodes
    this.likeArray2Array(_childrens).forEach(node => {
      //如果是元素节点,解析指令
      if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      // //如果是文本节点,解析插值表达式
      // if (this.isTextNode(node)) {
      //   this.compileText(node)
      // }
      //如果子节点还有子节点,需要递归解析
      if (node.childNodes) this.compile(node)
    })
  }
  //解析元素节点
  compileElement(node) {
    //1.获取当前节点下所有属性
    const attributes = node.attributes
    this.likeArray2Array(attributes).forEach(attr => {
      const attrName = attr.name
      const directiveValue = attr.value
      //2.解析所有以v-开头的属性
      if (this.isDirective(attrName)) {
        const directiveType = attrName.slice(2)
        //解析v-on
        if (this.isEventDirective(directiveType)) {
          compileUtil.handleEvent(node, this.vm, directiveType, directiveValue)
        }
        //解析v-text v-html v-model
        compileUtil[directiveType] &&
          compileUtil[directiveType](node, this.vm, directiveValue)
      }
      //3.解析@语法糖
      if (attrName.startsWith('@')) {
        compileUtil.handleEventSugar(node, this.vm, attrName, directiveValue)
      }
    })
  }
  //解析文本节点
  compileText(node) {
    console.log('文本')
  }
  /**
   *
   * @param {likeArray} likeArray 由HTMLElement组成的类数组
   * @returns 数组
   */
  likeArray2Array(likeArray) {
    return [...likeArray]
  }

  /**
   *
   * @param {HTMLElement} node 待判断类型的子节点
   * @returns 如果是元素节点返回true
   */
  isElementNode(node) {
    if (node.nodeType === 1) return true
  }

  /**
   *
   * @param {HTMLElement} node 待判断类型的子节点
   * @returns 如果是文本节点返回true
   */
  isTextNode(node) {
    if (node.nodeType === 3) return true
  }

  /**
   *
   * @param {String} attrName 待判断属性名
   * @returns 如果是以'v-'开头,返回true
   */
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  isEventDirective(directiveType) {
    return directiveType.split(':')[0] === 'on'
  }
}

//处理自定义指令逻辑
const compileUtil = {
  text(node, vm, directiveValue) {
    node.textContent = vm.$data[directiveValue]
  },
  html(node, vm, directiveValue) {
    node.innerHTML = vm.$data[directiveValue]
  },
  model(node, vm, directiveValue) {
    node.value = vm.$data[directiveValue]
  },
  handleEvent(node, vm, directiveType, directiveValue) {
    //获取事件类型
    const eventType = directiveType.split(':')[1]
    //给当前标签注册对应事件,并且将this指向vue实例
    vm.$methods[directiveValue] &&
      node.addEventListener(eventType, vm.$methods[directiveValue].bind(vm))
    return
  },
  handleEventSugar(node, vm, attrName, directiveValue) {
    const eventType = attrName.slice(1)
    vm.$methods[directiveValue] &&
      node.addEventListener(eventType, vm.$methods[directiveValue].bind(vm))
  }
}
