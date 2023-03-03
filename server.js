var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({
	extended: true
}));
// default route
app.get('/', function (req, res) {
	return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
	host: 'audio-analysis.cypyfxrlps1u.ap-south-1.rds.amazonaws.com',
	user: 'admin',
	password: 'Spea2lineAudi0Ana',
	database: 'audio_analysis_reports',
	insecureAuth : false
});

dbConn.connect(); 

app.get('/reports', function (req, res) {
	dbConn.query('SELECT * FROM audio_reports ORDER BY report_id DESC', function (error, results, fields) {
	if (error) throw error;
		return res.send({ error: false, data: results, message: 'Reports List.' });
	});
});

app.get('/reports/:report_status', function (req, res) {
	let report_status = req.params.report_status;
	if (!report_status) {
		return res.status(400).send({ error: true, message: 'Please provide report_status' });
	}
	dbConn.query('SELECT * FROM audio_reports where report_status=?', report_status, function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results[0], message: 'Reports List.' });
	});
});

app.get('/report/:report_id', function (req, res) {
	let report_id = req.params.report_id;
	if (!report_id) {
		return res.status(400).send({ error: true, message: 'Please provide report_id' });
	}
	dbConn.query('SELECT * FROM audio_reports where report_file_id=?', report_id, function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results[0], message: 'Reports List.' });
	});
});

app.post('/report', function (req, res) {
	let report_file_name = req.body.report_file_name;
	let aws_file_path = req.body.aws_file_path;
	let report_file_id = req.body.report_file_id;

	if (!report_file_name || !aws_file_path || !report_file_id) {
		return res.status(400).send({ error:true, message: 'Please provide required details.' });
	}
	dbConn.query("INSERT INTO audio_reports SET ? ", { report_file_name: report_file_name, aws_file_path: aws_file_path, report_file_id: report_file_id }, function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'New report has been added successfully.' });
	});
});

app.put('/report', function (req, res) {

	let report_id = req.body.report_id;
	let report_status = req.body.report_status;
	if (!report_id || !report_status) {
		return res.status(400).send({ error: user, message: 'Please provide report_id and report_status' });
	}
	dbConn.query("UPDATE audio_reports SET report_status = ? WHERE report_id = ?", [report_status, report_id], function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'Report has been updated successfully.' });
	});
});
//  Delete user
app.delete('/report', function (req, res) {
	let report_id = req.body.report_id;
	if (!report_id) {
		return res.status(400).send({ error: true, message: 'Please provide report_id' });
	}
	dbConn.query('DELETE FROM audio_reports WHERE report_id = ?', [report_id], function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'Report has been deleted successfully.' });
	});
}); 
// set port
app.listen(3000, "0.0.0.0", function () {
	console.log('Node app is running on port 3000');
});

module.exports = app;