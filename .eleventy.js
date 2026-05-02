module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css/style.css");
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
