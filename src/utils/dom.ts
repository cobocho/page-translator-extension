import type { TextNode } from "~interface/node"

interface ScrollAreaInformationOptions {
  nodes: TextNode[]
  margin?: number
}

export const getCurrentScrollAreaInformation = ({
  margin = 1000
}: ScrollAreaInformationOptions) => {
  const current = window.scrollY
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight

  const start = Math.max(0, current - margin)
  const end = current + viewportHeight + margin

  return {
    start,
    end,
    current
  }
}

export const getNodesInView = (
  nodes: TextNode[],
  scrollArea: ReturnType<typeof getCurrentScrollAreaInformation>
) => {
  return nodes.filter(({ node }) => {
    const element = node as HTMLElement
    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + window.scrollY
    const elementBottom = rect.bottom + window.scrollY

    return elementTop >= scrollArea.start && elementBottom <= scrollArea.end
  })
}

export const getAllTextDOM = (): TextNode[] => {
  const elementsWithTextChildren: TextNode[] = []

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null
  )

  let currentNode = walker.currentNode

  while (currentNode) {
    const children = currentNode.childNodes
    if (children.length > 0) {
      let text = ""
      const allTextChildren = Array.from(children).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent
        }
      })
      if (text.length > 0) {
        elementsWithTextChildren.push({
          node: currentNode,
          translation: null,
          id: Math.random().toString(36).substr(2, 9),
          text
        })
      }
    }

    currentNode = walker.nextNode()
  }

  return elementsWithTextChildren
}
