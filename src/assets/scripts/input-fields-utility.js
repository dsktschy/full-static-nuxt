export function isRadio(item) {
  return item.type === 'radio'
}

export function isCheckbox(item) {
  return item.type === 'checkbox'
}

export function isSelect(item) {
  return item.type === 'select'
}

export function isTextarea(item) {
  return item.type === 'textarea'
}

export function isRadioOrCheckbox(item) {
  return ['radio', 'checkbox'].includes(item.type)
}

export function isRadioOrSelect(item) {
  return ['radio', 'select'].includes(item.type)
}

export function isTextOrTextarea(item) {
  return ['text', 'textarea'].includes(item.type)
}

export function isSingleOptionCheckbox(item) {
  return isCheckbox(item) && item.options.length === 1
}

export function createDefaultValue(item) {
  let value = ''
  if (isCheckbox(item)) {
    if (!item.options.length) {
      value = false
    } else if (item.options.length === 1) {
      value = item.options[0].selected
    } else {
      const options = item.options.filter((option) => option.selected)
      value = options.map((option) => option.value)
    }
  } else if (isRadioOrSelect(item)) {
    if (!item.options.length) value = ''
    else {
      const option = item.options.find((option) => option.selected)
      value = option ? option.value : ''
    }
  }
  return value
}
