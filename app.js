const express = require( "express" );
const path = require( "path" );
const app = express();
const indexRouter = require( "./routes/index" );


// CORS
app.use( ( req, res, next ) => {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
    next();
}
);


// view engine setup
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use( express.json() );
app.use( express.urlencoded( { "extended": true } ) );
// app.use( express.bodyParser( { "uploadDir": "/tmp" } ) );
app.use( express.static( path.join( __dirname, "." ) ) );
// app.use( express.static( path.join( __dirname, "images" ) ) );
// app.use( express.static( path.join( __dirname, "js" ) ) );
// app.use( express.static( path.join( __dirname, "c" ) ) );
app.use( "/", indexRouter );


// catch 404 and forward to error handler
app.use( ( req, res, next ) => {
    next( createError( 404 ) );
} );

// error handler
app.use( ( err, req, res, next ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
res.locals.error = err ;

// render the error page
res.status( err.status || 500 );
res.render( "error" );
} );

module.exports = app;
