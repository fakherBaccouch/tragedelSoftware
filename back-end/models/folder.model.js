const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name:     {type: String,required: true,unique:true},
    parentId: {type: String},
    createdBy:{type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    files :   [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
