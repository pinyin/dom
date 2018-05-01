export function arrayFromNodeList(nodeList: NodeList): Array<Node> {
    const result = [] as Array<Node>
    for (let i = 0; i < nodeList.length; i++) {
        result.push(nodeList.item(i))
    }
    return result
}
