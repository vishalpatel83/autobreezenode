import db from './../db/db.js'
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
          from_date??"",
          to_date??"",
          pickup_time,
          drop_off_time,
          car_id,
          delivery,
          address,
          amount,
        ]
      );
      const insertResult = result[0];
      res
        .status(201)
        .json({ message: "Booking created",  result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

