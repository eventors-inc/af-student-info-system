const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StudentModel = require('../../models/Student/Student');

//POST
exports.students_signup = (req, res, next)=>{
    StudentModel.find({
        studentID: req.body.studentID
    }).exec().then(student => {
        if(student.length >= 1){
            res.status(409).json({
                message: 'Student ID exists!'
            });
        }
        else {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const new_student = new StudentModel({
                        _id : mongoose.Types.ObjectId(),
                        studentID: req.body.studentID,
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });

                    new_student.save().then(result=>{
                        console.log(result);

                        res.status(201).json({
                            message:'New Student Added!'
                        });
                    }).catch(err=>{
                        console.log(err);

                        res.status(500).json({
                            error:err
                        });
                    });
                }
            })
        }
    })
};

//GET - Specified Students
exports.get_studentById=(req,res,next)=>{
    StudentModel.find({
        studentID:req.params.studentID
    })
        .exec().then(result => {
            if(result.length >= 1){
                res.status(200).json({
                    student:result
                });
            }else {
                res.status(404).json({
                    message: 'Student ID does not match!!'
                });
            }
    }).catch(err => {
        res.status(500).json({
            error:err
        });
    });
};


//GET - All Students
exports.getAllStudents=(req,res,next)=>{
    StudentModel.find()
        .select('studentID name email')
        //.populate('students','studentID name email')
        .exec()
        .then(docs=>{
            res.status(200).json({
                count:docs.length,

                students:docs.map(doc=>{
                    return{
                        studentID:doc.studentID,
                        name:doc.name,
                        email:doc.email
                    }
                })
            })
        }).catch(err=>{
        res.status(500).json({
            error:err
        });
    });
};

