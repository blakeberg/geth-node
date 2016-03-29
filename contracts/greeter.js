//contract code in one single line
var greeterSource = 'contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) suicide(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';
//compile contract code
var greeterCompiled = web3.eth.compile.solidity(greeterSource);

var _greeting = "Hello World Two!";
//Creates a contract object for a solidity contract.
var greeterContract = web3.eth.contract(greeterCompiled.greeter.info.abiDefinition);
//deploy contract to ethereum from first account with 300000 gas 
//error-first callback with first argument e as error and second argument contract as successful response
var greeter2 = greeterContract.new(_greeting,{from:web3.eth.accounts[0], data: greeterCompiled.greeter.code, gas: 300000}, function(e, contract){
    if(!e) {
      if(!contract.address) {
        console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      } else {
        console.log("Contract mined! Address: " + contract.address);
      }
    }
});
