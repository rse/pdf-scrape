/*
**  PDF-Scrape -- PDF Text Scraping
**  Copyright (c) 2020-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  built-in requirements  */
const path      = require("path")

/*  external requirements  */
const PDFJS     = require("pdfjs-dist/es5/build/pdf.js")
const PDFJScmap = path.join(require.resolve("pdfjs-dist"), "cmaps")

/*  the API class  */
class PDFScrape {
    constructor (options = {}) {
        /*  provide option defaults  */
        this.options = {
            mergeFragments:   false,
            roundCoordinates: false,
            lineThreshold:    0.5,
            charThreshold:    1.5,
            wordThreshold:    5.0,
            ...options
        }
    }

    /*  find all text fragments in a PDF  */
    async findAll (data) {
        /*  open PDF document  */
        const doc = await PDFJS.getDocument({
            data:       data,
            cMapUrl:    PDFJScmap,
            cMapPacked: true,
            verbosity:  0
        }).promise

        /*  PASS 1: find all text fragments
            by iterating over all pages...  */
        let fragments = []
        for (let p = 1; p <= doc.numPages; p++) {
            const page = await doc.getPage(p)
            const viewport = page.getViewport({ scale: 1.0 })

            /*  ...and iterating over all text fragments...  */
            const textContent = await page.getTextContent({ normalizeWhitespace: true })
            for (const textItem of textContent.items) {
                /*  determine coordinates  */
                const t  = textItem.str
                const w  = textItem.width
                const h  = textItem.height
                const tx = PDFJS.Util.transform(viewport.transform, textItem.transform)
                const fh = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))
                const x  = tx[4]
                const y  = tx[5] - fh
                fragments.push({ t, p, x, y, w, h })
            }
        }

        /*  PASS 2: optionally merge consecutive text fragments  */
        if (this.options.mergeFragments) {
            let j = 0
            let i = 0
            const merged = []
            merged[j] = fragments[i++]
            while (i < fragments.length) {
                const diffV = Math.abs(merged[j].y - fragments[i].y)
                const diffH = Math.abs(fragments[i].x - (merged[j].x + merged[j].w))
                if (diffV <= this.options.lineThreshold && diffH <= this.options.wordThreshold) {
                    if (diffV <= this.options.charThreshold)
                        merged[j].t = merged[j].t + fragments[i].t
                    else
                        merged[j].t = merged[j].t + " " + fragments[i].t
                    merged[j].w = (fragments[i].x + fragments[i].w) - merged[j].x
                    i++
                }
                else
                    merged[++j] = fragments[i++]
            }
            fragments = merged
        }

        /*  PASS 3: optionally round coordinates  */
        if (this.options.roundCoordinates) {
            for (const fragment of fragments) {
                fragment.x = Math.round(fragment.x)
                fragment.y = Math.round(fragment.y)
                fragment.w = Math.round(fragment.w)
                fragment.h = Math.round(fragment.h)
            }
        }

        return fragments
    }

    /*  find matching fragment areas  */
    async findMatching (data, items = {}) {
        /*  PASS 1: find all fragments  */
        const fragments = await this.findAll(data)

        /*  PASS 2: reduce to matching fragments  */
        const result = {}
        for (const id of Object.keys(items)) {
            for (const fragment of fragments) {
                if (fragment.t.match(items[id])) {
                    result[id] = fragment
                    break
                }
            }
        }
        return result
    }
}

/*  export API class  */
module.exports = PDFScrape

