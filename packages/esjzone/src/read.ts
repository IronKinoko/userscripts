function removeLoveEmoji() {
  function transBody(node?: ChildNode) {
    const nodes = node ? node.childNodes : document.body.childNodes
    for (const node of nodes) {
      if (node.nodeType === node.TEXT_NODE) {
        const text = node as Text
        text.data = text.data.replace(/❤/g, '❤︎')
      } else {
        transBody(node)
      }
    }
  }

  transBody()
}
export function main() {
  removeLoveEmoji()
}
