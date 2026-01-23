# Social Media Graphics Tool - Setup Instructions

## Required Packages

Install these packages before using the tool:

```bash
npm install fabric react-colorful
```

**Note:** The code uses dynamic imports to avoid SSR issues, so these packages will only load on the client side.

## What's Included

- ✅ Drag-and-drop canvas editor
- ✅ Text, shapes (rectangles, circles), and image support
- ✅ Platform-specific sizing (Instagram, Facebook, Twitter, LinkedIn, TikTok)
- ✅ Export to PNG
- ✅ Undo/redo functionality
- ✅ Color picker for shapes
- ✅ Real-time preview

## Tool Location

- **Route:** `/tools/social-graphics`
- **File:** `app/tools/social-graphics/page.tsx`
- **Category:** Brand & Design

## Integration Complete

The tool has been:
- ✅ Added to tools list (Brand & Design section)
- ✅ Added to Essential plan tools
- ✅ Added to Professional plan tools
- ✅ Wrapped with ToolAccessGate for access control
- ✅ Styled to match existing design system

## Usage

1. Visit `/tools/social-graphics`
2. Select platform size
3. Add text, shapes, or images
4. Customize colors
5. Export as PNG

## Notes

- Uses Fabric.js for canvas manipulation
- All rendering is client-side (no API calls)
- No external dependencies for graphics (all built-in)
- Works offline once loaded
