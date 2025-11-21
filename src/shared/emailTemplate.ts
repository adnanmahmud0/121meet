import type { ICreateAccount, IResetPassword } from "../types/emailTamplate"

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: "Verify your account - TechFlow",
    html: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%); margin: 0; padding: 40px 20px; color: #e0e0e0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #1a1a2e; border-radius: 12px; border: 1px solid #2d3561; box-shadow: 0 8px 32px rgba(0, 169, 255, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #00a9ff 0%, #0088cc 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: white;">TF</div>
        </div>
        <h2 style="color: #00a9ff; font-size: 26px; margin: 0 0 20px 0; text-align: center; font-weight: 600;">Welcome to TechFlow</h2>
        <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin-bottom: 10px; text-align: center;">Hi ${values.name}, verify your email to get started</p>
        <div style="text-align: center; margin: 40px 0;">
            <p style="color: #b0b0b0; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background: linear-gradient(135deg, #00a9ff 0%, #0088cc 100%); padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <div style="color: white; font-size: 32px; letter-spacing: 4px; font-weight: bold; font-family: 'Courier New', monospace;">${values.otp}</div>
            </div>
            <p style="color: #808080; font-size: 13px; line-height: 1.6; margin-top: 20px;">This code expires in 3 minutes</p>
        </div>
        <div style="border-top: 1px solid #2d3561; padding-top: 25px; text-align: center;">
          <p style="color: #606060; font-size: 13px; margin: 0;">Don't share this code with anyone</p>
          <p style="color: #808080; font-size: 12px; margin: 10px 0 0 0;">© 2025 TechFlow. All rights reserved.</p>
        </div>
    </div>
</body>`,
  }
  return data
}

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: "Reset your password - TechFlow",
    html: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%); margin: 0; padding: 40px 20px; color: #e0e0e0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #1a1a2e; border-radius: 12px; border: 1px solid #2d3561; box-shadow: 0 8px 32px rgba(0, 169, 255, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #00a9ff 0%, #0088cc 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: white;">TF</div>
        </div>
        <h2 style="color: #00a9ff; font-size: 26px; margin: 0 0 20px 0; text-align: center; font-weight: 600;">Password Reset</h2>
        <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin-bottom: 10px; text-align: center;">We received a request to reset your password</p>
        <div style="text-align: center; margin: 40px 0;">
            <p style="color: #b0b0b0; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">Your reset code is:</p>
            <div style="background: linear-gradient(135deg, #00a9ff 0%, #0088cc 100%); padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <div style="color: white; font-size: 32px; letter-spacing: 4px; font-weight: bold; font-family: 'Courier New', monospace;">${values.otp}</div>
            </div>
            <p style="color: #808080; font-size: 13px; line-height: 1.6; margin-top: 20px;">This code expires in 3 minutes</p>
        </div>
        <div style="background-color: #252d4a; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 3px solid #00a9ff;">
          <p style="color: #b0b0b0; font-size: 13px; margin: 0;">Didn't request this? You can safely ignore this email or contact support if you're concerned.</p>
        </div>
        <div style="border-top: 1px solid #2d3561; padding-top: 25px; text-align: center;">
          <p style="color: #606060; font-size: 13px; margin: 0;">Never share your reset code with anyone</p>
          <p style="color: #808080; font-size: 12px; margin: 10px 0 0 0;">© 2025 TechFlow. All rights reserved.</p>
        </div>
    </div>
</body>`,
  }
  return data
}

export const emailTemplate = {
  createAccount,
  resetPassword,
  meetingInvite: (values: {
    to: string;
    title: string;
    meetingType: string;
    startTime?: Date;
    endTime?: Date;
    joinLink: string;
    warning: string;
  }) => {
    const start = values.startTime
      ? new Date(values.startTime).toLocaleString()
      : undefined;
    const end = values.endTime ? new Date(values.endTime).toLocaleString() : undefined;
    const html = `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%); margin: 0; padding: 40px 20px; color: #e0e0e0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #1a1a2e; border-radius: 12px; border: 1px solid #2d3561; box-shadow: 0 8px 32px rgba(0, 169, 255, 0.1);">
        <h2 style="color: #00a9ff; font-size: 22px; margin: 0 0 16px 0; text-align: center; font-weight: 600;">${values.title}</h2>
        <p style="color:#b0b0b0; text-align:center;">Type: ${values.meetingType}</p>
        ${start ? `<p style=\"color:#b0b0b0; text-align:center;\">Start: ${start}</p>` : ''}
        ${end ? `<p style=\"color:#b0b0b0; text-align:center;\">End: ${end}</p>` : ''}
        <div style="text-align: center; margin: 20px 0;">
          <a href="${values.joinLink}" style="display:inline-block; background: linear-gradient(135deg, #00a9ff 0%, #0088cc 100%); color:white; padding: 12px 20px; border-radius: 8px; text-decoration:none;">Join Meeting</a>
        </div>
        <p style="color:#808080; font-size: 12px; text-align:center;">${values.warning}</p>
    </div>
    </body>`;
    return { to: values.to, subject: 'Meeting Invitation - TechFlow', html };
  },
}
