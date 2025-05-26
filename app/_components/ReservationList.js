"use client";
import { useOptimistic } from "react";
import { deleteBooking } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

const ReservationList = ({ bookings }) => {
    //deleteBooking'ı deleteReservaiton.js den kaldırıp buraya aldık
    const [optimisticBookings, optimisticDelete] = useOptimistic(
        bookings,
        (currentBookings, bookingId) => {
            return currentBookings.filter((booking) => booking.id !== bookingId);
        }
    );

    async function handleDelete(bookingId) {
        optimisticDelete(bookingId);
        //arka planda calısan async operasyon bu sekilde tetikliyoruz
        await deleteBooking(bookingId);
    }

    return (
        <ul className="space-y-6">
            {optimisticBookings.map((booking) => (
                <ReservationCard
                    onDelete={handleDelete}
                    booking={booking}
                    key={booking.id}
                />
            ))}
        </ul>
    );
};

export default ReservationList;
