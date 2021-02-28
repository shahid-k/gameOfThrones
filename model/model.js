const dataDumpCollection = require("../utilities/dataDumpConnection");

const modelObj = {};

modelObj.getList = () => {
  return dataDumpCollection.getCollection().then((model) => {
    return model.find({}, { _id: 0, location: 1 }).then((data) => {
      return data;
    });
  });
};

modelObj.countOfBattles = () => {
  return dataDumpCollection.getCollection().then((model) => {
    return model
      .find(
        {
          battle_number: { $ne: null },
        },
        { _id: 0, battle_number: 1 }
      )
      .then((data) => {
        return data.length;
      });
  });
};

modelObj.search = (king, location, type) => {
  if (king != null && location == null && type == null) {
    return dataDumpCollection.getCollection().then((model) => {
      return model
        .find({
          $or: [
            { attacker_king: new RegExp(king) },
            { defender_king: new RegExp(king) },
          ],
        })
        .then((data) => {
          return data;
        });
    });
  }
  if (king != null && (location != null || type != null)) {
    return dataDumpCollection.getCollection().then((model) => {
      return model
        .find({
          $and: [
            {
              $or: [
                { attacker_king: new RegExp(king) },
                { defender_king: new RegExp(king) },
              ],
            },
            { location: location },
            { battle_type: type },
          ],
        })
        .then((data) => {
          return data;
        });
    });
  }
};

modelObj.stats = () => {
  // region: db.csvdump.aggregate([{$group:{_id:"$region",count:{$sum:1}}}])
  // name: db.csvdump.aggregate([{$group:{_id:"$name",count:{$sum:1}}}])
  //db.csvdump.aggregate([{$group:{_id:"$attacker_king",count:{$sum:1}}}])
  //db.csvdump.aggregate([{$group:{_id:"$defender_king",count:{$sum:1}}}])
  //db.csvdump.aggregate([{$group:{_id:"$attacker_outcome",count:{$sum:1}}}])
  //db.csvdump.aggregate([{$group:{_id:"$battle_type"}}])
  //db.csvdump.aggregate([{$group:{_id:"$defender_size"}}])
  let returnObj = {
    most_active: {
      attacker_king: null,
      defender_king: null,
      region: null,
      name: null,
    },
    attacker_outcome: { win: null, loss: null },
    battle_type: [],
    defender_size: { average: null, min: null, max: null },
  };
  return dataDumpCollection.getCollection().then((model) => {
    return Promise.all([
      model.aggregate([{ $group: { _id: "$region", count: { $sum: 1 } } }]),
      model.aggregate([{ $group: { _id: "$name", count: { $sum: 1 } } }]),
      model.aggregate([
        { $group: { _id: "$attacker_king", count: { $sum: 1 } } },
      ]),
      model.aggregate([
        { $group: { _id: "$defender_king", count: { $sum: 1 } } },
      ]),
      model.aggregate([
        { $group: { _id: "$attacker_outcome", count: { $sum: 1 } } },
      ]),
      model.aggregate([{ $group: { _id: "$battle_type" } }]),
      model.aggregate([{ $group: { _id: "$defender_size" } }]),
    ]).then((result) => {
      if (result[0].length > 0) {
        returnObj.most_active.region = result[0].sort(function (a, b) {
          return parseInt(b["count"]) - parseInt(a["count"]);
        })[0]["_id"];
      }
      if (result[1].length > 0)
        returnObj.most_active.name = result[1].map((x) => (x = x._id));
      if (result[2].length > 0) {
        returnObj.most_active.attacker_king = result[2].sort(function (a, b) {
          return parseInt(b["count"]) - parseInt(a["count"]);
        })[0]["_id"];
      }
      if (result[3].length > 0) {
        returnObj.most_active.defender_king = result[3].sort(function (a, b) {
          return parseInt(b["count"]) - parseInt(a["count"]);
        })[0]["_id"];
      }
      if (result[4].length > 0) {
        result[4].forEach((x) => {
          if (x._id == "win") returnObj.attacker_outcome.win = x.count;
          if (x._id == "loss") returnObj.attacker_outcome.loss = x.count;
        });
      }
      if (result[5].length > 0) {
        temp = [];
        result[5].forEach((x) => {
          if (x._id.length > 0) temp.push(x._id);
        });
        returnObj.battle_type = temp;
      }
      if (result[6].length > 0) {
        temp = new Array();
        result[6].forEach((x) => {
          if (x._id.length > 0) temp.push(parseInt(x._id));
        });
        returnObj.defender_size.average = parseInt(
          temp.reduce((a, v, i) => (a * i + v) / (i + 1))
        );
        returnObj.defender_size.max = temp.sort((a, b) => {
          a - b;
        })[temp.length - 1];
        returnObj.defender_size.min = temp.sort((a, b) => {
          a - b;
        })[0];
      }
      // console.log(returnObj);
      return returnObj;
    });
  });
};

module.exports = modelObj;
