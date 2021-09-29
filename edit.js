/**
 * 记录输入框的操作记录，可以进行上一步(撤销)或下一步(重做)操作
 * 
 */

 
// const inputEl = document.querySelectorAll('#textarea')[0]
const inputEl = document.getElementById('jyq_editor_content')
const previousEl = document.querySelectorAll('#Undo')[0]
const nextEl = document.querySelectorAll('#Redo')[0]
// 操作数组
const operateList = []
// 按键按下时记录的输入框的信息
let beforeInputInfo = null
// 当前操作的下标，范围：[-1, operateList.length - 1]。-1代表一开始的空状态
let operateIndex = -1
// 最大操作数，超过时，最前面的操作会被丢弃
const MAX_OPERATE_NUMBER = 200

let isComposing = false

inputEl.oninput = function(e) {
  console.log('oninput', this.value, this.value && this.value.length, e.isComposing)
  if(isComposing) {
    return
  }

  recordOperate(e)
}

// 按键按下时保存输入框信息
inputEl.onmousedown = function(e) {
  beforeInputInfo = getCurrentOperateInfo(e)
}

// 按键按下时保存输入框信息
inputEl.onkeydown = function(e) {
  beforeInputInfo = getCurrentOperateInfo(e)
}

// compositionstart和compositionend通过onxxx的方式无法绑定事件
inputEl.addEventListener('compositionstart',function(e) {
  console.log('oncompositionstart')
  isComposing = true
})

inputEl.addEventListener('compositionend',function(e) {
  console.log('oncompositionend')
  recordOperate(e)
  isComposing = false
})

// 上一步(撤销)
previousEl.onclick = function() {
  recoveryOperate(true)
}

// 下一步(重做)
nextEl.onclick = function() {
  recoveryOperate(false)
}

/**
 * 记录操作
 * @param {Event} e 事件
 */
function recordOperate(e) {
  // 操作下标不是最后的下标，证明之前有进行撤销或重做操作，那么重新输入后需要删除多余的操作
  if(operateIndex !== operateList.length - 1) {
    // 操作下标不是最后的操作，则要删除操作下标后面的所有操作
    operateList.splice(operateIndex + 1, operateList.length - 1 - operateIndex)
  }

  if(operateList.length) {
    // 之前有操作
    // 判断和前面的操作是否是连续的输入或删除，是的话则算一个操作，更新信息就好
    const previousOperate = operateList[operateList.length - 1]
    
    // e.data 返回当前输入的字符串
    if(
      previousOperate.direction === inputEl.selectionDirection &&
      previousOperate.start === previousOperate.end &&
      inputEl.selectionStart === inputEl.selectionEnd &&
      (
        (// 连续输入，无论是否是拼写状态
          (// 当前的输入类型
            (
              e.type === 'input' &&
              e.inputType === 'insertText'
            ) ||
            (
              e.type === 'compositionend'
            )
          ) &&
          // 之前的输入类型
          ['insertText', 'compositionend'].includes(previousOperate.inputType) &&
          // 光标位置
          inputEl.selectionStart === previousOperate.start + (e.data ? e.data.length : 0)
        ) ||
        (// 连续删除，包括back删除和del删除
          // 当前的输入类型
          e.type === 'input' &&
          ['deleteContentBackward', 'deleteContentForward'].includes(e.inputType) &&
          // 之前的输入类型
          ['deleteContentBackward', 'deleteContentForward'].includes(previousOperate.inputType) &&
          // 光标位置
          inputEl.selectionStart === previousOperate.start - (e.inputType === 'deleteContentBackward' ? 1 : 0)
        )
      )
    ) {
      updateOperateInfo(previousOperate)
    } else {
      addOperate(e)
    }
  } else {
    // 之前没有操作
    addOperate(e)
  }

  beforeInputInfo = null
}

/**
 * 新增一个操作
 * @param {Event} e 事件
 * @param {Object} operate 操作对象
 */
function addOperate(e, operate = null) {
  const resultOperate = operate ? operate : getCurrentOperateInfo(e)
  
  // 旧光标方向
  resultOperate.oldDirection = beforeInputInfo ? beforeInputInfo.direction : resultOperate.direction
  // 旧光标开始位置
  resultOperate.oldStart = beforeInputInfo ? beforeInputInfo.start : resultOperate.start
  // 旧光标结束位置
  resultOperate.oldEnd = beforeInputInfo ? beforeInputInfo.end : resultOperate.end

  if(operateList.length > MAX_OPERATE_NUMBER) {
    // 超过最大操作数，最前面的操作会被丢弃
    operateList.shift()
  }
  operateList.push(resultOperate)
  // 更新操作下标
  operateIndex = operateList.length - 1
}

/**
 * 获取当前操作的信息
 * @param {Event} e 事件
 * @returns {Object} 操作对象信息，包括光标位置、内容、事件的输入类型
 */
function getCurrentOperateInfo(e) {
  return {
    start: inputEl.selectionStart, // 光标开始位置
    end: inputEl.selectionEnd, // 光标结束位置
    direction: inputEl.selectionDirection, // 光标方向
    value: inputEl.value, // 输入框的内容
    inputType: e.inputType ? e.inputType : e.type // 输入类型，只有input事件有inputType
  }
}

/**
 * 更新操作信息
 * @param {Object} operate 更新的操作对象
 */
function updateOperateInfo(operate) {
  operate.start = inputEl.selectionStart, // 光标开始位置
  operate.end = inputEl.selectionEnd, // 光标结束位置
  operate.direction = inputEl.selectionDirection, // 光标方向
  operate.value = inputEl.value // 输入框的内容
}

/**
 * 恢复操作
 * @param {boolean} isPrevious 是否是撤销
 */
function recoveryOperate(isPrevious) {
  if(isPrevious) {
    // 撤销
    if(operateIndex < 0) {
      alert('没有操作可以撤销！')
      return
    } else {
      const currentOperate = operateList[operateIndex]
      let previousOperate = null

      if(operateIndex > 0) {
        previousOperate = operateList[operateIndex - 1]
      }

      // 先回复内容，再恢复光标位置
      inputEl.focus()
      inputEl.value = previousOperate ? previousOperate.value : ''
      inputEl.setSelectionRange(currentOperate.oldStart, currentOperate.oldEnd, currentOperate.oldDirection);
      // 更新操作下标
      if(operateIndex > -1) {
        --operateIndex
      }
    }
  } else {
    // 重做
    if(operateIndex >= operateList.length - 1) {
      alert('没有操作可以重做！')
      return
    } else {
      let nextOperate = null

      if(operateIndex < operateList.length - 1) {
        nextOperate = operateList[operateIndex + 1]
      }

      // 先回复内容，再恢复光标位置
      inputEl.focus()
      inputEl.value = nextOperate ? nextOperate.value : ''
      inputEl.setSelectionRange(nextOperate.start, nextOperate.end, nextOperate.direction);
      // 更新操作下标
      if(operateIndex < operateList.length - 1) {
        ++operateIndex
      }
    }
  }
}