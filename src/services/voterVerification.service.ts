// MOCK IMPLEMENTATION FOR DEMO PURPOSES
// In production, this would call the Election Commission of India's
// electoral roll API (or a state CEO office API) to verify the voter ID
// against the actual electoral database.

const EPIC_FORMAT_REGEX = /^[A-Z]{3}[0-9]{7}$/;

export function isValidVoterIdFormat(voterId: string): boolean {
  return EPIC_FORMAT_REGEX.test(voterId.trim().toUpperCase());
}

export async function verifyVoterId(voterId: string): Promise<{ verified: boolean; reason?: string }> {
  // Simulate network latency of a real government API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!isValidVoterIdFormat(voterId)) {
    return { verified: false, reason: 'Invalid EPIC number format. Expected format: ABC1234567' };
  }

  // MOCK: In production, this returns based on actual ECI database lookup.
  // For demo purposes, any correctly-formatted ID is treated as verified.
  return { verified: true };
}