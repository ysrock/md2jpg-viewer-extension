/**
 * Plugin HTML Utilities
 * Converts unified plugin render results to HTML
 */

/**
 * Convert unified plugin render result to HTML string
 * @param {string} id - Placeholder element ID
 * @param {object} renderResult - Unified render result from plugin.renderToCommon()
 * @param {string} pluginType - Plugin type for alt text
 * @returns {string} HTML string
 */
export function convertPluginResultToHTML(id, renderResult, pluginType = 'diagram') {
  if (renderResult.type === 'empty') {
    return '';
  }
  
  if (renderResult.type === 'error') {
    return `<pre style="background: #fee; border-left: 4px solid #f00; padding: 10px; font-size: 12px;">${renderResult.content.text}</pre>`;
  }
  
  if (renderResult.type === 'image') {
    const { base64, width } = renderResult.content;
    const { inline } = renderResult.display;
    const displayWidth = Math.round(width / 4);
    
    if (inline) {
      return `<span class="diagram-inline" style="display: inline-block;">
        <img src="data:image/png;base64,${base64}" alt="${pluginType} diagram" width="${displayWidth}px" style="vertical-align: middle;" />
      </span>`;
    }
    
    return `<div class="diagram-block" style="text-align: center; margin: 20px 0;">
      <img src="data:image/png;base64,${base64}" alt="${pluginType} diagram" width="${displayWidth}px" />
    </div>`;
  }
  
  return '';
}

/**
 * Replace placeholder with rendered content in DOM
 * @param {string} id - Placeholder element ID
 * @param {object} pngResult - Render result with base64, width, height
 * @param {string} pluginType - Plugin type
 * @param {boolean} isInline - Whether to render inline or block
 */
export function replacePlaceholderWithImage(id, pngResult, pluginType, isInline) {
  const placeholder = document.getElementById(id);
  if (placeholder) {
    // Convert pngResult to unified format
    const renderResult = {
      type: 'image',
      content: {
        base64: pngResult.base64,
        width: pngResult.width,
        height: pngResult.height
      },
      display: {
        inline: isInline
      }
    };
    placeholder.outerHTML = convertPluginResultToHTML(id, renderResult, pluginType);
  }
}
