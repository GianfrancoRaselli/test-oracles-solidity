// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OracleContract {

  address owner;
  uint public numberAsteroids;

  event callBackNewData();

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function update() public onlyOwner {
    emit callBackNewData();
  }

  function setNumberAteroids(uint _num) public onlyOwner {
    numberAsteroids = _num;
  }

}