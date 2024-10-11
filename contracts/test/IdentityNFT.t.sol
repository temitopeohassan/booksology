// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/IdentityNFT.sol";

contract IdentityNFTTest is Test {
    IdentityNFT public nft;
    address public user1 = address(1);
    address public user2 = address(2);

    function setUp() public {
        nft = new IdentityNFT();
    }

    function testMintIdentityNFT() public {
        vm.prank(user1);
        nft.mintIdentityNFT();
        
        assertTrue(nft.hasMinted(user1), "User1 should have minted an NFT");
        assertEq(nft.balanceOf(user1), 1, "User1 should have 1 NFT");
    }

    function testCannotMintTwice() public {
        vm.prank(user1);
        nft.mintIdentityNFT();
        
        vm.prank(user1);
        vm.expectRevert("User has already minted an Identity NFT");
        nft.mintIdentityNFT();
    }

    function testBurnIdentityNFT() public {
        vm.startPrank(user1);
        nft.mintIdentityNFT();
        uint256 tokenId = 1; // First token ID
        nft.burn(tokenId);
        vm.stopPrank();
        
        assertFalse(nft.hasMinted(user1), "User1 should no longer have an NFT");
        assertEq(nft.balanceOf(user1), 0, "User1 should have 0 NFTs");
    }

    function testCannotBurnOthersNFT() public {
        vm.prank(user1);
        nft.mintIdentityNFT();
        
        uint256 tokenId = 1; // First token ID
        
        vm.prank(user2);
        vm.expectRevert("Only the owner can burn the Identity NFT");
        nft.burn(tokenId);
    }
}