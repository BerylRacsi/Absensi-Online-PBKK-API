var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to MongoDB Atlas
var mongoose   = require('mongoose');
mongoose.connect('mongodb+srv://berylhartono:anakdewa666@myawesomeapp-uzrvu.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }); // connect to our database

//call model
var Mahasiswa = require('./models/mahasiswa');
var Matakuliah = require('./models/matakuliah');
var Jadwal = require('./models/jadwal');
var Takematkul = require('./models/takematkul');
var Absen = require('./models/absen');

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// do console log if request happened
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/tambahmahasiswa')

    // POST data mahasiswa baru : name, nrp, password
    .post(function(req, res) {

        var mhs = new Mahasiswa();      	// new instance from Mahasiswa model
        mhs.name = req.body.name;  			// set mhs name 
        mhs.nrp = req.body.nrp;				// set mhs nrp
        mhs.password = req.body.password;	// set mhs password

        // save the mhs
        mhs.save(function(err) {
            if (err){
                return res.send(err);
            }

            res.json({ message: 'Registrasi Mahasiswa Baru Sukses!' }); //return message in json if POST success
            res.end();
        });

    });

router.route('/mahasiswa')

	//GET all mahasiswa
    .get(function(req, res) {
        Mahasiswa.find(function(err, mhs) {
            if (err)
                res.send(err);

            res.json(mhs); //return all record from Mahasiswa
        });
    });

router.route('/mahasiswa/:mahasiswa_id')

    //GET mahasiswa record by id
    .get(function(req, res) {
        Mahasiswa.findById(req.params.mahasiswa_id, function(err, mhs) {
            if (err)
                res.send(err);
            res.json(mhs);
        });
    });

router.route('/tambahmatkul')

    // POST data mahasiswa baru : name, nrp, password
    .post(function(req, res) {

        var matkul = new Matakuliah();      	// new instance from Mahasiswa model
        matkul.id_matkul = req.body.id_matkul;  			// set mhs name 
        matkul.name = req.body.name;				// set mhs nrp
        matkul.kelas = req.body.kelas;	// set mhs password

        // save the mhs
        matkul.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Penambahan Mata Kuliah Sukses!' }); //return message in json if POST success
        });

    });

router.route('/tambahjadwal')

	.post(function(req, res) {
		var jadwal = req.body;

    	Matakuliah.findOne({
    		id_matkul: jadwal.id_matkul
    	}, 

    	function(err, Matakuliah){
    			
    		var newJadwal = new Jadwal({
                id_matkul: Matakuliah.id_matkul,
                pertemuan: jadwal.pertemuan,
                ruang: jadwal.ruang,
                masuk: jadwal.masuk,
                selesai: jadwal.selesai,
                tahun: jadwal.tahun,
                semester: jadwal.semester
            });

            newJadwal.save(function(err) {
            	if (err)
                	res.send(err);

            	res.json({ message: 'Penambahan Jadwal Kuliah Sukses!' }); //return message in json if POST success
        	});
    	
    	});

	});

router.route('/tambahpeserta/:id_matkul/:nrp')

	.post(function(req, res,next) {
		Matakuliah.find({
	        id_matkul: req.params.id_matkul
	    }, function (err, mataKuliahFound) {
	        if (err) {
	            return res.status(400)
	                .json({
	                    status: '400',
	                    message : 'Mata Kuliah not found'
	                });
	        }
	        if (mataKuliahFound.length > 0) {
	            Mahasiswa.find({
	                nrp: req.params.nrp
	            }, function (err, userFound) {
	                if (err)
	                    return res.status(400)
	                        .json({
	                            status: '400',
	                            message : 'User not found'
	                        });
	                if (userFound.length > 0) {
	                    Takematkul.find({
	                        id_matkul: mataKuliahFound[0]._id,
	                        ambilMatkulUserId: userFound[0]._id
	                    }, function (err, ambilMatkulFound) {
	                        if (err)
	                            return res.status(400)
	                                .json({
	                                    status: '400',
	                                    message : 'Take mata kuliah failed'
	                                });
	                        if(ambilMatkulFound.length > 0){
	                            return res.status(400)
	                                        .json({
	                                            status: '200',
	                                            message : 'ERROR!!! mahasiswa dengan NRP: ' + userFound[0].nrp + 
	                                            ' telah terdaftar pada mata kuliah ' + mataKuliahFound[0].name + ' kelas ' +
	                                            mataKuliahFound[0].kelas
	                                        });
	                        } else{
	                            var newTakematkul = new Takematkul({
	                                ambilMatkulUserId: userFound[0]._id,
	                                id_matkul: mataKuliahFound[0]._id
	                            });
	                            newTakematkul.save(function (err) {
	                                if (err)
	                                return res.status(400)
	                                        .json({
	                                            status: '400',
	                                            message : 'Take mata kuliah failed'
	                                        });
	                                else {
	                                    console.log('Berhasil!');
	                                    return res.status(201)
	                                        .json({
	                                            status: '200',
	                                            message : 'OK'
	                                        });
	                                }
	                            });
	                        }
	                    });

	                } else return res.status(400)
	                        .json({
	                            status: '400',
	                            message : 'User not found'
	                        });
	            });
	        } else return res.status(400)
	                    .json({
	                        status: '400',
	                        message : 'Mata Kuliah not found'
	                    });
	    });
	});

