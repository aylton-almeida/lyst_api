import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY || 'KEY';

class Mail {
  public to?: string;
  public message!: string;

  sendMail(isSandbox = false) {
    sgMail.setApiKey(apiKey);

    const data = {
      from: 'no-reply@lyst.com',
      to: this.to,
      text: this.message,
      template_id: 'd-ebcd184ab89b4043881f88aa408b2d79',
      mail_settings: {
        sandbox_mode: {
          enable: isSandbox,
        },
      },
    };

    return sgMail.send(data);
  }
}

export default new Mail();
