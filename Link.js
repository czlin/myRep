function linkedList() {
  const NEXT = 'next'
  const PREVIOUS = 'previous'
  var reversalKey = {
    NEXT: PREVIOUS,
    PREVIOUS: NEXT
  }
  var Node = function (element) {
    this[PREVIOUS] = null;
    this.element = element;
    this[NEXT] = null;
  }
  var length = 0;
  var head = null;
  var end = null
  this.append = function (element) {
    var node = new Node(element)
    if (head == null) {
      head = node
      end = node
    } else {
      var current = head
      while (current.next) {
        current = current.next
      }
      current.next = node;
      node.previous = current
      end = node
    }
    length++;
  }
  this.insert = function (element, position) {
    if (position < 0 || position > length) {
      console.error("position:" + position + " is out of array");
      return null
    }
    var node = new Node(element);
    var index = 0
    var current = head
    var previous
    if (position == 0) {
      if (current) {
        node.next = current
        current[PREVIOUS] = node
      }
      head = node
      length++;
      return true
    }
    if (position == length) {
      current = end
      node[PREVIOUS] = current
      current[NEXT] = node
      end = node
      length++;
      return true
    }
    var reversal = isReversal(position, length)
    var key = NEXT
    if (reversal) {
      current = end
      key = PREVIOUS
      position = length - 1 - position
    }
    while (index++ < position) {
      previous = current
      current = current[key]
    }
    node[key] = current
    node[reversalKey[key]] = previous

    previous[key] = node
    current[reversalKey[key]] = node

    length++;
    return true
  }
  this.get = function (position) {
    if (position < 0 || position >= length) {
      return null
    }
    if (position == 0) {
      return head.element
    }
    if (position == length - 1) {
      return end.element
    }
    var current = head
    var key = NEXT
    if (isReversal(position, length)) {
      current = end
      key = PREVIOUS
      position = length - 1 - position
    }

    var current = head
    var index = 0
    while (index++ < position) {
      current = current[key]
    }
    return current.element
  }
  function isReversal(position, length) {
    if (Math.round(length - 1) / 2 < position) {
      return true
    }
    return false
  }
  this.removeAt = function (position) {
    if (position < 0 || position >= length) {
      return null
    }
    var current = head
    var index = 0
    var previous
    if (position == 0) {
      head = current.next
      head.previous = null
      length--
      return current.element
    }
    var key = NEXT
    var reversal = isReversal(position, length)
    if (reversal) {
      current = end
      key = PREVIOUS
      position = length - 1 - position
    }
    while (index++ < position) {
      previous = current
      current = current[key]
    }
    // 设置next和previous的对应关系
    previous[key] = current[key]
    current[key][reversalKey[key]] = previous
    length--
    return current.element
  }
  this.toString = function () {
    if (head == null) {
      return null
    }
    var current = head
    var elementStr = ''
    while (current) {
      elementStr += current.element + ","
      current = current.next
    }
    elementStr = elementStr.substring(0, elementStr.length - 1)
    return elementStr
  }
  this.indexOf = function (element) {
    var current = head
    var index = 0
    while (current) {
      if (current.element === element) {
        return index
      }
      current = current.next
      index++
    }
    return -1
  }
  this.getLength = function () {
    return length;
  }
}