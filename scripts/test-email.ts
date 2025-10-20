import { sendVerificationEmail } from '../lib/email';

async function testEmail() {
  console.log('Testing Resend email sending...\n');

  const testEmail = 'your-email@example.com'; // Replace with your actual email
  const testToken = 'test-token-12345';

  console.log(`Attempting to send verification email to: ${testEmail}`);
  console.log(`Using RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Found' : 'NOT FOUND'}\n`);

  try {
    const result = await sendVerificationEmail(testEmail, testToken);

    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log('Check your inbox (and spam folder) for the verification email.\n');
    } else {
      console.log('❌ FAILED to send email');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log(error);
  }
}

testEmail();
