const express = require('express')
const path = require('path');
const TipoTicket = require('./models/TipoTicket');
const Tickets = require('./models/Tickets');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

// Create link to Angular build directory
app.use(express.static(__dirname + '/../dist/frontend'));
// Serve application paths
const dist = 'dist';



router.route('/tickets').get((req, res) => {
    console.log("Listing tickets");
    Tickets.find().populate('tipoTicket').sort({fechaIngreso: -1}).exec((err, tickets) => {
        if (err)
            console.log(err);
        else
            res.json(tickets);
    });
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