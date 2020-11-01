
# pdf-scrape(1) -- Versatile Password Generator CLI

## SYNOPSIS

`pdf-scrape`
\[`-h`|`--help`\]
\[`-V`|`--version`\]
\[`-m`|`--merge-fragments`\]
\[`-r`|`--round-coordinates`\]
\[`-l`|`--line-threshold`\]
\[`-c`|`--char-threshold`\]
\[`-w`|`--word-threshold`\]
\[`-a`|`--anchor` *name*`:`*chars*|*name*`:/`*regexp*`/`]
\[`-o`|`--output-file` *file*|`-`\]
\[`-f`|`--output-format` *format*\]
*pdf-file*|`-`

## DESCRIPTION

PDF-Scrape is a small Application Programming Interface (API) and
Command-Line Interface (CLI) to scrape texts from PDF documents. It is
intended as the pre-processing step to find anchor positions by text
fragments in a PDF document for a subsequent scraping those areas (in SVG
or PNG format) of the actual PDF document with tools like `pdftocairo`(1).
This is the documentation of the CLI `pdf-scrape`(1).

## OPTIONS

The following command-line options and arguments exist:

-   \[`-h`|`--help`\]:
    Show program usage information only.

-   \[`-V`|`--version`\]:
    Show program version information only.

-   \[`-m`|`--merge-fragments`\]
    Whether to merge consecutive text fragments (default: false).

-   \[`-r`|`--round-coordinates`\]
    Whether to round text fragment coordinates (default: false).

-   \[`-l`|`--line-threshold`\]
    PDF points the y-positions of lines can be offset (default: `0.5`).

-   \[`-c`|`--char-threshold`\]
    PDF points the x-positions of characters can be offset (default: `1.5`).

-   \[`-w`|`--word-threshold`\]
    PDF points the x-positions of words can be offset (default: `5.0`).

-   \[`-a`|`--anchor` *name*`:`*chars*|*name*`:/`*regexp*`/`]
    Define an anchor point for matching.

-   \[`-o`|`--output-file` *file*|`-`\]
    Output file (default: "-"). Use `"-"` for `stdout`.

-   \[`-f`|`--output-format` *format*\]
    Output format, either `"json"`, `"yaml"` or `"csv"` (default: `"yaml"`).
   
-   *pdf-file*|`-`
    Input PDF file (default: "-"). Use `"-"` for `stdin`.

## HISTORY

PDF-Scrape was developed in November 2020 for scraping the PDFs of
the various organizations providing COVID-19 statistics.

## AUTHOR

Dr. Ralf S. Engelschall <rse@engelschall.com>

