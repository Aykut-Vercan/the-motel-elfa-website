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

  console.log(to)
  console.log(subject)
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
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style type="text/css">
    /* Inline CSS - Tailwind benzeri stiller */
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      color: #374151;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background:#1f2937;
      color: white;
      text-align: center;
      padding: 48px 32px;
    }
    .content {
      padding: 32px;
      background-color: white;
    }
    .details-box {
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .total-price {
      background: #1f2937;
      color: white;
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;
    }
    .footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 32px 24px;
    }
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container {
        padding: 10px;
      }
      .header, .content {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
      <!-- Header -->
      <div class="header">
        <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Booking Confirmed!</h1>
        <p style="color: #bfdbfe; font-size: 18px;">Your dream getaway awaits</p>
      </div>
      
      <!-- Content -->
      <div class="content">
        <!-- Greeting -->
        <div style="margin-bottom: 32px;">
          <p style="font-size: 20px; color: #4b5563; margin-bottom: 16px;">Hello <span style="font-weight: 600; color: #111827;">${session.user.name}</span>,</p>
          <p style="color: #6b7280; line-height: 1.6;">
            Thank you for choosing us for your upcoming stay! <br/> We're thrilled to confirm your reservation and can't wait to provide you with an unforgettable experience.
          </p>
        </div>
        
        <!-- Reservation Details -->
        <div class="details-box">
          <div style="display: flex; align-items: center; margin-bottom: 24px;">
            <span style="font-size: 24px; margin-right: 12px;">📋</span>
            <h2 style="font-size: 20px; font-weight: 600; color: #1f2937;">Your Reservation Details</h2>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
                 <!-- Cabin Name -->
            <div class="detail-row">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 12px;">🛏️</span>
                <span style="font-weight: 500; color: #6b7280;">Your Room</span>
              </div>
              <span style="font-weight: 600; color: #1f2937;">
               Cabin ${cabinName}
              </span>
            </div>
            <!-- Check-in Date -->
            <div class="detail-row">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 12px;">📅</span>
                <span style="font-weight: 500; color: #6b7280;">Check-in Date</span>
              </div>
              <span style="font-weight: 600; color: #1f2937;">
                ${new Date(bookingData.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
              </span>
            </div>
            
            <!-- Check-out Date -->
            <div class="detail-row">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 12px;">📅</span>
                <span style="font-weight: 500; color: #6b7280;">Check-out Date</span>
              </div>
              <span style="font-weight: 600; color: #1f2937;">
                ${new Date(bookingData.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
              </span>
            </div>
            
            <!-- Number of Nights -->
            <div class="detail-row">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 12px;">🌙</span>
                <span style="font-weight: 500; color: #6b7280;">Duration</span>
              </div>
              <span style="font-weight: 600; color: #1f2937;">
                ${Number(bookingData.numNights)} ${Number(bookingData.numNights) === 1 ? "night" : "nights"}
              </span>
            </div>
            
            <!-- Guests -->
            <div class="detail-row">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 12px;">👥</span>
                <span style="font-weight: 500; color: #6b7280;">Guests</span>
              </div>
              <span style="font-weight: 600; color: #1f2937;">
                ${Number(formValues.numGuests)} ${Number(formValues.numGuests) === 1 ? "guest" : "guests"}
              </span>
            </div>
            
            <!-- Total Price -->
            <div class="total-price">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 24px; margin-right: 12px;">💰</span>
                  <span style="font-weight: 500; font-size: 18px;">Total Price</span>
                </div>
                <span style="font-weight: 700; font-size: 24px;">$${bookingData.cabinPrice}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Excitement Section -->
        <div style="background: linear-gradient(to right, #ffedd5, #fee2e2); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <div style="font-size: 36px; margin-bottom: 12px;">🏞️</div>
          <p style="color: #9a3412; font-weight: 500; font-size: 18px;">
            We are absolutely looking forward to hosting you and making your stay memorable!
          </p>
        </div>
        
        <!-- Additional Info -->
        <div style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
          <p style="margin-bottom: 16px;">
            If you have any questions or special requests, please don't hesitate to contact us. We're here to help make your experience perfect!
          </p>
        </div>
      </div>
      <!-- Footer -->
      <div class="footer">
        <p style="font-weight: 600; color: #1f2937; margin-bottom: 8px;">Best regards,</p>
        <p style="color: #6b7280;">Your Cabin Booking Team 🏡</p>
        <div style="margin-top: 16px; font-size: 12px; color: #6b7280;">
          <p>This is an automated confirmation email. Please save this for your records.</p>
        </div>
      </div>
    </div>
    
    <!-- Footer disclaimer -->
    <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #6b7280;">
      <p>© 2025 Your Cabin Booking Service. All rights reserved.</p>
    </div>
  </div>
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
  console.log([newBooking])
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
  console.log(updateData);
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
