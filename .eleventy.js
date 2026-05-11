const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const fs = require('fs');
const path = require('path');

let compiledMainCss = null;

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");

  // Compile main.css once before any templates run so the inline-main-css
  // transform always has CSS ready. Runs at the start of every build/rebuild.
  eleventyConfig.on('eleventy.before', async () => {
    const cssPath = path.join(__dirname, 'src/assets/css/main.css');
    const result = await postcss([tailwindcss]).process(
      fs.readFileSync(cssPath, 'utf-8'),
      { from: cssPath }
    );
    compiledMainCss = result.css;
  });

  eleventyConfig.addFilter("addMinutes", (isoDate, minutes) => {
    const d = new Date(isoDate);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
  });

  // Rewrite root-relative paths when deploying to a subpath (e.g. GitHub Pages).
  // Set ELEVENTY_BASE=/walkwitheric in CI; unset (or leave empty) for custom domain.
  const base = (process.env.ELEVENTY_BASE || '').replace(/\/$/, '');
  if (base) {
    eleventyConfig.addTransform('pathprefix', (content, outputPath) => {
      if (!outputPath || !outputPath.endsWith('.html')) return content;
      return content
        .replace(/href="\//g, `href="${base}/`)
        .replace(/src="\//g, `src="${base}/`);
    });
  }

  // Replace the render-blocking <link> to main.css with an inline <style> block.
  // Falls back gracefully (leaves the link tag) if CSS hasn't compiled yet.
  eleventyConfig.addTransform('inline-main-css', (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith('.html') || !compiledMainCss) return content;
    return content.replace(
      '<link rel="stylesheet" href="/assets/css/main.css">',
      `<style>${compiledMainCss}</style>`
    );
  });

  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: (inputContent, inputPath) => {
      if (!inputPath.endsWith("main.css")) return;
      // CSS was already compiled in eleventy.before; reuse the result.
      return async () => compiledMainCss;
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
