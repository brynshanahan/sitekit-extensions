var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var path = require('path');
var gulpWatch = require('gulp-watch');
var uglify = require('uglifyify')

function transpile() {
  console.log("Transpiling to 'dist/bundle.js'...");
  browserify(path.resolve(__dirname, '../src/index.js'), {
    standalone: "sitekit-extensions"
  })
    .transform(babelify.configure({
      presets: ["env"]
    }))
    .transform('uglifyify', {global: true})
    .bundle()
    .pipe(fs.createWriteStream(path.resolve(__dirname, '../dist/bundle.js')));
}

transpile();

if(process.argv.indexOf("--watch") > -1) {
  console.log("Watching for changes in 'src' directory...");
  gulpWatch("./src/**/*", transpile);
} 