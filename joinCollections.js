const getDb = require('./db')

async function joinOrdersWithProductsSuppliers() {
    const db = await getDb()
    const results = await db.collection('orders').aggregate([
        {   
            $lookup:{
                from: 'products',
                localField: 'product_id',
                foreignField:'_id',
                as:'product_details'
            }
        },

        { $unwind: 'product_details'},

        {
            $lookup: {
                from: 'suppliers',
                localField: 'product_details.supplier_id',
                foreignField: 'id',
                as: 'supplier_details'
            }
        }
        
    ]).toArray();

    return results
    
}

module.exports = { joinOrdersWithProductsSuppliers } 