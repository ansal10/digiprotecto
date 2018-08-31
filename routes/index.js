let express = require( "express" );
let router = express.Router();


router.get( "/about-us/background", ( req, res, next ) => {
    res.render( "background");
} );


router.get( "/contact-us/enquiries", ( req, res, next ) => {
    res.render( "products-connect");
} );

router.get( "/products/overview", ( req, res, next ) => {
    res.render( "products-overview");
} );

router.get( "/products/discover", ( req, res, next ) => {
    res.render( "products-discover");
} );

router.get( "/products/connect", ( req, res, next ) => {
    res.render( "products-connect");
} );

router.get( "/products/protect", ( req, res, next ) => {
    res.render( "products-protect");
} );

router.get( "/", ( req, res, next ) => {
    res.render( "index");
} );

module.exports = router;
