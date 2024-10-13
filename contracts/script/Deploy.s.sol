// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/IdentityNFT.sol";
import "../src/eBookNFT.sol";
import "../src/AccessControl.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy IdentityNFT contract
        IdentityNFT identityNFT = new IdentityNFT();

        // Deploy eBookNFT contract (assuming no changes were made to this contract)
        eBookNFT eBookNFT = new eBookNFT();

        // Deploy AccessControl contract
        AccessControl accessControl = new AccessControl(address(identityNFT), address(eBookNFT));

        // Transfer ownership of the contracts to the deployer
        identityNFT.transferOwnership(msg.sender);
        eBookNFT.transferOwnership(msg.sender);
        accessControl.transferOwnership(msg.sender);

        // Log the deployed contract addresses
        console.log("IdentityNFT (Bookshop Pass) deployed at:", address(identityNFT));
        console.log("eBookNFT deployed at:", address(eBookNFT));
        console.log("AccessControl deployed at:", address(accessControl));

        vm.stopBroadcast();
    }
}
