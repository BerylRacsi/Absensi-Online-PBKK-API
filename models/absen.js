var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AbsenSchema   = new Schema({
    id_matkul: {
    	type: mongoose.Schema.Types.String,
    	ref: 'Matakuliah'
    },
    nrp: {
        type: mongoose.Schema.Types.String,
        ref: 'Mahasiswa'
    },
    semester: String,
    pertemuan: Number,
    status: {
        type: Boolean, default: true
    }
});

module.exports = mongoose.model('Absen', AbsenSchema);