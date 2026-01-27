interface ResultsLinkEmailProps {
  resultsUrl: string;
  baseUrl: string;
}

export function getResultsLinkEmail({ resultsUrl, baseUrl }: ResultsLinkEmailProps) {
  const subject = "Your UpskillABA Survey Results";
  const logoUrl = `${baseUrl}/images/logo-medium.png`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Survey Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 3px solid #0D9488;">
              <img src="${logoUrl}" alt="UpskillABA" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #1e293b; text-align: center;">
                Your Survey Results Are Ready
              </h1>
              <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                Thank you for completing the Quick Quality Assessment.<br>
                Click below to view your personalized results and see how you compare to other ABA professionals.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="${resultsUrl}" style="display: inline-block; padding: 16px 40px; background-color: #0D9488; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px;">
                      View My Results
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Or copy this link: <span style="color: #0D9488;">${resultsUrl}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5;">
                This link will take you to your survey results.<br>
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin: 12px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
                &copy; ${new Date().getFullYear()} UpskillABA. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Your UpskillABA Survey Results Are Ready

Thank you for completing the Quick Quality Assessment. Click the link below to view your personalized results and see how you compare to other ABA professionals.

View your results: ${resultsUrl}

If you didn't request this email, you can safely ignore it.

(c) ${new Date().getFullYear()} UpskillABA. All rights reserved.
  `.trim();

  return { subject, html, text };
}
