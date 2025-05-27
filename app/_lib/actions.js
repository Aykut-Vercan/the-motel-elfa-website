//Burası server actionları

"use server"; //istemciden sunucuya giden bir köprü gibi

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
//import { updateGuest } from "./data-service";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";


//Update Profile
export async function updateProfile(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in"); //try catch kullanmamak yaygın bi uygulamaymıs
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid nationalId");

  const updateData = { nationality, countryFlag, nationalID };

  //await updateGuest(session.user.guestId, updateData); bu benim hamlem

  //ama adam böyle yaptı
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");
  revalidatePath("/account/profile"); //account/profile içindeki herşey refetch olur
}


//Send mail
export async function sendMail({ to, subject, html }) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    }
  });

  const mailOptions = {
    from: `"Cabin Booking" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email gönderildi:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Gmail gönderim hatası:', error);
    return { success: false, error: error.message };
  }
}


//Create Booking
export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const formValues = Object.fromEntries(formData);
  const { cabinName, ...restBookingData } = bookingData;

  const html = `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Booking Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif; color: #374151;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1f2937; color:white; padding:48px 32px;">
              <div style="font-size:48px; margin-bottom:8px;">🎉</div>
              <h1 style="font-size:28px; font-weight:700; margin:0 0 8px;">Booking Confirmed!</h1>
              <p style="color:#bfdbfe; font-size:18px; margin:0;">Your dream getaway awaits</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <!-- Greeting -->
              <p style="font-size:20px; color:#4b5563; margin-bottom:16px;">Hello <strong style="color:#111827;">${session.user.name}</strong>,</p>
              <p style="color:#6b7280; line-height:1.6; margin-bottom:32px;">
                Thank you for choosing us for your upcoming stay!<br />
                We're thrilled to confirm your reservation and can't wait to provide you with an unforgettable experience.
              </p>

              <!-- Reservation Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:12px; padding:24px; margin-bottom:32px;">
                <tr>
                  <td colspan="2" style="padding-bottom:24px; font-size:20px; font-weight:600; color:#1f2937;">
                    📋 Your Reservation Details
                  </td>
                </tr>

                <!-- Room -->
                <tr>
                  <td style="padding:12px 0; color:#6b7280;">🛏️ Your Room</td>
                  <td align="right" style="padding:12px 0; font-weight:600; color:#1f2937;">Cabin ${cabinName}</td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #e5e7eb;"></td></tr>

                <!-- Check-in -->
                <tr>
                  <td style="padding:12px 0; color:#6b7280;">📅 Check-in Date</td>
                  <td align="right" style="padding:12px 0; font-weight:600; color:#1f2937;">
                    ${new Date(bookingData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #e5e7eb;"></td></tr>

                <!-- Check-out -->
                <tr>
                  <td style="padding:12px 0; color:#6b7280;">📅 Check-out Date</td>
                  <td align="right" style="padding:12px 0; font-weight:600; color:#1f2937;">
                    ${new Date(bookingData.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #e5e7eb;"></td></tr>

                <!-- Nights -->
                <tr>
                  <td style="padding:12px 0; color:#6b7280;">🌙 Duration</td>
                  <td align="right" style="padding:12px 0; font-weight:600; color:#1f2937;">
                    ${Number(bookingData.numNights)} ${Number(bookingData.numNights) === 1 ? "night" : "nights"}
                  </td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #e5e7eb;"></td></tr>

                <!-- Guests -->
                <tr>
                  <td style="padding:12px 0; color:#6b7280;">👥 Guests</td>
                  <td align="right" style="padding:12px 0; font-weight:600; color:#1f2937;">
                    ${Number(formValues.numGuests)} ${Number(formValues.numGuests) === 1 ? "guest" : "guests"}
                  </td>
                </tr>
                <tr><td colspan="2" style="border-bottom:1px solid #e5e7eb;"></td></tr>

                <!-- Total Price -->
                <tr>
                  <td colspan="2" style="padding:16px; background-color:#1f2937; color:white; border-radius:8px; font-weight:700; font-size:18px; text-align:right;">
                    💰 Total Price: $${bookingData.cabinPrice}
                  </td>
                </tr>
              </table>

              <!-- Excitement -->
              <div style="background: #ffedd5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                <div style="font-size: 36px; margin-bottom: 12px;">🏞️</div>
                <p style="color: #9a3412; font-weight: 500; font-size: 18px;">
                  We are absolutely looking forward to hosting you and making your stay memorable!
                </p>
              </div>

              <!-- Info -->
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                If you have any questions or special requests, please don't hesitate to contact us. We're here to help make your experience perfect!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; text-align:center; padding:32px 24px;">
              <p style="font-weight:600; color:#1f2937; margin:0;">Best regards,</p>
              <p style="color:#6b7280; margin:8px 0 0;">Your Cabin Booking Team 🏡</p>
              <p style="font-size:12px; color:#6b7280; margin-top:16px;">
                This is an automated confirmation email. Please save this for your records.
              </p>
            </td>
          </tr>

          <!-- Legal -->
          <tr>
            <td style="text-align:center; font-size:12px; color:#6b7280; padding: 16px;">
              © 2025 Your Cabin Booking Service. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const newBooking = {
    ...restBookingData,
    guestId: session.user.guestId,
    numGuests: Number(formValues.numGuests) || 1,
    observations: formValues.observations?.slice(0, 1000) || "",
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  const { error } = await supabase.from("bookings").insert([newBooking]);
  if (error) {
    throw new Error("Booking could not be created");
  }

  try {
    await sendMail({ to: session.user.email, subject: "Reservation Confirmation", html: html })

  } catch (mailError) {
    console.error("Email gönderilemedi:", mailError);
    throw new Error("Email could not be sent")
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

//Update Booking
export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));
  //1-)Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in"); //try catch kullanmamak yaygın bi uygulamaymıs
  //2-)Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  //bu önemli  bu kontrol'un sebebi networktend curl alıp baska dataları silmesinin önüne geciyor
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("you are not allowed to update this booking");
  }
  //3-) building updating data
  const updateData = {
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
  };
  
  //4-)Mutaion
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();
  //5-)Error Handling
  if (error) {
    throw new Error("Booking could not be updated");
  }
  //6-)Revalidation
  revalidatePath(`/reservation/edit/${bookingId}`);
  //7-) Redirecting
  redirect("/account/reservations");
}
//Delete Booking
export async function deleteBooking(bookingId) {
  //1-)Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  //2-)Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  //bu önemli  bu kontrol'un sebebi networktend curl alıp baska dataları silmesinin önüne geciyor
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("you are not allowed to delete this booking");
  }
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

//Sign In
export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

//Sign Out
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
