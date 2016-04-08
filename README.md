# geth-node

Based on Official Ubuntu base image (trusty) from **ubuntu:14.04.4**

This Dockerfile stands for a **full ethereum node** where you can connect via **JSON RPC API** and the JavaScript Runtime Environment **JSRE** with interactive Console and Script Mode. Besides this **Solidity** as Contract Compiler is already installed.

> The full Ethereum Blockchain needs actually about 3,1 GByte in testnet and for mining 1,2 GByte for each Ethash epoche.

- Build context: 177 MByte
- DockerHub: <https://hub.docker.com/r/blakeberg/geth-node>
- Image Size: 418,6 MByte

## Installed packages

* openssh-server
* software-properties-common
* curl
* geth
* solc

## Building & Running

Pull from dockerhub:
    
    docker pull blakeberg/geth-node

or copy the sources to your docker host and build on your own.

### Build

	docker build --force-rm -t blakeberg/geth-node .

### Run

	docker run -d -h geth --name geth -p 20022:22 -p 8545:8545 blakeberg/geth-node

### Connect
Connect with ssh use the port that was just located:

	ssh -p 20022 geth@localhost

* initial passwd @see Dockerfile
* you can use sudo @ALL
* you can also connect via scp of course

> if you us boot2docker you shoud add to your /etc/hosts under Windows or Mac OS X the IP and host name of the boot2docker VM `192.168.99.100 geth` (IP to verify)

## Ethereum
Decentralized platform that runs smart contracts or especially applications that run exactly as coded without downtime, censorship, fraud or third party smog. **Applications so called Dapps** need just an Ethereum client node which is connected in Ethereum networks and syncs the Blockchain - the decentralized public ledger and global world computer. 

> A Dapp contains one or more contracts and a graphical user interface to handle it. 

### Start Client
The Ethereum node can be started inside the container within a ssh session or outside from host via docker exec command.

>It will need a long time (3+ hours) to sync all blocks from testnet about 2,6GB for full blockchain `~/.ethereum/testnet/chaindata`. You can see the state via JavaScript console type `eth.syncing` 

*Instead of `geth` ... and `geth attach` you can run `get console` to get both logging and interactive JavaScript console.*

>If you have an issue with cross origin requests you can allow all domains with parameter `--rpccorsdomain "*"` and if you can't connect to geth node you can allow all adresses with parameter `--rpcaddr "0.0.0.0"`

The url `http://meteor:3000` was set as `--rpccorsdomain` for a dapp running in container "meteor-nodejs". *(link below)*

#### from inside

1. connect with ssh
2. show help: `geth help`
3. start ethereum node: `nohup geth --testnet --rpc --rpcaddr "geth" --rpccorsdomain "http://meteor:3000" &`
4. tail logfile: `tail -f nohup.out`
5. try JSON RPC API type `curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://geth:8545` and will get a JSON Response `{"id":67,"jsonrpc":"2.0","result":"Geth/v1.3.6/linux/go1.5.1"}`
6. try JavaScript Console type `geth attach` and then `admin.nodeInfo` to get similiar info to request with curl before
7. try JSON IPC (Interprocess Communication) API type `echo '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' | nc -U ~/.ethereum/geth.ipc` *(gets the same JSON response)*

#### from outside

1. start client: `docker exec --user geth -d geth nohup geth --testnet --rpc --rpcaddr "geth" --rpccorsdomain "http://meteor:3000" &`
2. try JSON RPC API type `curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://localhost:8545`
3. try JavaScript console type `docker exec -i --user geth geth geth attach` to open interactively
4. type `admin.nodeInfo` to get similiar info to request with curl before

> If you use boot2docker outside means the boot2docker VM in VirtualBox. 

#### APIs
If your client running attach to JavaScript console and you will get an information about these module (Management APIs) with its versions `modules: admin:1.0 db:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 shh:1.0 txpool:1.0 web3:1.0`

**You can and should restrict these modules to RPC API with `--rpcapi "eth,web3"` cause these interface will give everyone access to the API who can access this interface!**

> you can also restrict JSON IPC Api with `--ipcapi "admin,eth"` and disable JSON IPC Api `--ipcdisable`. JSON RPC API won't be enabled if you not add `--rpcapi`. By default geth enables all API's over the ipc interface and only the db, eth, net and web3 for Dapps.

* for managing the node type `admin` 
* to set/get values to leveldb database type `db` *(same as `web3.db`)*
* to get more informations about blocks, set current head, replay block processing and get metrics type `debug`
* for blockchain related methodes type `eth` *(same as `web3.eth`)*
* for mining type `miner` *(you need to have an account)*
* to get network informations or adding peers type `net` *(same as `web3.net`)*
* for managing accounts type `personal`
* for whisper -a P2P messaging protocol type `shh` *(same as `web3.shh`*)
* to see pending/queued transactions type `txpool`
* for web3 JavaScript Dapp API type `web3` as it contains the modules `net`, `eth`, `db` and `shh`

