
# pdf-scrape(3) -- PDF Text Scraping

## SYNOPSIS

```
type Fragment = {
    t:                      string,        /*  the text of the fragment  */
    p:                      number,        /*  integral page number (1..n)  */
    x:                      number,        /*  floating-point number of PDF points of fragment x-position on page  */
    y:                      number,        /*  floating-point number of PDF points of fragment y-position on page  */
    w:                      number,        /*  floating-point number of PDF points of fragment width  on page  */
    h:                      number,        /*  floating-point number of PDF points of fragment height on page  */
}

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
```

## DESCRIPTION

PDF-Scrape is a small Application Programming Interface (API) and
Command-Line Interface (CLI) to scrape texts from PDF documents. It is
intended as the pre-processing step to find anchor positions by text
fragments in a PDF document for a subsequent scraping those areas (in SVG
or PNG format) of the actual PDF document with tools like `pdftocairo`(1).
This is the documentation of the API `pdf-scrape`(3).

## EXAMPLES

## HISTORY

PDF-Scrape was developed in November 2020 for scraping the PDFs of
the various organizations providing COVID-19 statistics.

## AUTHOR

Dr. Ralf S. Engelschall <rse@engelschall.com>

