import {isElement} from './isElement'
import {StyledElement} from './StyledElement'

export function* travel(ancestor: Element): IterableIterator<Element> {
    const walker = document.createTreeWalker(
        ancestor,
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: node =>
                isElement(node) ?
                    NodeFilter.FILTER_ACCEPT :
                    NodeFilter.FILTER_SKIP, // TODO what's not element?
        },
    )
    yield ancestor
    for (let next = walker.nextNode();
         next !== null;
         next = walker.nextNode()) {
        yield next as StyledElement
    }
}
