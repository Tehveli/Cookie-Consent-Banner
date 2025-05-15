# Tehveli Cookie Banner

This repository contains a shared cookie banner component designed for use across all Tehveli websites. The banner ensures compliance with cookie regulations and provides a consistent user experience.

## Features

- Customizable design to match website branding.
- Easy integration with any Tehveli website.
- Handles cookie consent and preferences.
- Lightweight and optimized for performance.

## Usage

Initialize the cookie banner in your JavaScript file:

```javascript
<script src="https://cdn.jsdelivr.net/gh/Tehveli/Cookie-Consent-Banner@main/cookie-banner.js" defer></script>
<cookie-banner lang="es" theme="light"></cookie-banner>
```

## Changing the Theme in the same tab

StorageEvent is fired in different page with the same domain.

From MDN:

> The StorageEvent is fired whenever a change is made to the Storage object.

> This won't work on the same page that is making the changes — it is really a way for other pages on the domain using the storage to sync any changes that are made。

**So you have to manually dispatch and storage event:**

```javascript
const event = new StorageEvent("storage", {
  key: "theme",
  oldValue: oldTheme,
  newValue: newTheme,
});

window.dispatchEvent(event);
```

## Purge CDN Cache

Use this [link](https://www.jsdelivr.com/tools/purge) to purge the CDN cache.
