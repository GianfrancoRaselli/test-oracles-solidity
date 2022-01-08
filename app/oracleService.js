const Web3 = require('web3');
const web3 = new Web3('ws://127.0.0.1:7545');
const Tx = require('ethereumjs-tx').Transaction;
const fetch = require('node-fetch');

const contractJson = require('../build/contrcts/OracleContract.json');
const addressContract = '0xCe4f57be04cDC39471d9aA14dB7EB23583c075b0';
const contractInstance = new web3.eth.Contract(contractJson.abi, addressContract);

const privateKey = Buffer.from('86699603f4ce95e29bd25b543f6109bca1db72b1c3de2afd6ef661b0ffa42ab1', 'hex');
const address = '0x608667201DAC9F44D62476A34D2459Aa2D155861';


web3.eth.getBlockNumber()
  .then(n => listenEvent(n - 1));

function listenEvent(_lastBlock) {
  contractInstance.events.callBackNewData({}, { fromBlock: _lastBlock, toBlock: 'latest' }, (err, event) => {
    event ? updateData() : null;
    err ? console.log(err) : null;
  })
}

function updateData() {
  const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-01-01&end_date=2022-01-08&api_key=DEMO_KEY';

  fetch(url)
    .then(response => response.json())
    .then(json => setDataContract(json.element_count));
}

function setDataContract(_value) {
  web3.eth.getTransactionCount(address, (err, txNum) => {
    contractInstance.methods.setNumberAsteroids(_value).estimateGas({}, (err, gasAmount) => {
      let rawTx = {
        nonce: web3.utils.toHex(txNum),
        gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
        gasLimit: web3.utils.toHex(gasAmount),
        to: addressContract,
        value: '0x00',
        data: contractInstance.methods.setNumberAteroids(_value).encodeABI(),
      }

      const tx = new Tx(rawTx);
      tx.sign(privateKey);
      const serializedTx = tx.serialize().toString('hex');

      web3.eth.sendSignedTransaction('0x' + serializedTx);
    })
  });
}