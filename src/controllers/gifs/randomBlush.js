const createError = require('http-errors')
const Blush = require('../../models/schemas/Blush')
const Stats = require('../../models/schemas/Stat')

// Get random Anime Blush
module.exports = async function getRandomBlush(req, res, next) {
  try {
    const [result] = await Blush.aggregate([
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, _id: 0 } },
    ])

    if (!result) {
      return next(createError(404, 'Could not find any Blush Gif'))
    }

    res.status(200).json(result)

    await Stats.findOneAndUpdate({ _id: 'systemstats' }, { $inc: { blush: 1 } })
  } catch (error) {
    await Stats.findOneAndUpdate(
      { _id: 'systemstats' },
      { $inc: { failed_requests: 1 } }
    )
    return next(error)
  }
}
