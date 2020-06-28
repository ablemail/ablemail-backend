const Imap = require('imap');
const parser = require('mailparser').simpleParser;

const imap = settings => new Promise((resolve, reject) => {
  const i = new Imap(settings);
  let mail = [];
  i
    .once('ready', () => {
      i.openBox('INBOX', false, (err, box) => {
        if (err) console.error(err);
        i.seq.fetch(`${ box.messages.total - 6 }:${ box.messages.total }`, { bodies: '', markSeen: true })
          .on('message', (msg, seqno) => {
            mail[seqno - 1] = {};
            msg
              .on('body', stream => {
                let buffer = '';
                stream.on('data', chunk => buffer += chunk);
                stream.once('end', () => parser(buffer).then(parsed => {
                  mail[seqno - 1].body = parsed;
                }));
              })
              // .on('attributes', attrs => {
              //   mail[seqno - 1].attributes = attrs;
              //   // i.setFlags([attrs.uid], ['\\Seen'], err => err && throw err);
              // });
          })
          .once('end', () => i.end());
      });
    })
    .once('error', err => reject(`Error with IMAP: ${ err }`))
    .once('end', () => resolve(mail))
    .connect();
});

module.exports = imap;