const htmlmin = require('html-minifier');
const dateFns = require('date-fns');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    transformImgPath: (imgPath) => {
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        // Handle remote file
        return imgPath;
      } else {
        return `./src/${imgPath}`;
      }
    },
  });

  eleventyConfig.setEjsOptions({
    rmWhitespace: true,
    context: {
      dateFns,
    },
  });

  eleventyConfig.setBrowserSyncConfig({
    files: './_site/assets/styles/main.css',
  });

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      });
      return minified;
    }

    return content;
  });

  // Table of contents generator
  const pluginTOC = require('eleventy-plugin-nesting-toc')
  eleventyConfig.addPlugin(pluginTOC, {tags: ['h2']})

  const markdownIt = require('markdown-it')
  const markdownItAnchor = require('markdown-it-anchor')
  const slugify = require('slugify')
  slugify.extend({"'": '-'})
  slugify.extend({"’": '-'})
  const fslugify = s => slugify(s, {lower: true, strict: true})
  eleventyConfig.setLibrary("md",
      markdownIt({
          html: true,
          linkify: true,
          typographer: true,
      })
      .use(markdownItAnchor, {
        slugify: fslugify
      })
  )

  const pluginPWA = require("eleventy-plugin-pwa");
  module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(pluginPWA, {
      swDest: "./build/sw.js",
      globDirectory: "./build"
    });
  };

  return {
    dir: { input: 'src', output: '_site', data: '_data' },
  };
};
