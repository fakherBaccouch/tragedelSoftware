const File = require("../models/files.model");
const User = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");

module.exports.showFiles = (req, res) => {
  File.find({folder:req.params.id},(err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

module.exports.uploadFile = async (req, res) => {
  if (req.files === null) {return res.status(400).json({ msg: 'No file uploaded' });  }
  const file = req.files.file;
  file.mv(`./files/${file.name}`,async err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    } 
    console.log(req.user);
    const newFile =await new File({
      nom: Date.now()+'-'+file.name,
      createdBy:  res.locals.user._id,
      description: req.body.description,
      downloadedBy: [],
      folder:req.body.folder,
      comments : []
    });
    try {
      const newfile = await newFile.save();
      return res.status(500).send({ newfile }); 
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  });
};


module.exports.download =  async (req, res) => {
  try {
    console.log((req.params));
 await File.findById(req.params.id, (err, doc) => {
   var myfile = doc;
   console.log(doc);
      var filePath = "./files";
      var fileName = myfile.nom;
      console.log(fileName)
      res.download(filePath, fileName,(err,doc)=>{
        if(err)console.log(err);
        res.status(200).send({ message : 'file downloaded' });
      });

 })
  
   /*   File.findByIdAndUpdate(
       req.params.id,
       {
         $addToSet: { receiver: "new one" },
       },
       { new: true },
       (err, docs) => {
        console.log(docs);
         if (err) return console.log(err);;
         
       }
     );*/

   } catch (err) {
     return console.log(err);;
   }
   } ;


module.exports.addReceiver = async (req, res) => {
console.log(req.body);

try {
  await File.findByIdAndUpdate(
    req.body.fileId,
    {
      $addToSet: { receiver: req.body.userId },
    },
    { new: true },
    (err, docs) => {
      if (err) return res.status(400).send(err);
    }
  );
} catch (err) {
  return res.status(400).send(err);
}
};
/*
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await User.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await User.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      if (!theComment) return res.status(404).send("Comment not found");
      theComment.text = req.body.text;

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
*/