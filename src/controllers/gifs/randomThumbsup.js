const createError = require('http-errors')
const Thumbsup = require('../../models/schemas/Thumbsup')
const Stats = require('../../models/schemas/Stat')

// Get random Anime Thumbsup
module.exports = async function getRandomThumbsup(req, res, next) {
  try {
    const [result] = await Thumbsup.aggregate([
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, _id: 0 } },
    ])

    if (!result) {
      return next(createError(404, 'Could not find any Thumbsup Gif'))
    }

    res.status(200).json(result)

    await Stats.findOneAndUpdate(
      { _id: 'systemstats' },
      { $inc: { thumbsup: 1 } }
    )
  } catch (error) {
    await Stats.findOneAndUpdate(
      { _id: 'systemstats' },
      { $inc: { failed_requests: 1 } }
    )
    return next(error)
  }
}
