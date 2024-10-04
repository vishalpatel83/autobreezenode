import { ResultModal } from "../common/response.js";
import db from "./../db/db.js";
export class RentalController {
  constructor() {}

  static async bookRental(req, res) {
    const {
      book_periods,
      from_date,
      to_date,
      pickup_time,
      drop_off_time,
      car_id,
      delivery,
      address,
      amount,
    } = req.body;

    try {
      const result = await db.execute(
        "INSERT INTO car_rental_bookings (book_periods, from_date, to_date, pickup_time, drop_off_time, car_id, delivery, address, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          book_periods,
          from_date ?? "",
          to_date ?? "",
          pickup_time,
          drop_off_time,
          car_id,
          delivery,
          address,
          amount,
        ]
      );
      const insertResult = result[0];
      res.status(200).json({ message: "Booking created", result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async checkCarAvailability(req, res) {
    try {
      const { car_id, from_date, to_date, pickup_time, drop_off_time } =
        req.body;
      const query = `
    SELECT * FROM bookings
    WHERE car_id = ?
    AND (
      (from_date BETWEEN ? AND ? OR to_date BETWEEN ? AND ?)
      OR
      (? BETWEEN from_date AND to_date OR ? BETWEEN from_date AND to_date)
    )
    AND (
      (pickup_time <= ? AND drop_off_time >= ?)
      OR
      (pickup_time <= ? AND drop_off_time >= ?)
    )
  `;
      db.query(
        query,
        [
          car_id,
          from_date,
          to_date,
          from_date,
          to_date,
          from_date,
          to_date,
          pickup_time,
          drop_off_time,
          drop_off_time,
          pickup_time,
        ],
        (err, results) => {
          if (err) {
            const data = new ResultModal([], "", 400, false, err.message);
            return res.status(400).json(data);
          }

          if (results.length > 0) {
            const data = new ResultModal(
              [false],
              "The car is not available for the selected period.",
              200,
              true,
              ""
            );
            return res.status(200).json(data);
          } else {
            const data = new ResultModal(
              [true],
              "The car is available for the selected period.",
              200,
              true,
              ""
            );
            return res.status(200).json(data);
          }
        }
      );
    } catch (error) {
      const data = new ResultModal([], "", 400, false, error.message);
      return res.status(400).json(data);
    }
  }
  // {
  //   "car_id": 1,
  //   "from_date": "2024-09-25 10:00:00",
  //   "to_date": "2024-09-26 18:00:00",
  //   "pickup_time": "10:00:00",
  //   "drop_off_time": "18:00:00"
  // }

  static async getLiveBookings(req, res) {
    const userId = req.params.userId;

    try {
      const [results] = await db.execute('CALL GetFutureBookingsByUser(?)', [userId]);
  
      if (results.length > 0) {
        const data = new ResultModal({ history: results[0] }, "", 200, true, "");
        return res.status(200).json(data);
      } else {
        const data = new ResultModal({ history: results[0] }, "No rental live booking found for this user.", 200, true, "");
        return res.status(200).json(data);
      }
    } catch (err) {
      const data = new ResultModal([], "", 400, false, err.message);
      return res.status(400).json(data);
    }
  }


  static async getPastBookings(req,res){
    const userId = req.params.userId;

    try {
      const [results] = await db.execute('CALL GetUserRentalHistory(?)', [userId]);
  
      if (results.length > 0) {
        const data = new ResultModal({ history: results[0] }, "", 200, true, "");
        return res.status(200).json(data);
      } else {
        const data = new ResultModal({ history: results[0] }, "No rental history found for this user.", 200, true, "");
        return res.status(200).json(data);
      }
    } catch (err) {
      const data = new ResultModal([], "", 400, false, err.message);
      return res.status(400).json(data);
    }
  
  }
}
