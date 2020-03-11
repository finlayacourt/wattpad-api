const wattpad = require('./wattpad');
const Table = require('cli-table');
const inquirer = require('inquirer');

(async () => {
	const answers = await inquirer.prompt([
		{name: 'query', message: 'Search query:'},
		{name: 'mature', message: 'Show mature content:', type:'list', choices: ['yes', 'no']},
		{name: 'minParts', message: 'Minimum parts', type:'number'},
		{name: 'maxParts', message: 'Maximum parts:', type:'number'},
		{name: 'fromDate', message: 'Earliest published date (DD/MM/YYYY):'},
		{name: 'toDate', message: 'Latest published date (DD/MM/YYYY):'},
		{name: 'minReadCount', message: 'Minimum views:'},
		{name: 'maxReadCount', message: 'Maximum views:'},
	])
	console.log('\nStarting search...')

	const query = {
		query: answers.query,
		mature: answers.mature == 'yes',
		minParts: answers.minParts,
		maxParts: answers.maxParts,
		limit: 50
	}

	const filter = wattpad.storyFilter({
		fromDate: Date.parse(answers.fromDate),
		toDate: Date.parse(answers.toDate),
		minReadCount: answers.minReadCount,
		maxReadCount: answers.maxReadCount
	})

	const stories = await wattpad.completeSearch(query, filter)

	console.log(`Done! Found ${stories.length} stories`)

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