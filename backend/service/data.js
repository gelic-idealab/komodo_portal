const fs = require('fs');
const AWS = require('aws-sdk');
const config = require("../config");
AWS.config.update(config.aws);
const s3 = new AWS.S3();
const BUCKET_NAME = config.aws.bucket;

const pool = require("./index");
const dataQuery = require("../query/data");

const getAllInteractions = async() => {
  const results = await pool.execute(dataQuery.getAllInteractions);
  return {
    data: results[0]
  }
}

const getAllRawCapture = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosCapture, [id]);
  results.int = await pool.execute(dataQuery.getRawIntCapture, [id]);
  return {
    data: results
  }
}

const getAllRawLab = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosLab, [id]);
  results.int = await pool.execute(dataQuery.getRawIntLab, [id]);
  return {
    data: results
  }
}

const getAllRawCourse = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosCourse, [id]);
  results.int = await pool.execute(dataQuery.getRawIntCourse, [id]);
  return {
    data: results
  }
}

const exportMetricCsv = async(data) => {
  let request = [data.captureId, data.clientId, data.type, 0, data]
  results = await pool.execute(dataQuery.insertRequest,request);
  return {
    data: {
      status: "success"
    }
  }
}

const getAllCsvExport = async(data) => {
  let userId = data.userId;
  results = await pool.execute(dataQuery.getAllDataRequest,[userId]);
  for(i=0;i<results[0].length;i++){
    results[0][i].message = JSON.parse(results[0][i].message);
  }
  return {
    data: results[0]
  };
}

const getDownloadLink = async(request) => {
  let requestId = request.requestId;
  results = await pool.execute(dataQuery.getDownloadLink,[requestId]);
  if(results[0][0].file_location == null){
    return({
      data: {
        status: "processing"
      }
    })
  }else{
    if(results[0][0].url == null){
      //upload file to s3
      const fileContent = fs.readFileSync("C://Users//shiuan//Documents//testfile.csv");
      const { url, fields } = await s3.createPresignedPost({
        Bucket: BUCKET_NAME,
        Key: "testfile.csv",
      });
      console.log(url, fields);
    }else{
      return({
        data: {
          status: "success",
          url: results[0][0].url
        }
      })
    }
  }
}

module.exports = {
  getAllInteractions,
  getAllRawCapture,
  getAllRawLab,
  getAllRawCourse,
  getAllCsvExport,
  exportMetricCsv,
  getDownloadLink
};
