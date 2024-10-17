import debounce from "lodash.debounce"

import type { TextNode } from "~interface/node"
import {
  getAllTextDOM,
  getCurrentScrollAreaInformation,
  getNodesInView
} from "~utils/dom"

const allTextDOMS: {
  [key: string]: TextNode
} = {}

const commitTranslation = (textNode: TextNode) => {
  if (textNode.translation) {
    textNode.node.textContent = textNode.translation
  }
}

const recordTranslation = (textNodes: TextNode[]) => {
  textNodes.forEach((textNode) => {
    const targetNode = allTextDOMS[textNode.id]
    if (targetNode.translation) {
      return
    }

    targetNode.translation = "번역되었습니다."
    commitTranslation(targetNode)
  })
}

const scrollHandler = debounce((e: Event) => {
  const nodes = Object.values(allTextDOMS)
  const area = getCurrentScrollAreaInformation({ nodes })

  const inviewNodes = getNodesInView(nodes, area)
  recordTranslation(inviewNodes)
}, 1000)

const setTextDOMS = () => {
  const textDOMS = getAllTextDOM()
  textDOMS.forEach((textDOM) => {
    allTextDOMS[textDOM.id] = textDOM
  })
}

const init = () => {
  setTextDOMS()

  window.addEventListener("scroll", scrollHandler)
}

window.addEventListener("load", init)
