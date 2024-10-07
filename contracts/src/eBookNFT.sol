// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract eBookNFT is ERC721, Ownable {
    constructor(address initialOwner) ERC721("eBookNFT", "EBOOK") Ownable(initialOwner) {}

    function mint(address to, uint256 tokenId, string memory uri) public onlyOwner {
        _safeMint(to, tokenId);
        // If you're using token URIs, you might want to set it here
        // _setTokenURI(tokenId, uri);
    }

    function _ownerOf(uint256 tokenId) internal view virtual override returns (address) {
        return super._ownerOf(tokenId);
    }

    // ... rest of your contract code ...
}