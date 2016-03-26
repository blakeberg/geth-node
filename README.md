# geth-node

Based on Official Ubuntu base image (trusty) from **ubuntu:14.04.4**

This Dockerfile stands for a **full ethereum node** where you can connect via **JSON RPC API**. The running container automatically starts the ethereum node without account connected to the **ethereum testnet** morden with permanently syncing.

> The full Ethereum Blockchain needs actually about 500 MByte in testnet. 

Image size: 355,2 MByte

## Installed packages

* openssh-server
* software-properties-common
* curl
* geth

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
Decentralized platform that runs smart contracts or especially applications that run exactly as coded without downtime, censorship, fraud or third party smog. **Applications so called Dapps** need just an Ethereum client node which is connected in Etherezm networks and syncs the Blockchain - the decentralized public ledger and global world computer.

### Start Client
The Ethereum node can be started inside the container within a ssh session or outside from host via docker exec command.
#### from inside

1. connect with ssh
2. start ethereum node: `nohup geth --testnet --rpc --rpcaddr "0.0.0.0" &`
3. tail logfile: `tail -f nohup.out`
3. try JSON RPC API type `curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://geth:8545` and will get a JSON Response `{"id":67,"jsonrpc":"2.0","result":"Geth/v1.3.5/linux/go1.5.1"}`
4. try JavaScript Console type `geth attach` and then `admin.nodeInfo` to get similiar info to request with curl before

#### from outside

1. start client: `docker exec --user geth -d geth nohup geth --testnet --rpc --rpcaddr "0.0.0.0" & `
2. try JSON RPC API type `curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' http://localhost:8545`
3. try JavaScript Console type `docker exec -i --user geth geth geth attach` to open interactively
4. type `admin.nodeInfo` into console to get similiar info to request with curl before

## Useful Links
* Ethereum Homepage <http://ethereum.org> 
* Main Wiki <https://github.com/ethereum/wiki>
* testnet morden <https://github.com/ethereum/wiki/wiki/Morden>
* JSON RPC API <https://github.com/ethereum/wiki/wiki/JSON-RPC>
* JavaScript Console and Management API <https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console>
* JavaScript web3 API <https://github.com/ethereum/web3.js/tree/master> and <https://github.com/ethereum/wiki/wiki/JavaScript-API>