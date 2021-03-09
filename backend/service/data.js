const pool = require("./index");
const dataQuery = require("../query/data");

const getAllInteractions = async() => {
  const results = await pool.execute(dataQuery.getAllInteractions);
  return {
    data: results[0]
  }
}

const getAllRaw = async() => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPos);
  results.int = await pool.execute(dataQuery.getRawInt);
  return {
    data: results
  }
}

module.exports = {
  getAllInteractions,
  getAllRaw
};
