const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://rabbitmq";
const PAYMENT_QUEUE = "paymentQueue";
const NOTIFICATION_QUEUE = "NotificationQueue";

async function startProcessor() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(PAYMENT_QUEUE, { durable: true });
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    console.log(`Listening to the queue: ${PAYMENT_QUEUE}`);

    channel.consume(PAYMENT_QUEUE, async (message) => {
      if (message !== null) {
        const paymentData = JSON.parse(message.content.toString());
        console.log("Processing payment:", paymentData);

        // Send a message to the notification queue
        await sendToNotificationQueue(channel, paymentData);

        console.log("Payment completed:", paymentData);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
  }
}

async function sendToNotificationQueue(channel, paymentData) {
  const notification = {
    user: paymentData.user,
    paymentType: paymentData.paymentType,
    message: "Payment has been successfully completed.",
  };
  channel.sendToQueue(NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(notification)));
  console.log("Message sent to the notification queue:", notification);
}

startProcessor();
