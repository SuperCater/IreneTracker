import axios from "axios"
const baseURL = "https://groups.roblox.com/v1/groups/"
import fs from "fs"

const captains = []

fs.writeFileSync(`./captains.txt`, "captain tracker\n")

let next = null
while (true) {
	let link = `${baseURL}4890641/roles/32662558/users?limit=100`
	if (next) link += `&cursor=${next}`
	const response = await axios.get(link).then(res => res.data)
	for (const user of response.data) {
		captains.push(user)
	}

	next = response.nextPageCursor
	if (next === null) break
}

for (const captain of captains) {
	console.log(`Checking ${captain.username}...`)
	const userinfo = await axios.get(`https://groups.roblox.com/v1/users/${captain.userId}/groups/roles`).then(res => res.data)
	const pbstinfo = await userinfo.data.find(role => role.group.id === 645836)
	if (!pbstinfo) {
		console.log(`${captain.username} is not in PBST.`)
		captains.splice(captains.indexOf(captain), 1)
		continue
	}
	console.log(`${captain.username} is in PBST as ${pbstinfo.role.name}.`)
	if (pbstinfo.role.name !== "Cadet") {
		console.log(`${captain.username} is not a cadet.`)
		captains.splice(captains.indexOf(captain), 1)
		continue
	}
	console.log(`${captain.username} is a cadet.`)
}

const fCaptain = captains.map(captain => captain.username).join("\n")
fs.appendFileSync(`./captains.txt`, fCaptain)