var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TakematkulSchema   = new Schema({
    ambilMatkulUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa'
    },
    id_matkul: {
    	type: mongoose.Schema.Types.String,
    	ref: 'Matakuliah'
    }
});

module.exports = mongoose.model('Takematkul', TakematkulSchema);