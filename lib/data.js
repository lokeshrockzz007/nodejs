/*
 *Library for storing and editing data
 * 
 */

var fs = require("fs");
var path = require("path");

//Container for module(to be exported)
var lib = {};


//Base directory for data folder

lib.baseDir = path.join(__dirname, '../.data/');
//Write data to file
lib.create = function (dir, file, data, callback) {


    //open the file
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, file) {

        if (!err && file) {
            //Convert data to string

            var stringData = JSON.stringify(data);

            fs.writeFile(file, stringData, function (err) {
                if (!err) {
                    fs.close(file, function (err) {
                        if (!err) {
                            callback(false);
                        }
                        else {

                            callback("Error closing new file");
                        }

                    });
                }
                else {

                    callback("Error in writing to new file");
                }

            });

        } else {

            callback("Could not create new file or file may already exist");
        }
    });

};

//Read data from file
lib.read = function (dir, file, callback) {

    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {

        callback(err, data);
    });
};

//Update data from the file

lib.update = function (dir, file, data, callback) {

    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, file) {

        if (!err && file) {

            //Convert data to string
            var stringData = JSON.stringify(data);

            //truncating the file
            fs.truncate(file, function (err) {
                if (!err) {

                } else {
                    callback("! error in truncating the file")
                }

            });
        }
        else {
            callback('could not open file for updating  file may not exist');
        }
    });
};



//Export Module
module.exports = lib;  