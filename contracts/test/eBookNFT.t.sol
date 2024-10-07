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
        nft = new eBookNFT();
    }

    function testMintEBook() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        assertEq(nft.ownerOf(tokenId), owner);
        (string memory retrievedTitle, address retrievedAuthor) = nft.getEBookMetadata(tokenId);
        assertEq(retrievedTitle, title);
        assertEq(retrievedAuthor, owner);
    }

    function testGetEncryptedContent() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        string memory retrievedContent = nft.getEncryptedContent(tokenId);
        assertEq(retrievedContent, encryptedContent);
    }

    function testLockAndUnlockEBook() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        nft.lockEBook(tokenId);
        vm.expectRevert("eBook is locked");
        nft.getEncryptedContent(tokenId);

        nft.unlockEBook(tokenId);
        string memory retrievedContent = nft.getEncryptedContent(tokenId);
        assertEq(retrievedContent, encryptedContent);
    }

    function testSetRoyalty() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        address royaltyReceiver = address(0x3);
        uint96 royaltyFee = 500; // 5%

        nft.setRoyalty(tokenId, royaltyReceiver, royaltyFee);

        (address retrievedReceiver, uint256 royaltyAmount) = nft.royaltyInfo(tokenId, 10000);
        assertEq(retrievedReceiver, royaltyReceiver);
        assertEq(royaltyAmount, 500); // 5% of 10000
    }

    function testTransferEBook() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        nft.transferFrom(owner, user1, tokenId);
        assertEq(nft.ownerOf(tokenId), user1);
    }

    function testRecordSale() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        vm.expectEmit(true, true, true, true);
        emit eBookNFT.eBookSold(tokenId, owner, user1, 1 ether);
        
        nft.recordSale(tokenId, owner, user1, 1 ether);
    }

    function testFailGetEncryptedContentNotOwner() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        vm.prank(user1);
        nft.getEncryptedContent(tokenId);
    }

    function testFailSetRoyaltyNotOwner() public {
        string memory title = "Test Book";
        string memory encryptedContent = "Encrypted content";
        string memory tokenURI = "https://example.com/metadata";

        uint256 tokenId = nft.mintEBook(title, encryptedContent, tokenURI);
        
        vm.prank(user1);
        nft.setRoyalty(tokenId, user2, 500);
    }
}
