# Countdown GIF generator for emails and whatnot

Simple library to generate countdown GIFs in nodejs using Cairo/Canvas implementation usable for on-demand image generation.

## Image Options
* **frames** - number of frames (also number of seconds) the countdown will run before looping [defaults to 30]
* **width** - width in pixels [defaults to 200]
* **height** - height in pixels [defaults to 200]
* **bg** - hex colour code for the background [defaults to 000000]
* **color** - hex colour code for the text [defaults to ffffff]

## Timer value
* **end** - Any momentjs parseable string, ideally JSON.stringify(new Date()) format [e.g. 2016-06-24T20:35:00.000Z]

## More fonts
via ```import { registerFonr } from 'canvas'
registerFont(path, 'name')
ImageOptions.familyName = 'name'```


## Samples
Attached webserver offers generating GIF into file or as direct output of express response (the fastest method of serving)

## License

[MIT](LICENSE)

## Inspired by
* [scottccoates](https://github.com/scottccoates/node-countdown-gif)
* [Nooshu](https://github.com/Nooshu/node-countdown-gif)
