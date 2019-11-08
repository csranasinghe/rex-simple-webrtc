
export class MediaHandler {
    private stream;
    private streamPromise: Promise<MediaStream>;
    constructor() {
        this.stream = null;
        this.streamPromise = null;
    }

    public async init() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log(this.stream);
    }

    public async getStream() {
        let s = this.stream;
        try {
            if (this.stream === null) {
                // Check usermedia support
                if (MediaHandler.isBrowserSupports()) {
                    s = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                    debugger;
                } else {
                    throw "Your browser doesnt support getUserMedia api.";
                }
            }
        } catch (err) {
            console.error(err)
            throw "Failed to get user media.";
        }
        return s;
    }

    public static isBrowserSupports(): boolean {
        // Make the result boolean using !! oparetors
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }



}
