import {StyledElement} from './StyledElement'

export function consolidateComputedStyle(from: StyledElement, to: StyledElement): void {
    const computedStyles = getComputedStyle(from)
    Array.from(computedStyles).forEach(key =>
        to.style.setProperty(
            key,
            computedStyles.getPropertyValue(key),
            computedStyles.getPropertyPriority(key),
        ),
    )
    to.setAttribute('class', '')
}
