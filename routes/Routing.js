const express = require("express");
const { set } = require("mongoose");
const RouterObj = express.Router();
const ServiceObj = require("../service/service");

RouterObj.get("/list", (req, res, next) => {
  return ServiceObj.list()
    .then((item) => {
      let uniqArray = [];
      item.forEach((element) => {
        if (element.location.length > 0) uniqArray.push(element.location);
      });
      uniqArray = Array.from(new Set(uniqArray));
      res.json(uniqArray);
    })
    .catch((err) => next(err));
});

RouterObj.get("/count", (req, res, next) => {
  return ServiceObj.battles()
    .then((item) => {
      res.json(item);
    })
    .catch((err) => next(err));
});

RouterObj.get("/search", (req, res, next) => {
  let king = req.query.king ? req.query.king : null;
  let location = req.query.location ? req.query.location : null;
  let type = req.query.type ? req.query.type : null;

  return ServiceObj.search(king, location, type)
    .then((cdata) => {
      res.json(cdata);
    })
    .catch((err) => next(err));
});

RouterObj.get("/stat", (req, res, next) => {
  return ServiceObj.stat()
    .then((cdata) => {
      res.json(cdata);
    })
    .catch((err) => next(err));
});

module.exports = RouterObj;
