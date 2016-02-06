var browserSync = require('browser-sync');
var del         = require('del');
var gulp        = require('gulp');
var inlineCss   = require('gulp-inline-css');
var imagemin    = require('gulp-imagemin');
var assemble    = require('fabricator-assemble');
var runSequence = require('run-sequence');
var sass        = require('gulp-sass');
var styleInject = require("gulp-style-inject");

var config = {
	html: {
		src: './src/views/**/*.html'
	},
	assemble: {
		src: './dist/*.html',
	},
	styles: {
		src: './src/scss/**/*.scss'
	},
		images: {
		src: './src/images/**/*',
		dest: './dist/images'
	},
	dest: './dist',
	data: './src/data.json'
};

/**
 * build
 *
 * Run all the neccesary tasks to make your emails
 */
gulp.task('build', function(cb) {
	runSequence(['compileTemplates', 'compileStyles', 'injectStyles', 'inlineStyles', 'optimizeImages', 'postclean'], cb);
});

/**
 * compileTemplates
 *
 * Compile all our HTML layouts and compoents to plain old HTML files.
 */
gulp.task('compileTemplates', function() {
	return assemble({
		dest : config.dest,
		data: config.data,
		keys: {
	        materials: 'components',
	        views: 'views',
	        docs: 'docs'
	    },
	    materials: 'src/components/*.html',
	    helpers : {
	    	default: function (value, defaultValue) {
                return value ? value : defaultValue;
            },
	    }
	});
});

/**
 * compileStyles
 *
 * Converts .scss files to css. Pipes result to temporary CSS file.
 */
gulp.task('compileStyles', function() {
	return gulp.src(config.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(config.dest));
});

/**
 * injectStyles
 *
 * Inject compiled CSS into <style> tag in template.
 * This allows you to use things like :hover styles and media queries when supported
 */
gulp.task('injectStyles', ['compileTemplates', 'compileStyles'],  function() {
	return gulp.src(config.assemble.src)
		.pipe(styleInject())
		.pipe(gulp.dest(config.dest));
});

/**
 * inlineStyles
 *
 * Take all of the CSS in the <style> tag, and add the styles as style attributes on every matching element.
 * https://www.campaignmonitor.com/blog/email-marketing/2013/11/introducing-our-new-standalone-css-inliner/
 */
gulp.task('inlineStyles', ['injectStyles'], function() {
	return gulp.src(config.assemble.src)
			.pipe(inlineCss({
				applyStyleTags: true,
				applyLinkTags: true,
				removeStyleTags: false,
				removeLinkTags: true,
				preserveMediaQueries: true
			}))
		.pipe(gulp.dest(config.dest));
});


/**
 * optimizeImages
 *
 * Optimize any images you are using in your emails.
 */
gulp.task('optimizeImages', function () {
	return gulp.src(config.images.src)
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(config.images.dest));
});

/**
 * preclean
 *
 * Blow away previous builds before we start
 */
gulp.task('preclean', function (cb) {
	del([config.dest], cb);
});

/**
 * postclean
 *
 * Delete the compiled CSS file, since we've injected the contents into a <style> tag on every HTML file
 */
gulp.task('postclean', ['inlineStyles'], function (cb) {
	del([config.dest + '/*.css'], cb);
});


/**
 * serve
 *
 * Run in browser with live reloading when files change
 */
gulp.task('serve', function() {

	browserSync({
		server: {
			baseDir: config.dest
		},
		notify: false
	});

	gulp.task('styles:watch', ['build'], browserSync.reload);
	gulp.watch(config.styles.src, ['styles:watch']);

	gulp.task('html:watch', ['build'], browserSync.reload);
	gulp.watch(config.html.src, ['html:watch']);
	gulp.watch(config.data, ['html:watch']);
});

/**
 * default
 *
 * Default gulp task. Build email, then serve with kick off serve task.
 */
gulp.task('default', ['preclean'], function () {
	runSequence(['build'], function () {
		gulp.start('serve');
	});
});
