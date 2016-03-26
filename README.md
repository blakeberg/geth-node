# geth-node

Based on Official Ubuntu base image (trusty) from **ubuntu:14.04.4**

This Dockerfile stands for a **full ethereum node** where you can connect via **JSON RPC API** and the JavaScript Runtime Environment **JSRE** with interactive Console and Script Mode. Besides this **Solidity** as Contract Compiler is already installed.

> The full Ethereum Blockchain needs actually about 500 MByte in testnet. 

Image size: 418,6 MByte

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

## Ethereum
Decentralized platform that runs smart contracts or especially applications that run exactly as coded without downtime, censorship, fraud or third party smog. **Applications so called Dapps** need just an Ethereum client node which is connected in Ethereum networks and syncs the Blockchain - the decentralized public ledger and global world computer. 

> A Dapp contains one or more contracts and a graphical user interface to handle it. 

### Start Client
The Ethereum node can be started inside the container within a ssh session or outside from host via docker exec command.
#### from inside

1. connect with ssh
2. show help: `geth help`
2. start ethereum node: `nohup geth --testnet --rpc --rpcaddr "0.0.0.0" &`
3. tail logfile: `tail -f nohup.out`
3. try JSON RPC API type `curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://geth:8545` and will get a JSON Response `{"id":67,"jsonrpc":"2.0","result":"Geth/v1.3.5/linux/go1.5.1"}`
4. try JavaScript Console type `geth attach` and then `admin.nodeInfo` to get similiar info to request with curl before

#### from outside

1. start client: `docker exec --user geth -d geth nohup geth --testnet --rpc --rpcaddr "0.0.0.0" &`
2. try JSON RPC API type `curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://localhost:8545`
3. try JavaScript console type `docker exec -i --user geth geth geth attach` to open interactively
4. type `admin.nodeInfo` into console to get similiar info to request with curl before

#### Management APIs
If your client running attach to JavaScript console and you will get an information about these module (Management APIs) with its versions `modules: admin:1.0 db:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 shh:1.0 txpool:1.0 web3:1.0`

* for managing the node type `admin` 
* to set/get values to leveldb database type `db` (same as `web3.db`)
* to get more informations about blocks, set current head, replay block processing and get metrics type `debug`
* for blockchain related methodes type `eth` (same as `web3.eth`)
* for mining type `miner` (you need to have an account)
* to get network informations or adding peers type `net` (same as `web3.net`)
* for managing accounts type `personal`
* for whisper -a P2P messaging protocol type `shh` (same as `web3.shh`)
* to see pending/queued transactions type `txpool`
* for web3 JavaScript Dapp API type `web3` as it contains the modules `net`, `eth`, `db` and `shh`

### Contracts with Solidity
Solidity is a high-level language whose syntax is similar to that of JavaScript and it is designed to compile to code for the Ethereum Virtual Machine. This is a quick guide to use solidity and compile a sample contract. 

1. connect with ssh
2. show help: `solc help`
3. connect to JavaScript console: `geth attach`
4. type `admin.setSolc('/usr/bin/solc')` into console
5. type `eth.getCompilers()` and you will get a JSON Response `["Solidity"]`

## Useful Links
* Ethereum Homepage <http://ethereum.org> 
* Main Wiki <https://github.com/ethereum/wiki>
* testnet morden <https://github.com/ethereum/wiki/wiki/Morden>
* JSON RPC API <https://github.com/ethereum/wiki/wiki/JSON-RPC>
* JavaScript Runtime Environment and Management APIs <https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console>
* Web3 JavaScript Dapp API <https://github.com/ethereum/wiki/wiki/JavaScript-API>
* Solidity <https://solidity.readthedocs.org/en/latest>