### Mining
Mining Ether = Securing the network = verify computation while Ether is the currency. You will get 5 Ether for a successful mined block with a much lower difficulty in testnet morden. You will need Ether to deploy contracts, interact with it and able to make transactions. At least one Ether is more than enough cause Gas price for (contract) computation takes about 20 Gwei (1 Ether = 1000000000 Gwei).

> If you have already an account with ether you can send ether to newly created account at step 2 and skip the other steps go directly to contracts.

**Before you start mining you should have been synced the full blockchain.**

1. if your client running attach to JavaScript console
2. create an account: `personal.newAccount("newpass")` 
*(take this adress as 0x0...)*
3. set account for mining: `miner.setEtherbase("0x0...")`
4. see syncing: `eth.syncing` *(you should have `currentBlock=highestBlock` before mining)*
5. start mining: `miner.start()`
6. see hashrate: `miner.hashrate`
7. see balance: `web3.eth.getBalance("0x0...")`
8. stop mining: `miner.stop()` *(if you have balance > 0)*
9. see your account and mined blocks in blockchain Explorer *(link below)*

**Mining will take 100% cpu and take some while depending on your cpu sha-3 hash performance.**

It will take some time (15+ minutes) to generate about 1,2GB Ethash `~/.ethash`. If your mining has begun you can see this with a `hashrate > 0` from JavaScript console via `miner.hashrate`.

>Don't loose your private keys `~/.ethereum/testnet/keystore` cause you won't have access to your account and ether without them.

### Contracts with Solidity
Solidity is a high-level language whose syntax is similar to that of JavaScript and it is designed to compile to code for the Ethereum Virtual Machine. This is a quick guide to use solidity and compile a sample contract. 

You can find the solidity file for "Greeter" - a hello world contract under `~/greeter.sol`.

#### with solc
1. connect with ssh
2. show help: `solc --help`
3. try some options p.e. 
	* estimate gas `solc --gas greeter.sol`
	* see user doc `solc --userdoc greeter.sol`
	* see developer doc `solc --devdoc greeter.sol`
4. compile: `solc --optimize --bin --bin-runtime greeter.sol`
5. get ABI (application binary interface) with `solc --abi greeter.sol` 
*(you will need the JSON from greeter ABI)*

#### with JS console
1. connect with ssh
2. connect to JavaScript console: `geth attach`
3. type `admin.setSolc('/usr/bin/solc')` 
4. type `eth.getCompilers()` and you will get a JSON Response `["Solidity"]`

##### existing contract
1. search for account `0x0608616212f0356c3d4c7c7b1c317151646164e1` and see contract in blockchain explorer *(link below)*
2. set abi to variable `var abi = <see ABI above>;`
3. load contract with `var greeter = eth.contract(abi).at("0x0608616212f0356c3d4c7c7b1c317151646164e1");`
4. type `greeter` for basic informations
5. run contract with `greeter.greet();`

##### your own contract
1. create contract account from javascript `loadScript('/home/geth/greeter.js');`
2. you have to unlook your account with your passphrase
3. you will get a transaction with the contract creation
4. if transaction is mined you get the contract address
5. type `greeter2` for basic informations
6. run contract with `greeter2.greet();`
7. you can kill your contract with `greeter.kill.sendTransaction({from:eth.accounts[0]})`
8. contract code is deleted type `eth.getCode(greeter2.address)` *(you get 0 if the transaction for kill finished)*
9. contract storage is deleted type `eth.getStorageAt(greeter2.address)` *(you get 0 if the transaction for kill finished)*
10. search for created account and see contract in blockchain explorer *(link below)*

## Useful Links
* Ethereum Homepage <http://ethereum.org> 
* Main Wiki <https://github.com/ethereum/wiki>
* testnet morden <https://github.com/ethereum/wiki/wiki/Morden>
* Blockchain Explorer for Testnet <http://testnet.etherscan.io>
* geth Command Line <https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options>
* JSON RPC API <https://github.com/ethereum/wiki/wiki/JSON-RPC>
* JavaScript Runtime Environment and Management APIs <https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console>
* Web3 JavaScript Dapp API <https://github.com/ethereum/wiki/wiki/JavaScript-API>
* Go Ethereum Management APIs <https://github.com/ethereum/go-ethereum/wiki/Go-ethereum-management-API's>
* Solidity <https://solidity.readthedocs.org/en/latest>
* Solidity contract "Greeter" <https://www.ethereum.org/greeter>
* Meteor NodeJs Container for Dapps <https://github.com/blakeberg/meteor-nodejs>