// Package store manages the DocTrack snapshot persistence.
package store

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// Snapshot records the state of all tracked files at a point in time.
type Snapshot struct {
	Timestamp time.Time            `json:"timestamp"`
	Files     map[string]FileEntry `json:"files"`
}

// FileEntry holds metadata for a single tracked file.
type FileEntry struct {
	Hash    string    `json:"hash"`
	ModTime time.Time `json:"mtime"`
	Size    int64     `json:"size"`
}

// EmptySnapshot returns a zeroed snapshot with an initialised map.
func EmptySnapshot() *Snapshot {
	return &Snapshot{
		Timestamp: time.Time{},
		Files:     make(map[string]FileEntry),
	}
}

// LoadSnapshot reads a JSON snapshot from path.
func LoadSnapshot(path string) (*Snapshot, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("opening snapshot: %w", err)
	}
	defer f.Close()

	var snap Snapshot
	if err := json.NewDecoder(f).Decode(&snap); err != nil {
		return nil, fmt.Errorf("decoding snapshot: %w", err)
	}
	if snap.Files == nil {
		snap.Files = make(map[string]FileEntry)
	}
	return &snap, nil
}

// SaveSnapshot writes snap as JSON to path, creating parent dirs as needed.
func SaveSnapshot(path string, snap *Snapshot) error {
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return fmt.Errorf("creating snapshot dir: %w", err)
	}
	snap.Timestamp = time.Now()

	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		return fmt.Errorf("opening snapshot for write: %w", err)
	}
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	if err := enc.Encode(snap); err != nil {
		f.Close()
		return fmt.Errorf("encoding snapshot: %w", err)
	}
	if err := f.Close(); err != nil {
		return fmt.Errorf("closing snapshot file: %w", err)
	}
	return nil
}
