var express = require('express');
var avitoService = require('../services/avito')
var router = express.Router();
var package_json = require('../package.json');

router.get('/', (req, res) => {
    res.send({project : package_json.name,version : package_json.version});

});
/**
 * Avito endpoints
 */
router.get('/avito/:query/:year/:model?', (req, res) => {
    let query = req.params;
    let price_query = {query : query};
    avitoService.getMeanPrice(req.params).then((data)=>{
        price_query['reconciliation_request'] = data.resolved;
        price_query['mean_price'] = data.average;
        res.send(price_query);
    });
});

module.exports = router;
