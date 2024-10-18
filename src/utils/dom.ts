import type { TextNode } from "~interface/node"

interface ScrollAreaInformationOptions {
  nodes: TextNode[]
  margin?: number
}

export const getScreenEdgePosition = () => {
  return {
    top: window.scrollY,
    bottom: window.scrollY + window.innerHeight
  }
}

export const checkIfNodeIsInView = (node: HTMLElement, margin = 500) => {
  const { top: nodeTop, bottom: nodeBottom } = node.getBoundingClientRect()
  const { top: screenTop, bottom: screenBottom } = getScreenEdgePosition()

  const nodeTopHigherThanScreenBottom =
    nodeTop + window.scrollY - margin <= screenBottom
  const nodeBottomLowerThanScreenTop =
    nodeBottom + window.scrollY + margin >= screenTop

  return nodeTopHigherThanScreenBottom && nodeBottomLowerThanScreenTop
}

const NO_TRANSLATION_TAGS = ["code", "pre", "script", "style"]

export const getAllTextDOM = () => {
  const elementsWithTextChildren = []

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null
  )

  let currentNode = walker.currentNode

  while (currentNode) {
    // 현재 노드의 태그 이름을 소문자로 변환하여 확인합니다.
    const tagName = currentNode.nodeName.toLowerCase()

    if (tagName === "body") {
      currentNode = walker.nextNode()
      continue
    }

    // 'code', 'pre', 'script' 태그는 건너뜁니다.
    if (NO_TRANSLATION_TAGS.includes(tagName)) {
      currentNode = walker.nextSibling() // 현재 노드의 다음 형제 노드로 이동
      continue
    }

    const children = currentNode.childNodes
    if (children.length > 0) {
      let text = ""
      Array.from(children).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent
        }
      })
      if (text.length > 0) {
        elementsWithTextChildren.push({
          node: currentNode,
          translation: null,
          text
        })
      }
    }

    currentNode = walker.nextNode()
  }

  return elementsWithTextChildren
}
