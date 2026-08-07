import prisma from './prisma';

export async function checkExpenseAnomalies(projectId: string, newExpenseAmount: number) {
  const project = await prisma.govProject.findUnique({
    where: { id: projectId },
    include: { expenses: true },
  });

  if (!project) return { flagged: false, reason: null };

  const totalSpent = project.expenses.reduce((sum, e) => sum + e.amount, 0) + newExpenseAmount;

  if (totalSpent > project.budgetAllocated) {
    return { flagged: true, reason: 'Overspending: total expenses exceed allocated budget' };
  }

  if (newExpenseAmount > project.budgetAllocated * 0.4) {
    return { flagged: true, reason: 'Large single expense: exceeds 40% of total project budget' };
  }

  const duplicate = project.expenses.find(
    (e) => e.amount === newExpenseAmount
  );
  if (duplicate) {
    return { flagged: true, reason: 'Possible duplicate: matches an existing expense amount on this project' };
  }

  return { flagged: false, reason: null };
}