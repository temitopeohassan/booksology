// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract IdentityNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    event IdentityNFTMinted(address indexed user, uint256 tokenId);

    constructor(address initialOwner) ERC721("IdentityNFT", "IDNFT") Ownable(initialOwner) {}

    function mint(address to) public onlyOwner {
        uint256 newTokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, newTokenId);
        emit IdentityNFTMinted(to, newTokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can burn the Identity NFT");
        _burn(tokenId);
    }
}