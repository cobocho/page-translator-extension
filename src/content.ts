import debounce from "lodash.debounce"

import { sendToBackground } from "@plasmohq/messaging"

import type { TextNode } from "~interface/node"
import { checkIfNodeIsInView, getAllTextDOM } from "~utils/dom"

const commitTranslation = (textNodes: TextNode[]) => {
  textNodes.forEach(({ node, translation }) => {
    const targetNode = node as HTMLElement

    targetNode.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent = translation
      }
    })

    targetNode.dataset.translated = "true"
  })
}

const allTextDOMS: Array<TextNode> = []

const translate = async (nodes: TextNode[]) => {
  try {
    const response = await sendToBackground({
      name: "translate",
      body: {
        nodes
      }
    })

    return response
  } catch (e) {
    return "번역 실패) " + e
  }
}

const checkIfNodeUnTranslated = (node: TextNode) => {
  const targetNode = node.node as HTMLElement

  return targetNode.dataset.translated !== "true"
}

const scrollHandler = debounce(async () => {
  const inviewNodes = allTextDOMS.filter(({ node }) =>
    checkIfNodeIsInView(node as HTMLElement)
  )

  const targetNodes = inviewNodes.filter(checkIfNodeUnTranslated)

  if (targetNodes.length === 0) {
    return
  }

  const response = await translate(targetNodes)

  response.data.result.forEach((translatedText: string, index: number) => {
    const nodeItem = targetNodes[index]

    nodeItem.translation = translatedText
  })

  commitTranslation(targetNodes)
}, 1000)

const setTextDOMS = () => {
  const textDOMS = getAllTextDOM()

  allTextDOMS.push(...textDOMS)
}

const init = () => {
  setTextDOMS()

  window.addEventListener("scroll", scrollHandler)
}

window.addEventListener("load", init)
