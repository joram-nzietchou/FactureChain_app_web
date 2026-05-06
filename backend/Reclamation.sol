// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReclamationSystem {
    struct Reclamation {
        uint256 id;
        address abonne;
        string cidPreuve;
        uint256 montant;
        string statut;
    }

    mapping(uint256 => Reclamation) public reclamations;
    uint256 public prochainId;

    event NouvelleReclamation(uint256 id, address abonne);

    function creerReclamation(string memory _cid, uint256 _montant) public {
        reclamations[prochainId] = Reclamation(prochainId, msg.sender, _cid, _montant, "Soumis");
        emit NouvelleReclamation(prochainId, msg.sender);
        prochainId++;
    }
}
 