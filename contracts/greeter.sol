/// @title THE MORTAL
/// @author https://www.ethereum.org/greeter
contract mortal {
    address owner;

    /// @notice this function is executed at initialization and sets the owner of the contract
    /// @dev owner will be set as `msg.sender`
    function mortal() { owner = msg.sender; }

    /// @notice function to recover the funds on the contract
    /// @dev only if `msg.sender` == owner
    function kill() { if (msg.sender == owner) suicide(owner); }
}

/// @title THE GREETER IS MORTAL
/// @author https://www.ethereum.org/greeter
contract greeter is mortal {
    string greeting;

    /// @notice this runs when the contract is executed
    /// @param _greeting greeting as string to send
    /// @dev sets greeting = _greeting
    function greeter(string _greeting) public {
        greeting = _greeting;
    }

    /// @notice this is main function receive greetings
    /// @dev gets greeting
    /// @return greeting as string to receive
    function greet() constant returns (string) {
        return greeting;
    }
}
