const express = require('express')
const path = require('path');
const TipoTicket = require('./models/TipoTicket');
const Tickets = require('./models/Tickets');
const Users = require('./models/User');
const cors = require('cors')
require('./config/passport');
const bodyParser = require('body-parser');
var passport = require('passport');
var ctrlAuth = require('./controllers/authentication');
var util = require('util')

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/', router);
// Create link to Angular build directory
app.use(express.static(__dirname + '/../dist/frontend'));
// Serve application paths
const dist = 'dist';
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

router.post('/api/login', ctrlAuth.login);


router.route('/tickets', auth).get((req, res) => {
    console.log("Listing ticketsRq "+req.query.payload);
    let payload
    if(req.query.payload){
        payload = JSON.parse(req.query.payload);
    }
    if (!payload || !payload._id) {
        res.status(401).json({
          "message" : "UnauthorizedError: private profile"
        });
    }
    else{
        console.log("in the else boys");
        Tickets.find().populate('tipoTicket').sort({fechaIngreso: -1}).exec((err, tickets) => {
            if (err)
                console.log(err);
            else
                res.json(tickets);
        });
    }
});

router.route('/tickets/:id').get((req, res) => {
    Tickets.findById(req.params.id, (err, tickets) => {
        if (err)
            console.log(err);
        else
            res.json(tickets);
    })
});

router.route('/tickets/add').post((req, res) => {
    console.log("Adding ticket");
    let tickets = new Tickets(req.body);
    tickets.save()
        .then(tickets => {
            console.log("Ticket added");
            res.status(200).json({'tickets': 'Added successfully'});
        })
        .catch(err => {
            console.log("Ticket error"+err);
            res.status(400).send('Failed to create new record');
        });
});

router.route('/tipoTickets').get((req, res) => {
    TipoTicket.find((err, tipo) => {
        if (err){
            console.log(err);
        }
        else{
            res.json(tipo);
        }
            
    });
});

router.route('/users').get((req, res) => {
    console.log("Listing users");
    Users.find().sort({name: -1}).exec((err, users) => {
        if (err)
            console.log(err);
        else
            res.json(users);
    });
});


router.route('/users/add').post((req, res) => {
    console.log("Adding user");
    let user = new User(req.body);
    user.save()
        .then(users => {
            console.log("User added");
            res.status(200).json({'users': 'Added successfully'});
        })
        .catch(err => {
            console.log("User error"+err);
            res.status(400).send('Failed to create new record');
        });
});



app.all('*', function (req, res) {
    
    const fullPath = path.join(__dirname + '/../dist/frontend/index.html');
    console.log("la ruta es: "+fullPath);
    res.status(200).sendFile(`/`, { root: fullPath });
});

const server = app.listen(process.env.PORT || 4000, () => {
    if(process.env.PORT ){
        console.log("Server started on port " + process.env.PORT  + "...");
    }
});

exports.server = server;