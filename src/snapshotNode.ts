import {existing, notExisting} from '@pinyin/maybe'
import {px} from '@pinyin/types'
import {hasStyle} from './hasStyle'
import {isStyledElement, StyledElement} from './StyledElement'
import {travel} from './travel'

type StringContainer = { [key: string]: string }

export function snapshotNode<T extends StyledElement>(node: T, shouldConsolidateStyle: boolean = true): T {
    const clonedNode = node.cloneNode(true) as StyledElement
    const styles = new Map<StyledElement, StringContainer>()
    const priorities = new Map<StyledElement, StringContainer>()
    const scrolls = new Map<HTMLElement, Scroll>()
    for (const [from, to] of pair(travel(node), travel(clonedNode))) {
        if (shouldConsolidateStyle && isStyledElement(from) && isStyledElement(to)) {
            const computedStyle: CSSStyleDeclaration = getComputedStyle(from)
            const style: StringContainer = {}
            const priority: StringContainer = {}
            Array.from(computedStyle).forEach(key => {
                const value = computedStyle.getPropertyValue(key)
                if (hasStyle(value)) {
                    style[key] = value
                    priority[key] = computedStyle.getPropertyPriority(key)
                }
            })
            styles.set(to, style)
            priorities.set(to, style)
        }
        if (from instanceof HTMLElement && to instanceof HTMLElement) {
            if (from.scrollTop !== 0 || from.scrollLeft !== 0) {
                scrolls.set(to, {top: from.scrollTop, left: from.scrollLeft})
            }
        }
    }
    // batch read & write to prevent reflow
    for (const to of travel(clonedNode)) {
        if (shouldConsolidateStyle && isStyledElement(to)) {
            const style = styles.get(to)
            const priority = priorities.get(to)
            if (notExisting(style) || notExisting(priority)) {
                throw new Error(`Style not present for ${to}`)
            }
            Object.keys(style).forEach(key => {
                to.style.setProperty(key, style[key], priority[key])
            })
            to.setAttribute('class', '')
        }
    }
    if (clonedNode instanceof HTMLElement) {
        adjustScrollAfterAdded(clonedNode, scrolls)
    }
    return clonedNode as T
}

function adjustScrollAfterAdded(clonedNode: HTMLElement, scrolls: Map<HTMLElement, Scroll>): void {
    if (!initialized) {
        observer.observe(document.body, {subtree: true, childList: true}) // FIXME what if document.body is deleted?
        initialized = true
    }

    addedToDocumentListeners.set(clonedNode, () => {
        for (const to of travel(clonedNode)) {
            if (to instanceof HTMLElement) {
                const scroll = scrolls.get(to)
                if (existing(scroll)) {
                    to.scrollTop = scroll.top
                    to.scrollLeft = scroll.left
                }
            }
        }
    })
}

type Scroll = { left: px, top: px }

const addedToDocumentListeners = new WeakMap<Node, () => void>()

let initialized: boolean = false
const observer = new MutationObserver((records: Array<MutationRecord>) => {
    records.forEach(record => {
        if (record.addedNodes.length > 0) {
            Array.from(record.addedNodes).forEach(addedNode => {
                const listener = addedToDocumentListeners.get(addedNode)
                if (listener) {
                    try { listener() } catch {}
                }
            })
        }
    })
})

function* pair<A, B>(ai: IterableIterator<A>, bi: IterableIterator<B>): IterableIterator<[A, B]> {
    for (let a = ai.next(), b = bi.next();
         !a.done && !b.done;
         a = ai.next(), b = bi.next()) {
        yield [a.value, b.value]
    }
}
