//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
/// @title Arbistatements.
/// @dev This contract is the main contract of our Arbistatements dApp

contract Arbistatements  is Ownable{

    ISemaphore public semaphore;
    AggregatorV3Interface internal priceFeed;
    using SafeMath for uint256;
    using SafeMath for int256;
    uint256 public groupId;

    address RELAYER_ADDRESS;
    // identity commitment to addresses of user
    mapping(uint256 => address []) userAddresses;
    // identity commitment to time window 
    mapping(uint256 => uint256) claimWindow;
    // address registered check
    mapping(address => bool) addressRegistered;
    // identity registered check
    mapping(uint256 => bool) identityRegistered;
    // mapping for fees paid
    mapping(address => bool) paidFee;
     // mapping for fees paid
    mapping(uint256 => bool) paidStatement;

    uint256 fee = 1e17; // 10 cents of dollar
    uint256 statement_fee = 1e17; // 10 cents of dollars

    uint256 TIME_WINDOW = 2 minutes;

    // modifier
    modifier onlyRelayer(){
        // only Relayer can call the function
        // require(msg.sender == RELAYER_ADDRESS,"should be address from relayer");
        require(msg.sender ==RELAYER_ADDRESS,"should be address from relayer");
        _;
    }

    function getLatestPriceETH() internal view returns (int256) {
        (,int256 price,,,) = priceFeed.latestRoundData();
        return price;
    }
    // generate group
    constructor(address semaphoreAddress,address relay, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;
        RELAYER_ADDRESS = relay;
        priceFeed = AggregatorV3Interface(0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08); // ETH - USD in Arbitrum
        semaphore.createGroup(groupId, 20, 0, address(this));
    }

    function joinProtocolWithFee() external payable{
        uint256 ex_rate = uint256(getLatestPriceETH());
        uint256 ETHfee = fee.mul(1e8).div(ex_rate);
        require (msg.value >= ETHfee , "not enough value sent");
        paidFee[msg.sender] = true;
    }

    function payForStatement(uint256 identityCommitment) external payable{
        uint256 ex_rate = uint256(getLatestPriceETH());
        uint256 ETHfee = statement_fee.mul(1e8).div(ex_rate);
        require (msg.value >= ETHfee , "not enough value sent");
        paidStatement[identityCommitment] = true;
    }

    function setRelayer(address addr) external onlyOwner{
        RELAYER_ADDRESS= addr;
    }

    function addNewUser(uint256 identityCommitment, address userAddr) external onlyRelayer {
        require(paidFee[userAddr],"This user Hasnt paid a fee yet");
        require(addressRegistered[userAddr] == false, "Address already in our protocol");
        if(!identityRegistered[identityCommitment]){
            // add new member
            semaphore.addMember(groupId, identityCommitment);
            identityRegistered[identityCommitment] = true;
        }
        userAddresses[identityCommitment].push(userAddr);
        addressRegistered[userAddr] = true;
    }

    function claimStatement(
        uint256 identityCommitment,
        bytes32 signal,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        // claimWindow[identityCommitment] = block.timestamp + TIME_WINDOW;
        require(paidStatement[identityCommitment],"user hasnt paid the fee");
        semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, groupId, proof);
    }

    function getAddresses(uint256 identityCommitment) public view onlyRelayer returns (address[] memory){
        // require(block.timestamp <= claimWindow[identityCommitment] , "should wait for more than 2 minutes to claim the statement!");
        return userAddresses[identityCommitment];
    }
    function getTimeStamp(uint256 identityCommitment) external view returns(uint256, uint256){
        return  (block.timestamp,claimWindow[identityCommitment]);
    }
}