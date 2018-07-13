import {travel} from './travel'


describe(`${travel.name}`, () => {
    const c1 = document.createElement('div')
    const c2 = document.createElement('p')
    const c3 = document.createElement('div')
    const c4 = document.createElement('svg')
    const c5 = document.createElement('path')
    c1.appendChild(c2)
    c1.appendChild(c3)
    c3.style.width = '50px'
    c3.appendChild(c4)
    c4.appendChild(c5)
    document.body.appendChild(c1)

    it(`should iterate over all descendant elements`, () => {
        expect(Array.from(travel(document.body)))
            .toEqual([document.body, c1, c2, c3, c4, c5])
    })
})
