const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");

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
