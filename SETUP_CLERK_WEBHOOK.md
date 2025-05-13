# Setting Up Clerk Webhooks

To ensure users are properly saved to your PostgreSQL database after Clerk authentication, follow these steps:

## 1. Add Environment Variables

Add this to your `.env.local` file:

```
# Clerk webhook secret
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
```

## 2. Configure Clerk Webhook

1. Go to your [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Navigate to **Webhooks** in the left sidebar
3. Click **Add Endpoint**
4. Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
5. Select the following events:
   - `user.created`
   - `user.updated`
6. Copy the generated **Signing Secret** and add it to your `.env.local` file as `CLERK_WEBHOOK_SECRET`
7. Save the webhook configuration

## 3. Run Database Migrations (if needed)

Make sure your database schema is up to date:

```
npx prisma migrate dev
```

## 4. Testing the Setup

1. Sign up or sign in with a new account
2. Check your database to verify that the user was created
3. Look at the application logs for any potential errors

If you encounter any issues, check the following:
- Verify your webhook is properly configured in Clerk
- Ensure your `CLERK_WEBHOOK_SECRET` is correctly set in your environment variables
- Check your application logs for any errors during the user creation process
- Confirm your database connection is working properly 