
PDF-Scrape
==========

**PDF Text Scraping**

<p/>
<img src="https://nodei.co/npm/pdf-scrape.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/pdf-scrape.png" alt=""/>

Abstract
--------

PDF-Scrape is a small Application Programming Interface (API) and
Command-Line Interface (CLI) to scrape texts from PDF documents. It is
intended as the pre-processing step to find anchor positions by text
fragments in a PDF document for a subsequent scraping those areas (in SVG
or PNG format) of the actual PDF document with tools like pdftocairo(1).

Installation
------------

```
$ npm install -g pdf-scrape
```

Usage
-----

The Unix manual pages for the
[API](https://github.com/rse/pdf-scrape/blob/master/pdf-scrape-api.md) and the
[CLI](https://github.com/rse/pdf-scrape/blob/master/pdf-scrape-cli.md) contain
detailed usage information.

Example
-------

```sh
$ pdf-scrape sample.pdf
1,692.7686,328.5921,33.77,10,Content
1,451.4961,156.7606,0,0,
1,451.4961,156.7606,27.828,12,know
1,451.4961,191.4422,0,0,
1,451.4961,191.4422,57.91199999999999,12,understand
[]...]
```

License
-------

Copyright &copy; 2020-2022 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

