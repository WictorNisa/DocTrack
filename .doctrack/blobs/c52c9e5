// DocTrack — keep documentation in sync with code changes.
// Copyright 2026 DocTrack Authors. Apache 2.0 License.
package main

import "github.com/wictorn/doctrack/cmd"

// Build-time variables injected by -ldflags.
var (
	version = "dev"
	commit  = "unknown"
	date    = "unknown"
)

func main() {
	cmd.SetBuildInfo(version, commit, date)
	cmd.Execute()
}