router.route('/absen/:ruang/:nrp')
	.post(function(req,res){
		Jadwal.find({ ruang: req.params.ruang },{} , {sort: {'masuk': -1}, limit: 1 }, function(err, jadwal){
        if (err) {
            console.log(err);
            return res.status(400)
                .json({
                    status: '400',
                    message : 'Ruang not found'
                });
        }
        if (jadwal.length > 0){
            Mahasiswa.find({ nrp: req.params.nrp}, function(err, user){
                if (err) {
                    console.log(err);
                    return res.status(400)
                        .json({
                            status: '400',
                            message : 'User not found'
                        });
                }
                if (user.length>0){
                    
                    if (jadwal[0].masuk.getTime() < new Date().getTime() && 
                        new Date().getTime() < jadwal[0].selesai.getTime()) {
                        var newAbsen = new Absen({
                            id_matkul: jadwal[0].id_matkul,
                            nrp: user[0].nrp,
                            semester: jadwal[0].semester,
                            pertemuan: jadwal[0].pertemuan,
                        });
                        newAbsen.save(function (err, Absen) {
                            if (err) {
                                console.log(err);
                                return res.status(400)
                                    .json({
                                        status: '400',
                                        message : 'Already absen'
                                    });
                            }
                            else {
                                console.log('Berhasil!');
                                return res.status(201)
                                        .json({
                                            status: '200',
                                            message : 'OK'
                                        });
                            }
                        }); 
                    } else return res.status(400)
                                .json({
                                    status: '400',
                                    message : 'Jadwal not found'
                                });
                }
                else if (!user.length){
                    return res.status(400)
                        .json({
                            status: '400',
                            message : 'User not found'
                        });
                }
            });
        }
        else if(!jadwal.length){
            return res.status(400)
                .json({
                    status: '400',
                    message : 'Ruang not found'
                });
        }
    });
	});

router.route('/rekap/:id_matkul/semester/:semester')
	.get(function(req, res){
		Absen.find({
			id_matkul: req.params.id_matkul,
			semester: req.params.semester
		}).select('id_matkul nrp semester pertemuan').exec(function(err,rekap){

        		return res.send(rekap);
        	
		})
	});

router.route('/rekap/:id_matkul/pertemuan/:pertemuan')
	.get(function(req, res){
		Absen.find({
			id_matkul: req.params.id_matkul,
			pertemuan: req.params.pertemuan
		}).select('id_matkul nrp semester pertemuan').exec(function(err,rekap){

        		return res.send(rekap);
        	
		})
	});

router.route('/rekapmahasiswa/:nrp/semester/:semester')
	.get(function(req, res){
		Absen.find({
			nrp: req.params.nrp,
			semester: req.params.semester
		}).select('id_matkul nrp semester pertemuan').exec(function(err,rekap){

        		return res.send(rekap);
        	
		})
	});

router.route('/rekapmahasiswa/:nrp/matkul/:id_matkul')
	.get(function(req, res){
		Absen.find({
			nrp: req.params.nrp,
			id_matkul: req.params.id_matkul
		}).select('id_matkul nrp semester pertemuan').exec(function(err,rekap){

        		return res.send(rekap);
        	
		})
	});	

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
