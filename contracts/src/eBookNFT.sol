// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract eBookNFT is ERC1155, Ownable, ERC2981 {
    struct eBook {
        string title;
        address author;
        string encryptedContent;
        uint256 supply;
        uint256 price;
    }

    mapping(uint256 => eBook) private _eBooks;
    mapping(address => mapping(uint256 => bool)) private _userHasAccess;

    event eBookMinted(uint256 indexed tokenId, string title, address author, uint256 supply, uint256 price);
    event eBookPurchased(uint256 indexed tokenId, address buyer);

    constructor() ERC1155("") Ownable(msg.sender) {
        _setDefaultRoyalty(msg.sender, 250); // 2.5% default royalty
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintEBook(
        string memory title,
        string memory uri,
        uint256 supply,
        uint256 price,
        uint256 tokenId
    ) public onlyOwner {
        _mint(msg.sender, tokenId, supply, "");
        _setURI(uri);

        _eBooks[tokenId] = eBook(title, msg.sender, "", supply, price);

        emit eBookMinted(tokenId, title, msg.sender, supply, price);
    }

    function buyEBook(uint256 tokenId) public payable {
        eBook storage book = _eBooks[tokenId];
        require(msg.value >= book.price, "Insufficient payment");
        require(balanceOf(address(this), tokenId) > 0, "No more copies available");

        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
        _userHasAccess[msg.sender][tokenId] = true;

        // Handle royalties
        (address royaltyReceiver, uint256 royaltyAmount) = royaltyInfo(tokenId, msg.value);
        payable(royaltyReceiver).transfer(royaltyAmount);

        // Transfer remaining amount to the contract owner
        payable(owner()).transfer(msg.value - royaltyAmount);

        emit eBookPurchased(tokenId, msg.sender);
    }

    function getEBookMetadata(uint256 tokenId) public view returns (string memory, address, uint256, uint256) {
        eBook memory book = _eBooks[tokenId];
        return (book.title, book.author, book.supply, book.price);
    }

    function getEncryptedContent(uint256 tokenId) public view returns (string memory) {
        require(_userHasAccess[msg.sender][tokenId], "You don't have access to this eBook");
        return _eBooks[tokenId].encryptedContent;
    }

    function setEncryptedContent(uint256 tokenId, string memory content) public onlyOwner {
        _eBooks[tokenId].encryptedContent = content;
    }

    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}