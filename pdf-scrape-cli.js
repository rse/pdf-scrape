#!/usr/bin/env node
/*!
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

/*  built-in requirements  */
const process   = require("process")

/*  external requirements  */
const yargs     = require("yargs")
const CLIio     = require("cli-io")
const csv       = require("csv")

/*  internal requirements  */
const my        = require("./package.json")
const PDFScrape = require("./pdf-scrape-api.js")

/*  establish asynchronous context  */
;(async () => {
    /*  command-line option parsing  */
    const argv = yargs()
        /* eslint indent: off */
        .parserConfiguration({
            "duplicate-arguments-array": false,
            "set-placeholder-key":       true,
            "flatten-duplicate-arrays":  true,
            "camel-case-expansion":      true,
            "strip-aliased":             false,
            "dot-notation":              false,
            "halt-at-non-option":        true
        })
        .usage("Usage: pdf-scrape " +
            "[-h|--help] " +
            "[-V|--version] " +
            "[-m|--merge-fragments] " +
            "[-r|--round-coordinates] " +
            "[-l|--line-threshold] " +
            "[-c|--char-threshold] " +
            "[-w|--word-threshold] " +
            "[-a|--anchor <name>:<chars>|<name>:/<regexp>/] " +
            "[-o|--output-file <file>|-] " +
            "[-f|--output-format` <format>] " +
            "<pdf-file>|-"
        )
        .version(false)
        .option("h", {
            describe: "show program help information",
            alias:    "help", type: "boolean", default: false
        })
        .option("V", {
            describe: "show program version information",
            alias:    "version", type: "boolean", default: false
        })
        .option("m", {
            describe: "whether to merge consecutive text fragments",
            alias:    "merge-fragments", type: "boolean", default: false
        })
        .option("r", {
            describe: "whether to round text fragment coordinates",
            alias:    "round-coordinates", type: "boolean", default: false
        })
        .option("l", {
            describe: "PDF points the y-positions of lines can be offset",
            alias:    "line-threshold", type: "number", nargs: 1, default: 0.5
        })
        .option("c", {
            describe: "PDF points the x-positions of characters can be offset",
            alias:    "char-threshold", type: "number", nargs: 1, default: 1.5
        })
        .option("w", {
            describe: "PDF points the x-positions of words can be offset",
            alias:    "word-threshold", type: "number", nargs: 1, default: 5.0
        })
        .option("a", {
            describe: "define regular expression based unique identified anchor point",
            alias:    "anchor", type: "array", nargs: 1, default: []
        })
        .option("o", {
            describe: "output file",
            alias:    "output-file", type: "string", nargs: 1, default: "-"
        })
        .option("f", {
            describe: "output format",
            alias:    "output-format", type: "string", nargs: 1, default: "csv"
        })
        .strict(true)
        .showHelpOnFail(true)
        .demand(1)
        .parse(process.argv.slice(2))

    /*  short-circuit processing of "-V" (version) command-line option  */
    if (argv.version) {
        process.stderr.write(`${my.name} ${my.version} <${my.homepage}>\n`)
        process.stderr.write(`${my.description}\n`)
        process.stderr.write(`Copyright (c) 2020 ${my.author.name} <${my.author.url}>\n`)
        process.stderr.write(`Licensed under ${my.license} <http://spdx.org/licenses/${my.license}.html>\n`)
        process.exit(0)
    }

    /*  create I/O handling instance  */
    const cli = new CLIio()

    /*  assemble API options from CLI options  */
    const options = {}
    options.mergeFragments   = argv.mergeFragments
    options.roundCoordinates = argv.roundCoordinates
    options.lineThreshold    = argv.lineThreshold
    options.charThreshold    = argv.charThreshold
    options.wordThreshold    = argv.wordThreshold
    const anchors = {}
    argv.anchor.forEach((anchor) => {
        const m = anchor.match(/^(.+?):(?:\/((?:\\\/|.)+)\/(i)?|(.+))$/)
        if (m === null)
            throw new Error(`invalid anchor definition "${anchor}"`)
        let [ , name, regexp, flags, string ] = m
        if (regexp) {
            regexp = new RegExp(regexp, flags !== undefined ? flags : "")
            anchors[name] = regexp
        }
        else
            anchors[name] = string
    })

    /*  read input file  */
    const doc = await cli.input(argv._[0], {
        encoding: null
    })

    /*  pass-through operation to API  */
    const pdfScrape = new PDFScrape(options)
    let result
    if (argv.anchor.length > 0) {
        result = await pdfScrape.findMatching(doc, anchors)
        if (argv.outputFormat === "csv") {
            result = Object.keys(result).map((id) => {
                const f = result[id]
                return [ id, f.p, f.x, f.y, f.w, f.h, f.t ]
            })
        }
    }
    else {
        result = await pdfScrape.findAll(doc)
        if (argv.outputFormat === "csv")
            result = result.map((f) => ([ f.p, f.x, f.y, f.w, f.h, f.t ]))
    }
    if (argv.outputFormat === "csv") {
        result = await new Promise((resolve, reject) => {
            csv.stringify(result, (err, output) => {
                if (err)
                    reject(err)
                else
                    resolve(output)
            })
        })
    }

    /*  write output  */
    await cli.output(argv.outputFile, result, {
        dump:     (argv.outputFormat !== "csv"),
        format:   argv.outputFormat,
        encoding: "utf8"
    })
})().catch((err) => {
    /*  handle fatal error  */
    process.stderr.write(`pdf-scrape: ERROR: ${err}\n`)
    process.exit(1)
})

