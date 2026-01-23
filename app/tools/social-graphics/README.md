# Social Media Graphics Tool

## Overview
The Social Media Graphics Tool is a powerful, client-side graphics editor that allows you to create professional social media graphics without any external API calls. Design graphics for Instagram, Facebook, Twitter, LinkedIn, and TikTok with drag-and-drop functionality.

## Features
- **Platform-Specific Sizing**: Pre-configured dimensions for all major social media platforms
- **Drag-and-Drop Canvas**: Intuitive canvas-based editor powered by Fabric.js
- **Text Tools**: Add and edit text with full customization
- **Shape Tools**: Add rectangles and circles with custom colors
- **Image Upload**: Upload and position images on your graphics
- **Color Picker**: Choose any color for shapes and elements
- **Undo/Redo**: Full history support for easy editing
- **Export**: Download graphics as PNG files
- **Zero External Calls**: Everything runs client-side, no API dependencies

## Supported Platforms

### Instagram Post
- Dimensions: 1080 x 1080 pixels
- Format: Square
- Best for: Feed posts, carousel images

### Facebook Post
- Dimensions: 1200 x 630 pixels
- Format: Landscape
- Best for: Link previews, shared content

### Twitter Post
- Dimensions: 1200 x 675 pixels
- Format: Landscape
- Best for: Tweet images, header graphics

### LinkedIn Post
- Dimensions: 1200 x 627 pixels
- Format: Landscape
- Best for: Professional content, articles

### TikTok Video Cover
- Dimensions: 1080 x 1920 pixels
- Format: Vertical
- Best for: Video thumbnails, story covers

## How to Use

### 1. Select Platform
- Choose your target platform from the dropdown menu
- Canvas automatically resizes to platform dimensions

### 2. Add Elements
- **Text**: Click "Add Text" to add editable text boxes
- **Shapes**: Add rectangles or circles with custom colors
- **Images**: Upload images from your device
- **Color**: Use the color picker to customize shape colors

### 3. Edit Elements
- Click on any element to select it
- Drag to reposition
- Resize using corner handles
- Edit text by double-clicking

### 4. Manage History
- **Undo**: Revert your last action
- **Redo**: Restore an undone action
- Full history tracking for all changes

### 5. Export
- Click "Export PNG" to download your graphic
- File is saved with platform name (e.g., `instagram-graphic.png`)
- High-quality PNG format ready for social media

## Technical Details

### Dependencies
- **Fabric.js**: Canvas manipulation and graphics rendering
- **react-colorful**: Color picker component
- Both packages are client-side only (no server dependencies)

### Browser Compatibility
- Modern browsers with Canvas API support
- Works best in Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled

### Performance
- All processing happens in the browser
- No data sent to external servers
- Fast and responsive editing experience
- Works offline once page is loaded

## Tips & Best Practices

### Design Tips
1. **Use High Contrast**: Ensure text is readable against backgrounds
2. **Keep It Simple**: Less is more for social media graphics
3. **Brand Colors**: Use your brand colors for consistency
4. **Text Size**: Make sure text is large enough to read on mobile
5. **Safe Zones**: Keep important content away from edges

### Platform-Specific Tips
- **Instagram**: Square format works best, use vibrant colors
- **Facebook**: Landscape format, include clear call-to-action
- **Twitter**: Keep text minimal, use bold visuals
- **LinkedIn**: Professional look, clear messaging
- **TikTok**: Vertical format, eye-catching thumbnails

### Workflow Tips
1. Start with a platform template
2. Add background shapes or colors first
3. Add text and images on top
4. Use undo/redo liberally to experiment
5. Export and preview before finalizing

## Limitations

### Current Limitations
- Text formatting options are basic (font size, color)
- Limited to rectangles and circles for shapes
- No layer management UI (though layers exist)
- No templates or presets (coming soon)
- No SVG export (PNG only)

### Future Enhancements
- More shape types (lines, polygons, arrows)
- Advanced text formatting (fonts, styles, effects)
- Template library
- Layer panel
- SVG export
- Background patterns and gradients
- Image filters and effects

## Troubleshooting

### Canvas Not Loading
- **Issue**: Canvas appears blank or doesn't load
- **Solution**: Refresh the page, ensure JavaScript is enabled
- **Check**: Browser console for any errors

### Images Not Uploading
- **Issue**: Image upload doesn't work
- **Solution**: Check file size (keep under 10MB), ensure image format is supported (JPG, PNG, GIF)
- **Check**: Browser file permissions

### Export Not Working
- **Issue**: Export button doesn't download file
- **Solution**: Check browser download settings, ensure pop-ups aren't blocked
- **Check**: Browser console for errors

### Performance Issues
- **Issue**: Tool is slow or laggy
- **Solution**: Reduce number of elements on canvas, close other browser tabs
- **Check**: Browser memory usage

## Access Control
- All authenticated users can access the graphics tool
- Access is controlled via `ToolAccessGate` component
- Available in Essential plan and above

## API Endpoints
None - this tool is fully client-side with no API endpoints required.

## Database Schema
None - this tool doesn't store data. All work is done in the browser and exported as files.

## Components
- `SocialGraphicsToolContent`: Main editor component with canvas
- Uses Fabric.js Canvas for rendering
- React hooks for state management
- Dynamic imports for code splitting

## Browser Storage
- No data is stored in browser storage
- All work is temporary (lost on page refresh)
- Export your work as PNG to save it

## Support
For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Ensure all dependencies are installed
4. Contact support if issues persist

---

**Note**: This tool is designed to be simple, fast, and work entirely in your browser. No external services, no data collection, just pure graphics creation.
