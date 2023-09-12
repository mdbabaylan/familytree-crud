const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router()

module.exports = router;

const Model = require('../model/family');

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
}


//READ #1 - Get ALL
router.get('/getAll', async(req, res) => {
  try{
      const data = await Model.find();
      res.json(data);
  }catch (error) {
      res.status(400).json({message: error.message});
  }
})

//READ #2 - Get one member and the names of its other family members
router.get('/getById/:id', async(req, res) => {
  try{
      let data = await Model.findById({_id: req.params.id});


      //get mom and dad
      const mom_data = await Model.findById({_id: data.mother});
      const father_data = await Model.findById({_id: data.father});
      const actual_mother_name = `${mom_data?.first_name?? ""} ${mom_data?.middle_name?? ""} ${mom_data?.last_name?? ""}`;
      const actual_father_name = `${father_data?.first_name?? ""} ${father_data?.middle_name?? ""} ${father_data?.last_name?? ""}`;

      //add their names as a bonus
      const finalObj = { ...data._doc, mothers_name: actual_mother_name, fathers_name: actual_father_name };
      res.json(finalObj);
  }catch (error) {
      res.status(400).json({message: error.message});
  }
})

//CREATE - Save a user in MongoDB, target a different collection though (users)
router.post('/addfamily', async (req, res) => {
  const data = new Model({
      birthday:  formatDate(req.body.birthday),
      first_name: req.body.first,
      middle_name: req.body.middle,
      last_name: req.body.last,
      gender: req.body.gender,
      mother: req.body.motherId,
      father: req.body.fatherId,
  });

  try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave)
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }
})

//DELETE 
router.post('/deletefamily', async (req, res) => {
  try {
    const deletedItem = await Model.findByIdAndDelete(req.body.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//UPDATE
router.put('/updateById/:id', async (req, res) => {
  try {
    const updatedUser = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // This option returns the updated document
    );
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//-----------------------------------------------------------------------------------//