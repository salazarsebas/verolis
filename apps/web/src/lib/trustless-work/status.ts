import { listInstitutionalEscrowBlueprints } from "./templates";

export function getInstitutionalEscrowStatuses() {
  const statuses = ["scoping", "funded", "in_review", "ready_to_release"] as const;

  return listInstitutionalEscrowBlueprints().map((blueprint, index) => ({
    id: `escrow-${blueprint.partnerSlug}`,
    partner: blueprint.partnerName,
    title: blueprint.title,
    amount: blueprint.totalAmount,
    asset: blueprint.settlementAsset,
    status: statuses[index % statuses.length],
    currentMilestone: blueprint.phases[Math.min(index, blueprint.phases.length - 1)].description,
    milestonesCompleted: Math.min(index + 1, blueprint.phases.length),
    totalMilestones: blueprint.phases.length,
  }));
}
