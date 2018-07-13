import {snapshotNode} from './snapshotNode'
import {StyledElement} from './StyledElement'

describe(`${snapshotNode.name}`, () => {
    document.body.innerHTML = `
        <div id="will-clone" class="outer" style="height: 800px;">
            <div class="inner"></div>
        </div>
        <style type="text/css">
        .outer {
            width: 500px;
            height: 1000px; /* will be overridden */
        }
        .inner {
            color: black;
        }
        </style>
    `

    const toClone = document.getElementById('will-clone') as StyledElement
    const snapshot = snapshotNode(toClone)
    const snapshotInner = snapshot.children[0] as StyledElement

    test(`should snapshot computed style to inline style`, () => {
        expect(snapshot.style.width).toEqual('500px')
        expect(snapshot.style.height).toEqual('800px')
        expect(snapshot.className).toEqual('')
    })

    test(`should snapshot recursively`, () => {
        expect(snapshotInner.style.color).toEqual('black')
        expect(snapshot.className).toEqual('')
    })
})