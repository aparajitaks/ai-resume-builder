import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

/**
 * consumeCredits(amount)
 * Middleware factory that deducts `amount` credits from the authenticated user
 * before allowing the request to proceed. Returns 402 if the user has insufficient credits.
 */
export const consumeCredits = (amount = 1) => async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.user.userId, deletedAt: null },
      select: { id: true, credits: true, plan: true },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // PRO users are never credit-gated
    if (user.plan === "PRO") {
      return next();
    }

    if (user.credits < amount) {
      return next(
        new AppError(
          `Insufficient credits. You need ${amount} credit(s) but have ${user.credits}. Upgrade to PRO for unlimited access.`,
          402
        )
      );
    }

    // Deduct credits atomically
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: amount } },
    });

    next();
  } catch (error) {
    next(error);
  }
};
