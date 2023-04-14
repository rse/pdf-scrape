/*
**  PDF-Scrape -- PDF Text Scraping
**  Copyright (c) 2020-2023 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  helper type  */
type Fragment = {
    t:                      string,        /*  the text of the fragment  */
    p:                      number,        /*  integral page number (1..n)  */
    x:                      number,        /*  floating-point number of PDF points of fragment x-position on page  */
    y:                      number,        /*  floating-point number of PDF points of fragment y-position on page  */
    w:                      number,        /*  floating-point number of PDF points of fragment width  on page  */
    h:                      number,        /*  floating-point number of PDF points of fragment height on page  */
}

/*  the API class  */
export class PDFScrape {
    public constructor(options?: {
        mergeFragments?:    boolean,       /*  whether to merge consecutive text fragments            (default: false) */
        roundCoordinates?:  boolean,       /*  whether to round text fragment coordinates             (default: false) */
        lineThreshold?:     number,        /*  PDF points the y-positions of lines can be offset      (default: 0.5)   */
        charThreshold?:     number,        /*  PDF points the x-positions of characters can be offset (default: 1.5)   */
        wordThreshold?:     number         /*  PDF points the x-positions of words can be offset      (default: 5.0)   */
    })
    findAll(
        document:           Buffer         /*  buffer of PDF document to scrape  */
    ): Array<Fragment>
    findMatching(
        document:           Buffer,        /*  buffer of PDF document to scrape  */
        items: {
            [ id: string ]: RegExp         /*  the regular expression to match the text fragment  */
        }
    ): {
        [ id: string ]:     Fragment       /*  the fragment corresponding to the match  */
    }
}

