// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract MedVerifyRegistry is AccessControl, Pausable {
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    enum RecordStatus {
        Active,
        Revoked,
        Superseded
    }

    struct Record {
        string recordId;
        bytes32 patientIdHash;
        bytes32 documentHash;
        bytes32 metadataHash;
        address issuer;
        uint256 issuedAt;
        RecordStatus status;
        bool exists;
    }

    mapping(string => Record) private records;

    event LabRegistered(address indexed lab, address indexed admin, uint256 timestamp);
    event RecordRegistered(
        string indexed recordId,
        bytes32 indexed documentHash,
        address indexed issuer,
        bytes32 patientIdHash,
        bytes32 metadataHash,
        uint256 timestamp
    );
    event RecordVerified(
        string indexed recordId,
        bytes32 indexed submittedHash,
        bool matched,
        address indexed verifier,
        uint256 timestamp
    );
    event RecordRevoked(
        string indexed recordId,
        address indexed revokedBy,
        uint256 timestamp
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
    }

    function registerLab(address lab) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(LAB_ROLE, lab);
        emit LabRegistered(lab, msg.sender, block.timestamp);
    }

    function registerRecord(
        string calldata recordId,
        bytes32 patientIdHash,
        bytes32 documentHash,
        bytes32 metadataHash
    ) external onlyRole(LAB_ROLE) whenNotPaused {
        require(!records[recordId].exists, "Record already exists");

        records[recordId] = Record({
            recordId: recordId,
            patientIdHash: patientIdHash,
            documentHash: documentHash,
            metadataHash: metadataHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            status: RecordStatus.Active,
            exists: true
        });

        emit RecordRegistered(
            recordId,
            documentHash,
            msg.sender,
            patientIdHash,
            metadataHash,
            block.timestamp
        );
    }

    function verifyRecord(
        string calldata recordId,
        bytes32 submittedDocumentHash
    ) external onlyRole(VERIFIER_ROLE) whenNotPaused returns (bool matched) {
        require(records[recordId].exists, "Record not found");

        Record memory r = records[recordId];
        matched = (
            r.status == RecordStatus.Active &&
            r.documentHash == submittedDocumentHash
        );

        emit RecordVerified(
            recordId,
            submittedDocumentHash,
            matched,
            msg.sender,
            block.timestamp
        );

        return matched;
    }

    function revokeRecord(string calldata recordId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(records[recordId].exists, "Record not found");
        records[recordId].status = RecordStatus.Revoked;
        emit RecordRevoked(recordId, msg.sender, block.timestamp);
    }

    function getRecord(string calldata recordId)
        external
        view
        returns (
            string memory,
            bytes32,
            bytes32,
            bytes32,
            address,
            uint256,
            RecordStatus,
            bool
        )
    {
        Record memory r = records[recordId];
        return (
            r.recordId,
            r.patientIdHash,
            r.documentHash,
            r.metadataHash,
            r.issuer,
            r.issuedAt,
            r.status,
            r.exists
        );
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}