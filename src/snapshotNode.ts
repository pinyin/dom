import {notExisting} from '@pinyin/maybe'
import {isStyledElement, StyledElement} from './StyledElement'
import {travel} from './travel'

export function snapshotNode<T extends StyledElement>(node: T): T {
    const clonedNode = node.cloneNode(true) as StyledElement
    const styles = new Map<StyledElement, string>()
    for (const [from, to] of pair(travel(node), travel(clonedNode))) {
        if (isStyledElement(from) && isStyledElement(to)) {
            const computedStyle: string = getComputedStyle(from).cssText
            styles.set(to, computedStyle)
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

function* pair<A, B>(ai: IterableIterator<A>, bi: IterableIterator<B>): IterableIterator<[A, B]> {
    for (let a = ai.next(), b = bi.next();
         !a.done && !b.done;
         a = ai.next(), b = bi.next()) {
        yield [a.value, b.value]
    }
}
