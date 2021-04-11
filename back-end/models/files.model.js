
const mongoose = require('mongoose');


const fileSchema=mongoose.Schema({
    nom :{type : String,required : true},
    createdBy:{type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    description: {type: String,maxlength: 500},
    downloadedBy:[{type: mongoose.Schema.Types.ObjectId,ref: "User",required: true}],
    folder:{type: mongoose.Schema.Types.ObjectId,ref: "Folder",required: true},
    comments: {
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        }
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model ('File',fileSchema);