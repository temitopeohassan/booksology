// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/BookshopPassNFT.sol";

contract BookshopPassNFTTest is Test {
    BookshopPassNFT public nft;
    address public user1 = address(1);
    address public user2 = address(2);

    function setUp() public {
        nft = new BookshopPassNFT();
    }

    function testMintBookshopPass() public {
        vm.prank(user1);
        nft.mintBookshopPass();
        
        assertTrue(nft.hasMinted(user1), "User1 should have minted a Bookshop Pass");
        assertEq(nft.balanceOf(user1), 1, "User1 should have 1 Bookshop Pass");
    }

    function testCannotMintTwice() public {
        vm.prank(user1);
        nft.mintBookshopPass();
        
        vm.prank(user1);
        vm.expectRevert("User has already minted a Bookshop Pass");
        nft.mintBookshopPass();
    }

    function testBurnBookshopPass() public {
        vm.startPrank(user1);
        nft.mintBookshopPass();
        uint256 tokenId = 1; // First token ID
        nft.burn(tokenId);
        vm.stopPrank();
        
        assertFalse(nft.hasMinted(user1), "User1 should no longer have a Bookshop Pass");
        assertEq(nft.balanceOf(user1), 0, "User1 should have 0 Bookshop Passes");
    }

    function testCannotBurnOthersBookshopPass() public {
        vm.prank(user1);
        nft.mintBookshopPass();
        
        uint256 tokenId = 1; // First token ID
        
        vm.prank(user2);
        vm.expectRevert("Only the owner can burn the Bookshop Pass");
        nft.burn(tokenId);
    }
}