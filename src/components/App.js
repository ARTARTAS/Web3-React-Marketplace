import React, { Component, useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'


const App = () => {

  const [account, setAccount] = useState('')
  const [marketplace, setMarketplace] = useState()
  const [productCount, setProductCount] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Connect Metamask')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.getId()
    const networkData = Marketplace.networks[networkId]
    if (networkData) {
      let marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      setMarketplace(marketplace)
      let productCount = await marketplace.methods.productCount().call()
      setProductCount(productCount)

      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        let newProducts = products
        newProducts.push(product)
        setProducts(newProducts)
      }
      setLoading(false)
    } else {
      window.alert('Marketplace contract not deployed to this network.')
    }
  }

  const createProduct = (name, price) => {
    setLoading(true)
    marketplace.methods.createProduct(name, price).send({ from: account }).once('receipt', (receipt) => {
      setLoading(false)
      loadBlockchainData()
    })
  }

  const purchaseProduct = (id, price) => {
    setLoading(true)
    marketplace.methods.purchaseProduct(id).send({ from: account, value: price })
      .once('receipt', (receipt) => {
        setLoading(false)
        loadBlockchainData()
      })
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <Main
                products={products}
                createProduct={createProduct}
                purchaseProduct={purchaseProduct}
              />
            }
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
