const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");

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

  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async (inputContent, inputPath) => {
      if (!inputPath.endsWith("main.css")) return;
      return async () => {
        const result = await postcss([tailwindcss]).process(inputContent, {
          from: inputPath,
        });
        return result.css;
      };
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
