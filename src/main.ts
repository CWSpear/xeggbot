import { ChatUserstate, Client } from 'tmi.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  identity: {
    username: `${process.env.TWITCH_USERNAME}`,
    password: `oauth:${process.env.TWITCH_OAUTH}`,
  },
  channels: (process.env.TWITCH_CHANNEL || '').split(','),
  options: { debug: true, messagesLogLevel: 'info' },
  connection: {
    reconnect: true,
    secure: true,
  },
});

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect().catch((err) => {
  console.error('Error connecting to Twitch:', err);
});

let eggTracker: number[] = [];

function onMessageHandler(
  channel: string,
  userstate: ChatUserstate,
  message: string,
  self: boolean,
) {
  if (self) {
    return;
  }

  const commandName = message.trim();

  switch (commandName) {
    case '!egg':
      const eggs = rollEggs();
      eggTracker = [...eggTracker, eggs];
      client.say(channel, `${eggs} ${thankEgg(eggs)} FOR ${userstate.username} [TEST MODE]`);

      // unnecessarily crazy messy, haha
      if (eggTracker.at(-1) === 10 && eggTracker.at(-2) === 10 && eggTracker.at(-3) === 10) {
        let eggTrackerClone = [...eggTracker];
        const tenEggs: number[] = [];
        let egg;
        do {
          egg = eggTrackerClone.pop();
          if (egg === 10) {
            tenEggs.push(egg);
          }
        } while (egg === 10);
        client.say(channel, `Wow! That's ${tenEggs.length} ten ThankEgg 's in a row! [TEST MODE]`);
      }

      break;
  }
}

function rollEggs() {
  // this will return a random integer between 0 and 1001 inclusive
  const result = Math.floor(Math.random() * 1002);

  if (result === 0) {
    return 0;
  }

  if (result === 1001) {
    return 11;
  }

  return Math.ceil(result / 100);
}

function thankEgg(count: number) {
  let msg = '';
  for (let i = 0; i < count; i++) {
    msg += ' ThankEgg';
  }

  return msg.trim();
}

function onConnectedHandler(address: string, port: number) {
  console.log(`Connected to ${address}:${port}`);
}
