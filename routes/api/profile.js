const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const { body, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

/*
    @route      GET api/profile/me
    @desc       Get current users profile
    @access     Private
*/

router.get("/me",auth, async(req, res,next) => {
    try{
        const userProfile = await Profile.findOne({user : req.user.id}).populate('user',['name', 'avatar']);
        if(!userProfile){
            return res.status(400).send({msg : "There is no Profile for this user"});
        }

        res.json(userProfile);
    }catch(err){
        console.error(err.message);
        res.status(500).send(`Server error ${err.message}`);
       
    }
});

/*
    @route      GET api/profile/
    @desc       Create or Update Profile
    @access     Private
*/

router.post("/",[auth , [
    body("status", "Status is required").not().isEmpty(),
    body("skills" , "Skills are required").not().isEmpty()
]], async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const {company,website,location,status,skills,bio,githubusername,youtube,twitter,linkedin,facebook,instagram} = req.body;
    
    //Build profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;
    profileFields.skills = skills.split(",").map(skill => skill.trim());

    //Build Social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
    let profile = await Profile.findOne({user : req.user.id});
    if(profile){
        //Update
        profile = await Profile.findOneAndUpdate({user : req.user.id}, {$set : profileFields},{new : true});

        return res.json({profile});
    }
    //Create
    profile = new Profile(profileFields);
    await profile.save();
    res.send({profile});
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error ${err.message}`);
    }

})

/*
    @route      GET api/profile
    @desc       Get all Profiles
    @access     Public
*/

router.get("/", async(req,res) =>{
    try {
        const profiles = await Profile.find().populate('user' , ['name', 'avatar']);
        res.send({profiles})
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }
})


/*
    @route      GET api/profile/:user_id
    @desc       Get profile by user id
    @access     Public
*/

router.get("/user/:user_id", async(req,res) =>{
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user' , ['name', 'avatar']);
        if(!profile)    return res.status(400).json({msg : "Profile not found"})
        
        res.send({profile})
    } catch (error) {
    
        if(error.kind == 'ObjectId')    return res.status(400).json({msg : "Profile not found"})
        res.status(500).send(`Server Error ${error.message}`);
    }
})


/*
    @route      DELETE api/profile
    @desc       Delete profile,user and Posts
    @access     Private
*/

router.delete("/",auth, async(req,res) =>{
    try {
        //Remove profile
        await Profile.findOneAndRemove({user : req.user.id});
        //Remove User
        await User.findOneAndRemove({_id : req.user.id});
        res.send({msg : "User deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }
})

/*
    @route      PUT api/profile/experience
    @desc       Add profile experience
    @access     Private
*/

router.put("/experience",[auth, [
    body("title", "Title is required").not().isEmpty(),
    body("company", "Company is required").not().isEmpty(),
    body("from", "From Date is required").not().isEmpty(),

]], async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {title, company, location,from,to,current,description} = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user : req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }

});

/*
    @route      DELETE api/profile/experience/:exp_id
    @desc       Delete profile experience
    @access     Private
*/

router.delete("/experience/:exp_id",auth, async(req,res) =>{
    try {
        //Remove profile
        const profile = await Profile.findOne({user : req.user.id});
        //Alternative logic : will it work ???
        // profile.experience = profile.experience.map(exp => exp.id !== req.params.exp_id);

        const index = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(index ,1);

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }
})



/*
    @route      PUT api/profile/education
    @desc       Add profile education
    @access     Private
*/

router.put("/eduation",[auth, [
    body("school", "school is required").not().isEmpty(),
    body("degree", "degree is required").not().isEmpty(),
    body("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
    body("from", "From Date is required").not().isEmpty(),

]], async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {school,degree,fieldofstudy,from,to,current,description} = req.body;

    const newEdu = {school,degree,fieldofstudy,from,to,current,description};

    try {
        const profile = await Profile.findOne({user : req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }

});

/*
    @route      DELETE api/profile/education/:edu_id
    @desc       Delete profile education
    @access     Private
*/

router.delete("/education/:edu_id",auth, async(req,res) =>{
    try {
        //Remove profile
        const profile = await Profile.findOne({user : req.user.id});
        //Alternative logic : will it work ???
        // profile.experience = profile.experience.map(exp => exp.id !== req.params.exp_id);

        const index = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(index ,1);
        
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }
})

/*
    @route      GET api/profile/github/:username
    @desc       Get user repo from github
    @access     Public
*/

router.get("/github/:username", async(req,res) =>{
    try {
        const options = {
            uri : `http://api.github.com/users/${req.params.username}/repos?per+page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method : 'GET',
            headers : {'user-agent' : 'node.js'}
        }
        console.log(options.uri);

        request(options, (err,response,body) =>{
            if(err) console.error(err);

            if(response.statusCode !== 200){
                return res.status(404).json({msg : "No github profile found"});
            }

            res.json(JSON.parse(body));
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send(`Server Error ${err.message}`);
    }
})

module.exports = router;
