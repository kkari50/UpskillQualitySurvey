interface SurveyInvitationEmailProps {
  surveyUrl: string;
  baseUrl: string;
}

export function getSurveyInvitationEmail({ surveyUrl, baseUrl }: SurveyInvitationEmailProps) {
  const subject = "Take the UpskillABA Quality Assessment";
  const logoUrl = `${baseUrl}/images/logo-medium.png`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Take the Quality Assessment</title>
  <style type="text/css">
    /* Mobile styles */
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-content {
        padding: 24px 20px !important;
      }
      .email-header {
        padding: 24px 20px 20px !important;
      }
      .email-footer {
        padding: 16px 20px !important;
      }
      .email-title {
        font-size: 20px !important;
      }
      .email-text {
        font-size: 15px !important;
      }
      .email-button {
        display: block !important;
        width: 100% !important;
        padding: 16px 20px !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .email-link {
        font-size: 12px !important;
        word-break: break-all !important;
      }
      .logo-img {
        width: 150px !important;
        max-width: 150px !important;
      }
      .benefits-box {
        padding: 16px !important;
      }
      .benefit-text {
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header with Logo -->
          <tr>
            <td class="email-header" style="padding: 32px 32px 24px; text-align: center; border-bottom: 3px solid #0D9488;">
              <img src="${logoUrl}" alt="UpskillABA" width="180" class="logo-img" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 32px 32px 24px;">
              <h1 class="email-title" style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #1e293b; text-align: center;">
                We Don't Have Results for You Yet
              </h1>
              <p class="email-text" style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                It looks like you haven't completed the Quick Quality Assessment yet.<br>
                Take our free 5-minute survey to:
              </p>

              <!-- Benefits Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 28px; background-color: #f0fdfa; border-radius: 8px; border: 1px solid #ccfbf1;">
                <tr>
                  <td class="benefits-box" style="padding: 20px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 12px; color: #0D9488; font-size: 16px; font-weight: bold;">&#10003;</td>
                              <td class="benefit-text" style="font-size: 15px; line-height: 1.5; color: #374151;">Assess your agency's quality practices across 5 key areas</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 12px; color: #0D9488; font-size: 16px; font-weight: bold;">&#10003;</td>
                              <td class="benefit-text" style="font-size: 15px; line-height: 1.5; color: #374151;">Get your personalized quality score instantly</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 12px; color: #0D9488; font-size: 16px; font-weight: bold;">&#10003;</td>
                              <td class="benefit-text" style="font-size: 15px; line-height: 1.5; color: #374151;">Compare your results to other ABA professionals</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="${surveyUrl}" class="email-button" style="display: inline-block; padding: 16px 40px; background-color: #0D9488; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px;">
                      Take the Assessment
                    </a>
                  </td>
                </tr>
              </table>

              <p class="email-link" style="margin: 20px 0 0; font-size: 13px; color: #9ca3af; text-align: center;">
                Or copy this link: <span style="color: #0D9488;">${surveyUrl}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="email-footer" style="padding: 20px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5;">
                This email was sent because someone requested survey results for this address.<br>
                If you didn't make this request, you can safely ignore this email.
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
We Don't Have Results for You Yet

It looks like you haven't completed the Quick Quality Assessment yet. Take our free 5-minute survey to:

- Assess your agency's quality practices across 5 key areas
- Get your personalized quality score instantly
- Compare your results to other ABA professionals

Take the assessment: ${surveyUrl}

This email was sent because someone requested survey results for this address. If you didn't make this request, you can safely ignore this email.

(c) ${new Date().getFullYear()} UpskillABA. All rights reserved.
  `.trim();

  return { subject, html, text };
}
