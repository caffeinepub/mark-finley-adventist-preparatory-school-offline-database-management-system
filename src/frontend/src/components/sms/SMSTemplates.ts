export const SMS_TEMPLATES = {
  feePayment: 'Dear Parent, we have received your payment of GH₵[AMOUNT] for [STUDENT_NAME]. Thank you. - Mark Finley APS',
  feeReminder: 'Dear Parent, this is a reminder that fees for [STUDENT_NAME] are outstanding. Please make payment at your earliest convenience. - Mark Finley APS',
  examResult: 'Dear Parent, exam results for [STUDENT_NAME] are now available. Please contact the school for details. - Mark Finley APS',
  announcement: 'Dear Parent, [ANNOUNCEMENT_TEXT]. - Mark Finley APS',
};

export function insertTemplate(template: string, replacements: Record<string, string> = {}): string {
  let result = template;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(`[${key}]`, value);
  });
  return result;
}
