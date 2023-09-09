export interface RouteSettings {
	api: string;
	cdn: string;
	gateway: string;
	wellknown: string;
}

export const DefaultRouteSettings: RouteSettings = {
	api: "https://api.old.server.spacebar.chat/api",
	cdn: "https://cdn.old.server.spacebar.chat",
	gateway: "wss://gateway.old.server.spacebar.chat",
	wellknown: "https://spacebar.chat",
};

// TODO: we should probably make our own
export const USER_JOIN_MESSAGES = [
	"{author} joined the party.",
	"{author} is here.",
	"Welcome, {author}. We hope you brought pizza.",
	"A wild {author} appeared.",
	"{author} just landed.",
	"{author} just slid into the server.",
	"{author} just showed up!",
	"Welcome {author}. Say hi!",
	"{author} hopped into the server.",
	"Everyone welcome {author}!",
	"Glad you're here, {author}.",
	"Good to see you, {author}.",
	"Yay you made it, {author}!",
];

// TODO: this should come from the server
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 1024; // 1GB, taken from spacebar server default
