import Notifier from 'node-notifier';
import { exec } from 'child_process';
import path from 'path';
import { setTimeout } from 'timers/promises';
import Dayjs from 'dayjs';
import { createWriteStream, writeFile, existsSync } from 'fs';

const __dirname = path.resolve(path.dirname('')); 
const key = ""; // get an API key from https://bereal.devin.fun/
let debug = false;
const BeReal_region = "us-central" // Set by default to US. Valid options are:
// us-central
// europe-west
// asia-west
// asia-east

process.argv.forEach(function (val, index, array) {
    if (array.includes("--debug")) {
        debug = true
    };
});
if (debug == true) {
    log("Running in debug mode...\n");
};

function log(message) {
    if (! existsSync("log.txt")) writeFile("log.txt", "", (err) => {if (err) console.error(err)})
    const stream = createWriteStream("log.txt", {flags:'a'});
    stream.write(`${message.replace("\u001b[2K\u001b[0E", "")}
`)
    process.stdout.write(message)
}

async function latestMoment(region) {
    let json;
    try {
        json = await fetch(`https://bereal.devin.rest/v1/moments/latest?api_key=${key}`).then(response => response.json())
    } catch (err) {
        log(`${err}\n`)
        Notifier.notify({
            title: "BeReal server error!",
            message: err,
            icon: path.join(__dirname, 'BeReal.png'), // Absolute path (doesn't work on balloons)
            sound: false, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
          })
    }
    const data = {
        "moment": json.regions[region].utc,
        "now": json.now.utc
    }
    return data
}

function between(x, min, max) { // https://stackoverflow.com/a/6454237
    return x >= min && x <= max;
}

async function notification() {
    Notifier.notify({
        title: "⚠️ It's time to BeReal. ⚠️",
        message: '2 min left to capture a BeReal and see what your frinds are up to!',
        icon: path.join(__dirname, 'BeReal.png'), // Absolute path (doesn't work on balloons)
        sound: false, // Only Notification Center or Windows Toasters
        wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      })
    exec(`cvlc ${path.join(__dirname, 'BeReal.mp3')} --play-and-exit`, (error, stdout, stderr) => {
        if (debug == true) {
            if (error) {
                console.log(`error: ${error.message}`);
                return;existsSync
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`command response: ${stdout}`);
        };
    });
}

async function main() {
    const serverResponse = await latestMoment(BeReal_region)
    const nowArray = serverResponse["now"].replaceAll(":", "-").replace(" ", "-").split("-")
    const momentArray = serverResponse["moment"].replaceAll(":", "-").replace(" ", "-").split("-")

    const now = new Date();
    now.setUTCHours(nowArray[3], nowArray[4], nowArray[5]);
    now.setUTCFullYear(nowArray[0], nowArray[1], nowArray[2]);

    const moment = new Date();
    moment.setUTCHours(momentArray[3], momentArray[4], momentArray[5]);
    moment.setUTCFullYear(momentArray[0], momentArray[1], momentArray[2]);

    if (between(moment.getTime(), now.getTime() - 10000, now.getTime() + 10000)) {
        notification()
        log(`New BeReal moment ${Dayjs(moment).format("ddd, MMM D")} at ${Dayjs(moment).format("HH:mm:ss")}! Millisecond: ${moment.getTime()}`)
        if (debug == false) await setTimeout(25200000)
    }

    if (debug == true) log(`\u001b[2K\u001b[0ELast BeReal moment: ${Dayjs(moment).format("HH:mm:ss (ddd, MMM D)")} | Time now: ${Dayjs(now).format("HH:mm:ss (ddd, MMM D)")}`)
}

while (true) {
    main()
    await setTimeout(1000)
}