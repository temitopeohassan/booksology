import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IdentityNFT is ERC721 {
    function someFunction(uint256 tokenId) public view {
        _requireOwned(tokenId);
        // ... rest of the function ...
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can burn the Identity NFT");
        require(_exists(tokenId), "ERC721: token does not exist");
        _hasMinted[msg.sender] = false;
        _burn(tokenId);
    }
}
