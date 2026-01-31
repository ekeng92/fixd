/**
 * SMS Message Templates for Fix'D
 */

/**
 * New job notification for fixers
 */
export function newJobMessage(
  jobTitle: string,
  zipCode: string,
  startingPrice: number,
  jobId: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://fixd.app'
): string {
  const link = `${appUrl}/fixer/jobs/${jobId}`;
  return `🔧 New Job: ${jobTitle} in ${zipCode}. Budget $${startingPrice}. Tap to bid: ${link}`;
}

/**
 * Bid accepted notification for winner
 */
export function bidAcceptedMessage(
  jobTitle: string,
  address: string,
  jobId: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://fixd.app'
): string {
  const link = `${appUrl}/fixer/jobs/${jobId}`;
  return `🎉 Congratulations! You won "${jobTitle}". Address: ${address}. Details: ${link}`;
}

/**
 * Bid rejected notification for losers
 */
export function bidRejectedMessage(
  jobTitle: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://fixd.app'
): string {
  return `Job "${jobTitle}" has been closed. Check out new opportunities on Fix'D: ${appUrl}/fixer/jobs`;
}

/**
 * Job created confirmation for broker
 */
export function jobCreatedConfirmation(
  jobTitle: string,
  jobId: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://fixd.app'
): string {
  const link = `${appUrl}/broker/jobs/${jobId}`;
  return `✅ Your job "${jobTitle}" is live and fixers are being notified. View bids: ${link}`;
}
