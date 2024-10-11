// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/AccessControl.sol";
import "../src/eBookNFT.sol";
import "../src/IdentityNFT.sol";

contract AccessControlTest is Test {
    AccessControl public accessControl;
    eBookNFT public eBookContract;
    IdentityNFT public identityNFT;
    
    address public user1 = address(1);
    address public user2 = address(2);

    function setUp() public {
        eBookContract = new eBookNFT();
        identityNFT = new IdentityNFT();
        accessControl = new AccessControl(address(identityNFT), address(eBookContract));
    }

    function testAccessControl() public {
        // Mint Identity NFT for user1
        vm.prank(user1);
        identityNFT.mintIdentityNFT();

        // Mint eBook for user1
        vm.prank(user1);
        uint256 tokenId = eBookContract.mintEBook("Test Book", "Encrypted Content", "uri");

        // Verify access for user1
        vm.prank(user1);
        bool hasAccess = accessControl.verifyAccess(user1, tokenId);
        assertTrue(hasAccess, "User1 should have access to their eBook");

        // Verify user2 doesn't have access
        vm.prank(user2);
        bool noAccess = accessControl.verifyAccess(user2, tokenId);
        assertFalse(noAccess, "User2 should not have access to user1's eBook");
    }

    function testRequestAccess() public {
        // Mint Identity NFT for user1
        vm.prank(user1);
        identityNFT.mintIdentityNFT();

        // Mint eBook for user1
        vm.prank(user1);
        uint256 tokenId = eBookContract.mintEBook("Test Book", "Encrypted Content", "uri");

        // Request access as user1
        vm.prank(user1);
        bool hasAccess = accessControl.requestAccess(tokenId);
        assertTrue(hasAccess, "User1 should be able to access their eBook");

        // Request access as user2
        vm.prank(user2);
        bool noAccess = accessControl.requestAccess(tokenId);
        assertFalse(noAccess, "User2 should not be able to access user1's eBook");
    }
}