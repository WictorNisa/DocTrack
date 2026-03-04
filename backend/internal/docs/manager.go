package docs

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

const (
	userStart = "<!-- doctrack:user:start -->"
	userEnd   = "<!-- doctrack:user:end -->"
	autoStart = "<!-- doctrack:auto:start -->"
	autoEnd   = "<!-- doctrack:auto:end -->"
)

// Frontmatter is the YAML front matter stored in every doc file.
type Frontmatter struct {
	Doctrack struct {
		Source     string    `yaml:"source"`
		SourceHash string    `yaml:"source_hash"`
		LastSync   time.Time `yaml:"last_sync"`
		Schema     int       `yaml:"schema"`
		Deleted    bool      `yaml:"deleted,omitempty"`
	} `yaml:"doctrack"`
}

// DocFile represents a parsed documentation file.
type DocFile struct {
	Frontmatter  Frontmatter
	Title        string
	AutoSection  string
	UserSections []string
}

// Manager handles reading and writing doc files.
type Manager struct {
	docsDir string
}

// NewManager returns a Manager rooted at docsDir.
func NewManager(docsDir string) *Manager {
	return &Manager{docsDir: docsDir}
}

// NewDocFile creates a fresh DocFile for a new source file.
func NewDocFile(sourcePath, sourceHash string) *DocFile {
	df := &DocFile{}
	df.Frontmatter.Doctrack.Source = sourcePath
	df.Frontmatter.Doctrack.SourceHash = sourceHash
	df.Frontmatter.Doctrack.LastSync = time.Now().UTC()
	df.Frontmatter.Doctrack.Schema = 1
	extless := strings.TrimSuffix(filepath.Base(sourcePath), filepath.Ext(sourcePath))
	dir := filepath.Dir(sourcePath)
	if dir == "." {
		df.Title = extless
	} else {
		df.Title = filepath.ToSlash(dir) + "/" + extless
	}
	df.UserSections = []string{""}
	return df
}

// IsStale returns true if the doc's source_hash differs from currentHash.
func IsStale(df *DocFile, currentHash string) bool {
	return df.Frontmatter.Doctrack.SourceHash != currentHash
}

// Read parses a doc file at path.
func (m *Manager) Read(path string) (*DocFile, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("reading doc: %w", err)
	}
	return parse(string(data))
}

// Write serialises df and writes it to path.
func (m *Manager) Write(path string, df *DocFile) error {
	df.Frontmatter.Doctrack.LastSync = time.Now().UTC()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("creating dirs: %w", err)
	}
	content := render(df)
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		return fmt.Errorf("writing doc: %w", err)
	}
	return nil
}

func parse(text string) (*DocFile, error) {
	df := &DocFile{}
	body, fm, err := splitFrontmatter(text)
	if err != nil {
		return nil, err
	}
	df.Frontmatter = fm
	df.Title, df.AutoSection, df.UserSections = parseSections(body)
	return df, nil
}

func splitFrontmatter(text string) (string, Frontmatter, error) {
	var fm Frontmatter
	if !strings.HasPrefix(text, "---\n") {
		return text, fm, nil
	}
	end := strings.Index(text[4:], "\n---\n")
	if end < 0 {
		return text, fm, nil
	}
	yamlBlock := text[4 : end+4]
	if err := yaml.Unmarshal([]byte(yamlBlock), &fm); err != nil {
		return text, fm, fmt.Errorf("parsing frontmatter: %w", err)
	}
	return text[end+4+5:], fm, nil
}

func parseSections(body string) (title, auto string, users []string) {
	lines := strings.Split(body, "\n")
	var current strings.Builder
	inUser := false
	inAuto := false
	for _, line := range lines {
		switch {
		case strings.TrimSpace(line) == userStart:
			if !inUser {
				if !inAuto {
					if title == "" {
						title = strings.TrimSpace(current.String())
					}
				}
				current.Reset()
				inUser = true
			}
		case strings.TrimSpace(line) == userEnd:
			if inUser {
				users = append(users, strings.TrimSpace(current.String()))
				current.Reset()
				inUser = false
			}
		case strings.TrimSpace(line) == autoStart:
			if !inAuto {
				current.Reset()
				inAuto = true
			}
		case strings.TrimSpace(line) == autoEnd:
			if inAuto {
				auto = strings.TrimSpace(current.String())
				current.Reset()
				inAuto = false
			}
		default:
			current.WriteString(line + "\n")
		}
	}
	if title == "" && len(users) == 0 && auto == "" {
		title = strings.TrimSpace(current.String())
	}
	if len(users) == 0 {
		users = []string{""}
	}
	return
}

func render(df *DocFile) string {
	var sb strings.Builder
	raw, _ := yaml.Marshal(df.Frontmatter)
	sb.WriteString("---\n")
	sb.Write(raw)
	sb.WriteString("---\n")
	sb.WriteString("# " + df.Title + "\n")
	for i, u := range df.UserSections {
		sb.WriteString(userStart + "\n")
		if strings.TrimSpace(u) != "" {
			sb.WriteString(u + "\n")
		}
		sb.WriteString(userEnd + "\n")
		if i == 0 {
			sb.WriteString(autoStart + "\n")
			if strings.TrimSpace(df.AutoSection) != "" {
				sb.WriteString(df.AutoSection + "\n")
			}
			sb.WriteString(autoEnd + "\n")
		}
	}
	return sb.String()
}
