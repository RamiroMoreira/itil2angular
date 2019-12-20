const server = require('./server');
const io = server.io;
var MailListener = require("mail-listener2");
const Tickets = require('./models/Tickets');
const TipoTicket = require('./models/TipoTicket');
var username = process.env.USERNAME_MAIL || "testitilmail@gmail.com";
var password = process.env.PASSWORD_MAIL || "itilmail"; 
var mailListener = new MailListener({
    username: username,
    password: password,
    host: "imap.gmail.com",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});
mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
    // do something with mail object including attachments
    // mail processing code goes here
    var tipo = TipoTicket.findOne({}, function(err,res){
        if(!res){
            return;
        }
        let tickets = new Tickets({title:mail.subject, description: mail.text, tipoTicket: res._id});
        tickets.save()
        .then(tickets => {
            Tickets.findOne({_id: tickets._id}).populate('tipoTicket').exec(function(err,res){
              if (err)
                  console.log(err);
              else
                  io.emit('new ticket', res);
            });
         })
        .catch(err => {
            console.log(err);
        });
    });
   

});

mailListener.on("attachment", function(attachment){
  console.log(attachment.path);
});

