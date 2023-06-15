const { postProductModel } = require("../Model/product.model");
const express = require("express");
const app = express()
const postProduct = express.Router();
const axios = require('axios');
const fs = require('fs');

// *****************Add Product***************

postProduct.post("/api/product", async (req, res) => {
    const payload = req.body
    // console.log(payload)
    try {
        axios({
            method: 'GET',
            url: payload.product_images,
            responseType: 'stream'
        })
            .then((response) => {
                const writer = fs.createWriteStream(`./Public/${payload.productName}.jpg`);

                response.data.pipe(writer);

                writer.on('finish', async () => {
                    const data = await new postProductModel(payload);
                    await data.save()
                    res.status(200).send({ "msg": "Product Added" });

                });

                // Handle any errors during the download
                writer.on('error', (err) => {

                    res.status(404).send({ "msg": "Error while downloading image", "error": err });
                });
            })
            .catch((err) => {

                res.status(404).send({ "msg": "Error downloading image", "error": err });
            });




    } catch (err) {
        console.log(err)
        res.status(404).send({
            "msg": "Product Added failed",
            "error": err
        })
    }

});

// ******Product by its ProductID****

postProduct.get("/api/product/:id", async (req, res) => {
    const productId = req.params.id;
    let check = await postProductModel.find({ productId: productId });
    if (check.length > 0) {
        res.status(200).send(check)
    } else {
        res.status(404).send('No users found')

    }

});

//active product  example==>  /api/product?page=2&limit=5;
postProduct.get("/api/product", async (req, res) => {
    var limit = req.query.limit || 10
    var page = req.query.page || 1
    const skip = (page - 1) * limit;
    var data = await postProductModel.find({ isActive: true }).skip(skip).limit(limit);
    res.status(200).send(data)
})


//Edit product by productID

postProduct.put("/api/product/:id", async (req, res) => {
    var productId = req.params.id;
    var payload = req.body
    var data = await postProductModel.findOneAndReplace({ productId: productId }, payload);
    if (data) {
        res.status(200).send("Product Edited")
    } else {
        res.status(400).send("Product not found")
    }

})

//Delete product by productID

postProduct.delete("/api/product/:id", async (req, res) => {
    var productId = req.params.id;
    var data = await postProductModel.findOneAndDelete({ productId: productId });
    if (data) {
        res.status(200).send("Product Deleted")
    } else {
        res.status(400).send("Product not found")
    }

})


module.exports = { postProduct }