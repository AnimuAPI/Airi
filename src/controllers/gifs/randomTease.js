const createError = require('http-errors')
const Tease = require('../../models/schemas/Tease')
const Stats = require('../../models/schemas/Stat')

// Get random Anime Tease
module.exports = async function getRandomTease(req, res, next) {
  try {
    const [result] = await Tease.aggregate([
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, _id: 0 } },
    ])

    if (!result) {
      return next(createError(404, 'Could not find any Tease Gif'))
    }

    res.status(200).json(result)

    await Stats.findOneAndUpdate({ _id: 'systemstats' }, { $inc: { tease: 1 } })
  } catch (error) {
    await Stats.findOneAndUpdate(
      { _id: 'systemstats' },
      { $inc: { failed_requests: 1 } }
    )
    return next(error)
  }
}
