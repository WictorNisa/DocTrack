# DocTrack cross-compilation Makefile
# CGO_ENABLED=0 is mandatory for all targets.

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT  ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE    ?= $(shell date -u +%Y-%m-%dT%H:%M:%SZ)
LDFLAGS  = -X main.version=$(VERSION) -X main.commit=$(COMMIT) -X main.date=$(DATE)

NPM_DIR = ../npm

.PHONY: all clean test lint darwin-arm64 darwin-x64 linux-x64 win32-x64

all: darwin-arm64 darwin-x64 linux-x64 win32-x64

darwin-arm64:
	CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -trimpath -ldflags "$(LDFLAGS)" -o $(NPM_DIR)/@doctrack/darwin-arm64/bin/doctrack .

darwin-x64:
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -trimpath -ldflags "$(LDFLAGS)" -o $(NPM_DIR)/@doctrack/darwin-x64/bin/doctrack .

linux-x64:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "$(LDFLAGS)" -o $(NPM_DIR)/@doctrack/linux-x64/bin/doctrack .

win32-x64:
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -trimpath -ldflags "$(LDFLAGS)" -o $(NPM_DIR)/@doctrack/win32-x64/bin/doctrack.exe .

test:
	go test -race -count=1 ./...

lint:
	go vet ./...

clean:
	rm -f $(NPM_DIR)/@doctrack/*/bin/doctrack $(NPM_DIR)/@doctrack/win32-x64/bin/doctrack.exe
