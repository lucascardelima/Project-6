const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        heat: req.body.sauce.heat,
        userId: req.body.sauce.userId,
        imageUrl: url + '/images/' + req.file.filename,
        likes: req.body.sauce.likes,
        dislikes: req.body.sauce.dislikes,
        usersLiked: req.body.sauce.usersLiked,
        usersDisliked: req.body.sauce.usersDisliked,
    });

    sauce.save().then(() => {
        res.status(201).json({
            message: 'Sauce created successffuly!'
        })
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    });
};

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;

    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {

            if (req.body.like == 1) {
                sauce.usersLiked.push(userId);
                sauce.likes += 1;
            } else if (req.body.like == 0 && sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked.remove(req.body.userId);
                sauce.likes -= 1;
            } else if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes += 1;
            } else if (req.body.like == 0 && sauce.usersDisliked.includes(req.body.userId)) {
                sauce.usersDisliked.remove(req.body.userId);
                sauce.dislikes -= 1;
            }
            sauce.save().then(() => {
                res.status(201).json({
                    message: 'Feedback saved'
                });
            }).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params.id });
    
    if(req.file) {
        req.body.sauce = JSON.parse(req.body);
        const url = req.protocol + '://' + req.get('host');
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            heat: req.body.sauce.heat,
            imageUrl: url + '/images/' + req.file.filename,
            userId: req.body.sauce.userId,
        };
    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            heat: req.body.heat,
            userId: req.body.userId,
        };
    }

    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
            res.status(200).json({
                message: 'Sauce updated successffuly!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(200).json({
                            message: 'Sauce deleted successffuly!'
                        });
                    }                    
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });    
        }       
    );
};