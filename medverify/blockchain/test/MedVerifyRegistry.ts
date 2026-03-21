import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { MedVerifyRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// ─────────────────────────────────────────────────────────────
//  Constants  (match the contract's keccak256 role identifiers)
// ─────────────────────────────────────────────────────────────
const LAB_ROLE      = ethers.keccak256(ethers.toUtf8Bytes("LAB_ROLE"));
const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));

// Deterministic test hashes
const patientIdHash      = "0x1111111111111111111111111111111111111111111111111111111111111111";
const documentHash       = "0x2222222222222222222222222222222222222222222222222222222222222222";
const wrongDocumentHash  = "0x3333333333333333333333333333333333333333333333333333333333333333";
const metadataHash       = "0x4444444444444444444444444444444444444444444444444444444444444444";

const RECORD_ID   = "REC-001";
const RECORD_ID_2 = "REC-002";

// ─────────────────────────────────────────────────────────────
//  Test suite
// ─────────────────────────────────────────────────────────────
describe("MedVerifyRegistry", function () {
  let registry: MedVerifyRegistry;
  let admin: SignerWithAddress;
  let lab: SignerWithAddress;
  let verifier: SignerWithAddress;
  let outsider: SignerWithAddress;

  // Deploy a fresh contract + set up roles before every test
  // so no state ever leaks between tests
  beforeEach(async function () {
    [admin, lab, verifier, outsider] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("MedVerifyRegistry");
    registry = (await Factory.deploy(admin.address)) as unknown as MedVerifyRegistry;
    await registry.waitForDeployment();

    // Grant lab its role
    await registry.connect(admin).registerLab(lab.address);

    // Grant verifier role to dedicated verifier account
    // (admin already has VERIFIER_ROLE from the constructor)
    await registry.connect(admin).grantRole(VERIFIER_ROLE, verifier.address);
  });

  // ─────────────────────────────────────────────────────────
  //  1. Admin can register a lab
  // ─────────────────────────────────────────────────────────
  it("1. admin can register a lab", async function () {
    const [,,,,newLab] = await ethers.getSigners();

    await expect(registry.connect(admin).registerLab(newLab.address))
      .to.emit(registry, "LabRegistered")
      .withArgs(newLab.address, admin.address, anyValue);

    // Confirm the role was actually granted on-chain
    expect(await registry.hasRole(LAB_ROLE, newLab.address)).to.equal(true);
  });

  // ─────────────────────────────────────────────────────────
  //  2. Non-admin cannot register a lab
  // ─────────────────────────────────────────────────────────
  it("2. non-admin cannot register a lab", async function () {
    // outsider has no DEFAULT_ADMIN_ROLE so OpenZeppelin AccessControl reverts
    await expect(
      registry.connect(outsider).registerLab(outsider.address)
    ).to.be.reverted;
  });

  // ─────────────────────────────────────────────────────────
  //  3. Lab can register a medical record
  // ─────────────────────────────────────────────────────────
  it("3. lab can register a medical record", async function () {
    await expect(
      registry.connect(lab).registerRecord(
        RECORD_ID, patientIdHash, documentHash, metadataHash
      )
    )
      .to.emit(registry, "RecordRegistered")
      .withArgs(
        RECORD_ID,
        documentHash,
        lab.address,
        patientIdHash,
        metadataHash,
        anyValue        // block.timestamp
      );

    // Confirm every field stored correctly
    const record = await registry.getRecord(RECORD_ID);
    expect(record[0]).to.equal(RECORD_ID);       // recordId
    expect(record[1]).to.equal(patientIdHash);    // patientIdHash
    expect(record[2]).to.equal(documentHash);     // documentHash
    expect(record[3]).to.equal(metadataHash);     // metadataHash
    expect(record[4]).to.equal(lab.address);      // issuer
    expect(record[5]).to.be.gt(0n);               // issuedAt — non-zero
    expect(record[6]).to.equal(0n);               // status — 0 = Active
    expect(record[7]).to.equal(true);             // exists
  });

  // ─────────────────────────────────────────────────────────
  //  4. Duplicate recordId fails
  // ─────────────────────────────────────────────────────────
  it("4. duplicate recordId fails", async function () {
    await registry.connect(lab).registerRecord(
      RECORD_ID, patientIdHash, documentHash, metadataHash
    );

    await expect(
      registry.connect(lab).registerRecord(
        RECORD_ID, patientIdHash, documentHash, metadataHash
      )
    ).to.be.revertedWith("Record already exists");
  });

  // ─────────────────────────────────────────────────────────
  //  5. verifyRecord returns true for correct hash
  // ─────────────────────────────────────────────────────────
  it("5. verify returns true for correct hash", async function () {
    await registry.connect(lab).registerRecord(
      RECORD_ID, patientIdHash, documentHash, metadataHash
    );

    // staticCall reads the return value without mining a tx
    const result = await registry
      .connect(verifier)
      .verifyRecord.staticCall(RECORD_ID, documentHash);

    expect(result).to.equal(true);
  });

  // ─────────────────────────────────────────────────────────
  //  6. verifyRecord returns false for wrong hash
  // ─────────────────────────────────────────────────────────
  it("6. verify returns false for wrong hash", async function () {
    await registry.connect(lab).registerRecord(
      RECORD_ID, patientIdHash, documentHash, metadataHash
    );

    const result = await registry
      .connect(verifier)
      .verifyRecord.staticCall(RECORD_ID, wrongDocumentHash);

    expect(result).to.equal(false);
  });

  // ─────────────────────────────────────────────────────────
  //  7. Revoked record cannot be treated as valid
  // ─────────────────────────────────────────────────────────
  it("7. revoked record cannot be treated as valid", async function () {
    await registry.connect(lab).registerRecord(
      RECORD_ID, patientIdHash, documentHash, metadataHash
    );

    // Passes before revocation
    expect(
      await registry.connect(verifier).verifyRecord.staticCall(RECORD_ID, documentHash)
    ).to.equal(true);

    // Revoke it
    await registry.connect(admin).revokeRecord(RECORD_ID);

    // Must now return false even with the correct hash
    expect(
      await registry.connect(verifier).verifyRecord.staticCall(RECORD_ID, documentHash)
    ).to.equal(false);
  });

  // ─────────────────────────────────────────────────────────
  //  8. Events are emitted correctly
  // ─────────────────────────────────────────────────────────
  it("8. events are emitted correctly", async function () {
    // RecordRegistered
    await expect(
      registry.connect(lab).registerRecord(
        RECORD_ID, patientIdHash, documentHash, metadataHash
      )
    )
      .to.emit(registry, "RecordRegistered")
      .withArgs(RECORD_ID, documentHash, lab.address, patientIdHash, metadataHash, anyValue);

    // RecordVerified — verifyRecord is a real tx because it emits an event
    await expect(
      registry.connect(verifier).verifyRecord(RECORD_ID, documentHash)
    )
      .to.emit(registry, "RecordVerified")
      .withArgs(RECORD_ID, documentHash, true, verifier.address, anyValue);

    // RecordRevoked
    await expect(registry.connect(admin).revokeRecord(RECORD_ID))
      .to.emit(registry, "RecordRevoked")
      .withArgs(RECORD_ID, admin.address, anyValue);
  });

  // ─────────────────────────────────────────────────────────
  //  Bonus: pause blocks registerRecord and verifyRecord
  // ─────────────────────────────────────────────────────────
  it("paused contract blocks registerRecord", async function () {
    await registry.connect(admin).pause();

    await expect(
      registry.connect(lab).registerRecord(
        RECORD_ID, patientIdHash, documentHash, metadataHash
      )
    ).to.be.reverted;
  });

  it("unpause restores normal operation", async function () {
    await registry.connect(admin).pause();
    await registry.connect(admin).unpause();

    await expect(
      registry.connect(lab).registerRecord(
        RECORD_ID, patientIdHash, documentHash, metadataHash
      )
    ).to.not.be.reverted;
  });

  // ─────────────────────────────────────────────────────────
  //  Bonus: outsider without VERIFIER_ROLE is blocked
  // ─────────────────────────────────────────────────────────
  it("account without VERIFIER_ROLE cannot verify", async function () {
    await registry.connect(lab).registerRecord(
      RECORD_ID, patientIdHash, documentHash, metadataHash
    );

    await expect(
      registry.connect(outsider).verifyRecord(RECORD_ID, documentHash)
    ).to.be.reverted;
  });

  // ─────────────────────────────────────────────────────────
  //  Bonus: revoking non-existent record reverts
  // ─────────────────────────────────────────────────────────
  it("revoking a non-existent record reverts", async function () {
    await expect(
      registry.connect(admin).revokeRecord("NO-SUCH-RECORD")
    ).to.be.revertedWith("Record not found");
  });

  // ─────────────────────────────────────────────────────────
  //  Bonus: two labs can register independent records
  // ─────────────────────────────────────────────────────────
  it("two labs can each register independent records", async function () {
    const [,,,,,lab2] = await ethers.getSigners();
    await registry.connect(admin).registerLab(lab2.address);

    await registry.connect(lab).registerRecord(
      RECORD_ID, patientIdHash, documentHash, metadataHash
    );
    await registry.connect(lab2).registerRecord(
      RECORD_ID_2, patientIdHash, wrongDocumentHash, metadataHash
    );

    expect(
      await registry.connect(verifier).verifyRecord.staticCall(RECORD_ID, documentHash)
    ).to.equal(true);

    expect(
      await registry.connect(verifier).verifyRecord.staticCall(RECORD_ID_2, wrongDocumentHash)
    ).to.equal(true);
  });
});