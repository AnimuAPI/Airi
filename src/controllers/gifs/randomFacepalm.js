const createError = require('http-errors')
const Facepalm = require('../../models/schemas/Facepalm')
const Stats = require('../../models/schemas/Stat')

// Get random Anime Facepalm
module.exports = async function getRandomFacepalm(req, res, next) {
  try {
    const [result] = await Facepalm.aggregate([
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, _id: 0 } },
    ])

    if (!result) {
      return next(createError(404, 'Could not find any Facepalm Gif'))
    }

    res.status(200).json(result)

    await Stats.findOneAndUpdate(
      { _id: 'systemstats' },
      { $inc: { facepalm: 1 } }
    )
  } catch (error) {
    await Stats.findOneAndUpdate(
      { _id: 'systemstats' },
      { $inc: { failed_requests: 1 } }
    )
    return next(error)
  }
}
