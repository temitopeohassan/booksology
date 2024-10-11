// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/eBookNFT.sol";

contract eBookNFTTest is Test {
    eBookNFT public nft;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        vm.prank(owner);
        nft = new eBookNFT();
    }

    function testMintEBook() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        vm.prank(user1);
        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        assertEq(nft.ownerOf(tokenId), user1);
        (string memory retrievedTitle, address retrievedAuthor) = nft.getEBookMetadata(tokenId);
        assertEq(retrievedTitle, title);
        assertEq(retrievedAuthor, user1);
    }

    function testGetEncryptedContent() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        vm.prank(user1);
        string memory retrievedContent = nft.getEncryptedContent(tokenId);
        assertEq(retrievedContent, "Encrypted content");
    }

    function testLockAndUnlockEBook() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        vm.prank(user1);
        nft.lockEBook(tokenId);
        
        vm.prank(user1);
        vm.expectRevert("eBook is locked");
        nft.getEncryptedContent(tokenId);

        vm.prank(user1);
        nft.unlockEBook(tokenId);
        
        vm.prank(user1);
        string memory retrievedContent = nft.getEncryptedContent(tokenId);
        assertEq(retrievedContent, "Encrypted content");
    }

    function testSetRoyalty() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        address royaltyReceiver = address(0x3);
        uint96 royaltyFee = 500; // 5%

        vm.prank(user1);
        nft.setRoyalty(tokenId, royaltyReceiver, royaltyFee);

        (address retrievedReceiver, uint256 royaltyAmount) = nft.royaltyInfo(tokenId, 10000);
        assertEq(retrievedReceiver, royaltyReceiver);
        assertEq(royaltyAmount, 500); // 5% of 10000
    }

    function testTransferEBook() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        vm.prank(user1);
        nft.transferFrom(user1, user2, tokenId);
        assertEq(nft.ownerOf(tokenId), user2);
    }

    function testRecordSale() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        vm.expectEmit(true, true, true, true);
        emit eBookNFT.eBookSold(tokenId, user1, user2, 1 ether);
        
        vm.prank(owner);
        nft.recordSale(tokenId, user1, user2, 1 ether);
    }

    function testFailGetEncryptedContentNotOwner() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        vm.prank(user2);
        nft.getEncryptedContent(tokenId);
    }

    function testFailSetRoyaltyNotOwner() public {
        vm.prank(user1);
        uint256 tokenId = nft.mintEBook("Test Book", "Encrypted content", "https://example.com/metadata");
        
        vm.prank(user2);
        nft.setRoyalty(tokenId, user2, 500);
    }
}