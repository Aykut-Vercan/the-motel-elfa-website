import SubmitButton from "@/app/_components/SubmitButton";
import { updateBooking } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { getBooking, getBookings, getCabin } from "@/app/_lib/data-service";
import React from "react";

export default async function Page({ params }) {
    const { bookingId } = await params;
    const { numGuests, observations, cabinId } = await getBooking(bookingId);

    const session = await auth();
    if (!session) throw new Error("You must be logged in");
    const guestBookings = await getBookings(session.user.guestId);

    const guestBookingsIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingsIds.includes(Number(bookingId)))
        throw new Error("You have no booking with this id");

    const { maxCapacity } = await getCabin(cabinId);

    return (
        <div>
            <h2 className="font-bold text-2xl text-indigo-300 mb-7">
                Edit Reservation #{bookingId}
            </h2>
            <form
                action={updateBooking}
                className="bg-primary-800 py-6 px-10 text-lg gap-6 flex flex-col rounded-lg"
            >
                <input type="hidden" value={bookingId} name="bookingId" />
                <div className=" flex flex-col">
                    <label htmlFor="numGuests" className="font-bold">
                        How many guests?
                    </label>
                    <select
                        name="numGuests"
                        id="numGuests"
                        defaultValue={numGuests ? Number(numGuests) : ""}
                        className="mt-2 px-5 py-3 w-1/3 bg-primary-200  text-primary-800 shadow-sm rounded-sm"
                        required
                    >
                        <option value="" key="">
                            Select number of guest...
                        </option>
                        {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
                            <option value={x} key={x}>
                                {x} {x === 1 ? "guest" : "guests"}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="observations" className="font-bold">
                        Anything we should know about your stay?
                    </label>
                    <textarea
                        name="observations"
                        defaultValue={observations}
                        className=" px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    />
                </div>
                <div className="flex justify-end items-center gap-6">
                    <SubmitButton pendingText="Updating...">
                        Update Reservations
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
