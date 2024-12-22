const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teachingTeamSchema = new Schema({
  image: String,
  name: String,
  experience:String,
  subject:String,
});

const TeachingTeam = mongoose.model("TeachingTeam", teachingTeamSchema);

module.exports = TeachingTeam;

