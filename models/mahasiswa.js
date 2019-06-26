var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MahasiswaSchema   = new Schema({
    name: String,
    nrp: String,
    password: String
});

module.exports = mongoose.model('Mahasiswa', MahasiswaSchema);