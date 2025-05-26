"use client";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useState, useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import ConfirmModal from "./ConfirmModal";

function DeleteReservation({ bookingId, onDelete }) {
  /*
  const [isPending, startTransition] = useTransition();
  function handleDelete() {
    if (confirm("are you sure you want to delete this record? "))
      startTransition(() => onDelete(bookingId));
  }
  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-red-600 transition-colors hover:text-primary-900"
    >
      {!isPending ? (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-200 transition-colors" />
          <span className="mt-1 group-hover:text-primary-200">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
  */
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleDelete() {
    startTransition(() => onDelete(bookingId));
    setIsModalOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-red-600 transition-colors hover:text-primary-900"
      >
        <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-200 transition-colors" />
        <span className="mt-1 group-hover:text-primary-200">Delete</span>
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      >
        <h3 className="font-bold text-lg">Delete Reservation</h3>
        <p className=" border-l-4 border-red-500 p-4 rounded-r-md shadow-sm">
          Are you sure you want to delete this reservation?<br />
          <span className="font-bold text-red-600 block mt-2">
            (This action cannot be undone.)
          </span>
        </p>
        {isPending && <SpinnerMini />}
      </ConfirmModal>
    </>
  );
}

export default DeleteReservation;
