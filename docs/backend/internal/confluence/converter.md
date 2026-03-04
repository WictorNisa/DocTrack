---
doctrack:
    source: backend/internal/confluence/converter.go
    source_hash: e0f495220fb90d375f548dcca91535a7de9218b7271cb6c3410e668528c28168
    last_sync: 2026-02-27T13:37:46.338063Z
    schema: 1
---
# backend/internal/confluence/converter
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Function: ConvertMarkdown

The `ConvertMarkdown` function takes a Markdown string as input and converts it to Confluence storage format (XHTML).

**Parameters:**
- `md string`: The input Markdown string to be converted.

**Return Values:**
- `string`: The converted Confluence storage format (XHTML) string.
- `error`: Any error that occurred during the conversion process.

The function uses the `goldmark` library to perform the Markdown to XHTML conversion. It creates a new `goldmark` instance with a custom `confluenceRenderer` that implements the necessary rendering logic for various Markdown elements.

The conversion process involves the following steps:
1. Create a new `goldmark` instance with the custom `confluenceRenderer`.
2. Convert the input Markdown string to XHTML using the `goldmark.Convert` function.
3. Return the resulting XHTML string or an error if the conversion failed.

## Struct: confluenceRenderer

The `confluenceRenderer` struct is a custom Markdown renderer that implements the conversion from Markdown to Confluence storage format (XHTML).

**Methods:**
- `RegisterFuncs(reg renderer.NodeRendererFuncRegisterer)`: Registers the rendering functions for various Markdown node types with the provided `renderer.NodeRendererFuncRegisterer`.

The `confluenceRenderer` provides the following node rendering functions:
- `renderDefault(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Handles the default rendering for nodes not explicitly handled.
- `renderText(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders text nodes.
- `renderString(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders string nodes.
- `renderHeading(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders heading nodes.
- `renderParagraph(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders paragraph nodes.
- `renderCodeBlock(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders code block nodes.
- `renderCodeSpan(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders code span nodes.
- `renderList(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders list nodes.
- `renderListItem(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders list item nodes.
- `renderEmphasis(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders emphasis nodes.
- `renderHR(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders horizontal rule nodes.
- `renderBlockquote(w util.BufWriter, source []byte, node ast.Node, entering bool)`: Renders blockquote nodes.

The `renderNode` function is a placeholder and is not used in the current implementation.
<!-- doctrack:auto:end -->
