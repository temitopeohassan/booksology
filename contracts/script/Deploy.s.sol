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

        IdentityNFT identityNFT = new IdentityNFT();
        eBookNFT eBookNFT = new eBookNFT();
        AccessControl accessControl = new AccessControl(address(identityNFT), address(eBookNFT));

        vm.stopBroadcast();
    }
}
