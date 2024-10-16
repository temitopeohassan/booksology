// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookshopPassNFT is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId;

    mapping(address => bool) private _hasMinted;

    string private constant TOKEN_URI = "ipfs://QmYybP5fCGSC7Ywv9ivm5NF9ZWGWTYfsaUJHvTYQToLBgW";

    event BookshopPassMinted(address indexed user, uint256 tokenId);

    constructor() ERC721("Bookshop Pass", "BPS") Ownable(msg.sender) {}

    function mintBookshopPass() public {
        require(!_hasMinted[msg.sender], "User has already minted a Bookshop Pass");

        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, TOKEN_URI);
        _hasMinted[msg.sender] = true;

        emit BookshopPassMinted(msg.sender, newTokenId);
    }

    function hasMinted(address user) public view returns (bool) {
        return _hasMinted[user];
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can burn the Bookshop Pass");
        _hasMinted[msg.sender] = false;
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}