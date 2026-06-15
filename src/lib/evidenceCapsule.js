import { sha256 } from './encryption';

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
}

function shortHash(hash = '') {
  return hash ? `${hash.slice(0, 12)}...${hash.slice(-8)}` : 'unavailable';
}

export async function createEvidenceCapsule({
  activeSession,
  vaultData = [],
  ledgerData = [],
  watchdogStatus = 'IDLE',
  ledgerIntegrity = true,
  committee1Signed = false,
  committee2Signed = false,
  approvalTime = '',
  pipelineState = 'idle',
  phaseStatuses = {},
  logs = []
}) {
  const latestVaultRow = vaultData.at(-1) || null;
  const latestLedgerRow = ledgerData.at(-1) || null;
  const phasesPassed = Object.values(phaseStatuses).filter((status) => status === 'SUCCESS').length;

  const capsule = {
    capsule_type: 'ZERO_TRUST_EXAM_EVIDENCE_CAPSULE',
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    exam: {
      session_id: activeSession?.id || null,
      exam_code: activeSession?.exam_code || 'UNSELECTED',
      board: activeSession?.board || null,
      subject: activeSession?.subject || null
    },
    approvals: {
      committee_1_setter_signed: Boolean(committee1Signed),
      committee_2_approver_signed: Boolean(committee2Signed),
      approval_time: approvalTime || null
    },
    pipeline: {
      state: pipelineState,
      phases_passed: phasesPassed,
      phase_statuses: phaseStatuses
    },
    vault: {
      row_id: latestVaultRow?.id || null,
      exam_code: latestVaultRow?.exam_code || null,
      ciphertext_bytes_hex: latestVaultRow?.blob?.length || 0,
      sha256_hash: latestVaultRow?.hash || null,
      sha256_preview: shortHash(latestVaultRow?.hash),
      iv_present: Boolean(latestVaultRow?.iv),
      auth_tag_present: Boolean(latestVaultRow?.auth_tag),
      watchdog_status: watchdogStatus
    },
    ledger: {
      block_count: ledgerData.length,
      integrity_status: ledgerIntegrity ? 'VERIFIED' : 'COMPROMISED',
      latest_block_id: latestLedgerRow?.id || null,
      latest_row_hash: latestLedgerRow?.row_hash || null,
      latest_row_hash_preview: shortHash(latestLedgerRow?.row_hash)
    },
    audit_log_tail: logs.slice(-8).map((entry) => `${entry.timestamp} ${entry.text}`)
  };

  const canonicalPayload = stableStringify(capsule);
  const capsuleHash = await sha256(canonicalPayload);

  return {
    ...capsule,
    capsule_hash: capsuleHash,
    capsule_hash_preview: shortHash(capsuleHash)
  };
}

export function evidenceCapsuleFileName(capsule) {
  const examCode = capsule?.exam?.exam_code || 'exam';
  const stamp = capsule?.generated_at?.replace(/[:.]/g, '-').slice(0, 19) || 'evidence';
  return `${examCode}-evidence-capsule-${stamp}.json`;
}
