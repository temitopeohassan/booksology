// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/BookshopPassNFT.sol";

contract BookshopPassNFTTest is Test {
    BookshopPassNFT public nft;
    address public user1 = address(1);
    address public user2 = address(2);

    function setUp() public {
        nft = new BookshopPassNFT("https://example.com/metadata");
    }

    function testMintBookshopPass() public {
        vm.prank(user1);
        nft.mintBookshopPass();
        
        assertEq(nft.balanceOf(user1), 1, "User1 should have 1 Bookshop Pass");
    }

    function testCannotMintTwice() public {
        vm.startPrank(user1);
        nft.mintBookshopPass();
        
        vm.expectRevert("User already has a Bookshop Pass");
        nft.mintBookshopPass();
        vm.stopPrank();
    }

    function testDifferentUsersCanMint() public {
        vm.prank(user1);
        nft.mintBookshopPass();
        
        vm.prank(user2);
        nft.mintBookshopPass();
        
        assertEq(nft.balanceOf(user1), 1, "User1 should have 1 Bookshop Pass");
        assertEq(nft.balanceOf(user2), 1, "User2 should have 1 Bookshop Pass");
    }

    function testTokenURI() public {
        string memory initialURI = nft.tokenURI(1);
        assertEq(initialURI, "https://example.com/metadata", "Initial token URI should match");

        vm.prank(nft.owner());
        nft.setTokenURI("https://newexample.com/metadata");

        string memory newURI = nft.tokenURI(1);
        assertEq(newURI, "https://newexample.com/metadata", "Updated token URI should match");
    }
}
