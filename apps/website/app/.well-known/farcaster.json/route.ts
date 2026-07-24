import { siteConfig } from "@/config";

export async function GET() {
	return Response.json({
		accountAssociation: {
			header:
				"eyJmaWQiOjIwMjY1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MGJDQzI4MDE5N0JCYUViODJlOWYyNDY0NTBhQTNFQzY4NjEwZjlFMCJ9",
			payload: "eyJkb21haW4iOiJub3Vucy5nZyJ9",
			signature:
				"MHhhZTljMzZhZGM4YmRmYTU0ZTg2M2NkNjNlZDE1ODg0MjA1ODA0MjZiN2M3M2VlZTQyMjE5N2IyMDhiYTY1NWRlMDllNDYyOWM2OWFmZjQ0NzYxZGFiNmIxZWQ5Y2EwMjBkZTVmZTg2YmY4NzVlYjRjMmViNzMzODU5OWIwOTM2MDFj",
		},
		frame: {
			version: "0.0.1",
			name: "Nouns GG",
			iconUrl:
				"https://ipfs.nouns.gg/ipfs/bafkreihrlnm24yfbi3bqgmwlr2ejcm6qbdm3pj6gvblb2grrlpogsvm6o4",
			homeUrl: siteConfig.domain,
			imageUrl:
				"https://ipfs.nouns.gg/ipfs/bafybeih4hyyo6jakdqvg6xjc26pmh5kg5peqkig2wmjufzjbnum6oyb25y",
			buttonTitle: "Launch",
			splashImageUrl:
				"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
			splashBackgroundColor: "#040404",
		},
	});
}
