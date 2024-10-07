// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/AccessControl.sol";
import "../src/IdentityNFT.sol";
import "../src/eBookNFT.sol";

contract AccessControlTest is Test {
    AccessControl public accessControl;
    IdentityNFT public identityNFT;
    eBookNFT public eBookNFT;

    address public user1 = address(0x1);
    address public user2 = address(0x2);
    uint256 public constant EBOOK_ID = 1;

    function setUp() public {
        identityNFT = new IdentityNFT(address(this));
        eBookNFT = new eBookNFT(address(this));
        accessControl = new AccessControl(address(identityNFT), address(eBookNFT));

        // Mint Identity NFT for user1
        identityNFT.mint(user1);

        // For now, let's comment out the eBookNFT mint function
        // eBookNFT.mint(user1, EBOOK_ID, "Test eBook");
    }

    function testAccessGranted() public {
        vm.prank(user1);
        bool access = accessControl.requestAccess(EBOOK_ID);
        assertTrue(access, "Access should be granted");
    }

    function testAccessDeniedNoIdentityNFT() public {
        vm.prank(user2);
        bool access = accessControl.requestAccess(EBOOK_ID);
        assertFalse(access, "Access should be denied due to lack of Identity NFT");
    }

    function testAccessDeniedNoEBookNFT() public {
        // Mint Identity NFT for user2
        identityNFT.mint(user2);

        vm.prank(user2);
        bool access = accessControl.requestAccess(EBOOK_ID);
        assertFalse(access, "Access should be denied due to not owning the eBook NFT");
    }

    function testUpdateIdentityNFTAddress() public {
        address newAddress = address(0x3);
        accessControl.setIdentityNFTAddress(newAddress);
        assertEq(address(accessControl.identityNFT()), newAddress, "Identity NFT address should be updated");
    }

    function testUpdateEBookNFTAddress() public {
        address newAddress = address(0x4);
        accessControl.setEBookNFTAddress(newAddress);
        assertEq(address(accessControl.eBookNFT()), newAddress, "eBook NFT address should be updated");
    }

    function testOnlyOwnerCanUpdateAddresses() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        accessControl.setIdentityNFTAddress(address(0x5));

        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        accessControl.setEBookNFTAddress(address(0x6));
    }
}
