##
##  PDF-Scrape -- PDF Text Scraping
##  Copyright (c) 2020-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
##
##  Permission is hereby granted, free of charge, to any person obtaining
##  a copy of this software and associated documentation files (the
##  "Software"), to deal in the Software without restriction, including
##  without limitation the rights to use, copy, modify, merge, publish,
##  distribute, sublicense, and/or sell copies of the Software, and to
##  permit persons to whom the Software is furnished to do so, subject to
##  the following conditions:
##
##  The above copyright notice and this permission notice shall be included
##  in all copies or substantial portions of the Software.
##
##  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
##  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
##  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
##  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
##  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
##  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
##  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
##

SHELL = bash
NPM   = npm

all: build

bootstrap:
	@if [ ! -x $(GRUNT) ]; then $(NPM) install; fi

build: bootstrap
	$(NPM) run prepublishOnly
	$(NPM) run build

clean: bootstrap

distclean: bootstrap

VERSION_NODE        = 14
VERSION_NODE_ALPINE = $(VERSION_NODE)-alpine
VERSION_NODE_DEBIAN = $(VERSION_NODE)-buster
VERSION_PKG_ALPINE  = node$(VERSION_NODE)-alpine-x64
VERSION_PKG_DEBIAN  = node$(VERSION_NODE)-linux-x64

USR                 = $$(id -u -n)
UID                 = $$(id -u)
GRP                 = $$(id -g -n)
GID                 = $$(id -g)

package: package-alpine package-debian

package-alpine:
	@echo "(executing under Alpine GNU/Linux)" && \
	docker run -it --rm -v $$HOME:$$HOME -e TERM -e HOME --name pkg-alpine node:$(VERSION_NODE_ALPINE) \
		sh -c "apk -q update && \
	        apk -q add --no-progress bash sudo shadow && \
	        groupadd -g $(GID) $(GRP) && \
            useradd -M -d $$HOME -s /bin/bash -u $(UID) -g $(GID) -G wheel $(USR) && \
	        echo 'Set disable_coredump false' >>/etc/sudo.conf && \
	        cd $$PWD && \
	        sudo -u $(USR) -g $(GRP) npx pkg -t $(VERSION_PKG_ALPINE) ." && \
	tar -c -f- pdf-scrape pdf-scrape.1 pdf-scrape.3 | xz -9 >pdf-scrape-linux-alpine-x64.tar.xz && rm -f pdf-scrape

package-debian:
	@echo "(executing under Debian GNU/Linux)" && \
	docker run -it --rm -v $$HOME:$$HOME -e TERM -e HOME --name pkg-debian node:$(VERSION_NODE_DEBIAN) \
		sh -c "apt-get -q update -q && \
	        apt-get -q install -q -y bash sudo >/dev/null 2>&1 && \
	        groupadd -g $(GID) $(GRP) && \
            useradd -M -d $$HOME -s /bin/bash -u $(UID) -g $(GID) -G root $(USR) && \
	        cd $$PWD && \
	        sudo -u $(USR) -g $(GRP) npx pkg -t $(VERSION_PKG_DEBIAN) ." && \
	tar -c -f- pdf-scrape pdf-scrape.1 pdf-scrape.3 | xz -9 >pdf-scrape-linux-debian-x64.tar.xz && rm -f pdf-scrape

