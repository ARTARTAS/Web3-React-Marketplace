import React, { Component } from 'react';

const Main = (props) => {

  let productPrice, productName
  return (
    <div id="content">
      <h1>Add Product</h1>
      <form onSubmit={(event) => {
        event.preventDefault()
        const name = productName.value
        const price = window.web3.utils.toWei(productPrice.value.toString(), 'Ether')
        props.createProduct(name, price)
      }}>
        <div className="form-group mr-sm-2">
          <input
            id="productName"
            type="text"
            ref={(input) => { productName = input }}
            className="form-control"
            placeholder="Product Name"
            required />
        </div>
        <div className="form-group mr-sm-2">
          <input
            id="productPrice"
            type="text"
            ref={(input) => { productPrice = input }}
            className="form-control"
            placeholder="Product Price"
            required />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
      <p>&nbsp;</p>
      <h2>Buy Product</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="productList">
          {props.products.map((product, key) => {
            return (
              <tr key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td>{product.name}</td>
                <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                <td>{product.owner}</td>
                <td>
                  {!product.purchased
                    ? <button
                      name={product.id}
                      value={product.price}
                      onClick={(event) => {
                        props.purchaseProduct(event.target.name, event.target.value)
                      }}
                    >
                      Buy
                    </button>
                    : null
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );

}

export default Main;
