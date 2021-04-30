/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}

export function copyProperties(sourceObj, targetObj) {
  for (let key in sourceObj) {
    targetObj[key] = sourceObj[key]
  }
}

export function setWindowTitle(title) {
  document.title = title
}
