// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract eBookNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _currentTokenId;

    struct eBook {
        string title;
        address author;
        string encryptedContent;
    }

    mapping(uint256 => eBook) private _eBooks;
    mapping(uint256 => bool) private _eBookLocked;

    event eBookMinted(uint256 indexed tokenId, string title, address author);
    event eBookTransferred(uint256 indexed tokenId, address from, address to);
    event eBookSold(uint256 indexed tokenId, address seller, address buyer, uint256 price);

    constructor() ERC721("eBookNFT", "ENFT") Ownable(msg.sender) {
        _setDefaultRoyalty(msg.sender, 250); // 2.5% default royalty
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintEBook(string memory title, string memory coverUrl, uint256 bookId) public returns (uint256) {
        _safeMint(msg.sender, bookId);
        _setTokenURI(bookId, coverUrl);

        _eBooks[bookId] = eBook(title, msg.sender, "");
        _eBookLocked[bookId] = false;

        emit eBookMinted(bookId, title, msg.sender);

        return bookId;
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }

    function getEBookMetadata(uint256 tokenId) public view returns (string memory, address) {
        require(tokenExists(tokenId), "eBook does not exist");
        eBook memory book = _eBooks[tokenId];
        return (book.title, book.author);
    }

    function getEncryptedContent(uint256 tokenId) public view returns (string memory) {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this eBook");
        require(!_eBookLocked[tokenId], "eBook is locked");
        return _eBooks[tokenId].encryptedContent;
    }

    function lockEBook(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this eBook");
        _eBookLocked[tokenId] = true;
    }

    function unlockEBook(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this eBook");
        _eBookLocked[tokenId] = false;
    }

    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this eBook");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function recordSale(uint256 tokenId, address seller, address buyer, uint256 price) public onlyOwner {
        require(tokenExists(tokenId), "eBook does not exist");
        emit eBookSold(tokenId, seller, buyer, price);
    }
}
