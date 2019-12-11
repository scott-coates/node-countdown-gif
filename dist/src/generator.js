"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gifencoder_1 = __importDefault(require("gifencoder"));
const canvas_1 = require("canvas");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Generator {
    constructor(options) {
        this.defaultOptions = {
            width: 200,
            height: 200,
            color: 'ffffff',
            bg: '000000',
            frames: 30,
            fontSize: 26,
            fontFamily: 'Courier New'
        };
        this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
        this.encoder = new gifencoder_1.default(this.options.width, this.options.height);
        this.canvas = canvas_1.createCanvas(this.options.width, this.options.height);
        const ctx = this.canvas.getContext('2d');
        ctx.font = `bold ${this.options.fontSize}px ${this.options.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.ctx = ctx;
    }
    setTimer(end, timezone = 'UTC') {
        if (typeof end === 'string') {
            end = moment_timezone_1.default(end).toDate();
        }
        this.timeResult = this.getDiff(end, timezone);
        return this;
    }
    setOutputStream(stream) {
        this.stream = stream;
        return this;
    }
    /**
     * Calculate the diffeence between timeString and current time
     */
    getDiff(end, tz = 'UTC') {
        const target = moment_timezone_1.default.tz(end, tz);
        const current = moment_timezone_1.default();
        const difference = target.diff(current);
        if (difference > 0) {
            return moment_timezone_1.default.duration(difference);
        }
        return null;
    }
    getFormattedTime() {
        if (!this.timeResult) {
            return '';
        }
        const days = Math.floor(this.timeResult.asDays());
        const hours = Math.floor(this.timeResult.asHours() - (days * 24));
        const minutes = Math.floor(this.timeResult.asMinutes()) - (days * 24 * 60) - (hours * 60);
        const seconds = Math.floor(this.timeResult.asSeconds()) - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
        const finalArr = [];
        if (days > 0) {
            days.toString().length == 1 ? finalArr.push('0' + days) : finalArr.push(days);
            finalArr.push('d ');
        }
        if (hours.toString().length == 1) {
            finalArr.push('0' + hours);
        }
        else {
            finalArr.push(hours);
        }
        finalArr.push(':');
        if (minutes.toString().length == 1) {
            finalArr.push('0' + minutes);
        }
        else {
            finalArr.push(minutes);
        }
        finalArr.push(':');
        if (seconds.toString().length == 1) {
            finalArr.push('0' + seconds);
        }
        else {
            finalArr.push(seconds);
        }
        return finalArr.join('');
    }
    /**
     * Encode the GIF with the information provided by the time function
     */
    async encode() {
        // pipe the image to the filesystem to be written
        const imageStream = this.encoder.createReadStream().pipe(this.stream);
        // start encoding gif with following settings
        this.encoder.start();
        this.encoder.setRepeat(0);
        this.encoder.setDelay(1000);
        this.encoder.setQuality(90);
        let frames;
        let shouldFormatTime = false;
        if (this.timeResult && typeof this.timeResult === 'object') {
            frames = this.options.frames;
            shouldFormatTime = true;
        }
        else {
            frames = 2;
        }
        for (let i = 0; i < frames; i++) {
            const timeStr = shouldFormatTime ? this.getFormattedTime() : (i ? '00:00:00' : '');
            this.ctx.fillStyle = '#' + this.options.bg;
            this.ctx.fillRect(0, 0, this.options.width, this.options.height);
            this.ctx.fillStyle = '#' + this.options.color;
            this.ctx.fillText(timeStr, this.options.width / 2, this.options.height / 2);
            this.encoder.addFrame(this.ctx);
            // remove a second for the next loop
            this.timeResult && this.timeResult.subtract(1, 'seconds');
        }
        this.encoder.finish();
        return new Promise((resolve, reject) => {
            imageStream.on('finish', resolve);
            imageStream.on('error', reject);
        });
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map