// utils/emailHtml.js
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build an email-friendly HTML showing each key on a new row.
 * @param {Object} obj
 * @returns {string} HTML string
 */
export function buildSimpleKeyValueHtml(obj) {
  const rows = Object.entries(obj)
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 8px; font-weight:600; vertical-align:top;">${escapeHtml(
          k
        )}</td>
        <td style="padding:6px 8px; vertical-align:top;">${escapeHtml(v)}</td>
      </tr>`
    )
    .join("");

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; color:#111; line-height:1.4; margin:0; padding:20px;">
    <table role="presentation" style="width:100%; max-width:600px; border-collapse:collapse;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>
  `;
}
