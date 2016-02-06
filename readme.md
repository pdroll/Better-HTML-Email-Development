#HTML Email Development That Doesn't Suck*

_*As much_

HTML Email Development sucks. You can't use [even some of the most basic CSS properties](https://www.campaignmonitor.com/css/). You have to rely tables for all layouts. Email clients that you have to support use  [HTML rendering engines](https://litmus.com/blog/a-guide-to-rendering-differences-in-microsoft-outlook-clients) that were [released over a decade ago](https://en.wikipedia.org/wiki/Internet_Explorer_7#Release_history). Things are [better than they used to be](https://litmus.com/help/email-clients/media-query-support/), but it will be a long time before we're able to use modern web development techniques for HTML emails.

But just because you can't change these things, doesn't mean you have to develop like a caveman.

This is an attempt to use modern web development tooling to make the task of developing HTML emails less painful.

**[Gulp.js](http://gulpjs.com/)** is used to do the heavy lifting, automatically while you develop:

1. **Assemble HTML**.
	Uses [fabricator-assemble](https://github.com/fbrctr/fabricator-assemble) to bring elegent use of layouts to Handlebars templates.


2. **Compile Sass**.
	Never leave home without variables and `@import`'s again.

3. **Inject CSS into `<style>` tag**.
	This lets you use things like `:hover` states and media queries.

4. **Inline all CSS properties**.
	It's dumb, but [you have to do it](https://www.campaignmonitor.com/blog/email-marketing/2013/11/introducing-our-new-standalone-css-inliner/). And now it's done for you.

5. **Optimize Images**.
	Uses [Imagemin](https://github.com/sindresorhus/gulp-imagemin) to seamlessly minify images.


## Scripts
### Run Locally
To run locally, while keeping your browser updated in real time using [BrowserSync](https://www.browsersync.io/), you can run:

```
npm start
```

### Build for production

To package things up when you're ready to send, you can run:


```
npm run build
```

Look in the `dist` folder for your compiled HTML and optimized images.


## How to Use


### Templates

Start building your emails inside the `src/views` folder. Four [responsive email designs](http://foundation.zurb.com/emails/email-templates.html) from Zurb Foundation are included. They are a great starting point, and they come with well lots of [well tested features](http://foundation.zurb.com/emails/docs.html).

Edit these files, or add your own to make your own email design from scratch.

### Layouts

Look in `src/views/layouts` to add or edit different layouts for your emails.

The layout can be specified for each email via front matter.

For example:

```html
<!-- /src/views/layouts/mylayout.html -->

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
</head>
<body>
	<div id="my-cool-container">
	{% body %}
	</div>
</body>
</html>

```

```html
<!-- /src/views/my-email.html -->

---
layout : mylayout
---

<table class="body">
	<tr>
		<td>
			HTML Emails are the best.
		</td>
	</tr>
</table>

```

would result in

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
</head>
<body>
	<div id="my-cool-container">
		<table class="body">
			<tr>
				<td>
					HTML Emails are the best.
				</td>
			</tr>
		</table>
	</div>
</body>
</html>

```

### Components

HTML components that you will be reused can be defined in `src/components`

For example:

```html
<!-- src/components/button.html -->
<table class="button">
  <tr>
    <td>
      <a href="http://facebook.com">Click Me</a>
    </td>
  </tr>
</table>

```

Components can be accessed in an email using the `>` syntax:

```
{{> button }}
```

### Template Data

Data can be passed to templates from the `src/data.json` file.

For example:

```json
{
	"imagePath" : "images/",
	"name"      : "Pete Droll"
}
```

That data can be accessed in any HTML like so:

```HTML
<p>Hello, {{ data.name }}</p>

<img src="{{ data.imagePath }}facebook.png" alt="Facebook" />

```


Check out the [fabricator-assemble](https://github.com/fbrctr/fabricator-assemble) docs for more information.

--
### SCSS

Styles for your emails can be defined in `/src/scss/styles.css`.

Write all the cool Sass that you know and love, and rest assured it will end up injected into a `<style>` tag **and** inlined as style attributes on all matching HTML elements.




