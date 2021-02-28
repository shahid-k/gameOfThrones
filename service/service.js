const modelObj = require("../model/model");

const ServiceObj = {};

//update the products to cart
ServiceObj.list = () => {
  return modelObj
    .getList()
    .then((cart) => {
      if (cart) {
        return cart;
      }
    })
    .catch((err) => {
      err = new Error("Sorry!! Data not found");
      err.status = 403;
      throw err;
    });
};

// fetches cart object
ServiceObj.battles = () => {
  return modelObj.countOfBattles().then((item) => {
    if (item) {
      return item;
    } else {
      let err = new Error("No battles occured");
      err.status = 403;
      throw err;
    }
  });
};

ServiceObj.search = (king, location, type) => {
  return modelObj.search(king, location, type).then((item) => {
    if (item) {
      return item;
    } else {
      let err = new Error("No data found");
      err.status = 403;
      throw err;
    }
  });
};

ServiceObj.stat = () => {
  return modelObj.stats().then((item) => {
    if (item) {
      return item;
    } else {
      let err = new Error("No stats");
      err.status = 403;
      throw err;
    }
  });
};

module.exports = ServiceObj;
