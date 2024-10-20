// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookshopPassNFT is ERC721, Ownable {
    uint256 private _currentTokenId;
    string private _tokenURI;

    event BookshopPassMinted(address indexed user, uint256 tokenId);

    constructor(string memory initialTokenURI) ERC721("Bookshop Pass", "BPS") Ownable(msg.sender) {
        _tokenURI = initialTokenURI;
    }

    function mintBookshopPass() public {
        require(balanceOf(msg.sender) == 0, "User already has a Bookshop Pass");
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;
        _safeMint(msg.sender, newTokenId);
        emit BookshopPassMinted(msg.sender, newTokenId);
    }

    function tokenURI(uint256) public view override returns (string memory) {
        return _tokenURI;
    }

    function setTokenURI(string memory newTokenURI) public onlyOwner {
        _tokenURI = newTokenURI;
    }

    function totalSupply() public view returns (uint256) {
        return _currentTokenId;
    }

    // The balanceOf function is already inherited from ERC721
    // function balanceOf(address owner) public view virtual override returns (uint256) {
    //     return super.balanceOf(owner);
    // }
}
