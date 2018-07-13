export type StyledElement = HTMLElement | SVGElement

export function isStyledElement(obj: any): obj is StyledElement {
    return obj instanceof HTMLElement || obj instanceof SVGElement
}
