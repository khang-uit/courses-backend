const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const app = express();
const port = 5000;

const SortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require('./routes');
const db = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

//Custom middleware
app.use(SortMiddleware);

db.connect();
app.use(express.static(path.join(__dirname, 'public')));

//Template Engine (Handlebars)
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const iconTypes = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                }
                const sortTypes = {
                    default: 'desc',
                    asc: 'default',
                    desc: 'asc',
                }
                const keyType = field === sort.column ? sort.type : 'default'
                const iconType = iconTypes[keyType];
                const sortType = sortTypes[keyType]

                if(sortType === 'default') {
                    
                    return `
                        <a href="?_sort">
                            <span class="${iconType}"></span>
                        </a>
                        `
                } else {

                    return `
                        <a href="?_sort&column=${field}&type=${sortType}">
                            <span class="${iconType}"></span>
                        </a>
                        `
                }
            }
        },
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//HTTP Logger (Morgan)
app.use(morgan('combined'));

//Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
