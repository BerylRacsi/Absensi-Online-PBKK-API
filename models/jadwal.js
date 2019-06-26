var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var JadwalSchema   = new Schema({
    id_matkul: {
    	type: mongoose.Schema.Types.String,
    	ref: 'Matakuliah'
    },
    pertemuan: Number,
    ruang: String,
    masuk: Date,
    selesai: Date,
	semester: Number,    
    tahun: String
});

module.exports = mongoose.model('Jadwal', JadwalSchema);