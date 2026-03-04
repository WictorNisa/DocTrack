---
doctrack:
    source: backend/internal/confluence/client.go
    source_hash: e5b2b4f6a0b415b0b2e3d6f20cf92b3a9bd15b4067f2bc343cd9a072ab6d01c9
    last_sync: 2026-02-27T13:38:02.66127Z
    schema: 1
---
# backend/internal/confluence/client
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
### Client

The `Client` struct represents a thin Confluence Cloud REST API v2 client. It provides methods for interacting with the Confluence API, such as retrieving pages, creating new pages, and updating existing pages.

#### Methods

##### `NewClient(baseURL, email, token string) *Client`
Creates a new Confluence client for the given base URL with email and API token authentication.

##### `GetPage(ctx context.Context, pageID string) (*Page, error)`
Retrieves a page by its numeric ID.

##### `FindByTitle(ctx context.Context, spaceKey, title string) (*Page, error)`
Searches for a page by space key and title.

##### `CreatePage(ctx context.Context, spaceKey, parentID, title, storageBody string) (*Page, error)`
Creates a new page under the specified parent page ID in the given space key.

##### `UpdatePage(ctx context.Context, pageID string, version int, title, storageBody string) (*Page, error)`
Updates the content of a page, incrementing the version number.

### Page

The `Page` struct represents a Confluence page and contains the following fields:

- `ID`: The unique identifier of the page.
- `Title`: The title of the page.
- `Version`: The version information of the page, including the version number.
- `Body`: The storage representation of the page content.
<!-- doctrack:auto:end -->
