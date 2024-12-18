const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://rabbitmq";
const NOTIFICATION_QUEUE = "NotificationQueue";

// Starting the Notification Service
async function startNotificationService() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    console.log(`Notification Service is listening to the queue: ${NOTIFICATION_QUEUE}`);

    channel.consume(NOTIFICATION_QUEUE, (message) => {
      if (message !== null) {
        const notification = JSON.parse(message.content.toString());
        console.log("Sending Notification:", notification);

        // Example: Notification process can be done here
        console.log(
          `Notification: Payment of type "${notification.paymentType}" was notified to user ${notification.user}.`
        );

        channel.ack(message); // Acknowledge the message
      }
    });
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
  }
}

// Start the Notification Service
startNotificationService();
