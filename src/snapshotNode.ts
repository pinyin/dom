import {notExisting} from '@pinyin/maybe'
import {isStyledElement, StyledElement} from './StyledElement'
import {travel} from './travel'

export function snapshotNode<T extends StyledElement>(node: T): T {
    const clonedNode = node.cloneNode(true) as StyledElement
    const styles = new Map<StyledElement, string>()
    for (const descendant of travel(clonedNode)) { // FIXME what's the computed styles of an element that's not in document?
        if (isStyledElement(descendant)) {
            const computedStyle: string = getComputedStyle(descendant).cssText
            styles.set(descendant, computedStyle)
        }
    }
    // batch read & write to prevent reflow
    for (const descendant of travel(clonedNode)) {
        if (isStyledElement(descendant)) {
            const style = styles.get(descendant)
            if (notExisting(style)) {
                throw new Error(`Style not present for ${descendant}`)
            }
            descendant.style.cssText = style
            descendant.setAttribute('class', '')
        }
    }
    return clonedNode as T
}
