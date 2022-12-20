import crypto from "crypto";
import { Request, Response } from "express";
import { CreateOrder } from "../services/OrderService";
import { IOrder } from "../models/order";

const { PAYSTACK_SECRET_KEY } = process.env;

export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    // only accept requests from official paystack ip addresses
    const trustedIps = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];
    const requestIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (trustedIps.indexOf(requestIp as string) !== -1) {
      // validate event
      const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY as string)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (hash === req.headers["x-paystack-signature"]) {
        // Retrieve the request's body
        const { event, data } = req.body;

        switch (event) {
          case "charge.success":
            if (data.metadata.purpose === "order") {
              const {
                name,
                email,
                phone_number,
                product_name,
                product_id,
                user_id,
                lga,
                delivery_fee,
                total_amount,
                state,
                address,
                landmark,
              } = data.metadata;
              const order: IOrder = {
                name,
                userId: user_id,
                email,
                phoneNumber: phone_number,
                paymentRef: data.reference,
                state,
                localGovernmentArea: lga,
                address,
                productId: product_id,
                productName: product_name,
                deliveryFee: delivery_fee,
                totalAmount: total_amount,
                majorLandmark: landmark,
                status: "processing",
              };
              // no await to prevent blocking
              CreateOrder(order);
            }
            break;
          default:
            break;
        }

        res.send(200);
      }
    } else {
      return res.send(401);
    }
  } catch (error: any) {
    return res.status(500).send(error);
  }
};
