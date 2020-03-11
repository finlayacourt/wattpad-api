const fs = require('fs').promises;
const wattpad = require('./wattpad');
const logging = require('./logging');
const Table = require('cli-table');

(async () => {
	const query = {
		query: 'sherlock',
		mature: true,
		minParts: 20,
		maxParts: 50,
		limit: 50
	}

	const filter = wattpad.storyFilter({
		fromDate: new Date(2012,0,1),
		toDate: new Date(2015,0,1),
		minReadCount: 50000,
		maxReadCount: 80000
	})

	const stories = await wattpad.completeSearch(query, filter)

	const table = new Table({
		head: ['author', 'title', 'published', 'views']
	})

	stories.forEach(story => {
		table.push([
			story.user.name,
			story.title,
			story.lastPublishedPart.createDate,
			story.readCount
		])
	})

	console.log(table.toString())
})()