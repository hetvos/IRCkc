const irc = require('irc');
const config = require("./config.json") 
const yttoken = config.token
const botname = config.botName
const ircClient = new irc.Client(config.ircServer, botname, {
	channels: config.ircChannels,
	port: config.ircPort,
	realName: botname,
	secure: config.ircSsl,
});

const he = require("html-entities");

const wsc = require("ws");
const ws = new wsc(config.chatkcServer);

ircClient.addListener("message#",(from,to,msg)=>{
	ws.send(JSON.stringify({"auth":"google","token":yttoken,"type":"message","data":{text:`<${from}> ${msg}`}}))
})

ircClient.addListener("error", error =>{
	console.log(error)
})

console.log(ws,ws._url);
ws.addListener("message",(message) => {
		message = JSON.parse(message.toString())
		console.log(message)
		if (message.type == "chat" && message.data.author != botname) {
			gmem = message.data.author
			content = he.decode(message.data.message)
			ircClient.say("#streamkc",`[${gmem}] => ${content}`)
		}
	}
);
