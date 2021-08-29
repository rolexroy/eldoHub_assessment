const path = require('path');
		const express = require('express');
		const ejs = require('ejs');
		const bodyParser = require('body-parser');
		const mysql = require('mysql');
		const app = express();

        app.set('views', './views');
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));


        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'eldoHub_assessment'
        
        });
        
        connection.connect(function(error){
            if(!!error) console.log(error);
            else console.log('Database Connected!');
          }); 



        app.get('/',(req, res) => {
            // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
            let sql = "SELECT * FROM customer_table";
            let query = connection.query(sql, (err, results) => {
                if(err) throw err;
                res.render('user_index', {
                    title : 'Customer details',
                    customers : results
                });
            });
        });
        
        
        app.get('/add',(req, res) => {
            res.render('user_add', {
                title : 'Add Customer Details'
            });
        });
        
        app.post('/save',(req, res) => { 
            let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no, region: req.body.region};
            let sql = "INSERT INTO customer_table SET ?";
            let query = connection.query(sql, data,(err, results) => {
              if(err) throw err;
              res.redirect('/');
            });
        });
        
        app.get('/edit/:userId',(req, res) => {
            const userId = req.params.userId;
            let sql = `Select * from customer_table where id = ${userId}`;
            let query = connection.query(sql,(err, result) => {
                if(err) throw err;
                res.render('user_edit', {
                    title : 'Edit Customer Data',
                    customer : result[0]
                });
            });
        });
        
        
        app.post('/update',(req, res) => {
            const userId = req.body.id;
            let sql = "update customer_table SET name = ?,  email= ?,  phone_no = ?,   region = ? where id = ?" ;
             connection.query(sql, [req.body.name, req.body.email, req.body.phone_no, req.body.region, userId], (err, results) => {
              if(err) throw err;
              res.redirect('/');
            });
        });
        
        
        app.get('/delete/:userId',(req, res) => {
            const userId = req.params.userId;
            let sql = `DELETE from customer_table where id = ${userId}`;
            let query = connection.query(sql,(err, result) => {
                if(err) throw err;
                res.redirect('/');
            });
        });
        
        
// Server Listening
app.listen(8080, () => {
	console.log('Server is running at port 8080');
});