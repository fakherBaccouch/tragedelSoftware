const Folder = require("../models/folder.model");
const User = require("../models/user.model");
// function to create folder
function createFolders(folders, parentId = null) {
  const folderList = [];
  let folder;
  if (parentId == null) {
    folder = folders.filter((fold) => fold.parentId == undefined);
  } else {
    folder = folders.filter((fold) => fold.parentId == parentId);
  }

  for (let foldr of folder) {
    folderList.push({
      _id: foldr._id,
      name: foldr.name,
      slug: foldr.slug,
      parentId: foldr.parentId,
      type: foldr.type,
      children: createFolders(folders, foldr._id),
    });
  }

  return folderList;
}


module.exports.readFolder = (req, res) => {
  Folder.find({}).exec((error, folders) => {
    if (error) return res.status(400).json({ error });
    if (folders) {
      const folderList = createFolders(folders);
      res.status(200).json({ folderList });
    }
  });
};

module.exports.createFolder = async (req, res) => {
    const folderObj = {
      name: req.body.name,
      createdBy: "606f7758c4c6ae17b4eb5150",
      files:[]
    }; 
    if (req.body.parentId) {
      folderObj.parentId = req.body.parentId;
    }
    const fold = new Folder(folderObj);
    fold.save((error, folder) => {
      if (error) return res.status(400).json({ error });
      if (folder) {
        return res.status(201).json({ folder });
      }
    });
  };


module.exports.deleteFolder = (req, res) => {

};

module.exports.readOneFolder = (req, res) => {
  Folder.find({}).exec((error, folders) => {
    if (error) return res.status(400).json({ error });
    if (folders) {
      console.log("from react"+req.params.id);
      const folderList = createFolders(folders,req.params.id);
      res.status(200).json({ folderList });
    }
  });
};