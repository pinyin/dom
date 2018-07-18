import 'mutationobserver-shim'
import {snapshotNode} from './snapshotNode'
import {StyledElement} from './StyledElement'

declare const global: any

global.MutationObserver = (window as any).MutationObserver

document.body.innerHTML = `
    <div id="will-clone" class="outer" style="height: 800px;">
        <div class="inner"></div>
    </div>
    <style type="text/css">
    .outer {
        width: 500px;
        height: 1000px; /* will be overridden */
        overflow: scroll;
    }
    .inner {
        color: black;
        height:2000px;
    }
    </style>
`

describe(`${snapshotNode.name}`, () => {
    const toClone = document.getElementById('will-clone') as StyledElement
    toClone.scrollTop = 100
    const snapshot = snapshotNode(toClone)
    document.body.appendChild(snapshot)
    const snapshotInner = snapshot.children[0] as StyledElement

    test(`should snapshot computed style to inline style`, async () => {
        expect(snapshot.style.width).toEqual('500px')
        expect(snapshot.style.height).toEqual('800px')
        expect(snapshot.className).toEqual('')
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(snapshot.scrollTop).toEqual(100) // not sure if this is working or not
    })

    test(`should snapshot recursively`, () => {
        expect(snapshotInner.style.color).toEqual('black')
        expect(snapshot.className).toEqual('')
    })
})
