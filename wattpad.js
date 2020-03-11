const fetch = require('node-fetch')
const querystring = require('querystring')

const BASE_URL = 'https://api.wattpad.com/v4'
const STORY_SEARCH = '/search/stories'
const MAXIMUM_OFFSET = 9000

// @param query: {{query: string, mature: boolean, category: integer, minParts: integer, maxParts: integer, offset: integer, limit: integer}}
const singleSearch = async (query) => {
	if (query.limit > 99) throw Error('Limit must be <100')

	const parameters = querystring.encode({
		fields: 'stories(title,user(name),readCount,numParts,lastPublishedPart(createDate)),total',
		...query
	})

	const url = `${BASE_URL}${STORY_SEARCH}?${parameters}`

	const response = await fetch(url)
	const data = await response.json()

	var offset = query.offset || 0
	console.log(`Searched stories ${offset}-${offset + query.limit - 1}/${data.total}`)

	return {
		total: data.total,
		stories: data.stories,
		offset: Number(querystring.decode(data.nextUrl).offset)
	}
}

// @param query: {{query: string, mature: boolean, category: integer, minParts: integer, maxParts: integer, offset: integer, limit: integer}}
// @param filter: {function}
const completeSearch = async (query, filter) => {
	var stories = []
	var currentQuery = query

	while (true) {
		const result = await singleSearch(currentQuery)

		const newStories = filter ? result.stories.filter(filter) : result.stories
		stories = stories.concat(newStories)

		if (!result.offset) break

		if (result.offset > MAXIMUM_OFFSET) {
			throw Error('maximum offset reached')
			break
		}

		currentQuery.offset = result.offset
	}

	return stories
}

// @param parameters: {{fromDate: Date, toDate: Date, minReadCount: integer, maxReadCount: integer}}
const storyFilter = (parameters) => {
	return (story) => {
		const published = Date.parse(story.lastPublishedPart.createDate)
		const count = story.readCount
		return published >= parameters.fromDate && published <= parameters.toDate && story.readCount >= parameters.minReadCount && story.readCount <= parameters.maxReadCount
	}
}

module.exports = {
	singleSearch: singleSearch,
	completeSearch: completeSearch,
	storyFilter: storyFilter
}
