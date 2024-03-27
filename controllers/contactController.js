const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//will contain all our logic for req response and connect with db
//@desc Get all contacts
//@route Get /api/contact
//@access private 
const getContacts = asyncHandler(async (req,res)=>{

    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc create contacts
//@route post /api/contact
//@access  private
const createContact = asyncHandler(async (req,res)=>{
    console.log("req is :", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(200).json(contact);
});
//@desc create contacts
//@route get /api/contact/:id
//@access private 
const getContact = asyncHandler(async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
  
      if (!contact) {
        return res.status(404).json({ message: "Contact Not Found" });
      }
  
      res.status(200).json(contact);
    } catch (err) {
      // Handle unexpected errors here (e.g., database errors)
      console.error(err);
      res.status(500).json({ message: "Contact Not found" });
    }
  });
  
//@desc update contacts
//@route put /api/contact/:id
//@access private 
const updateContact =  asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }
     if(contact.user_id.toString() !== req.user.id){
      res.status(403)
      throw new Error("User dont have permisson to update other user contact")
    }
   const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});

//@desc delete contacts
//@route delete /api/contact/:id
//@access  private
const deleteContact = asyncHandler(async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
  
      if (!contact) {
        return res.status(404).json({ message: "Contact Not Found" });
      }
       if(contact.user_id.toString() !== req.user.id){
      res.status(403)
      throw new Error("User dont have permisson to delete other user contact")
    }
 
      res.status(200).json({ message: "Contact Deleted" }); // Informative response
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

module.exports = { getContact, createContact, updateContact, getContacts, deleteContact}