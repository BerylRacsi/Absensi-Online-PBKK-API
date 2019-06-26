var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatakuliahSchema   = new Schema({
    id_matkul: String,
    name: String,
    kelas: String
});

module.exports = mongoose.model('Matakuliah', MatakuliahSchema);