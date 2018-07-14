import {notExisting} from '@pinyin/maybe'
import {isStyledElement, StyledElement} from './StyledElement'
import {travel} from './travel'

export function snapshotNode<T extends StyledElement>(node: T): T {
    const clonedNode = node.cloneNode(true) as StyledElement
    const styleMap = new Map<StyledElement, { [key: string]: string }>()
    const priorityMap = new Map<StyledElement, { [key: string]: string }>()
    for (const descendant of travel(clonedNode)) { // FIXME what's the computed styles of an element that's not in document?
        if (isStyledElement(descendant)) {
            const computedStyle: CSSStyleDeclaration = getComputedStyle(descendant)
            const style = {} as any
            const priority = {} as any
            Array.from(computedStyle).forEach(key => {
                style[key] = computedStyle.getPropertyValue(key)
                priority[key] = computedStyle.getPropertyPriority(key)
            })
            styleMap.set(descendant, style)
            priorityMap.set(descendant, priority)
        }
    }
    // batch read & write to prevent reflow
    for (const descendant of travel(clonedNode)) {
        if (isStyledElement(descendant)) {
            const style = styleMap.get(descendant)
            const priority = priorityMap.get(descendant)
            if (notExisting(style) || notExisting(priority)) {
                throw new Error(`Style not present for ${descendant}`)
            }
            Object.keys(style).forEach(key => {
                descendant.style.setProperty(key, style[key], priority[key])
            })
            descendant.setAttribute('class', '')
        }
    }
    return clonedNode as T
}
